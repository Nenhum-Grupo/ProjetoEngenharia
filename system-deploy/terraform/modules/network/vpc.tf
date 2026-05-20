//==============
//VPC e Subnets
//==============

resource "aws_vpc" "main_project" {
  cidr_block = var.vpc_cidr
  tags = {
      Name = var.vpc_name
  }
}

resource "aws_subnet" "public_subnet" {
    vpc_id = aws_vpc.main_project.id
    cidr_block = var.public_subnet_cidr
    availability_zone = var.availability_zone_1
    tags = {
        Name = var.public_subnet_name
    }
}

resource "aws_subnet" "public_subnet2" {
    vpc_id = aws_vpc.main_project.id
    cidr_block = var.public_subnet2_cidr
    availability_zone = var.availability_zone_2
    tags = {
        Name = var.public_subnet2_name
    }
}

resource "aws_subnet" "private_subnet" {
    vpc_id = aws_vpc.main_project.id
    cidr_block = var.private_subnet_cidr
    availability_zone = var.availability_zone_1
    tags = {
        Name = var.private_subnet_name
    }
}

resource "aws_subnet" "subnet_database1" {
    vpc_id = aws_vpc.main_project.id
    cidr_block = var.private_subnet_database_cidr
    availability_zone = var.availability_zone_1
    tags = {
        Name = var.private_subnet_database_name
    }
}

resource "aws_subnet" "subnet_database2" {
    vpc_id = aws_vpc.main_project.id
    cidr_block = var.private_subnet_database_cidr_2
    availability_zone = var.availability_zone_2
    tags = {
        Name = var.private_subnet_database_name_2
    }
}
