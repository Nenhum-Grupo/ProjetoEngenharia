//=========================
//Application Load Balancer
//=========================

resource "aws_lb" "alb"{
    name = var.alb_name
    internal = false
    load_balancer_type = "application"
    subnets = [aws_subnet.public_subnet.id, aws_subnet.public_subnet2.id]
}


//=========================
//Target Groups do ALB
//=========================

resource "aws_lb_target_group" "target_group_backend" {
  name     = var.alb_target_group_backend_name
  port     = var.alb_target_group_backend_port
  protocol = "HTTP"
  vpc_id   = aws_vpc.main_project.id
  target_type = "instance"

  //Adicionar Health Checks Depois
}

resource "aws_lb_target_group" "target_group_frontend" {
  name     = var.alb_target_group_front_name
  port     = var.alb_target_group_front_port
  protocol = "HTTP"
  vpc_id   = aws_vpc.main_project.id
  target_type = "instance"
  
  //Adicionar Health Checks Depois
}

//=========================
//Listeners do ALB
//=========================

resource "aws_lb_listener" "alb_listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group_frontend.arn
  }
}

//=========================
//Listener Rules do ALB
//=========================

resource "aws_lb_listener_rule" "backend_api_rule" {
  listener_arn = aws_lb_listener.alb_listener.arn
  priority     = 10

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group_backend.arn
  }
}