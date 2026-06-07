import numpy as np
import random
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json, datetime, requests, hashlib, hmac, base64

WORKSPACE_ID = 'd744608e-3e9e-4ef3-aa8f-6dcce97aeac1'
WORKSPACE_KEY = 'C6f8v3lvfKkrhIyJZNYN1D9qO+tQGnBQ7R+muQceAk2+560UiEEimjTJonwgjinDUPvR7YVpUXhzmlMdXuwbgA=='

X = np.array([[random.randint(10,100), random.randint(0,3), random.randint(0,2), random.randint(8,22), random.uniform(0.1,5)] for _ in range(200)] + [[random.randint(250,500), 0, 0, 12, 1] for _ in range(20)] + [[80, random.randint(15,50), 0, 10, 0.5] for _ in range(20)] + [[50, 0, random.randint(8,20), 14, random.uniform(15,50)] for _ in range(20)])

sc = StandardScaler()
Xs = sc.fit_transform(X)
m = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
m.fit(Xs)
p = m.predict(Xs)
n = (p==-1).sum()
print('Total:', len(p), 'Anomalies:', n, 'Taux:', round(n/len(p)*100,1), '%')

body = json.dumps([{'timestamp': datetime.datetime.utcnow().isoformat(), 'anomalies': int(n), 'application': 'QuizApp'}])
date = datetime.datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
s2h = 'POST\n' + str(len(body)) + '\napplication/json\nx-ms-date:' + date + '\n/api/logs'
dk = base64.b64decode(WORKSPACE_KEY)
eh = base64.b64encode(hmac.new(dk, s2h.encode('utf-8'), hashlib.sha256).digest()).decode('utf-8')
sig = 'SharedKey ' + WORKSPACE_ID + ':' + eh
url = 'https://' + WORKSPACE_ID + '.ods.opinsights.azure.com/api/logs?api-version=2016-04-01'
r = requests.post(url, data=body, headers={'Content-Type':'application/json','Authorization':sig,'Log-Type':'QuizAppAnomalies','x-ms-date':date}, timeout=10)
print('Azure Monitor:', r.status_code)
