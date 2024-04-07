#!/usr/bin/bash

# Verify we are in the correct directory
if [[ ! -d "client" || ! -d "server" || ! -d "shared" ]]; then
  echo "Must be run from root of project"
  exit 1
fi

# Verify flags
WITH_COMMIT=0
WITH_FORMAT=0

while test $# -gt 0; do
  case "$1" in
  -c | --with-commit) WITH_COMMIT=1 ;;
  -f | --with-format) WITH_FORMAT=1 ;;
  -h | --help)
    echo "Usage: $0 [-c|--with-commit] [-f|--with-format]"
    exit 0
    ;;
  *)
    echo "$1 is not a valid flag, view $0 -h|--help for usage"
    exit 1
    ;;
  esac
  shift
done

# Verify api-types exists
if [[ ! -d "shared/api-types" ]]; then
  echo "Shared/api-types not found"
  exit 1
fi

# Sync
IS_SYNCED=$(./check_sync.sh)
if [[ $? -eq 1 ]]; then
  echo "Syncing shared/api-types"

  # Create directories (if does not exist)
  mkdir -p client/src/lib
  mkdir -p server/src/lib

  # Remove old api-types
  echo "Removing old api-types in client and server"
  if [[ -d "client/src/lib/api-types" ]]; then
    rm -rf client/src/lib/api-types
  fi
  if [[ -d "server/src/lib/api-types" ]]; then
    rm -rf server/src/lib/api-types
  fi

  # Copy files
  cp -r shared/api-types/src client/src/lib/
  cp -r shared/api-types/src server/src/lib/

  # Rename direcotry
  mv client/src/lib/src client/src/lib/api-types
  mv server/src/lib/src server/src/lib/api-types
else
  echo "Shared/api-types already synced, skipping sync"
fi

# Format code
if [[ $WITH_FORMAT -eq 1 ]]; then
  npm run lint:fix
else
  echo "Skipping code format"
fi

# Check whether we should commit
if [[ $WITH_COMMIT -eq 0 ]]; then
  echo "Skipping commit"
  exit 0
fi

echo "Committing changes"

# Store staged
STAGED="$(git diff --staged --name-only)"

# Unstage all (if needed)
if [[ $STAGED ]]; then
  echo "Caching adn removing staged commits"
  git restore --staged $STAGED
fi

# Add new changes
git add client/src/lib/api-types
git add server/src/lib/api-types
git commit -m "chore(sync): Sync shared/api-types


Co-authored-by: AlexNg <contact@ngjx.org>"

# Restore staged files (if needed)
if [[ $STAGED ]]; then
  git add $STAGED
fi
