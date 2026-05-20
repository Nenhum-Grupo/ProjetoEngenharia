variable "instance_type" {
    type = string
}

variable "ebs_size" {
    type = number
}

variable "ec2_public_key" {
    type = string
}

variable "s3_bucket" {
  type        = string
}

variable "private_subnet_id" {
    type = string
}

variable "backend_target_group_arn" {
    type = string
}

variable "frontend_target_group_arn" {
    type = string
}

variable "backend_image" {
    type = string
}

variable "frontend_image" {
    type = string
}

variable "backend_port" {
    type = number
}

variable "frontend_port" {
    type = number
}

variable "secret_id" {
    type = string
}