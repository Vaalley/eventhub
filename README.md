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

## Development Mode

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

### Access the Application (Development)

- **Frontend**: http://localhost:5173 (Vite dev server with HMR)
- **Backend API**: http://localhost:3000 (Nodemon with hot reload)
- **Nginx Proxy**: http://localhost (frontend) AND http://localhost/api (backend)

## Production Mode

### Build and Start Production Services
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Stop Production Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Access the Application (Production)

- **Frontend**: http://localhost:8080 (Nginx serving static files)
- **Backend API**: http://localhost:3000 (Node.js production mode)
- **Nginx Proxy**: http://localhost
