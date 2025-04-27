#!/usr/bin/env bash

# scripts/check_migrations.sh

set -e

echo "Checking for new migrations..."

# Make sure we have enough git history locally
git fetch origin main --depth=2

# Default is false
SHOULD_RUN_MIGRATE=false

# Check if there are new migration SQL files
if git diff --name-only HEAD^ HEAD | grep -qE '^prisma/migrations/.+\.sql$'; then
  echo "Migrations found."
  SHOULD_RUN_MIGRATE=true
else
  echo "No new migrations."
fi

# Export the result for the caller
echo "SHOULD_RUN_MIGRATE=${SHOULD_RUN_MIGRATE}"
