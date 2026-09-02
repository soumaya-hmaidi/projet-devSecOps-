import os, json, datetime, hashlib, hmac, base64, random, subprocess
import numpy as np
import requests
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

WORKSPACE_ID  = os.environ.get('AZURE_MONITOR_WORKSPACE_ID', '44fb9e1f-1c87-448a-8f2a-51c291c0f293')
WORKSPACE_KEY = os.environ.get('AZURE_MONITOR_WORKSPACE_KEY', '')

# If key not in env, fetch it live from Azure CLI
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

# ── Dataset ──────────────────────────────────────────────────────────────────
X = np.array(
    [[random.randint(10,100), random.randint(0,3), random.randint(0,2), random.randint(8,22), random.uniform(0.1,5)] for _ in range(200)] +
    [[random.randint(250,500), 0, 0, 12, 1]                                                                         for _ in range(20)]  +
    [[80, random.randint(15,50), 0, 10, 0.5]                                                                        for _ in range(20)]  +
    [[50, 0, random.randint(8,20), 14, random.uniform(15,50)]                                                        for _ in range(20)]
)

# ── Model ─────────────────────────────────────────────────────────────────────
sc = StandardScaler()
Xs = sc.fit_transform(X)
m  = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
m.fit(Xs)

predictions = m.predict(Xs)           # 1 = normal, -1 = anomaly
scores      = m.decision_function(Xs) # more negative → more anomalous

n            = int((predictions == -1).sum())
anomaly_rate = round(n / len(predictions) * 100, 1)

# Average isolation score of anomalous points (negative; closer to -1 = more severe)
anomaly_scores = scores[predictions == -1]
avg_score      = round(float(anomaly_scores.mean()), 4) if len(anomaly_scores) else 0.0
min_score      = round(float(anomaly_scores.min()),  4) if len(anomaly_scores) else 0.0

# ── Degree classification ─────────────────────────────────────────────────────
# Based on anomaly rate AND average isolation score (the more negative, the worse)
def classify_degree(rate, avg_sc):
    if rate >= 15 or avg_sc <= -0.15:
        return 'CRITIQUE'
    elif rate >= 10 or avg_sc <= -0.10:
        return 'ELEVE'
    elif rate >= 5  or avg_sc <= -0.05:
        return 'MODERE'
    else:
        return 'FAIBLE'

degree = classify_degree(anomaly_rate, avg_score)

print(f'Total: {len(predictions)}  Anomalies: {n}  Taux: {anomaly_rate} %')
print(f'Score moyen anomalies: {avg_score}  Score min: {min_score}')
print(f'Degré: {degree}')

# ── Send to Azure Monitor ─────────────────────────────────────────────────────
if not WORKSPACE_KEY:
    print('Envoi annulé — clé workspace manquante')
else:
    now  = datetime.datetime.utcnow()
    body = json.dumps([{
        'timestamp':        now.isoformat(),
        'anomalies':        n,
        'anomaly_rate':     anomaly_rate,
        'avg_score':        avg_score,
        'min_score':        min_score,
        'degree':           degree,
        'application':      'QuizApp'
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
