# 🚀 Stratégie Agile - Projet EventHub
**Méthodologie hybride : Scrumban (Cadre Scrum + visualisation Kanban)**

Lien de la [presentation](https://docs.google.com/presentation/d/1YFC3WpmUD-V7fg7ucxX-pIa1gPoGKH3E8NrA17_j7kE/edit?usp=sharing)

## 1. Définition du MVP (Minimum Viable Product)

Le MVP se concentre sur la chaîne de valeur principale : **"Un organisateur publie un événement, un participant réserve sa place."**

### ✅ Fonctionnalités incluses (Périmètre)
1.  **Authentification :** Inscription/Connexion (JWT) pour Participants et Organisateurs.
2.  **Gestion Événements :** Création (CRUD), liste et détail d'un événement.
3.  **Recherche :** Filtrage simple (par date ou catégorie).
4.  **Billetterie :** Réservation d'un billet (génération d'un QR Code fictif/simple).
5.  **Paiement :** Simulation de paiement (ou intégration Stripe Sandbox basique).

### ❌ Exclusions volontaires (Pour la V2)
* Tableaux de bord analytiques.
* Gestion des remboursements automatisés.
* Application mobile native.

### 🎯 Métriques de succès du MVP
* Temps de chargement page d'accueil < 2s.
* Parcours complet (Inscription -> Réservation) réalisable en < 5 min.
* Zéro bug critique sur le processus de paiement.
* 10 évènements enregistrés en moins de 3 mois.
* 300 utilisateurs enregistrés en moins de 3 mois.

---

## 2. User Stories (Exemples Clés)

| ID | En tant que... | Je veux... | Afin de... | Critères d'acceptation |
|:---|:---|:---|:---|:---|
| **US-01** | **Participant** | Créer un compte personnel | Accéder aux réservations | Email valide, MDP haché |
| **US-02** | **Organisateur** | Créer une fiche événement | Mettre en vente mes billets | Formulaire complet (Lieu, Date, Prix), validation des champs, statut "Brouillon" par défaut. |
| **US-03** | **Participant** | Filtrer les événements | Trouver une sortie ce weekend | Filtres fonctionnels : Date, Lieu, Catégorie. Résultats < 1s. |
| **US-04** | **Participant** | Payer ma commande | Valider ma réservation | Formulaire CB sécurisé, débit confirmé, redirection page succès. |
| **US-05** | **Organisateur** | Scanner un billet (QR) | Valider l'entrée d'un client | Le scan change le statut du billet de "Valide" à "Utilisé" en base. |

---

## 3. Product Backlog & Priorisation (MoSCoW)

1.  **Priorité absolue - Sprint 1 & 2**
    * Setup Environnement (Docker, Git, CI/CD).
    * Base de données (diagrammes UML -> SQL/NOSQL).
    * API Auth (Login/Register).
    * API CRUD Événements.
    * Frontend : Liste des événements (Landing Page).

2.  **Important - Sprint 3 & 4**
    * Détail événement.
    * Panier et tunnel de commande.
    * Génération PDF du billet.
    * Espace personnel (Historique).

3.  **Confort - Sprint 5**
    * Système de favoris.
    * Notation / Avis post-événement.
    * Upload d'images optimisé (third-party service).

---

## 4. Estimation (Poker Planning)

Utilisation de la suite de Fibonacci (1, 2, 3, 5, 8, 13, 21) pour estimer la complexité.

* **1 pt :** Tâche triviale (ex: changer un texte, couleur).
* **3 pts :** Tâche standard (ex: créer une page simple sans logique complexe).
* **5 pts :** Tâche moyenne (ex: CRUD API complet avec tests).
* **8 pts :** Tâche complexe (ex: Intégration Stripe complète avec Webhooks).
* **13 pts :** Trop gros ➔ À découper (Epic).

**Exemple d'estimation :**
* *US-01 (Auth)* : **5 pts** (nécessite sécu, token, DB).
* *US-02 (Création Event)* : **8 pts** (formulaire complexe, gestion dates, upload image).
* *US-05 (Scan QR)* : **3 pts** (logique simple côté back, utilisation lib existante côté front).

---

## 5. Sprint Planning #1 (Lancement)

* **Durée du Sprint :** 1 semaine.
* **Vélocité estimée de l'équipe :** 13 points.
* **Sprint Goal :** "Avoir un socle technique opérationnel (Docker/DB) et une API d'authentification prête à l'emploi"

**Sprint Backlog (Tickets sélectionnés) :**
1.  [TECH] Initialisation Repo + Docker Compose (3 pts).
2.  [TECH] Script création BDD SQL/NOSQL(seed) (2 pts).
3.  [BACK] API Authentification (Register/Login) (5 pts).
4.  [FRONT] Mise en place React + Router + Tailwind (3 pts).
    * **Total : 13 points**

---

## 6. Tableau Kanban

Nous utilisons un tableau Kanban pour visualiser le flux continu au sein du Sprint Scrum.

### Colonnes et Workflow
1.  **Backlog** (Tout ce qui reste à faire).
2.  **To Do** (Sélectionné pour le sprint courant).
3.  **In Progress** (En cours de développement).
4.  **Review / Test** (Pull Request, Code Review, Test fonctionnel).
5.  **Done** (Validé et mergé sur la branche `main` / `develop`).

### 📋 Tableau Kanban - Sprint 1 (exemple)
**Objectif :** Socle technique opérationnel & API Auth prête.

| 📝 À FAIRE (3 pts) | 🚧 EN COURS (5 pts) | 👀 REVUE (2 pts) | ✅ TERMINÉ (3 pts) |
| :--- | :--- | :--- | :--- |
| **[FRONT] EH-4**<br>Architecture React + Router + Tailwind<br>*(Dev Front)* | **[BACK] EH-3**<br>API Auth (Register/Login) + JWT<br>*(Dev Back)* | **[TECH] EH-2**<br>Script Création BDD (SQL) & Seed<br>*(Tech Lead)* | **[TECH] EH-1**<br>Init Repo Git & Docker Compose<br>*(Tech Lead)* |
||**US-1**<br>Socle technique opérationnel & API Auth<br>|||

---

## 7. Roadmap Prévisionnelle

* **Sprint 1 (Semaine 1) : Fondations**
    * Architecture Docker, CI/CD pipeline, Auth JWT, Base de données.
* **Sprint 2 (Semaine 2) : Côté Organisateur**
    * CRUD Événements, Gestion des lieux, Catégories.
* **Sprint 3 (Semaine 3) : Côté Participant**
    * Recherche, Filtres, Page détail événement, Réservation (Tunnel d'achat).
* **Sprint 4 (Semaine 4) : Finalisation MVP**
    * Paiement (Stripe), Génération PDF Billet, QR Code.
* **Sprint 5 (Semaine 5) : Fiabilisation & Bonus**
    * Avis, Tests de charge, Optimisation, Documentation Swagger finale.