# Diagramme de classe - EventHub (Global)

A copier/coller sur https://www.plantuml.com/plantuml

```plantuml
@startuml
title EventHub - Diagramme de classe global

' --- Utilisateurs ---
class User {
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

enum UserRole {
  PARTICIPANT
  ORGANIZER
  ADMIN
}

' --- Événements ---
class Event {
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

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

' --- Lieux ---
class Venue {
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
class TicketType {
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
class Booking {
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

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

' --- Billets ---
class Ticket {
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
class Review {
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
class Category {
  -id: UUID
  -name: String
  -description: String
  --
  +getEvents(): Event[]
  +update(data): Boolean
}

' --- Notifications ---
class Notification {
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

enum NotificationType {
  EMAIL
  IN_APP
  PUSH
}

' --- Paiements ---
class Payment {
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

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

' --- Relations ---
User ||--o{ Booking : makes
User ||--o{ Review : writes
User ||--o{ Notification : receives
User }|--|| UserRole : has

Event ||--o{ TicketType : contains
Event ||--o{ Booking : has
Event ||--o{ Review : receives
Event }|--|| EventStatus : has
Event }o--|| Venue : located at
Event }o--|| Category : belongs to

Venue ||--o{ Event : hosts

TicketType ||--o{ Ticket : generates
TicketType }|--|| Event : belongs to

Booking ||--o{ Ticket : includes
Booking ||--|| Payment : requires
Booking }|--|| BookingStatus : has
Booking }|--|| Event : for
Booking }|--|| User : by

Ticket }|--|| TicketType : type of
Ticket }|--|| Booking : part of

Review }|--|| Event : about
Review }|--|| User : by

Notification }|--|| User : for
Notification }|--|| NotificationType : type

Payment }|--|| Booking : for
Payment }|--|| PaymentStatus : has

@enduml
```
