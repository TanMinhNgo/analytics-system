#!/bin/sh
set -eu

# Frontend internal server
cd /app/frontend
npm start -- -p 3000 &
FRONT_PID=$!

# Backend public server (Render binds to $PORT here)
cd /app/backend
npm start &
BACK_PID=$!

term_handler() {
  kill "$FRONT_PID" "$BACK_PID" 2>/dev/null || true
}

trap term_handler INT TERM

while kill -0 "$FRONT_PID" 2>/dev/null && kill -0 "$BACK_PID" 2>/dev/null; do
  sleep 1
done

term_handler
