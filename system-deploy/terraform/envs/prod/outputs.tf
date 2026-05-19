output "ec2_instance_id" {
  value = module.compute.ec2_instance_id
}

output "alb_dns_name" {
    value = module.network.alb_dns_name
}

output "app_secret_id" {
  value = module.secrets.secret_id
}