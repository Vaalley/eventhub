# Stage 1: Dependencies
FROM oven/bun:1.3-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install all dependencies
RUN bun install --frozen-lockfile

# Stage 2: Production Dependencies
FROM oven/bun:1.3-alpine AS prod-dependencies

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Stage 3: Development
FROM oven/bun:1.3-debian AS development

WORKDIR /app

# Install netcat for database connection check and wget for healthcheck
RUN apt-get update && apt-get install -y netcat-openbsd wget && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy prisma schema first for generation
COPY prisma ./prisma/

# Generate Prisma client
RUN bunx prisma generate

# Copy application source
COPY . .

# Copy start script
COPY start.sh .

# Make start script executable
RUN chmod +x /app/start.sh

# Expose the application port
EXPOSE 3000

# Run the startup script
CMD ["/app/start.sh"]

# Stage 4: Production
FROM oven/bun:1.3-alpine AS production

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S bun && \
    adduser -S bun -u 1001

# Copy package files
COPY package.json bun.lock* ./

# Copy production dependencies
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Copy application source
COPY --chown=bun:bun . .

# Generate Prisma client
RUN bunx prisma generate

# Switch to non-root user
USER bun

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["bun", "run", "main.ts"]
