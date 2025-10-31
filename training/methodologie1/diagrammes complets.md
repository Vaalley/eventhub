# EventHub - Diagrammes Complets

Ce fichier contient tous les diagrammes UML du projet EventHub. Pour visualiser un diagramme, copiez le code PlantUML correspondant et collez-le sur https://www.plantuml.com/plantuml

---

## 1. Diagramme de cas d'utilisation - Participants, Organisateurs et Administrateurs

A copier/coller sur https://www.plantuml.com/plantuml

```plantuml
@startuml
left to right direction

actor "Participant" as Participant
actor "Organisateur" as Organisateur
actor "Administrateur" as Administrateur

rectangle "Module Participants" {
  usecase "S'inscrire" as UCRegister
  usecase "Se connecter (participant)" as UCLoginParticipant
  usecase "Rechercher événement" as UCSearch
  usecase "Réserver billet" as UCBook
  usecase "Payer" as UCPay
  usecase "Consulter historique" as UCHistory
  usecase "Évaluer événement" as UCRate
}

rectangle "Module Organisateurs" {
  usecase "Se connecter (organisateur)" as UCLoginOrganizer
  usecase "Créer événement" as UCCreate
  usecase "Gérer les détails d'événement" as UCManageDetails
  usecase "Gérer les billets" as UCTickets
  usecase "Suivre les ventes" as UCSales
  usecase "Gérer les participants" as UCManageParticipants
}

rectangle "Module Administrateurs" {
  usecase "Se connecter (admin)" as UCLoginAdmin
  usecase "Superviser plateforme" as UCSupervise
  usecase "Gérer comptes utilisateurs" as UCManageAccounts
  usecase "Configurer paramètres globaux" as UCConfigure
  usecase "Consulter rapports" as UCReports
}

Participant --> UCRegister
Participant --> UCLoginParticipant
Participant --> UCSearch
Participant --> UCBook
Participant --> UCPay
Participant --> UCHistory
Participant --> UCRate

Organisateur --> UCLoginOrganizer
Organisateur --> UCCreate
Organisateur --> UCManageDetails
Organisateur --> UCTickets
Organisateur --> UCSales
Organisateur --> UCManageParticipants

Administrateur --> UCLoginAdmin
Administrateur --> UCSupervise
Administrateur --> UCManageAccounts
Administrateur --> UCConfigure
Administrateur --> UCReports

UCBook ..> UCLoginParticipant : <<include>>
UCBook ..> UCSearch : <<include>>
UCHistory ..> UCLoginParticipant : <<include>>
UCRate ..> UCHistory : <<extend>>
UCSearch ..> UCLoginParticipant : <<include>>
UCBook ..> UCPay : <<include>>
UCPay ..> UCLoginParticipant : <<include>>

UCCreate ..> UCLoginOrganizer : <<include>>
UCManageDetails ..> UCLoginOrganizer : <<include>>
UCTickets ..> UCLoginOrganizer : <<include>>
UCManageParticipants ..> UCLoginOrganizer : <<include>>
UCSales ..> UCLoginOrganizer : <<include>>

UCTickets ..> UCCreate : <<include>>
UCManageParticipants ..> UCTickets : <<extend>>
UCSales ..> UCTickets : <<include>>

UCSupervise ..> UCLoginAdmin : <<include>>
UCManageAccounts ..> UCSupervise : <<include>>
UCConfigure ..> UCSupervise : <<include>>
UCReports ..> UCSupervise : <<include>>
@enduml
```

---

## 2. Diagramme d'activité - Réservation d'un billet

A copier/coller sur https://www.plantuml.com/plantuml

