//===========================
//Elastic Compute Cloud (EC2)
//===========================

resource "aws_iam_role" "ec2_role" {
  name = "system-eleic-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "system-eleic-ec2-role"
  }
}

resource "aws_iam_policy" "ec2_read_secrets_policy" {
  name = "system-eleic-ec2-read-secrets-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = var.secret_id
      }
    ]
  })
}

resource "aws_iam_policy" "s3_read_only_policy" {
  name        = "s3-read-only-policy"
  description = "Permite que a EC2 leia objetos do bucket S3 da aplicação."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ListBucket"
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = "arn:aws:s3:::${var.s3_bucket}"
      },
      {
        Sid    = "ReadObjects"
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "arn:aws:s3:::${var.s3_bucket}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_read_secrets_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ec2_read_secrets_policy.arn
}

resource "aws_iam_role_policy_attachment" "ec2_s3_read_only_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.s3_read_only_policy.arn
}

resource "aws_iam_role_policy_attachment" "ec2_ssm_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "system-eleic-ec2-profile"
  role = aws_iam_role.ec2_role.name
}


resource "aws_key_pair" "ec2_key" {
  key_name   = "ec2-system-eleic-key"
  public_key = var.ec2_public_key
}

data "aws_ssm_parameter" "ubuntu_24_04" {
  name = "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id"
}

resource "aws_instance" "ec2-instance"{
    ami = data.aws_ssm_parameter.ubuntu_24_04.value
    instance_type = var.instance_type
    subnet_id = var.private_subnet_id
    hibernation = true
    associate_public_ip_address = false

    key_name = aws_key_pair.ec2_key.key_name

    iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    root_block_device {
      volume_size = var.ebs_size
      volume_type = "gp3"
      encrypted = true
      delete_on_termination = true
    }

    user_data = templatefile("../../../userdata.tpl", {
        backend_image = var.backend_image
        frontend_image = var.frontend_image
        backend_port = var.backend_port
        frontend_port = var.frontend_port
        app_secret_id = var.secret_id
    })
}


resource "aws_lb_target_group_attachment" "attachment_backend" {
  target_group_arn = var.backend_target_group_arn
  target_id        = aws_instance.ec2-instance.id
}

resource "aws_lb_target_group_attachment" "attachment_frontend" {
  target_group_arn = var.frontend_target_group_arn
  target_id        = aws_instance.ec2-instance.id
}
