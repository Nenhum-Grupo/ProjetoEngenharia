terraform {
  backend "s3" {
    bucket       = "system-eleic-terraform-state-915946341985"
    key          = "prod/terraform.tfstate"
    region       = "sa-east-1"
    encrypt      = true
    use_lockfile = true
  }
}