#!/bin/bash

# ==============================================================================
# Self's - Simple VPS Deployment Script
# Configure the remote server variables below before executing.
# ==============================================================================

# Remote Server Settings
SERVER_USER="your-ssh-username"
SERVER_IP="your-server-ip-or-domain"
DEST_DIR="/var/www/selfs"

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting deployment..."

# 1. Build production bundle
echo "📦 Building production assets..."
npm run build

# 2. Upload dist folder
echo "📤 Transferring files to remote server ($SERVER_IP)..."
echo "Running: rsync -avz --delete dist/ $SERVER_USER@$SERVER_IP:$DEST_DIR"

# Note: This requires SSH keys to be set up on your machine for passwordless login
rsync -avz --delete dist/ "$SERVER_USER@$SERVER_IP:$DEST_DIR"

echo "✅ Deployment finished successfully!"
