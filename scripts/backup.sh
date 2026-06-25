#!/usr/bin/env bash
# Backup script for Vetrinaria - can be run via cron
# Usage: ./scripts/backup.sh
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUPS_DIR="$DIR/backups"
mkdir -p "$BACKUPS_DIR"

TIMESTAMP=$(date +%Y-%m-%dT%H-%M-%S)
FILENAME="vetrinaria-${TIMESTAMP}.dump"
FILEPATH="${BACKUPS_DIR}/${FILENAME}"

# Source DATABASE_URL from .env if it exists
if [ -f "$DIR/.env" ]; then
  export $(grep -v '^#' "$DIR/.env" | xargs)
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL not set"
  exit 1
fi

# Parse DATABASE_URL
DB_URL="${DATABASE_URL#postgresql://}"
DB_USER="${DB_URL%%:*}"
DB_URL="${DB_URL#*:}"
DB_PASS="${DB_URL%%@*}"
DB_URL="${DB_URL#*@}"
DB_HOST="${DB_URL%%:*}"
DB_URL="${DB_URL#*:}"
DB_PORT="${DB_URL%%/*}"
DB_NAME="${DB_URL#*/}"

PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -Fc -f "$FILEPATH"

echo "Backup created: $FILEPATH ($(du -h "$FILEPATH" | cut -f1))"
