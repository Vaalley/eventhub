#!/bin/bash
echo "Installing dependencies..."
bun install
echo "Waiting for database..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Database is ready!"
echo "Generating Prisma client..."
bunx prisma generate
echo "Pushing database schema..."
bunx prisma db push --accept-data-loss
echo "Starting application..."
exec bun --watch main.ts
