terraform {
  backend "s3" {
    bucket       = "system-eleic-terraform-state"
    key          = "prod/terraform.tfstate"
    region       = "sa-east-1"
    encrypt      = true
    use_lockfile = true
  }
}