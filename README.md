# EventHub

EventHub is a web platform for event management and ticketing. It enables
organizers to create and manage their events, and allows users to book tickets
in a simple and secure way.

## Architecture

- **Frontend**: React + TypeScript + Vite (port 5173)
- **Backend**: Bun + Express (port 3000)
- **Database**: MongoDB (port 27017)
- **Cache**: Redis (port 6379)
- **Reverse Proxy**: Nginx (port 80)

## Local Development (with Docker)

### Prerequisites

- Docker Desktop installed and running

### Start All Services

```bash
docker compose up
```

### Start in Detached Mode

```bash
docker compose up -d
```

### Stop All Services

```bash
docker compose down
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
```

### Access the Application (Development)

- **Frontend**: http://localhost:5173 (Vite dev server with HMR)
- **Backend API**: http://localhost:3000 (Bun with hot reload)
- **Nginx Proxy**: http://localhost (frontend) AND http://localhost/api
  (backend)

---

## Docker Production

### Build and Start Production Services

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Stop Production Services

```bash
docker compose -f docker-compose.prod.yml down
```

### Access the Application (Production)

- **Frontend**: http://localhost:8080 (Nginx serving static files)
- **Backend API**: http://localhost:3000 (Bun production mode)
- **Nginx Proxy**: http://localhost

---

## Diagrams

This project includes several UML diagrams to document the system architecture
and workflows:

- [Use Case Diagram](training/methodologie1/diagramme%20cas%20utilisation.md) -
  Complete use cases for all user types
- [Activity Diagram - Ticket Reservation](training/methodologie1/diagramme%20activit%C3%A9%20r%C3%A9servation.md) -
  End-to-end reservation flow
- [Sequence Diagram - Conference Creation](training/methodologie1/diagramme%20s%C3%A9quence%20cr%C3%A9ation%20conf%C3%A9rence.md) -
  Event creation process
- [Class Diagram](training/methodologie1/diagramme%20classe%20global.md) -
  Global class structure
- [Entity-Relationship Diagram](training/methodologie1/diagramme%20mod%C3%A8le%20entit%C3%A9%20relation.md) -
  Database schema

### Viewing the Diagrams

All diagrams are created with PlantUML. To view them:

1. Copy the PlantUML code from any diagram file
2. Paste it at
   [https://www.plantuml.com/plantuml](https://www.plantuml.com/plantuml)
3. The diagram will render automatically
