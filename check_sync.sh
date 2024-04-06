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

# Verify client exists
if [[ ! -d "client/src/lib/api-types" ]]; then
  echo "client/src/lib/api-types not found"
  exit 1
fi

# Verify server exists
if [[ ! -d "server/src/lib/api-types" ]]; then
  echo "server/src/lib/api-types not found"
  exit 1
fi

# Verify shared/api-types and client/src/lib/api-types are in sync
if [[ $(diff -q shared/api-types/src client/src/lib/api-types) ]]; then
  echo "Client is out of sync with shared/api-types"
  exit 1
fi

# Verify shared/api-types and server/src/lib/api-types are in sync
if [[ $(diff -q shared/api-types/src server/src/lib/api-types) ]]; then
  echo "Server is out of sync with shared/api-types"
  exit 1
fi

echo "All in sync :D"
