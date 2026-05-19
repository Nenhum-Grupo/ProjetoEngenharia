variable "vpc_cidr" {
    type = string
}

variable "vpc_name"{
    type = string
}

variable "public_subnet_cidr" {
    type = string
}

variable "public_subnet_name"{
    type = string
}

variable "public_subnet2_cidr" {
    type = string
}

variable "public_subnet2_name"{
    type = string
}

variable "private_subnet_cidr" {
    type = string
}

variable "private_subnet_name"{
    type = string
}

variable "private_subnet_database_cidr" {
    type = string
}

variable "private_subnet_database_name"{
    type = string
}

variable "private_subnet_database_cidr_2" {
    type = string
}

variable "private_subnet_database_name_2"{
    type = string
}

variable "alb_name" {
    type = string
}

variable "alb_target_group_backend_name"{
    type = string
}

variable "alb_target_group_front_name"{
    type = string
}

variable "alb_target_group_backend_port"{
    type = number
}

variable "alb_target_group_front_port"{
    type = number
}

variable "igw_name" {
    type = string
}

variable "eip_name" {
    type = string
}

variable "nat_gateway_name" {
    type = string
}

variable "route_table_nat_igw_name" {
    type = string
}

variable "route_table_private_nat_name" {
    type = string
}

variable "availability_zone_1" {
    type = string
}

variable "availability_zone_2" {
    type = string
}

