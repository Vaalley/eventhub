Exemple: Développement de la feature "Gestion des événements" (Backend)
Méthodologie : Onion Architecture + TDD métier

Étape 1 : Exprimer les règles métier pour la création d'un événement
Questionnement :

Qu'est-ce qu'un événement valide dans EventHub ? Quelles contraintes doivent
être respectées dès la création ? Exemples de règles métier à identifier :

Un événement doit avoir un titre non vide. La date de début doit être dans le
futur. Le lieu doit être spécifié. La capacité maximale doit être positive (au
moins 1). La catégorie de l'événement doit exister parmi celles définies.
L'organisateur (créateur de l'événement) doit être un utilisateur authentifié.
Le prix (s’il existe) doit être un nombre positif. Le nombre de billets
disponibles ne peut pas excéder la capacité.

Étape 2 : À partir des règles métier, lister les cas de test unitaires Guidage :
Chaque règle métier → un ou plusieurs tests.

Exemples de tests pour CreateEventUseCase :

"Créer un événement avec des données valides retourne l'ID de l'événement créé."
"Créer un événement sans titre échoue." "Créer un événement avec une date dans
le passé échoue." "Créer un événement sans lieu échoue." "Créer un événement
avec une capacité négative échoue." "Créer un événement avec une catégorie
inconnue échoue." "Créer un événement sans organisateur authentifié échoue."
Livrable intermédiaire : Un fichier de tests avec tous les cas énumérés (même si
les tests ne sont pas encore écrits).

Étape 3 : Définir l’entité Event (à partir des règles métier) À déduire :

Quelles propriétés doit contenir l'entité Event ? Quelle est la cohérence de
l'objet (constructeur ou validate method) ? Guidage attendu :

L'entité Event doit contenir (au minimum) : id, title, description, startDate,
venueId, capacity, price, organizerId, categoryId, imageUrl, createdAt,
updatedAt. Les règles métier peuvent être vérifiées soit au niveau de l'entité,
soit au niveau du UseCase, selon l'importance.

Étape 4 : Écrire le CreateEventUseCase en respectant les règles métier Approche
:

Injecter un EventRepositoryInterface. Valider les données fournies avant de
sauvegarder. Retourner l’événement créé. Responsabilités à vérifier :

Ne jamais accéder directement à la base de données dans le UseCase. Faire
remonter une erreur explicite en cas d’échec de validation.

Étape 5 : Implémenter l'EventRepositoryInterface Contenu attendu :

save(event: Event): Promise<Event>

Étape 6 : Implémenter l'EventRepositoryDatabase Contenu attendu :

Implémentation réelle via ORM ou requêtes SQL. Mapping entité <-> modèle base de
données.

Étape 7 : Créer le EventController + route REST Structure :

Le controller reçoit la requête HTTP (POST /events) Il transforme la requête en
DTO. Il appelle CreateEventUseCase. Il retourne la réponse HTTP standard (201 ou
erreur).

Résumé du flux complet pour la création d’un événement : [HTTP Request POST
/events] | v [EventController] | v [CreateEventUseCase] | v
[EventRepositoryInterface] | v [EventRepositoryDatabase] | v [Base de données]

En résumé : Lister toutes les règles métier de l'action "Créer un événement"
Lister tous les tests unitaires attendus Écrire l'entité Event et ses
validations Écrire l'interface EventRepositoryInterface Écrire
CreateEventUseCase en TDD Créer un InMemoryRepository pour tester
CreateEventUseCase Coder la vraie implémentation EventRepositoryDatabase Coder
EventController et exposer la route POST /events Les autres usecases se feront
naturellement:

Modifier un événement Supprimer un événement Lister tous les événements
Consulter un événement par ID Exemples de réflexions attendues :

Lors de la création d’un événement, est-ce que tous les champs sont obligatoires
? Que se passe-t-il si on tente de modifier un événement qui n’existe pas ? Que
doit-on retourner si un événement est supprimé avec succès ? Comment paginer ou
filtrer la liste des événements ?
