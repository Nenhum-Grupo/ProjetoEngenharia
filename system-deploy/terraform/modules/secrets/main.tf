//===============
//Secrets Manager
//===============

resource "aws_secretsmanager_secret" "app_secrets" {
  name        = "system-eleic-2/app"
}

resource "aws_secretsmanager_secret_version" "app_secrets_value" {
  secret_id = aws_secretsmanager_secret.app_secrets.id

  secret_string = jsonencode({
    DB_URL             = "jdbc:postgresql://${var.db_adress}:5432/${var.db_name}"
    DB_USER_POSTGRES   = var.db_username
    DB_PASSWORD_POSTGRES = var.db_password
    AWS_REGION         = var.aws_region
    AWS_ACCESS_KEY = var.app_aws_access_key
    AWS_SECRET_KEY = var.app_aws_secret_key
  })
}