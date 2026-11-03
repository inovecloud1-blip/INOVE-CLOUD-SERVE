#!/bin/sh
# ====================================================================
# InoveCloud OS - Alpine Linux First Boot Setup Script
# ====================================================================

echo "🚀 InoveCloud OS - Initializing Alpine Linux Server..."

# Enable community repos if needed
echo "https://dl-cdn.alpinelinux.org/alpine/v3.20/main" > /etc/apk/repositories
echo "https://dl-cdn.alpinelinux.org/alpine/v3.20/community" >> /etc/apk/repositories

apk update

# Install essential tools, docker, docker-compose, avahi/mDNS
echo "📦 Installing Docker, Docker Compose, Avahi, and Node.js..."
apk add --no-cache docker docker-compose openrc avahi avahi-tools nodejs npm git curl bash

# Enable services
rc-update add docker boot
rc-update add avahi-daemon default

service docker start
service avahi-daemon start

# Create installation directory
mkdir -p /opt/inovecloudos
cd /opt/inovecloudos

echo "📥 Setting up InoveCloud OS Workspace..."
if [ -d "/media/cdrom/workspace" ]; then
    cp -r /media/cdrom/workspace/* /opt/inovecloudos/
else
    git clone https://github.com/inovecloud/inovecloud-os.git /opt/inovecloudos || true
fi

if [ -f "docker-compose.yml" ]; then
    echo "🐳 Starting InoveCloud OS containers via Docker Compose..."
    docker-compose up -d || true
else
    echo "⚙️ Starting InoveCloud OS Node server..."
    npm install --production || true
    npm run build || true
fi

echo "✨ InoveCloud OS successfully initialized!"
echo "👉 Access your server at: http://inovecloudos.local or via server IP."

# Disable firstboot script so it runs only once
rc-update del inovecloud-firstboot boot
rm -f /etc/init.d/inovecloud-firstboot
