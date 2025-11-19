# Projet Fil Rouge CDA - 3WA
Cahier des Charges Fonctionnel - Projet EventHub

Présentation générale
EventHub est une plateforme de gestion d'événements et de billetterie en ligne
permettant à des organisateurs de créer, promouvoir et gérer leurs événements, et
aux utilisateurs de découvrir, réserver et participer à ces événements. La solution
inclut la gestion des réservations, des paiements, des participants et propose des
fonctionnalités d'analyse pour les organisateurs.
Contexte

Dans un contexte où les événements physiques et virtuels se multiplient
(conférences, ateliers, concerts, expositions), il devient essentiel pour les
organisateurs de disposer d'outils performants pour gérer efficacement leurs
événements. Parallèlement, les participants recherchent des plateformes intuitives
pour découvrir des événements correspondant à leurs centres d'intérêt et effectuer
des réservations sans friction.

Objectifs du projet
1. Fournir une plateforme complète de gestion d'événements et de billetterie

2. Offrir une expérience utilisateur fluide pour la recherche et la réservation
d'événements

3. Permettre aux organisateurs de gérer efficacement leurs événements et
d'analyser leurs performances

4. Sécuriser les données personnelles et les transactions

5. Créer une architecture évolutive et maintenable

6. Mettre en place une démarche DevOps complète pour le développement et le
déploiement

Cibles utilisateurs
● Participants : personnes recherchant et réservant des places pour des
événements
● Organisateurs : entreprises ou personnes créant et gérant des événements
● Administrateurs : gestionnaires de la plateforme
Fonctionnalités attendues

1. Gestion des utilisateurs
● Inscription et authentification sécurisée (participant, organisateur,
administrateur)
● Profils personnalisables avec historique des événements
● Système de notifications (email, in-app)
● Gestion des préférences et centres d'intérêt

2. Gestion des événements (organisateurs)
● Création et configuration d'événements (lieu, date, capacité, tarifs)
● Gestion des billets et des formules tarifaires
● Publication et promotion des événements
● Suivi des ventes et des inscriptions
● Gestion des remboursements et annulations

3. Découverte et réservation (participants)
● Recherche multicritères d'événements (lieu, date, catégorie, prix)
● Système de recommandations personnalisées
● Processus de réservation et paiement sécurisés
● Gestion des billets électroniques et QR codes
● Avis et notations post-événement

4. Gestion des lieux
● Référencement des lieux d'événements
● Informations sur la capacité, les équipements, l'accessibilité
● Gestion des disponibilités
● Cartographie et indications d'accès

5. Administration
● Tableau de bord d'administration globale
● Modération des événements et des utilisateurs
● Gestion des catégories d'événements
● Analyse des performances de la plateforme
● Configuration des paramètres globaux

6. Analyse et statistiques en temps réel
● Suivi des affluences et des réservations en temps réel
● Tableaux de bord dynamiques pour les organisateurs
● Calcul de métriques de performance des événements
● Stockage des données d'analyse en NoSQL pour la performance
Contraintes techniques

Architecture
● Architecture en couches clairement séparées (présentation, métier, données)
● Frontend responsive en TypeScript avec React
● Backend en Node.js (Express) et TS
● Base de données relationnelle MySQL ou PostgreSQL
● API REST sécurisée pour la communication entre frontend et backend
● Conteneurisation avec Docker et docker-compose
● Système d'authentification avec JWT

