FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Run the application
CMD ["npm", "run", "dev", "--", "--host"]
