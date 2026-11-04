#!/bin/sh
# ====================================================================
# InoveCloud OS - Alpine Linux First Boot Setup Script
# ====================================================================

echo "🚀 InoveCloud OS - Initializing Alpine Linux Server..."

# Enable community repos if needed
echo "https://dl-cdn.alpinelinux.org/alpine/v3.20/main" > /etc/apk/repositories
echo "https://dl-cdn.alpinelinux.org/alpine/v3.20/community" >> /etc/apk/repositories

apk update

# Install essential tools, docker, docker-compose, avahi/mDNS, openssh, python3
echo "📦 Installing Docker, Docker Compose, Avahi, OpenSSH, Python 3, and Node.js..."
apk add --no-cache docker docker-compose openrc avahi avahi-tools openssh nodejs npm git curl bash python3

# Configure network interface automatically
echo "auto lo" > /etc/network/interfaces
echo "iface lo inet loopback" >> /etc/network/interfaces
echo "" >> /etc/network/interfaces
echo "auto eth0" >> /etc/network/interfaces
echo "iface eth0 inet dhcp" >> /etc/network/interfaces

# Enable SSH root login
sed -i 's/#PermitRootLogin.*/PermitRootLogin yes/g' /etc/ssh/sshd_config 2>/dev/null || echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

# Enable services including networking and sshd
rc-update add networking boot
rc-update add dhcpcd boot 2>/dev/null || true
rc-update add docker boot
rc-update add sshd default
rc-update add avahi-daemon default

service networking start || true
service docker start
service sshd start
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

# Ensure port 3000 is always served with a web UI/landing page & persistent local boot startup
echo "🌐 Configuring InoveCloud OS Web Service on port 3000 for auto-start..."
mkdir -p /opt/inovecloudos/public

cat << 'EOF' > /opt/inovecloudos/public/index.html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>InoveCloud OS - Alpine Linux</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
        .card { background: #1e293b; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); max-width: 600px; width: 100%; }
        h1 { color: #38bdf8; margin-bottom: 10px; }
        p { color: #94a3b8; line-height: 1.6; }
        .badge { display: inline-block; background: #0284c7; color: white; padding: 6px 12px; border-radius: 9999px; font-size: 14px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>☁️ InoveCloud OS</h1>
        <p>Alpine Linux Server rodando com sucesso no VirtualBox!</p>
        <p>Sua interface gráfica e serviços em nuvem estão ativos e prontos.</p>
        <div class="badge">InoveCloud OS v2.4 - Online</div>
    </div>
</body>
</html>
EOF

# Create OpenRC local startup script to ensure web server starts automatically on every boot
cat << 'EOF' > /etc/local.d/inovecloud.start
#!/bin/sh
python3 -m http.server 3000 --directory /opt/inovecloudos/public > /var/log/inovecloud-web.log 2>&1 &
EOF

chmod +x /etc/local.d/inovecloud.start
rc-update add local default
service local start || true

echo "✨ InoveCloud OS successfully initialized!"
echo "👉 Access your server at: http://inovecloudos.local or http://192.168.0.101:3000"

# Disable firstboot script so it runs only once
rc-update del inovecloud-firstboot boot
rm -f /etc/init.d/inovecloud-firstboot

