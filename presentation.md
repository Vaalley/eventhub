---
marp: true
theme: default
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
---

<!-- _class: lead -->

# Soutenance DEVOPS1

## EventHub - Mise en place de l'environnement DevOps

**Projet:** Plateforme de gestion d'événements et billetterie

---

# 📖 Rappel des Objectifs

## Objectifs de la semaine

- ✅ Comprendre les principes et pratiques DevOps
- ✅ Mettre en place un environnement de développement conteneurisé
- ✅ Orchestrer des services avec Docker Compose

## Projet EventHub

Plateforme web permettant aux organisateurs de créer et gérer des événements, et aux utilisateurs de réserver des billets de manière simple et sécurisée.

---

# 🔧 Environnement DevOps Configuré

## Repository Git EventHub

```bash
# Structure du projet
eventhub/
├── back/          # Backend Node.js + Express
├── front/         # Frontend React + TypeScript + Vite
├── mongo/         # Configuration MongoDB
├── redis/         # Configuration Redis
├── nginx/         # Reverse proxy
└── docker-compose.yml
```

--- 

## Bonnes pratiques appliquées

- ✅ Conventional Commits
- ✅ Fichiers .gitignore et .dockerignore
- ✅ Documentation complète (README.md)
- ✅ Variables d'environnement (.env.example)

---

# 🐳 Maîtrise de Docker - Architecture

## Stack Technique Conteneurisée

| Service | Technologie | Port | Rôle |
|---------|-------------|------|------|
| **Frontend** | React + Vite | 5173 | Interface utilisateur |
| **Backend** | Node.js + Express | 3000 | API REST |
| **MongoDB** | MongoDB 8.0 | 27017 | Base de données |
| **Redis** | Redis 8.2 | 6379 | Cache |
| **Nginx** | Nginx 1.29 | 80 | Reverse proxy |

---

# 🐳 Dockerfiles Créés

## Caractéristiques

- Image Alpine (légère)
- Volume mounting pour développement
- Ports exposés pour développement local

---

# 🐋 Docker Compose - Orchestration

## Configuration Multi-Services

```yaml
services:
  mongodb:
    build: ./mongo
    volumes: [mongodb_data:/data/db]
  
  redis:
    build: ./redis
    volumes: [redis_data:/data]
  
  backend:
    build: ./back
    volumes:
      - ./back:/app
      - /app/node_modules
    depends_on: [mongodb, redis]
```

---

# 🔧 Concepts Docker Maîtrisés

## Volumes et Bind Mounts

- **Bind mount:** `./back:/app` → Hot reload en développement
- **Volume anonyme:** `/app/node_modules` → Préserve les dépendances du conteneur
- **Volume nommé:** `mongodb_data:/data/db` → Persistance des données

## Réseau Docker

- **Bridge network:** Communication entre conteneurs via noms de services
- `mongodb://mongodb:27017` → DNS interne Docker
- Isolation réseau et sécurité

---

# 🌐 Communication Inter-Conteneurs

## Architecture Réseau

```
┌─────────────┐
│   Nginx     │ :80
│  (Proxy)    │
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
┌──▼──┐  ┌─▼───┐
│Front│  │Back │
│:5173│  │:3000│
└─────┘  └──┬──┘
            │
      ┌─────┴─────┐
      │           │
   ┌──▼───┐    ┌──▼──┐
   │Mongo │    │Redis│
   │:27017│    │:6379│
   └──────┘    └─────┘
```

---

# 📚 Documentation Technique

## README.md Principal

- Architecture détaillée du projet
- Instructions de démarrage avec Docker
- Commandes Docker Compose
- Accès aux différents services

---

# 🎯 Démonstration Complète

## Workflow de bout en bout

```bash
# 1. Démarrage de tous les services
docker-compose up -d

# 2. Vérification des conteneurs
docker ps

# 3. Consultation des logs
docker-compose logs -f backend

# 4. Test de l'application
curl http://localhost:3000
curl http://localhost

# 5. Arrêt des services
docker-compose down
```

---

# 🎯 Démonstration - Hot Reload

## Développement en temps réel

### Backend
- ✅ Nodemon détecte les changements de fichiers
- ✅ Rechargement automatique du serveur
- ✅ `./back:/app` synchronise le code local

### Frontend
- ✅ Vite HMR (Hot Module Replacement)
- ✅ Mise à jour instantanée dans le navigateur
- ✅ `./front:/app` synchronise le code local

**Avantage:** Pas besoin de rebuild pour voir les changements !

---

# 🔍 Points Techniques Avancés

## Optimisations Appliquées

### Dockerfiles
- Images Alpine (réduction de taille ~70%)
- .dockerignore pour exclure node_modules

### Docker Compose
- Restart policies (`unless-stopped`)
- Variables d'environnement centralisées
- Dépendances entre services (`depends_on`)

---

# 📊 Métriques du Projet

## Livrables

| Élément | Status |
|---------|--------|
| Dockerfiles (5) | ✅ Créés et testés |
| Docker Compose | ✅ Opérationnel |
| Documentation | ✅ Complète |
| .env.example | ✅ Backend + Frontend |
| .dockerignore | ✅ Tous les services |

## Commandes Docker Maîtrisées
```bash
docker build, run, ps, logs, stop, rm
docker-compose up, down, logs, build
```

---

# 🚀 Avantages de l'Architecture

## Pour le Développement

- ✅ Environnement reproductible sur toutes les machines
- ✅ Hot reload sur backend et frontend
- ✅ Isolation des services
- ✅ Démarrage en une commande : `docker-compose up`

## Pour la Production (futur)

- ✅ Multi-stage builds possibles
- ✅ Scalabilité horizontale
- ✅ CI/CD facile à mettre en place

---

# 🎓 Compétences Acquises

## DevOps

- ✅ Conteneurisation avec Docker
- ✅ Orchestration multi-services
- ✅ Configuration réseau et volumes
- ✅ Variables d'environnement

## Outils Collaboratifs

- ✅ Git et GitHub (conventional commits)
- ✅ Documentation technique
- ✅ Bonnes pratiques de versioning

## Architecture

- ✅ Reverse proxy avec Nginx
- ✅ Architecture microservices
- ✅ Séparation frontend/backend
- ✅ Gestion de cache et base de données

---

# 🔮 Perspectives d'Amélioration

## Court Terme

- Ajouter des multi-stage builds pour la production
- Implémenter des health checks dans docker-compose
- Configurer un pipeline CI/CD (GitHub Actions)

## Long Terme

- Migration vers Kubernetes pour l'orchestration
- Tests automatisés dans les conteneurs

---

<!-- _class: lead -->

# ❓ Questions ?

---

<!-- _class: lead -->

# Merci !

## EventHub - DevOps Environment

**Repository:** [Vaalley/eventhub](https://github.com/Vaalley/eventhub)
**Stack:** Docker • Node.js • React • MongoDB • Redis • Nginx

*Questions techniques bienvenues* 🚀