```plantuml
@startuml
title Réservation d'un billet - EventHub

start

:Participant connecté;

if (Rechercher un événement?) then (oui)
  :Saisir critères (catégorie, date, lieu);
  :Afficher résultats;
  :Sélectionner un événement;
else (non)
  stop
endif

:Consulter détails événement;
if (Places disponibles?) then (oui)
  if (Choisir quantité?) then (oui)
    :Sélectionner nombre de billets;
    :Calculer total;
  else (non)
    stop
  endif
else (non)
  :Afficher "Complet";
  stop
endif

if (Confirmer réservation?) then (oui)
  :Accéder au paiement;
else (non)
  :Retour aux détails;
  stop
endif

:Entrer informations paiement;
:Valider paiement (Stripe);
if (Paiement accepté?) then (oui)
  :Générer billets électroniques;
  :Envoyer confirmation email;
  :Envoyer billets (QR codes);
  :Mettre à jour stock événement;
  :Enregistrer réservation dans historique;
else (non)
  :Afficher erreur paiement;
  :Proposer de réessayer;
  stop
endif

:Afficher page de confirmation;
:Accéder aux billets depuis espace personnel;

stop

@enduml
```

---

## 3. Diagramme de séquence - Création d'une conférence

A copier/coller sur https://www.plantuml.com/plantuml

```plantuml
@startuml
title Création d'une conférence - EventHub

actor "Organisateur" as Org
participant "Frontend (React)" as UI
participant "Backend API" as API
database "Base de données" as DB
participant "Service Stockage" as Storage
participant "Service Email" as Email

Org -> UI: Accéder à "Créer événement"
activate UI

UI -> API: GET /categories
activate API
API -> DB: Lister catégories disponibles
activate DB
DB --> API: Retourner catégories
deactivate DB
API --> UI: Catégories reçues
deactivate API

UI -> Org: Afficher formulaire de création
UI --> Org: Saisir informations (titre, description, date, lieu, capacité, tarifs)

Org -> UI: Soumettre formulaire
UI -> API: POST /events (données événement)
activate API

API -> API: Valider données requête
alt Données invalides
  API --> UI: 400 Bad Request (erreurs validation)
  deactivate API
  UI --> Org: Afficher erreurs
else Données valides
  API -> DB: INSERT INTO events
  activate DB
  DB --> API: ID événement créé
  deactivate DB
  
  alt Images fournies
    API -> Storage: Uploader images événement
    activate Storage
    Storage --> API: URLs images générées
    deactivate Storage
    API -> DB: UPDATE events SET images = URLs
    activate DB
    DB --> API: Confirmation mise à jour
    deactivate DB
  end
  
  API -> DB: UPDATE events SET status = 'brouillon'
  activate DB
  DB --> API: Confirmation statut
  deactivate DB
  
  API --> UI: 201 Created (détails événement)
  deactivate API
  
  UI --> Org: Afficher confirmation création
  UI --> Org: Proposer "Publier l'événement"
  
  alt Publier immédiatement
    Org -> UI: Cliquer "Publier"
    UI -> API: PUT /events/{id}/publish
    activate API
    API -> DB: UPDATE events SET status = 'publié'
    activate DB
    DB --> API: Confirmation publication
    deactivate DB
    API -> Email: Envoyer notification création événement
    activate Email
    Email --> API: Notification envoyée
    deactivate Email
    API --> UI: 200 OK (événement publié)
    deactivate API
    UI --> Org: Afficher "Événement publié"
  else Garder en brouillon
    UI --> Org: Afficher "Événement en brouillon"
  end
end

deactivate UI

@enduml
```

---

## 4. Diagramme de classe - EventHub (Global)

A copier/coller sur https://www.plantuml.com/plantuml

