# =========================
# Network / VPC
# =========================

vpc_name = "system-eleic-vpc"
vpc_cidr = "10.0.0.0/16"

availability_zone_1 = "sa-east-1a"
availability_zone_2 = "sa-east-1b"

# =========================
# Subnets públicas
# =========================

public_subnet_name  = "system-eleic-public-subnet-1"
public_subnet_cidr  = "10.0.1.0/24"

public_subnet2_name = "system-eleic-public-subnet-2"
public_subnet2_cidr = "10.0.2.0/24"

# =========================
# Subnet privada EC2
# =========================

private_subnet_name = "system-eleic-private-subnet-ec2"
private_subnet_cidr = "10.0.10.0/24"

# =========================
# Subnets privadas RDS
# =========================

private_subnet_database_name = "system-eleic-private-subnet-db-1"
private_subnet_database_cidr = "10.0.20.0/24"

private_subnet_database_name_2 = "system-eleic-private-subnet-db-2"
private_subnet_database_cidr_2 = "10.0.21.0/24"

# =========================
# Internet Gateway / NAT / Rotas
# =========================

igw_name = "system-eleic-igw"

eip_name = "system-eleic-nat-eip"

nat_gateway_name = "system-eleic-nat-gateway"

route_table_nat_igw_name     = "system-eleic-public-rt"
route_table_private_nat_name = "system-eleic-private-rt"

# =========================
# ALB / Target Groups
# =========================

alb_name = "system-eleic-alb"

alb_target_group_front_name   = "system-eleic-front-tg"
alb_target_group_backend_name = "system-eleic-back-tg"

frontend_port = 3000
backend_port  = 8080

# =========================
# Compute / EC2
# =========================

instance_type = "t3.small"
ebs_size      = 30

# =========================
# Database / RDS
# =========================

db_type = "db.t4g.micro"
db_storage     = 20
db_max_storage = 30

s3_bucket = "eleicoesystem-bucket"
# =========================
# Backend / Frontend Images
# =========================
frontend_image = "bmjoao/frontend-tcc:latest"
backend_image  = "pietrocaf/system-eleic:latest"
