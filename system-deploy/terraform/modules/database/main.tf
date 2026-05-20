//================================================
//Relational Database Service for PostgreSQL (RDS)
//================================================

resource "aws_db_subnet_group" "subnet_group" {
  name       = "main"
  subnet_ids = [var.subnet1, var.subnet2]

  tags = {
    Name = "My DB subnet group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "system-eleic-postgres"

  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_type

  allocated_storage     = var.db_storage
  max_allocated_storage = var.db_max_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  port = 5432

  db_subnet_group_name   = aws_db_subnet_group.subnet_group.name
  publicly_accessible = false
  multi_az            = false

  skip_final_snapshot = true
  deletion_protection = false

}

data "aws_s3_bucket" "app_bucket" {
  bucket = var.s3_bucket
}