Sécurité
● Chiffrement des données sensibles
● Protection contre les attaques courantes (XSS, CSRF, injections SQL)
● Validation stricte des entrées utilisateurs
● Journalisation des activités sensibles
● Conformité RGPD (consentement, droit à l'oubli)

Performance
● Optimisation des requêtes de base de données (indexation, pagination)
● Mise en cache pour les données fréquemment consultées
● Optimisation des assets frontend (minification, lazy loading)
● Temps de réponse < 3 secondes pour les opérations standard

DevOps et CI/CD
● Intégration continue avec des tests automatisés
● Pipeline de déploiement automatisé
● Gestion des environnements (développement, test, production)
● Analyse des rapports d'exécution des tests et d'intégration continue
● Scripts d'automatisation pour les tâches répétitives

Qualité et tests
● Tests unitaires couvrant les fonctionnalités critiques
● Tests d'intégration pour les principales fonctionnalités
● Tests de non-régression automatisés
● Tests de sécurité et d'accessibilité
● Documentation technique complète

Communication et documentation
● Documentation technique rédigée en français et en anglais
● Commentaires de code en anglais
● API documentée avec Swagger/OpenAPI en anglais
● Guides utilisateurs disponibles en français

Livrables attendus
1. Code source de l'application (frontend TypeScript/React, backend, scripts)
2. Fichiers Docker et docker-compose pour le développement et le déploiement
3. Documentation technique complète en français et en anglais:
○ Diagrammes UML (cas d'utilisation, classes, séquences)
○ Modèle de données
○ Documentation API (Swagger/OpenAPI)
○ Guide d'installation et de déploiement
4. Configuration CI/CD et scripts d'automatisation
5. Rapport de tests unitaires, d'intégration et de non-régression
6. Analyse de sécurité et rapport de conformité
7. Manuel utilisateur pour chaque type d'utilisateur

Cas d'utilisation principaux
UC1: Inscription et authentification
● Un utilisateur s'inscrit sur la plateforme comme participant ou organisateur
● Il confirme son compte via email
● Il complète son profil selon son rôle
● Il peut se connecter et accéder aux fonctionnalités correspondantes

UC2: Création d'un événement
● Un organisateur crée un nouvel événement
● Il configure les détails (titre, description, lieu, date, capacité)
● Il définit les catégories de billets et tarifs
● Il publie l'événement sur la plateforme

UC3: Recherche et réservation
● Un participant recherche un événement selon ses critères
● Il consulte les détails et la disponibilité
● Il sélectionne et réserve des billets
● Il reçoit une confirmation et ses billets électroniques

UC4: Gestion des entrées
● Un organisateur consulte la liste des participants
● Il scanne les QR codes des billets à l'entrée
● Il peut vérifier la validité des billets
● Il accède aux statistiques d'entrées en temps réel

UC5: Administration et reporting
● Un organisateur consulte les statistiques de ses événements
● Il génère des rapports sur les ventes et la participation
● Il analyse les données démographiques des participants
● Il suit la rentabilité de ses événements

Spécifications techniques détaillées
Base de données
● Base relationnelle:
○ Users (participants, organisateurs, administrateurs)
○ Events (événements avec détails complets)
○ Venues (lieux d'événements)
○ Tickets (types de billets par événement)
○ Bookings (réservations des utilisateurs)
○ Categories (catégories d'événements)
○ Reviews (avis sur les événements)

● Base NoSQL (optionnelle mais recommandée):
○ Analytics: stockage des données d'analyse en temps réel
○ Sessions: gestion des sessions utilisateurs
○ EventStats: métriques des événements pour tableaux de bord
○ RealtimeData: données de fréquentation en temps réel

Architecture de l'application
● Frontend: React avec TypeScript et gestion d'état (Redux ou Context API)

● Backend: API REST avec authentification JWT

● Services principaux:
○ Service d'authentification et gestion des utilisateurs
○ Service de gestion des événements
○ Service de billetterie et paiements
○ Service de notification
○ Service d'analyse et reporting
○ Service de statistiques en temps réel (avec stockage NoSQL)

Composant d'accès aux données NoSQL
Un composant spécifique sera développé pour gérer l'accès aux données NoSQL. Ce
composant devra:
● Fournir une interface abstraite pour les opérations CRUD sur les données
NoSQL

● Gérer la connexion et les sessions avec la base NoSQL

● Optimiser les requêtes pour les performances en temps réel

● Assurer la synchronisation avec les données relationnelles lorsque nécessaire

● Implémenter des mécanismes de cache et d'agrégation pour les tableaux de
bord

● Gérer la persistance des données critiques
L'implémentation de ce composant sera guidée par un cours spécifique sur
l'utilisation des bases de données NoSQL dans un contexte d'application web.
Déploiement avec Docker

● Conteneurs séparés pour:
○ Frontend (React/TypeScript)
○ Backend API
○ Base de données relationnelle
○ Base de données NoSQL
○ Serveur de cache (Redis)
○ Serveur web (Nginx)

● Configuration via docker-compose pour le développement et la production
Approche DevOps

● Intégration continue:
○ Vérification automatique de la qualité du code
○ Exécution des tests unitaires et d'intégration
○ Tests de non-régression automatisés

● Livraison continue:
○ Build automatique des images Docker
○ Déploiement automatisé dans l'environnement de test
○ Analyse des rapports d'exécution des tests et d'intégration continue

● Déploiement continu:
○ Scripts de déploiement en production
○ Gestion des configurations d'environnement
○ Stratégies de rollback en cas de problème
Tests

● Tests unitaires pour les composants clés

● Tests d'intégration pour les flux principaux

● Tests de non-régression pour garantir que les nouvelles fonctionnalités ne
cassent pas les anciennes

● Tests de charge pour simuler l'affluence lors des mises en vente

● Tests de sécurité pour valider la protection des données