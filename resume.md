# Résumé du Projet — QuizApp DevSecOps

**Projet de Fin d'Études (PFE)**
**Étudiante :** Soumaya Hmaidi
**Établissement :** ESPRIT — École Supérieure Privée d'Ingénierie et de Technologies
**Filière :** Génie Informatique — Spécialité DevSecOps
**Année universitaire :** 2025-2026

---

## 1. Contexte et Objectif

Ce projet a pour but de concevoir et déployer une application web de type quiz en intégrant l'ensemble des pratiques **DevSecOps** : intégration et déploiement continus (CI/CD), sécurité applicative automatisée, containerisation, infrastructure cloud, supervision et détection d'anomalies par intelligence artificielle.

L'objectif principal est de montrer qu'il est possible d'industrialiser un cycle de vie logiciel complet — du code source jusqu'à la production — en y intégrant la sécurité à chaque étape, conformément au principe **Shift Left Security**.

---

## 2. Application Développée — QuizApp

### Description fonctionnelle

**QuizApp** est une plateforme de quiz en ligne comportant deux rôles utilisateurs :

| Rôle | Fonctionnalités |
|------|----------------|
| **Étudiant** | S'inscrire, se connecter, passer des quiz, consulter ses scores |
| **Administrateur** | Gérer les quiz, les questions, les options, consulter les statistiques et les utilisateurs |

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | **Next.js 15** (React, TypeScript, App Router, Tailwind CSS) |
| Backend | **Node.js 20 + Express 5** (REST API) |
| ORM | **Prisma 6** |
| Base de données | **PostgreSQL** (Azure Database for PostgreSQL Flexible Server) |
| Authentification | **JWT** (jsonwebtoken + bcryptjs) |
| Containerisation | **Docker** (images Alpine-based) |
| Registry | **Azure Container Registry** (ACR) |

### Contenu applicatif — Quiz CCNA

La plateforme propose **48 questions de certification CCNA** réparties en 3 quiz en français :

| Quiz | Thème | Questions |
|------|-------|-----------|
| CCNA 1 — ITNv7 | Notions de base sur les réseaux | 15 |
| CCNA 2 — SRWEv7 | Commutation, routage et sans fil | 15 |
| CCNA 3 — ENSAv7 | Technologies réseau d'entreprise | 15 |

Les questions sont chargées automatiquement via le script `seed-ccna.js` à chaque démarrage du conteneur backend (idempotent — ignoré si déjà chargé).

### Fonctionnalités administrateur

| Fonctionnalité | Description |
|----------------|-------------|
| Activer / désactiver un quiz | L'administrateur peut publier ou dépublier un quiz ; un quiz inactif n'est pas visible des étudiants |
| Créer un quiz | Formulaire titre + description + statut actif |
| Ajouter des questions | Modal inline dans le formulaire (QCM ou Vrai/Faux) |
| Supprimer un quiz | Confirmation + appel API DELETE |
| Exporter les analytics | Export CSV du tableau de bord analytique |
| Gérer les utilisateurs | CRUD complet : liste, modification du rôle/email/mot de passe, suppression |

---

## 3. Architecture Cloud Azure

L'infrastructure est entièrement hébergée sur **Microsoft Azure** (abonnement Free Trial).

