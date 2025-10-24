# Stage 1: Dependencies
FROM node:22-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Development
FROM node:22-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 3: Build for production
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Stage 4: Production with nginx
FROM nginx:1.29.2-alpine AS production

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
