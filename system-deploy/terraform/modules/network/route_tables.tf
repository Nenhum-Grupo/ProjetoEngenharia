//======================
//Route Tables e Routes
//======================

resource "aws_route_table" "route_table_nat_igw" {
  vpc_id = aws_vpc.main_project.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = var.route_table_nat_igw_name
  }
}

resource "aws_route_table_association" "public_subnet_association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.route_table_nat_igw.id
}

resource "aws_route_table" "route_table_private_nat" {
  vpc_id = aws_vpc.main_project.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway.id
  }
  tags = {
    Name = var.route_table_private_nat_name
  }
}

resource "aws_route_table_association" "private_subnet_association" {
  subnet_id      = aws_subnet.private_subnet.id
  route_table_id = aws_route_table.route_table_private_nat.id
}