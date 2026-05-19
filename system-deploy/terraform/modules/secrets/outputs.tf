output "secret_id" {
  value = aws_secretsmanager_secret.app_secrets.arn
}