
output "db_adress" {
  value = aws_db_instance.postgres.address
}

output "bucket_name" {
  value = aws_s3_bucket.bucket.id
}