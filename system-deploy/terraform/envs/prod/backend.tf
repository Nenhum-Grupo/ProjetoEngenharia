terraform {
  backend "s3" {
    bucket       = "tccterraform"
    key          = "prod/terraform.tfstate"
    region       = "sa-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
