module "network" {
  source = "../../modules/network"
  
  vpc_name = var.vpc_name
  vpc_cidr = var.vpc_cidr

  availability_zone_1 = var.availability_zone_1
  availability_zone_2 = var.availability_zone_2

  public_subnet_name = var.public_subnet_name
  public_subnet_cidr  = var.public_subnet_cidr
  public_subnet2_name = var.public_subnet2_name
  public_subnet2_cidr = var.public_subnet2_cidr

  private_subnet_name = var.private_subnet_name
  private_subnet_cidr = var.private_subnet_cidr

  private_subnet_database_name = var.private_subnet_database_name
  private_subnet_database_cidr   = var.private_subnet_database_cidr

  private_subnet_database_name_2 = var.private_subnet_database_name_2
  private_subnet_database_cidr_2 = var.private_subnet_database_cidr_2

  nat_gateway_name = var.nat_gateway_name
  eip_name = var.eip_name
  igw_name = var.igw_name
  route_table_nat_igw_name = var.route_table_nat_igw_name
  route_table_private_nat_name = var.route_table_private_nat_name
  alb_name = var.alb_name
  alb_target_group_front_name = var.alb_target_group_front_name
  alb_target_group_backend_name = var.alb_target_group_backend_name

  alb_target_group_front_port = var.frontend_port
  alb_target_group_backend_port = var.backend_port
}

module "compute" {
  source = "../../modules/compute"

  instance_type = var.instance_type

  private_subnet_id = module.network.private_subnet_id

  backend_target_group_arn = module.network.target_group_backend_arn
  frontend_target_group_arn = module.network.target_group_frontend_arn

  ebs_size = var.ebs_size
  ec2_public_key = var.ec2_public_key

  s3_bucket = var.s3_bucket

  backend_image = var.backend_image
  frontend_image = var.frontend_image
  backend_port = var.backend_port
  frontend_port = var.frontend_port
  secret_id = module.secrets.secret_id
}

module "database" {
  source = "../../modules/database"

  subnet1 = module.network.database_subnet_ids[0]
  subnet2 = module.network.database_subnet_ids[1]

  db_type = var.db_type

  db_name = var.db_name
  db_username = var.db_username
  db_password = var.db_password

  db_storage = var.db_storage
  db_max_storage = var.db_max_storage

  s3_bucket = var.s3_bucket
}

module "secrets" {
  source = "../../modules/secrets"

  aws_region = var.aws_region

  db_adress = module.database.db_adress
  db_name = var.db_name
  db_username = var.db_username
  db_password = var.db_password

  app_aws_access_key = var.app_aws_access_key
  app_aws_secret_key = var.app_aws_secret_key
}