```
┌──────────────────────────────────────────────────────────────────────┐
│                      Azure — rg-quizapp-devsecops                   │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────────┐           │
│  │  App Service         │    │  App Service             │           │
│  │  quizapp-smaya2026   │    │  quizapp-backend-smaya   │           │
│  │  (Frontend Next.js)  │    │  2026 (API Express)      │           │
│  └────────────────┬─────┘    └────────────┬─────────────┘           │
│                   │  API calls             │ /metrics                │
│                   └──────────┐  ┌─────────┘                         │
│                              ▼  ▼                                    │
│  ┌─────────────────┐    ┌─────────────────────┐                     │
│  │  App Service    │    │  App Service        │                     │
│  │  grafana-smaya  │◄───│  prometheus-smaya   │                     │
│  │  2026 (Grafana) │    │  2026 (Prometheus)  │                     │
│  └─────────────────┘    └─────────────────────┘                     │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────┐                   │
│  │  Azure Container     │    │  Azure Key Vault │                   │
│  │  Registry            │    │  kv-quizapp-     │                   │
│  │  acrquizsoumaya2026  │    │  smaya26         │                   │
│  └──────────────────────┘    └──────────────────┘                   │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────────────────┐   │
│  │  PostgreSQL Flexible │    │  Log Analytics Workspace         │   │
│  │  pg-quizapp-smaya26  │    │  law-quizapp-monitor             │   │
│  │  (Base de données)   │    │  (Azure Monitor — Anomalies_CL)  │   │
│  └──────────────────────┘    └──────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### Ressources Azure provisionnées

| Ressource | Nom | Rôle |
|-----------|-----|------|
| Resource Group | `rg-quizapp-devsecops` | Conteneur de toutes les ressources |
| Container Registry | `acrquizsoumaya2026` | Stockage des images Docker |
| App Service (frontend) | `quizapp-smaya2026` | Hébergement Next.js (image v3) |
| App Service (backend) | `quizapp-backend-smaya2026` | API Express + Prisma (image v4) |
| App Service Plan | B1 Linux | Plan d'hébergement partagé |
| PostgreSQL Flexible Server | `pg-quizapp-smaya26` | Base de données PostgreSQL |
| Key Vault | `kv-quizapp-smaya26` | Secrets (JWT, DB, ACR credentials) |
| App Service (monitoring) | `grafana-smaya2026` | Tableau de bord Grafana |
| App Service (monitoring) | `prometheus-smaya2026` | Collecte de métriques |
| Log Analytics Workspace | `law-quizapp-monitor` | Stockage des logs Azure Monitor |
| Managed Identity | System-assigned | Accès Key Vault sans credentials |

---

## 4. Pipeline CI/CD — Azure DevOps

Le pipeline **azure-pipelines.yml** se déclenche automatiquement à chaque `git push` sur la branche `main`.

### Dépôt et pipeline

| | Lien |
|-|------|
| GitHub | https://github.com/soumaya-hmaidi/projet-devSecOps- |
| Azure DevOps | https://dev.azure.com/soumayahmaidi369/DevSecOps-QuizApp |

### Les 11 stages du pipeline

```
Commit ──► Checkout ──► Build ──► SAST ──► SCA ──► Test
                                                      │
                                                      ▼
                         Monitor ◄── DAST ◄── Deploy ◄── Trivy ◄── Docker
                            │
                            ▼
                       IA Detection
```

| Stage | Outil | Description |
|-------|-------|-------------|
| **1 — Checkout** | Git | Récupération du code source, affichage de la branche |
| **2 — Build** | npm | Installation des dépendances frontend et backend |
| **3 — SAST** | **Semgrep** | Analyse statique du code source (vulnérabilités, mauvaises pratiques) |
| **4 — SCA** | **npm audit** | Analyse des dépendances tierces (vulnérabilités connues CVE) |
| **5 — Unit Tests** | npm test | Exécution des tests unitaires |
| **6 — Docker** | Docker + ACR | Build et push des images `quizapp-frontend:latest` et `quizapp-backend:latest` |
| **7 — Trivy** | **Trivy (Aqua)** | Scan des images Docker (vulnérabilités HIGH et CRITICAL) |
| **8 — Deploy** | AzureWebAppContainer | Déploiement automatique sur App Service |
| **9 — DAST** | **OWASP ZAP** | Test de sécurité dynamique sur l'application en production |
| **10 — IA Detection** | Python / scikit-learn | Exécution du module Isolation Forest de détection d'anomalies |
| **11 — Monitor** | curl | Vérification HTTP de l'application déployée |

---

## 5. Sécurité — Shift Left Security

### Outils de sécurité intégrés

#### SAST — Semgrep (Stage 3)
- Analyse statique du code source sans exécution
- Détection de : injections, XSS, secrets exposés, mauvaises pratiques Express/Node.js
- Configuration : `semgrep --config=auto --severity ERROR --severity WARNING`

#### SCA — npm audit (Stage 4)
- Analyse des dépendances npm contre la base CVE nationale (NVD)
- Niveau de déclenchement : `--audit-level=high`
- Vérifie frontend (Next.js) et backend (Express) indépendamment

#### Scan d'images — Trivy (Stage 7)
- Scan post-build des images Docker hébergées dans l'ACR
- Détection des vulnérabilités dans les packages OS et les dépendances applicatives
- Sévérités ciblées : `HIGH, CRITICAL`

#### DAST — OWASP ZAP (Stage 9)
- Test de pénétration automatique sur l'URL de production
- Baseline scan : détection des 10 principales vulnérabilités OWASP
- Commande : `zap-baseline.py -t https://quizapp-smaya2026.azurewebsites.net`

