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

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]
