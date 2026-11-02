#!/bin/bash
# ====================================================================
# InoveCloud OS Workspace - Script de Instalação Automatizada (install.sh)
# Alvo: Ubuntu Server LTS (22.04 / 24.04)
# ====================================================================

set -e

echo "🚀 Iniciando a instalação do InoveCloud OS Workspace..."

# 1. Atualizar sistema e instalar dependências básicas
echo "📦 Atualizando pacotes e instalando dependências (curl, git, avahi-daemon)..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw avahi-daemon

# 2. Instalar Docker e Docker Compose
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker e Docker Compose..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "✅ Docker já está instalado."
fi

# 3. Configurar Avahi para .local
echo "🌐 Configurando mDNS (Avahi) para inovecloudos.local..."
sudo systemctl enable --now avahi-daemon

# 4. Criar diretório de trabalho do InoveCloud OS
INSTALL_DIR="/opt/inovecloudos"
echo "📁 Criando diretório de instalação em $INSTALL_DIR..."
sudo mkdir -p $INSTALL_DIR
sudo chown -R $USER:$USER $INSTALL_DIR

# 5. Clonar / Copiar arquivos do projeto (Simulado aqui)
echo "📥 Configurando arquivos do projeto..."
# (Neste ponto, o repositório ou arquivos compose.yml e Caddyfile são copiados para $INSTALL_DIR)

echo "✨ Instalação concluída com sucesso!"
echo "👉 Acesse http://inovecloudos.local na sua rede ou http://localhost no servidor."
