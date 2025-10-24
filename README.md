# EventHub

EventHub is a web platform for event management and ticketing. It enables organizers to create and manage their events, and allows users to book tickets in a simple and secure way.

## Architecture

- **Frontend**: React + TypeScript + Vite (port 5173)
- **Backend**: Node.js + Express (port 3000)
- **Database**: MongoDB (port 27017)
- **Cache**: Redis (port 6379)
- **Reverse Proxy**: Nginx (port 80)

## Getting Started with Docker

### Prerequisites
- Docker Desktop installed and running

### Start All Services
```bash
docker-compose up
```

### Start in Detached Mode
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