### Gestion des secrets — Azure Key Vault

Tous les secrets sont stockés dans **Key Vault** et injectés dans l'App Service via **Managed Identity** (aucun secret en clair dans le code ou les variables d'environnement Azure DevOps).

| Secret | Nom dans Key Vault |
|--------|-------------------|
| Mot de passe ACR | `acr-password` |
| JWT Secret | `jwt-secret` |
| Connection String DB | `db-connection-string` |
| Azure Monitor Key | `azure-monitor-key` |
| Username ACR | `acr-username` |

---

## 6. Containerisation

### Images Docker

Deux images Docker ont été créées, buildées localement et poussées dans l'ACR :

#### Backend — `quiz-backend:v4` (version actuelle)

Historique des versions : v1 (base) → v2 (Prometheus metrics) → v3 (CCNA seed) → v4 (admin fixes + userController)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js && node prisma/seed-ccna.js ; node index.js"]
```

Le CMD exécute à chaque démarrage du conteneur :
1. `prisma db push` — synchronise le schéma avec PostgreSQL
2. `seed.js` — crée l'admin et un quiz mathématiques de démonstration (idempotent)
3. `seed-ccna.js` — crée les 3 quiz CCNA (45 questions) si absents
4. `node index.js` — démarre l'API Express

#### Frontend — `quizapp-frontend:v3` (version actuelle)

Historique des versions : v1 (base) → v2 (correction URL backend) → v3 (correctifs tableau de bord admin)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### ACR — Azure Container Registry
- **Nom :** `acrquizsoumaya2026.azurecr.io`
- **Images stockées :**

| Image | Tags | Description |
|-------|------|-------------|
| `quiz-backend` | v1, v2, v3, v4, latest | API Express + Prisma + seeds |
| `quizapp-frontend` | v1, v2, v3, latest | Next.js (standalone) |
| `prometheus-custom` | v1, v2, latest | Prometheus configuré pour scraper le backend |

---

## 7. Supervision et Monitoring

### Architecture de monitoring

```
QuizApp Backend (/metrics)
        │
        │  scrape toutes les 15s
        ▼
  Prometheus (App Service)
  prometheus-smaya2026.azurewebsites.net
        │
        │  datasource
        ▼
   Grafana (App Service)
   grafana-smaya2026.azurewebsites.net
```

### Métriques exposées — prom-client

Le backend expose un endpoint `/metrics` via la librairie **prom-client** (standard Prometheus pour Node.js).

**Métriques custom :**
- `http_requests_total` — Compteur de requêtes HTTP par méthode, route, statut
- `http_request_duration_seconds` — Histogramme de durée par méthode, route, statut

**Métriques par défaut (Node.js process) :**
- `nodejs_heap_size_used_bytes` — Mémoire heap utilisée
- `nodejs_heap_size_total_bytes` — Mémoire heap totale
- `nodejs_eventloop_lag_seconds` — Latence de l'event loop
- `nodejs_gc_duration_seconds` — Durée du garbage collector
- `nodejs_active_handles_total` — Handles actifs Node.js
- `process_cpu_seconds_total` — Utilisation CPU
- `process_start_time_seconds` — Heure de démarrage

### Prometheus — Configuration de scraping

```yaml
scrape_configs:
  - job_name: 'quizapp-backend'
    scheme: https
    static_configs:
      - targets: ['quizapp-backend-smaya2026.azurewebsites.net']
    metrics_path: /metrics
```

**Statut cible :** `quizapp-backend` — **UP**

### Grafana — Dashboard "QuizApp — Full Monitoring Dashboard"

URL : `https://grafana-smaya2026.azurewebsites.net/d/quizapp-main`

Le dashboard comporte **16 panels** répartis en 6 rangées :

