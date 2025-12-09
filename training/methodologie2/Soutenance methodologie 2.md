# Soutenance METH2

Vous allez maintenant travailler sur le projet fil rouge **EventHub**. Vous devrez réaliser le travail ci-dessous et le présenter ensuite en soutenance afin d'être évalué.

## 📊 Préparation

À partir du cahier des charges d’EventHub, réaliser :

### 1. Merise
* Le Modèle Conceptuel de Données (MCD)
* Le Modèle Logique de Données (MLD)
* Le Modèle Physique de Données (MPD)
    * *Si vous avez le temps :* générer les fichiers SQL.
    * *Si vous êtes juste :* au format texte : `table(id_cle_primaire, #clé_étragère)`.

### 2. Agile
Une fois les modèles réalisés, produire :
1.  Définition du MVP
2.  User Stories
3.  Product Backlog
4.  Estimation et Poker Planning
5.  Sprint Planning #1
6.  Tableau Kanban et règles WIP
7.  Roadmap et planification

### 3. Bonus
*S’il vous reste du temps.*

**3.1 Générer quelques jeux de données :**
* 3-5 évènements
* 25-100 participants par évènement
* 1 budget par évènement
* 2-3 lieux
* 25 % à 100 % d’évaluations par évènement par rapport au nombre de participants

> Vous pouvez générer les données via IA, Python/Faker, [GenerateData](https://generatedata.com/) ou en « scrappant » des données sur [BilletReduc](https://www.billetreduc.com/) avec curl, [Selenium](https://www.selenium.dev/) ou [Playwright](https://playwright.dev/).

**3.2 Reprendre votre travail de DevOps1 :**
* Lors du build de l’image ou à la création du container, injecter vos scripts SQL (structures + données).

---

> **ℹ️ Informations Générales**
> * **Durée totale :** 10-15 minutes
> * **Format :** Présentation sous forme de soutenance
> * **Contexte :** Semaine 3 - METH2 - Gestion de projet Agilité

---

## 📊 Structure de la Présentation

### Slide 1 : Page de Titre (30 sec)
* Titre du projet et présentation.

---

### Slide 2 : Contexte et Choix Méthodologique (1 min 30)
* Bref rappel du projet EventHub et acteurs.
* Justification du choix de l'agilité pour EventHub.
* Scrum vs Kanban : pourquoi Scrum ?
* Application des valeurs du Manifeste Agile.

---

### Slide 3 : Équipe Scrum EventHub (45 sec)
* Composition de l'équipe (Product Owner, Scrum Master, Dev Team).
* Organigramme de l'équipe.
* Répartition des rôles et responsabilités.

---

### Slide 4 : Merise (2 min)
* Présentation et explication de la méthode Merise.
* Explication du MCD.
* Explication du MLD.
* Explication du MPD.

---

### Slide 5 : Définition du MVP EventHub (1 min 15)
* Fonctionnalités incluses dans le MVP.
* Exclusions volontaires (et pourquoi).
* Métriques de succès du MVP.
* Horizon temporel (nombre de sprints).

---

### Slide 6 : Technique d'Estimation - Planning Poker (45 sec)
* Explication de la technique utilisée.
* Échelle de Fibonacci.
* Processus d'estimation collaboratif.
* Exemple d'estimation d'une User Story.

---

### Slide 7 : Sprint Planning #1 et Tableau Kanban (3 min)
* Sprint Goal du premier sprint.
* Capacité de l'équipe (vélocité estimée).
* Sprint Backlog (User Stories sélectionnées).
* Total des Story Points.
* Risques identifiés et plan de mitigation.
* Visualisation du tableau Kanban.
* Colonnes définies (Backlog, Ready, In Progress, Review, Done).
* Règles WIP (Work In Progress).
* Métriques de suivi (Lead Time, Cycle Time, Throughput).

---

### Slide 8 : Roadmap et Cérémonies Scrum (1 min 30)
* Vue d'ensemble de la roadmap MVP (6 sprints / 3 mois).
* Sprint Goals pour chaque sprint.
* Cérémonies Scrum mises en place (Sprint Planning, Daily, Review, Retrospective).
