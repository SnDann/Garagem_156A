#!/usr/bin/env bash
set -euo pipefail

echo "Running Alembic migrations against DATABASE_URL=${DATABASE_URL:-<unset>}"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Please set DATABASE_URL environment variable before running this script. Example:"
  echo "export DATABASE_URL=postgresql://user:pass@host:5432/dbname"
  exit 2
fi

cd "$(dirname "$0")/.."

alembic upgrade head

echo "Migrations applied." 
