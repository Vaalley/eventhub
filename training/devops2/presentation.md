---
marp: true
theme: default
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
---

# Soutenance DEVOPS2

## EventHub - Mise en place de CI/CD

**Projet:** Plateforme de gestion d'événements et billetterie

---

# 📖 Contexte et Objectifs

## Pourquoi CI/CD ?

- **CI (Continuous Integration):** Intégration continue du code
- **CD (Continuous Deployment):** Déploiement continu automatique
- **Objectifs:** Automatiser les tests, détecter les erreurs rapidement,
  faciliter les déploiements

## Projet EventHub

Application full-stack avec backend et frontend React nécessitant une chaîne
CI/CD robuste.

---

# 🐳 1. Infrastructure Docker - Jenkins

## Installation & Configuration

Dans la VM Ubuntu, exécuter la commande suivante :

```bash
cat jenkins/docker-compose.jenkins.yml
```

---

# 🚀 2. Pipeline Jenkins (CI)

## Jenkinsfile & Stages

Dans les fichiers `Jenkinsfiles` à la racine du dépôt :

- `Jenkinsfile.check` pour les tests
- `Jenkinsfile.build` pour le build et déploiement

### Pipeline Check (Lint & Test)

**Checkout → Install Bun → Lint → Install Dependencies → Test**

### Pipeline Build & Deploy

**Checkout → Build Backend → Build Frontend → Start Services → Health Check**

---

# 🚀 2. Pipeline Jenkins - Tests & Résultats

## Exécution des Tests

```groovy
stage('Test') {
    steps {
        dir('back') {
            sh 'bun test'
        }
    }
}
```

- Stage Test exécute `bun test` ✅
- Tests unitaires: CreateEventUseCase, RegisterUseCase, LoginUseCase
- Tests d'intégration: Auth flow (register, login, logout)

---

# 🔄 3. GitHub Actions

## Workflow & Triggers

Le fichier `github/workflows/ci.yml` contient le workflow de CI.

- Déclenchement automatique sur push et pull_request ✅

---

# 🧪 4. Tests Unitaires

## Présence & Exécution Locale

### Backend Tests

- **CreateEventUseCase.test.ts** → 13 tests
- **RegisterUseCase.test.ts** → 10 tests
- **LoginUseCase.test.ts** → 8 tests

### Frontend Tests

- **slice.test.ts** → Tests Redux auth

### Tests d'Intégration

- **auth.integration.test.ts** → 11 tests (full auth flow)

**Total: 32 tests sur 4 fichiers ✅**

### Exécution locale

```bash
bun test
✓ 55 tests passed
```

- 0 échec avant déclenchement CI ✅

---

# 🧪 4. Tests Unitaires - Intégration Pipeline

### Jenkins

```groovy
stage('Test') {
    steps {
        dir('back') {
            sh 'bun test'
        }
    }
}
```

### GitHub Actions

```yaml
- run: bun test
```

- Tests lancés automatiquement dans Jenkins ✅
- Tests lancés automatiquement dans GHA ✅

---

# 🔗 5. Webhook GitHub & Déclenchement Automatique

## Configuration & Déclenchement

### Configuration

- URL Jenkins configurée dans GitHub
- Accès via tunnl.gg (ngrok alternatif)

### Workflow Automatique

1. Développeur push sur GitHub
2. GHA déclenché automatiquement
3. Checks exécutés sans action manuelle

---

# 📊 Résultats & Livrables

| Élément             | Status |
| ------------------- | ------ |
| Jenkins dans Docker | ✅     |
| Persistance volumes | ✅     |
| Jenkinsfile (Check) | ✅     |
| Jenkinsfile (Build) | ✅     |
| Tests unitaires     | ✅     |
| Tests d'intégration | ✅     |
| GitHub Actions      | ✅     |
| Webhook GitHub      | ✅     |

---

# 🎓 Compétences Acquises

## CI/CD

- ✅ Configuration Jenkins dans Docker
- ✅ Création de pipelines déclaratifs
- ✅ Intégration des tests automatiques
- ✅ Configuration de webhooks GitHub

## Docker

- ✅ Gestion des volumes pour persistance
- ✅ Docker Compose pour orchestration
- ✅ Build multi-stage pour optimisation

---

# Merci !

## EventHub - CI/CD Pipeline

**Repository:** [Vaalley/eventhub](https://github.com/Vaalley/eventhub)
**Stack:** Jenkins • GitHub Actions • Docker • Bun • Node.js • React

_Questions techniques bienvenues_ 🚀
