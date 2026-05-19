#!/bin/bash
set -euo pipefail

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting EC2 bootstrap..."

echo "Installing base dependencies..."
export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y ca-certificates curl gnupg unzip jq

echo "Installing Docker repository..."
install -m 0755 -d /etc/apt/keyrings

if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
fi

chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y

echo "Installing Docker Engine and Compose plugin..."
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "Installing AWS CLI v2..."
if ! command -v aws >/dev/null 2>&1; then
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
  unzip -q /tmp/awscliv2.zip -d /tmp
  /tmp/aws/install
fi

echo "Enabling Docker..."
systemctl enable docker
systemctl start docker

echo "Creating app directory..."
mkdir -p /opt/system-eleic

echo "Creating docker-compose.yml..."
cat > /opt/system-eleic/docker-compose.yml <<'EOF_COMPOSE'
services:
  backend:
    image: ${backend_image}
    container_name: system-eleic-backend
    restart: always
    ports:
      - "${backend_port}:8080"
    environment:
      DB_URL: "$${DB_URL}"
      DB_USER_POSTGRES: "$${DB_USER_POSTGRES}"
      DB_PASSWORD_POSTGRES: "$${DB_PASSWORD_POSTGRES}"
      AWS_REGION: "$${AWS_REGION}"
      AWS_ACCESS_KEY: "$${AWS_ACCESS_KEY}"
      AWS_SECRET_KEY: "$${AWS_SECRET_KEY}"

  frontend:
    image: ${frontend_image}
    container_name: system-eleic-frontend
    restart: always
    ports:
      - "${frontend_port}:3000"
    depends_on:
      - backend
EOF_COMPOSE

echo "Bootstrap finished."

docker --version
docker compose version
aws --version
ls -la /opt/system-eleic
cat /opt/system-eleic/docker-compose.yml