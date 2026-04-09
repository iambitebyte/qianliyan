#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Default port if not set
PORT=${PORT:-3000}

# Start script for Qianliyan Log Watcher

echo "Starting Qianliyan Log Watcher..."
echo "Port: $PORT"
echo "Access the application at http://localhost:$PORT"
echo ""

npm run dev
