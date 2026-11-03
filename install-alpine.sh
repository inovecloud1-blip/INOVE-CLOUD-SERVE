#!/bin/sh
# ====================================================================
# InoveCloud OS Workspace - 1-Line Installer for Alpine Linux
# ====================================================================

set -e

echo "🚀 Iniciando a instalação do InoveCloud OS no Alpine Linux..."

# 1. Instalar dependências básicas
echo "📦 Instalando Docker, Docker Compose, Avahi (mDNS) e Git..."
apk update
apk add --no-cache docker docker-compose openrc avahi avahi-tools git curl bash nodejs npm

# 2. Ativar serviços no boot
rc-update add docker boot
rc-update add avahi-daemon default

service docker start
service avahi-daemon start

# 3. Criar diretório de instalação
INSTALL_DIR="/opt/inovecloudos"
echo "📁 Criando diretório de instalação em $INSTALL_DIR..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# 4. Clonar ou copiar InoveCloud OS
if [ ! -d ".git" ]; then
    echo "📥 Clonando repositório do InoveCloud OS..."
    git clone https://github.com/inovecloud/inovecloud-os.git . || true
fi

# 5. Iniciar containers ou aplicação
if [ -f "docker-compose.yml" ]; then
    echo "🐳 Subindo containers Docker..."
    docker-compose up -d
else
    echo "⚙️ Configurando Node.js server..."
    npm install
    npm run build
fi

echo "✨ Instalação do InoveCloud OS concluída com sucesso no Alpine!"
echo "👉 Acesse http://inovecloudos.local na sua rede local ou http://<IP_DO_SERVIDOR>"