```plantuml
@startuml
title EventHub - Diagramme de classe global

' --- Utilisateurs ---
class user {
  -id: UUID
  -email: String
  -password: String
  -firstName: String
  -lastName: String
  -role: UserRole
  -createdAt: DateTime
  -updatedAt: DateTime
  --
  +register(data): Boolean
  +login(email, password): Token
  +logout(): void
  +updateProfile(data): Boolean
  +getHistory(): Booking[]
}

enum userRole {
  PARTICIPANT
  ORGANIZER
  ADMIN
}

' --- Événements ---
class event {
  -id: UUID
  -title: String
  -description: String
  -startDate: DateTime
  -endDate: DateTime
  -status: EventStatus
  -maxCapacity: Integer
  -createdAt: DateTime
  -updatedAt: DateTime
  --
  +publish(): Boolean
  +cancel(): Boolean
  +updateDetails(data): Boolean
  +getAvailableSeats(): Integer
  +addTicketType(ticket: TicketType): void
}

enum eventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

' --- Lieux ---
class venue {
  -id: UUID
  -name: String
  -address: String
  -capacity: Integer
  -equipment: String[]
  -isAccessible: Boolean
  --
  +checkAvailability(date): Boolean
  +updateInfo(data): Boolean
  +getEvents(): Event[]
}

' --- Types de billets ---
class ticketType {
  -id: UUID
  -eventId: UUID
  -name: String
  -price: Decimal
  -quantity: Integer
  -soldQuantity: Integer
  --
  +isAvailable(): Boolean
  +sell(quantity): Boolean
  +updatePrice(newPrice): Boolean
}

' --- Réservations ---
class booking {
  -id: UUID
  -userId: UUID
  -eventId: UUID
  -bookingDate: DateTime
  -status: BookingStatus
  -totalAmount: Decimal
  --
  +confirm(): Boolean
  +cancel(): Boolean
  +generateTickets(): Ticket[]
  +sendConfirmation(): Boolean
}

enum bookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

' --- Billets ---
class ticket {
  -id: UUID
  -bookingId: UUID
  -ticketTypeId: UUID
  -qrCode: String
  -isUsed: Boolean
  --
  +generateQRCode(): String
  +validate(): Boolean
  +sendByEmail(): Boolean
}

' --- Évaluations ---
class review {
  -id: UUID
  -eventId: UUID
  -userId: UUID
  -rating: Integer
  -comment: String
  -createdAt: DateTime
  --
  +submit(): Boolean
  +update(newRating, newComment): Boolean
  +delete(): Boolean
}

' --- Catégories ---
class category {
  -id: UUID
  -name: String
  -description: String
  --
  +getEvents(): Event[]
  +update(data): Boolean
}

' --- Notifications ---
class notification {
  -id: UUID
  -userId: UUID
  -type: NotificationType
  -message: String
  -isRead: Boolean
  -createdAt: DateTime
  --
  +send(): Boolean
  +markAsRead(): Boolean
}

enum notificationType {
  EMAIL
  IN_APP
  PUSH
}

' --- Paiements ---
class payment {
  -id: UUID
  -bookingId: UUID
  -amount: Decimal
  -status: PaymentStatus
  -paymentMethod: String
  -transactionId: String
  -createdAt: DateTime
  --
  +process(): Boolean
  +refund(): Boolean
  +getReceipt(): String
}

enum paymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

' --- Relations ---
user ||--o{ booking : makes
user ||--o{ review : writes
user ||--o{ notification : receives
user }|--|| userRole : has

event ||--o{ ticketType : contains
event ||--o{ booking : has
event ||--o{ review : receives
event }|--|| eventStatus : has
event }o--|| venue : located at
event }o--|| category : belongs to

venue ||--o{ event : hosts

ticketType ||--o{ ticket : generates

booking ||--o{ ticket : includes
booking ||--|| payment : requires
booking }|--|| bookingStatus : has

ticket }|--|| ticketType : type of
ticket }|--|| booking : part of

review }|--|| event : about
review }|--|| user : by

notification }|--|| user : for
notification }|--|| notificationType : type

payment }|--|| booking : for
payment }|--|| paymentStatus : has

@enduml
```

---

## 5. Modèle Entité-Relation - EventHub

A copier/coller sur https://www.plantuml.com/plantuml

