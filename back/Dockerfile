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
FROM oven/bun:1.3-alpine AS development

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application with bun --watch
CMD ["bun", "run", "dev"]

# Stage 4: Production
FROM oven/bun:1.3-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S bun && \
    adduser -S bun -u 1001

# Copy package files
COPY package.json bun.lock* ./

# Copy production dependencies
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Copy application source
COPY --chown=bun:bun . .

# Switch to non-root user
USER bun

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["bun", "run", "main.js"]
