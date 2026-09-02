import os, json, datetime, hashlib, hmac, base64, random, subprocess
import numpy as np
import requests
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

WORKSPACE_ID  = os.environ.get('AZURE_MONITOR_WORKSPACE_ID', '44fb9e1f-1c87-448a-8f2a-51c291c0f293')
WORKSPACE_KEY = os.environ.get('AZURE_MONITOR_WORKSPACE_KEY', '')

if not WORKSPACE_KEY:
    try:
        az_cmd = 'az.cmd' if os.name == 'nt' else 'az'
        result = subprocess.run(
            [az_cmd, 'monitor', 'log-analytics', 'workspace', 'get-shared-keys',
             '--resource-group', 'rg-quizapp-devsecops',
             '--workspace-name', 'law-quizapp-monitor',
             '--query', 'primarySharedKey', '-o', 'tsv'],
            capture_output=True, text=True, timeout=30
        )
        WORKSPACE_KEY = result.stdout.strip()
        if WORKSPACE_KEY:
            print('Clé workspace récupérée via az CLI')
        else:
            print('ERREUR: impossible de récupérer la clé workspace:', result.stderr.strip())
    except Exception as e:
        print('ERREUR az CLI:', e)

# ── Dataset ───────────────────────────────────────────────────────────────────
# Features: [req/min, errors/min, errors_5xx/min, hour, avg_latency_s]
X = np.array(
    [[random.randint(10,100), random.randint(0,3),   random.randint(0,2),   random.randint(8,22), random.uniform(0.1,5)]   for _ in range(200)] +  # normal
    [[random.randint(250,500), 0,                    0,                     12,                   1]                        for _ in range(20)]  +  # traffic spike
    [[80,                      random.randint(15,50), 0,                    10,                   0.5]                      for _ in range(20)]  +  # error flood
    [[50,                      0,                    random.randint(8,20),  14,                   random.uniform(15,50)]    for _ in range(20)]      # high latency
)

# ── Model ─────────────────────────────────────────────────────────────────────
sc          = StandardScaler()
Xs          = sc.fit_transform(X)
m           = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
m.fit(Xs)

predictions = m.predict(Xs)            # 1 = normal, -1 = anomaly
scores      = m.decision_function(Xs)  # more negative → more anomalous
anomaly_idx = np.where(predictions == -1)[0]

n            = int(len(anomaly_idx))
anomaly_rate = round(n / len(predictions) * 100, 1)

anomaly_scores = scores[anomaly_idx]
avg_score      = round(float(anomaly_scores.mean()), 4) if n else 0.0
min_score      = round(float(anomaly_scores.min()),  4) if n else 0.0

# ── Anomaly type classification ───────────────────────────────────────────────
# Thresholds based on raw (non-scaled) feature values
TRAFFIC_SPIKE_THRESHOLD  = 150   # req/min
ERROR_FLOOD_THRESHOLD    = 10    # errors/min
HIGH_LATENCY_THRESHOLD   = 10    # avg_latency_s
ERROR_5XX_THRESHOLD      = 5     # errors_5xx/min

type_counts = {'Pic de trafic': 0, "Flood d'erreurs": 0, 'Latence excessive': 0, 'Erreurs 5xx': 0, 'Multiple': 0}

for i in anomaly_idx:
    req, err, err5xx, _, latency = X[i]
    flags = {
        'Pic de trafic':    req     >= TRAFFIC_SPIKE_THRESHOLD,
        "Flood d'erreurs":  err     >= ERROR_FLOOD_THRESHOLD,
        'Erreurs 5xx':      err5xx  >= ERROR_5XX_THRESHOLD,
        'Latence excessive': latency >= HIGH_LATENCY_THRESHOLD,
    }
    active = [t for t, v in flags.items() if v]
    if   len(active) > 1:  type_counts['Multiple']        += 1
    elif len(active) == 1: type_counts[active[0]]          += 1
    else:                  type_counts['Latence excessive'] += 1  # subtle anomaly → closest to latency

# Dominant type = the one with the most anomalies (excluding 0-count types)
dominant_type = max(type_counts, key=type_counts.get)

# ── Degree classification ─────────────────────────────────────────────────────
def classify_degree(rate, avg_sc):
    if   rate >= 15 or avg_sc <= -0.15: return 'CRITIQUE'
    elif rate >= 10 or avg_sc <= -0.10: return 'ELEVE'
    elif rate >= 5  or avg_sc <= -0.05: return 'MODERE'
    else:                               return 'FAIBLE'

degree = classify_degree(anomaly_rate, avg_score)

print(f'Total: {len(predictions)}  Anomalies: {n}  Taux: {anomaly_rate} %')
print(f'Score moyen: {avg_score}  Score min: {min_score}')
print(f'Degré: {degree}')
print(f'Types: { {k: v for k, v in type_counts.items() if v > 0} }')
print(f'Type dominant: {dominant_type}')

# ── Send to Azure Monitor ─────────────────────────────────────────────────────
if not WORKSPACE_KEY:
    print('Envoi annulé — clé workspace manquante')
else:
    now  = datetime.datetime.now(datetime.timezone.utc)
    body = json.dumps([{
        'timestamp':          now.isoformat(),
        'anomalies':          n,
        'anomaly_rate':       anomaly_rate,
        'avg_score':          avg_score,
        'min_score':          min_score,
        'degree':             degree,
        'anomaly_type':       dominant_type,
        'traffic_spikes':     type_counts['Pic de trafic'],
        'error_floods':       type_counts["Flood d'erreurs"],
        'high_latency':       type_counts['Latence excessive'],
        'errors_5xx':         type_counts['Erreurs 5xx'],
        'multiple_types':     type_counts['Multiple'],
        'application':        'QuizApp'
    }])
    date = now.strftime('%a, %d %b %Y %H:%M:%S GMT')
    s2h  = 'POST\n' + str(len(body)) + '\napplication/json\nx-ms-date:' + date + '\n/api/logs'
    dk   = base64.b64decode(WORKSPACE_KEY)
    eh   = base64.b64encode(hmac.new(dk, s2h.encode('utf-8'), hashlib.sha256).digest()).decode('utf-8')
    sig  = 'SharedKey ' + WORKSPACE_ID + ':' + eh
    url  = 'https://' + WORKSPACE_ID + '.ods.opinsights.azure.com/api/logs?api-version=2016-04-01'
    r    = requests.post(url, data=body,
                         headers={'Content-Type': 'application/json',
                                  'Authorization': sig,
                                  'Log-Type':      'QuizAppAnomalies',
                                  'x-ms-date':     date},
                         timeout=10)
    print('Azure Monitor:', r.status_code)
    if r.status_code != 200:
        print('Réponse:', r.text)
