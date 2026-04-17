#!/bin/bash

APP_NAME="qianliyan"
ENV_FILE=".env.production"

echo "Reading configuration from $ENV_FILE..."
PORT=$(grep "^PORT=" "$ENV_FILE" | cut -d '=' -f2)

if [ -z "$PORT" ]; then
    echo "Error: PORT not found in $ENV_FILE"
    exit 1
fi

echo "Port: $PORT"
echo "Application name: $APP_NAME"

echo ""
echo "Building project..."
pnpm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build successful!"
echo ""

echo "Checking for existing PM2 processes..."
EXISTING_PROCESSES=$(pm2 list | grep -w "$APP_NAME" | awk '{print $2}')

if [ -n "$EXISTING_PROCESSES" ]; then
    echo "Found existing PM2 process for $APP_NAME, stopping and deleting..."
    pm2 delete "$APP_NAME"
else
    echo "No existing PM2 process found"
fi

echo ""
echo "Starting application with PM2..."
pm2 start "dotenv -e $ENV_FILE -- next start" --name "$APP_NAME"

if [ $? -eq 0 ]; then
    echo ""
    echo "Application started successfully!"
    pm2 list
else
    echo "Failed to start application!"
    exit 1
fi
