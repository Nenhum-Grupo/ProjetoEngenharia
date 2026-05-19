output "private_subnet_id" {
  value = aws_subnet.private_subnet.id
}

output "database_subnet_ids" {
  value = [aws_subnet.subnet_database1.id, aws_subnet.subnet_database2.id]
}

output "target_group_backend_arn" {
  value = aws_lb_target_group.target_group_backend.arn
}

output "target_group_frontend_arn" {
  value = aws_lb_target_group.target_group_frontend.arn
}

output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}