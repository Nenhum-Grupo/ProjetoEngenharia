#!/bin/bash
set -euo pipefail

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

APP_DIR="/opt/system-eleic"

SECRET_ID="${app_secret_id}"


echo "Starting EC2 bootstrap..."

echo "Installing dependencies..."

mkdir -p "$APP_DIR"

if command -v dnf >/dev/null 2>&1; then
  dnf update -y
  dnf install -y docker awscli jq amazon-ssm-agent
elif command -v apt-get >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y docker.io docker-compose-plugin awscli jq amazon-ssm-agent
else
  echo "Unsupported Linux distribution. Could not find dnf or apt-get."
  exit 1
fi

systemctl enable docker
systemctl start docker

systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent

echo "Creating docker-compose.yml..."

cat > "$APP_DIR/docker-compose.yml" <<'COMPOSE'
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
COMPOSE

echo "EC2 bootstrap finished successfully."