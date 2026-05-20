# =========================
# Provider / Ambiente
# =========================

variable "aws_region" {
  type        = string
  description = "Região da AWS onde os recursos serão criados."
}

variable "app_aws_access_key" {
  type      = string
  sensitive = true
}

variable "app_aws_secret_key" {
  type      = string
  sensitive = true
}

# =========================
# Network / VPC
# =========================

variable "vpc_name" {
  type        = string
  description = "Nome da VPC."
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR principal da VPC."
}

variable "availability_zone_1" {
  type        = string
  description = "Primeira Availability Zone."
}

variable "availability_zone_2" {
  type        = string
  description = "Segunda Availability Zone."
}

# =========================
# Subnets públicas
# =========================

variable "public_subnet_name" {
  type        = string
  description = "Nome da primeira subnet pública."
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR da primeira subnet pública."
}

variable "public_subnet2_name" {
  type        = string
  description = "Nome da segunda subnet pública."
}

variable "public_subnet2_cidr" {
  type        = string
  description = "CIDR da segunda subnet pública."
}

# =========================
# Subnet privada EC2
# =========================

variable "private_subnet_name" {
  type        = string
  description = "Nome da subnet privada da EC2."
}

variable "private_subnet_cidr" {
  type        = string
  description = "CIDR da subnet privada da EC2."
}

# =========================
# Subnets privadas RDS
# =========================

variable "private_subnet_database_name" {
  type        = string
  description = "Nome da primeira subnet privada do banco."
}

variable "private_subnet_database_cidr" {
  type        = string
  description = "CIDR da primeira subnet privada do banco."
}

variable "private_subnet_database_name_2" {
  type        = string
  description = "Nome da segunda subnet privada do banco."
}

variable "private_subnet_database_cidr_2" {
  type        = string
  description = "CIDR da segunda subnet privada do banco."
}

# =========================
# Internet Gateway / NAT / Rotas
# =========================

variable "nat_gateway_name" {
  type        = string
  description = "Nome do NAT Gateway."
}

variable "eip_name" {
  type        = string
  description = "Nome do Elastic IP usado pelo NAT Gateway."
}

variable "igw_name" {
  type        = string
  description = "Nome do Internet Gateway."
}

variable "route_table_nat_igw_name" {
  type        = string
  description = "Nome da route table pública que aponta para o Internet Gateway."
}

variable "route_table_private_nat_name" {
  type        = string
  description = "Nome da route table privada que aponta para o NAT Gateway."
}

# =========================
# ALB / Target Groups
# =========================

variable "alb_name" {
  type        = string
  description = "Nome do Application Load Balancer."
}

variable "alb_target_group_front_name" {
  type        = string
  description = "Nome do Target Group do frontend."
}

variable "alb_target_group_backend_name" {
  type        = string
  description = "Nome do Target Group do backend."
}

variable "frontend_port" {
  type        = number
  description = "Porta onde o frontend escuta."
}

variable "backend_port" {
  type        = number
  description = "Porta onde o backend escuta."
}

# =========================
# Compute / EC2
# =========================

variable "instance_type" {
  type        = string
  description = "Tipo da instância EC2."
}

variable "ebs_size" {
  type        = number
  description = "Tamanho do volume EBS da EC2 em GB."
}

variable "ec2_public_key" {
  type        = string
  sensitive   = true
  description = "Chave pública SSH usada para criar o key pair da EC2."
}

# =========================
# Database / RDS
# =========================

variable "db_type" {
  type        = string
  description = "Classe/tipo da instância do banco RDS."
}

variable "db_name" {
  type        = string
  description = "Nome do banco de dados."
}

variable "db_username" {
  type        = string
  description = "Usuário master do banco."
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Senha master do banco."
}

variable "db_storage" {
  type        = number
  description = "Armazenamento inicial do banco em GB."
}

variable "db_max_storage" {
  type        = number
  description = "Armazenamento máximo do banco em GB."
}

variable "s3_bucket" {
  type        = string
  description = "nome do bucket."
}

#=========================
# Imagens Back e Frontend
#=========================

variable "backend_image" {
  type        = string
  description = "nome da imagem do backend no Dockerhub."
}


variable "frontend_image" {
  type        = string
  description = "nome da imagem do frontend no Dockerhub."
}

