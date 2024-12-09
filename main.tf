terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-south-1"
}

resource "aws_security_group" "app_sg" {
  name        = "app_security_group"
  description = "Allow inbound and outbound traffic"

  // Inbound rules
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow SSH from anywhere
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow HTTP from anywhere
  }

  // Outbound rules
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Allow all outbound traffic
  }
}

resource "aws_instance" "app_server" {
  ami                    = "ami-09b0a86a2c84101e1"
  instance_type          = "t2.micro"
  key_name               = "chatbot" # Add your key pair name here
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  // user Script for install necessary packages
  // install docker 

  user_data = <<-EOF
  #!/bin/bash
  sudo apt update
  sudo apt install snapd

  # install docker
  sudo snap install docker -y


  
EOF

  tags = {
    Name = "TelegranAppInstance"
  }
}
