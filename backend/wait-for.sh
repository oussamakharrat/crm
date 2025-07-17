#!/usr/bin/env sh
#   Use this script to test if a given TCP host/port are available

# The MIT License (MIT)
# https://github.com/Eficode/wait-for

set -e

HOST="$1"
PORT="$2"
shift 2

while ! nc -z "$HOST" "$PORT"; do
  echo "Waiting for $HOST:$PORT..."
  sleep 1
done

exec "$@" 