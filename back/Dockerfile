# Stage 1: Dependencies
FROM node:22-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Stage 2: Production Dependencies
FROM node:22-alpine AS prod-dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Stage 3: Development
FROM node:22-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application with nodemon
CMD ["npm", "run", "dev"]

# Stage 4: Production
FROM node:22-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Copy production dependencies
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "main.js"]
