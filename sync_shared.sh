#!/usr/bin/bash

# Verify we are in the correct directory
if [[ ! -d "client" || ! -d "server" || ! -d "shared" ]]; then
  echo "Must be run from root of project"
  exit 1
fi

# Verify api-types exists
if [[ ! -d "shared/api-types" ]]; then
  echo "Shared/api-types not found"
  exit 1
fi

# Verify that it is not already synced
if [[ $(./check_sync.sh) ]]; then
  echo "Shared/api-types already synced! :D"
  exit 0
fi

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

echo "Syncing shared/api-types in client and server"

# Copy files
cp -r shared/api-types/src client/src/lib/
cp -r shared/api-types/src server/src/lib/

# Rename direcotry
mv client/src/lib/src client/src/lib/api-types
mv server/src/lib/src server/src/lib/api-types

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
