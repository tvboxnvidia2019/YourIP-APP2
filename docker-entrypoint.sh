#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -p 5432 -U postgres; do
  echo "PostgreSQL is not ready yet. Waiting 2 seconds..."
  sleep 2
done

echo "PostgreSQL is ready!"

# Run database schema push to ensure tables exist
echo "Setting up database schema..."
npm run db:push

echo "Starting the application..."
exec "$@"