//=====================================================
//Internet Gateway e NAT Gateway para acesso à internet
//=====================================================
resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.main_project.id
    tags = {
        Name = var.igw_name
    }
  
}

resource "aws_eip" "eip" {
  domain = "vpc"

  tags = {
    Name = var.eip_name
  }
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.eip.id
  subnet_id     = aws_subnet.public_subnet.id

  tags = {
    Name = var.nat_gateway_name
  }

  depends_on = [
    aws_internet_gateway.igw
  ]
}

