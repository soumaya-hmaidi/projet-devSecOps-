# QuizApp — PFE DevSecOps

**Projet de Fin d'Études — Soumaya Hmaidi**
**ESPRIT — Génie Informatique, Spécialité DevSecOps — 2025-2026**

---

## Description

QuizApp est une plateforme de quiz en ligne déployée sur **Microsoft Azure** avec une chaîne **DevSecOps** complète : pipeline CI/CD 11 stages, sécurité automatisée (SAST, SCA, DAST, Trivy), supervision Prometheus/Grafana et détection d'anomalies par **Isolation Forest**.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 15 · React · TypeScript · Tailwind CSS |
| Backend | Node.js 20 · Express 5 · REST API |
| ORM | Prisma 6 |
| Base de données | PostgreSQL (Azure Flexible Server) |
| Auth | JWT · bcryptjs |
| Conteneurs | Docker · Azure Container Registry |
| Cloud | Azure App Service (Linux containers) |
| Monitoring | Prometheus · prom-client · Grafana |
| IA | Isolation Forest (scikit-learn) · Azure Monitor |
| CI/CD | Azure DevOps Pipelines |

---

## Architecture Azure

```
rg-quizapp-devsecops
├── App Service — quizapp-smaya2026          (Frontend Next.js · image v3)
├── App Service — quizapp-backend-smaya2026  (API Express  · image v4)
├── App Service — grafana-smaya2026          (Grafana · 16 panels)
├── App Service — prometheus-smaya2026       (Prometheus scraper)
├── Azure Container Registry — acrquizsoumaya2026
├── PostgreSQL Flexible Server — pg-quizapp-smaya26
├── Key Vault — kv-quizapp-smaya26           (JWT · DB · ACR credentials)
└── Log Analytics — law-quizapp-monitor      (Azure Monitor · anomalies IA)
```

---

## Pipeline CI/CD — 11 stages

```
Checkout → Build → SAST (Semgrep) → SCA (npm audit) → Unit Tests
  → Docker Build+Push ACR → Trivy Scan → Deploy (frontend+backend)
  → DAST (OWASP ZAP) → IA Isolation Forest → Monitor
```

| Stage | Outil | Description |
|-------|-------|-------------|
| SAST | Semgrep | Analyse statique — injections, XSS, secrets exposés |
| SCA | npm audit | Vulnérabilités CVE dans les dépendances |
| Trivy | Aqua Security | Scan d'images Docker (HIGH/CRITICAL) |
| DAST | OWASP ZAP | Test de pénétration sur l'URL de production |
| IA | scikit-learn | Isolation Forest — détection d'anomalies comportementales |

---

## Fonctionnalités applicatives

### Rôles utilisateurs

| Rôle | Fonctionnalités |
|------|----------------|
| **Étudiant** | S'inscrire, se connecter, passer des quiz, consulter ses scores |
| **Administrateur** | CRUD quiz/questions/utilisateurs, activer/désactiver un quiz, analytics + export CSV |

### Contenu — Quiz CCNA (45 questions en français)

| Quiz | Thème |
|------|-------|
| CCNA 1 — ITNv7 | Notions de base sur les réseaux (15 questions) |
| CCNA 2 — SRWEv7 | Commutation, routage et sans fil (15 questions) |
| CCNA 3 — ENSAv7 | Technologies réseau d'entreprise (15 questions) |

Chargées automatiquement via `prisma/seed-ccna.js` au démarrage du conteneur (idempotent).

---

## Structure du projet

```
projet-devSecOps-/
├── quiz_app_frontend/       # Next.js 15 (App Router · TypeScript)
│   ├── src/app/             # Pages admin, student, auth
│   ├── src/components/      # UI components (admin dashboard, quiz player)
│   ├── src/hooks/           # React Query mutations & queries
│   └── Dockerfile
├── quiz_app_server/         # Node.js + Express API
│   ├── controllers/         # auth, quiz, question, user, stats, anomaly
│   ├── routes/              # /api/auth, /api/quiz, /api/admin, /metrics
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js          # Admin user + demo quiz
│   │   └── seed-ccna.js     # 3 quiz CCNA × 15 questions
│   └── Dockerfile
├── ia_module/
│   └── anomaly_detector.py  # Isolation Forest → Azure Monitor
├── azure-pipelines.yml      # Pipeline 11 stages
├── resume.md                # Résumé complet du projet (PFE)
└── DEPLOYMENT_GUIDE.md      # Guide de déploiement pas-à-pas
```

---

## Démarrage local

### Prérequis

```bash
node --version   # 20+
docker --version
```

### Backend

```bash
cd quiz_app_server
cp .env.example .env   # renseigner DATABASE_URL et JWT_SECRET
npm install
npx prisma db push
node prisma/seed.js
node prisma/seed-ccna.js
node index.js
# API → http://localhost:3000
```

### Frontend

```bash
cd quiz_app_frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3000
npm install
npm run dev
# App → http://localhost:3001
```

### Docker Compose (optionnel)

```bash
docker compose up --build
```

---

## Liens du projet

| Ressource | URL |
|-----------|-----|
| Application | https://quizapp-smaya2026.azurewebsites.net |
| API Backend | https://quizapp-backend-smaya2026.azurewebsites.net |
| Grafana | https://grafana-smaya2026.azurewebsites.net |
| Prometheus | https://prometheus-smaya2026.azurewebsites.net |
| Pipeline CI/CD | https://dev.azure.com/soumayahmaidi369/DevSecOps-QuizApp/_build |
| Azure Portal | https://portal.azure.com (rg-quizapp-devsecops) |

---

## Sécurité

- Tous les secrets sont stockés dans **Azure Key Vault** et injectés via **Managed Identity** (aucun secret en clair)
- Pipeline `--audit-level=high` sur npm audit
- Images Docker scannées à chaque build (Trivy)
- OWASP ZAP baseline scan sur l'URL de production après chaque déploiement

---

*PFE DevSecOps — ESPRIT 2025-2026 · Soumaya Hmaidi*