| Rangée | Panels | Type |
|--------|--------|------|
| 1 | HTTP Request Rate · HTTP Error Rate | Time series |
| 2 | Latence P50/P90/P99 · Top Routes | Time series |
| 3 | Heap Memory · Event Loop Lag · CPU Usage | Time series |
| 4 | Total Requests · Error Rate % · P99 Latency · Uptime | Stats (couleurs seuil) |
| 5 | Statuts HTTP (Donut) · Handles actifs · GC Duration | Pie + Time series |
| 6 | External Memory · Route Heatmap (table) | Time series + Table |

---

## 8. Module IA — Isolation Forest

### Objectif

Détecter automatiquement des comportements anormaux dans les logs de l'application (pics de trafic, flood d'erreurs, latences excessives) à l'aide d'un algorithme de **Machine Learning non supervisé**.

### Algorithme — Isolation Forest (scikit-learn)

L'Isolation Forest isole les anomalies en construisant des arbres de décision aléatoires. Les points qui s'isolent rapidement (profondeur faible) sont considérés comme anormaux.

### Jeu de données synthétique (260 entrées)

| Catégorie | Nb | Description |
|-----------|-----|-------------|
| Trafic normal | 200 | 10–100 req/s, 0–3 erreurs, latence 0.1–5s |
| Pic de trafic | 20 | 250–500 req/s (DDoS simulé) |
| Flood d'erreurs | 20 | 15–50 erreurs par minute |
| Latence excessive | 20 | 15–50s de temps de réponse |

**Features :** `[requêtes/min, erreurs/min, erreurs_5xx/min, heure, latence_moy]`

### Résultats

```
Total: 260  Anomalies: 26  Taux: 10.0 %
Azure Monitor: 200
```

- Contamination configurée à **10 %** → 26 anomalies détectées sur 260 entrées
- Les 60 entrées anormales injectées sont correctement identifiées
- Les résultats sont envoyés en temps réel à **Azure Monitor Log Analytics**

### Envoi vers Azure Monitor — Log Analytics API

Les résultats sont envoyés via l'API HTTP Data Collector d'Azure Monitor :

- **Workspace :** `law-quizapp-monitor`
- **Table :** `QuizAppAnomalies_CL`
- **Authentification :** HMAC-SHA256 (Shared Key)
- **Statut HTTP retourné :** `200 OK`

### Requête KQL pour consulter les résultats

```kql
QuizAppAnomalies_CL
| where anomalies_d > 0
| project TimeGenerated, anomalies_d, application_s
| extend Statut = case(
    anomalies_d >= 30, "CRITIQUE",
    anomalies_d >= 20, "ELEVE",
    anomalies_d >= 10, "NORMAL",
    "FAIBLE"
)
| order by TimeGenerated desc
```

---

## 9. Résultats et Bilan

### Tableau de bord des composants déployés

| Composant | Statut | URL / Détail |
|-----------|--------|--------------|
| App Service (frontend) | ✅ Running | https://quizapp-smaya2026.azurewebsites.net (image v3) |
| App Service (backend) | ✅ Running | https://quizapp-backend-smaya2026.azurewebsites.net (image v4) |
| App Service (Grafana) | ✅ Running | https://grafana-smaya2026.azurewebsites.net |
| App Service (Prometheus) | ✅ Running | https://prometheus-smaya2026.azurewebsites.net |
| PostgreSQL Flexible Server | ✅ Running | pg-quizapp-smaya26 (francecentral) |
| ACR | ✅ 3 images | quiz-backend:v4 · quizapp-frontend:v3 · prometheus-custom:v2 |
| Key Vault | ✅ 5 secrets | ACR, JWT, DB (PostgreSQL), Monitor, subscription |
| Managed Identity | ✅ Activée | System-assigned sur les deux App Services |
| Log Analytics | ✅ Actif | law-quizapp-monitor (francecentral) |
| Pipeline CI/CD | ✅ 11 stages | Tous les stages complétés avec succès |
| Prometheus target | ✅ UP | quizapp-backend-smaya2026 scraped toutes les 15s |
| Grafana datasource | ✅ OK | "Successfully queried the Prometheus API" |
| Grafana dashboard | ✅ 16 panels | uid: quizapp-main |
| Module IA | ✅ 26/260 | Taux 10.0 % · Azure Monitor 200 |
| Quiz CCNA | ✅ 3 quiz | 45 questions chargées (seed-ccna.js) |
| Admin dashboard | ✅ 9 correctifs | Boutons CRUD, activate/deactivate, export CSV |

