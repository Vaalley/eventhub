# Stage 1: Dependencies
FROM oven/bun:1.3-alpine AS dependencies

WORKDIR /app

# Copy package files from front directory
COPY front/package.json front/bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Stage 2: Development
FROM oven/bun:1.3-alpine AS development

WORKDIR /app

# Copy package files
COPY front/package.json front/bun.lock* ./

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy tsconfig.base.json to parent directory (simulates monorepo structure)
COPY tsconfig.base.json /tsconfig.base.json

# Copy application source
COPY front/ .

# Expose the Vite dev server port
EXPOSE 5173

# Run the development server
CMD ["bun", "run", "dev", "--host"]

# Stage 3: Build for production
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy package files
COPY front/package.json front/bun.lock* ./

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy tsconfig.base.json to parent directory
COPY tsconfig.base.json /tsconfig.base.json

# Copy application source
COPY front/ .

# Build the application
RUN bun run build

# Stage 4: Production with nginx
FROM nginx:1.27-alpine AS production

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
