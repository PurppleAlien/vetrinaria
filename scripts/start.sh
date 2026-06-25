#!/bin/sh
set -e

echo "Running database migrations..."
drizzle-kit migrate --config=packages/db/drizzle.config.ts

echo "Starting server..."
exec node apps/web/server.js