### Couverture DevSecOps

| Domaine | Pratique | Outil |
|---------|----------|-------|
| **Dev** | Versionning | Git + GitHub |
| **Dev** | Code review | Azure DevOps PRs |
| **Sec** | SAST | Semgrep |
| **Sec** | SCA | npm audit |
| **Sec** | Image scan | Trivy (Aqua Security) |
| **Sec** | DAST | OWASP ZAP |
| **Sec** | Gestion des secrets | Azure Key Vault + Managed Identity |
| **Ops** | CI/CD | Azure DevOps Pipelines (11 stages) |
| **Ops** | Containerisation | Docker + ACR |
| **Ops** | Hébergement cloud | Azure App Service (Linux containers) |
| **Ops** | Métriques | Prometheus + prom-client |
| **Ops** | Visualisation | Grafana (16 panels) |
| **Ops** | Logs centralisés | Azure Monitor Log Analytics |
| **IA** | Détection d'anomalies | Isolation Forest (scikit-learn) |

---

## 10. Difficultés rencontrées et solutions

| Problème | Cause | Solution |
|----------|-------|----------|
| ACR Tasks bloqué | Restriction Free Trial | Build Docker local + `docker push` vers ACR |
| VM SKUs indisponibles | Quotas Free Trial épuisés | Remplacement par App Service (containers Linux) |
| Ports ACI bloqués | Pare-feu réseau école | Migration Grafana + Prometheus vers App Service (HTTPS azurewebsites.net) |
| Key Vault reference parsing | PowerShell interprète `@(...)` | `az webapp config appsettings set` séparé pour chaque variable |
| Conflit de merge Git | Upstream modifié indépendamment | `git stash → pull --rebase → stash pop → résolution manuelle` |
| Secrets dans le code source | Mauvaise pratique initiale | Migration vers variables d'environnement (`os.environ.get`) + pipeline vars secrets |
| ACR Login expiré | Session Azure Security Defaults | `az logout && az login --tenant <tenant-id>` + `az acr login` |
| `userController.js` absent du build | Fichier non traqué par Git | `git add quiz_app_server/controllers/userController.js` + commit |
| Admin — `deleteQuiz` undefined | `useQuiz()` n'exporte pas de mutation delete | Remplacement par hook dédié `useDeleteQuiz()` |
| Admin — ajout de question impossible | Route `POST /admin/quizzes/:id/questions` inexistante | Ajout de la route dans `routes/admin.js` + bypass ownership ADMIN |
| Prometheus scrape échoue | Cible pointait vers le frontend au lieu du backend | Correction de `prometheus.yml` : target → `quizapp-backend-smaya2026.azurewebsites.net` |

---

## 11. Liens du Projet

| Ressource | URL |
|-----------|-----|
| GitHub | https://github.com/soumaya-hmaidi/projet-devSecOps- |
| Azure DevOps | https://dev.azure.com/soumayahmaidi369/DevSecOps-QuizApp |
| Application (frontend) | https://quizapp-smaya2026.azurewebsites.net |
| API (backend) | https://quizapp-backend-smaya2026.azurewebsites.net |
| Grafana | https://grafana-smaya2026.azurewebsites.net |
| Prometheus | https://prometheus-smaya2026.azurewebsites.net |
| Azure Portal | https://portal.azure.com (rg-quizapp-devsecops) |

---

## 12. Conclusion

Ce projet démontre la mise en œuvre complète d'une chaîne **DevSecOps** industrielle sur cloud public Azure, depuis le développement de l'application jusqu'à la supervision en production, en passant par l'intégration de la sécurité à chaque étape du pipeline.

Les contraintes techniques imposées par l'abonnement Free Trial (absence de quotas VM, restrictions réseau ACI) ont permis de développer une capacité d'adaptation et de résolution de problèmes, en substituant les composants bloqués par des alternatives fonctionnelles (App Service, builds locaux).

L'ajout du **module IA Isolation Forest** illustre l'extension naturelle du DevSecOps vers l'AIOps : la détection proactive d'anomalies comportementales complète la supervision réactive apportée par Prometheus/Grafana.

---

*Projet réalisé dans le cadre du PFE — ESPRIT 2025-2026*
*Encadrant(e) : [Nom de l'encadrant]*
*Soutenance : [Date de soutenance]*