```plantuml
@startuml
title EventHub - Modèle Entité-Relation

' --- Entité Utilisateur ---
entity user {
  * **id** : UUID <<PK>>
  --
  * email : varchar(255) <<UNIQUE>>
  * password : varchar(255)
  * first_name : varchar(100)
  * last_name : varchar(100)
  * role : enum('PARTICIPANT','ORGANIZER','ADMIN')
  * created_at : timestamp
  * updated_at : timestamp
}

' --- Entité Événement ---
entity event {
  * **id** : UUID <<PK>>
  --
  * title : varchar(200)
  * description : text
  * start_date : timestamp
  * end_date : timestamp
  * status : enum('DRAFT','PUBLISHED','CANCELLED','COMPLETED')
  * max_capacity : int
  * venue_id : UUID <<FK>>
  * category_id : UUID <<FK>>
  * created_at : timestamp
  * updated_at : timestamp
}

' --- Entité Lieu ---
entity venue {
  * **id** : UUID <<PK>>
  --
  * name : varchar(200)
  * address : varchar(500)
  * capacity : int
  * equipment : json
  * is_accessible : boolean
}

' --- Entité Catégorie ---
entity category {
  * **id** : UUID <<PK>>
  --
  * name : varchar(100)
  * description : text
}

' --- Entité Type de Billet ---
entity ticketType {
  * **id** : UUID <<PK>>
  --
  * event_id : UUID <<FK>>
  * name : varchar(100)
  * price : decimal(10,2)
  * quantity : int
  * sold_quantity : int
}

' --- Entité Réservation ---
entity booking {
  * **id** : UUID <<PK>>
  --
  * user_id : UUID <<FK>>
  * event_id : UUID <<FK>>
  * booking_date : timestamp
  * status : enum('PENDING','CONFIRMED','CANCELLED','COMPLETED')
  * total_amount : decimal(10,2)
}

' --- Entité Billet ---
entity ticket {
  * **id** : UUID <<PK>>
  --
  * booking_id : UUID <<FK>>
  * ticket_type_id : UUID <<FK>>
  * qr_code : varchar(255)
  * is_used : boolean
}

' --- Entité Évaluation ---
entity review {
  * **id** : UUID <<PK>>
  --
  * event_id : UUID <<FK>>
  * user_id : UUID <<FK>>
  * rating : int
  * comment : text
  * created_at : timestamp
}

' --- Entité Notification ---
entity notification {
  * **id** : UUID <<PK>>
  --
  * user_id : UUID <<FK>>
  * type : enum('EMAIL','IN_APP','PUSH')
  * message : text
  * is_read : boolean
  * created_at : timestamp
}

' --- Entité Paiement ---
entity payment {
  * **id** : UUID <<PK>>
  --
  * booking_id : UUID <<FK>>
  * amount : decimal(10,2)
  * status : enum('PENDING','COMPLETED','FAILED','REFUNDED')
  * payment_method : varchar(50)
  * transaction_id : varchar(255)
  * created_at : timestamp
}

' --- Relations ---
user ||--o{ booking : "fait"
user ||--o{ review : "rédige"
user ||--o{ notification : "reçoit"

event ||--o{ ticketType : "contient"
event ||--o{ booking : "concerne"
event ||--o{ review : "reçoit"
event }o--|| venue : "a lieu à"
event }o--|| category : "appartient à"

venue ||--o{ event : "accueille"

ticketType ||--o{ ticket : "génère"

booking ||--o{ ticket : "inclut"
booking ||--|| payment : "requiert"

@enduml
```

---

## Instructions d'utilisation

1. **Choisir un diagramme** ci-dessus
2. **Copier** le code PlantUML correspondant (entre les ```plantuml et ```)
3. **Coller** le code sur https://www.plantuml.com/plantuml
4. Le diagramme s'affichera automatiquement

### Types de diagrammes utilisés

- **Diagramme de cas d'utilisation** : Montre les interactions entre les acteurs et le système
- **Diagramme d'activité** : Représente le flux d'un processus métier
- **Diagramme de séquence** : Illustre les interactions temporelles entre composants
- **Diagramme de classe** : Modélise la structure orientée objet avec attributs et méthodes
- **Modèle entité-relation** : Schéma de base de données avec entités et relations
