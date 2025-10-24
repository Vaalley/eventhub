FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]
