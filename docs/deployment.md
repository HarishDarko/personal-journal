# Personal Journal Application Deployment Guide

This document provides detailed instructions for deploying the Personal Journal application to AWS using Terraform, GitHub Actions, and Ansible.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Process](#deployment-process)
4. [Monitoring and Logging](#monitoring-and-logging)
5. [Troubleshooting](#troubleshooting)
6. [Rollback Procedures](#rollback-procedures)
7. [Security Considerations](#security-considerations)

## Architecture Overview

The Personal Journal application is deployed to AWS with the following architecture:

- **VPC**: Custom VPC with public and private subnets across two Availability Zones
- **Networking**: Internet Gateway for public access, NAT Gateway for outbound access from private subnets
- **Load Balancer**: Application Load Balancer (ALB) deployed in public subnets
- **Compute**: ECS Cluster using Fargate launch type
- **Services**:
  - Frontend: ECS Fargate Service running Nginx + React static build
  - Backend: ECS Fargate Service running Node.js/Express API
- **Container Registry**: AWS ECR repositories for frontend and backend Docker images
- **Database**: External MongoDB (e.g., AWS DocumentDB or MongoDB Atlas)
- **Secrets**: AWS Secrets Manager for storing the MongoDB URI
- **Logging**: AWS CloudWatch Logs for container logs

## Prerequisites

Before deploying the application, ensure you have the following prerequisites in place:

### 1. AWS Account and Permissions

- **AWS Account**: An active AWS account with billing enabled
- **IAM User**: An IAM user with programmatic access and the following permissions:
  - AmazonECR-FullAccess
  - AmazonECS-FullAccess
  - AmazonVPCFullAccess
  - AmazonRoute53FullAccess (if using custom domain)
  - IAMFullAccess
  - AmazonS3FullAccess (for Terraform state)
  - CloudWatchLogsFullAccess
  - AmazonSecretsManagerReadWrite
  - ElasticLoadBalancingFullAccess
  - AWSCloudFormationFullAccess

  Alternatively, create a custom policy with the specific permissions needed for the resources in this deployment.

### 2. Development Environment

- **Git**: Version 2.x or later
- **Docker**: Version 20.x or later with Docker Compose
- **Node.js**: Version 16.x or later (for local testing)
- **AWS CLI**: Version 2.x, configured with your AWS credentials
- **Terraform**: Version 1.5.x or later
- **Python**: Version 3.8 or later (for Ansible)
- **Ansible**: Version 2.12 or later

### 3. GitHub Repository and CI/CD

- **GitHub Repository**: A repository containing the application code
- **GitHub Actions**: Enabled for the repository
- **GitHub Secrets**: The following secrets must be configured in your GitHub repository:
  - `AWS_ACCESS_KEY_ID`: AWS access key with appropriate permissions
  - `AWS_SECRET_ACCESS_KEY`: Corresponding AWS secret key
  - `MONGO_URI_SECRET_ARN`: ARN of the AWS Secrets Manager secret containing the MongoDB URI

### 4. MongoDB Database

- **MongoDB Atlas Account** (recommended) or AWS DocumentDB
- **Database Cluster**: A MongoDB cluster (M0 free tier is sufficient for development)
- **Database User**: A user with readWrite permissions on the database
- **Network Access**:
  - After deploying the infrastructure, note the NAT Gateway's public IP address from the Terraform outputs
  - In MongoDB Atlas, go to Network Access and add this IP address to the IP Access List
  - For temporary development, you can use "Allow Access from Anywhere" (0.0.0.0/0), but this is not recommended for production
- **Connection String**: The MongoDB connection string in the format: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`

### 5. AWS Resources (Pre-deployment)

- **AWS Secrets Manager**: Create a secret with the following details:
  - Name: `personal-journal/mongodb-uri`
  - Description: "MongoDB connection string for Personal Journal application"
  - Secret value: Your MongoDB connection string
  - Note the ARN of this secret for the `MONGO_URI_SECRET_ARN` GitHub secret

- **S3 Bucket and DynamoDB Table** (required for Terraform state management):
  - These resources will be created using the bootstrap Terraform configuration
  - The S3 bucket will store the Terraform state with versioning and encryption enabled
  - The DynamoDB table will be used for state locking to prevent concurrent modifications
  - Default names: `personal-journal-terraform-state` and `personal-journal-terraform-locks`

### 6. Domain Name (Optional)

- **Registered Domain**: A domain name registered through AWS Route 53 or another registrar
- **DNS Configuration**: If using an external registrar, configure NS records to point to AWS Route 53

### 7. SSL Certificate (Optional)

- **AWS Certificate Manager**: Request a certificate for your domain
- **Domain Validation**: Complete the domain validation process

## Terraform State Management

The application uses remote state management with S3 and DynamoDB to ensure safe and collaborative infrastructure changes. This requires a one-time bootstrap process before the main deployment.

### Bootstrap Process

1. **Navigate to the bootstrap directory**:
   ```bash
   cd infra/bootstrap
   ```

2. **Initialize Terraform**:
   ```bash
   terraform init
   ```

3. **Apply the bootstrap configuration**:
   ```bash
   terraform apply
   ```
   This will create:
   - An S3 bucket for storing Terraform state
   - A DynamoDB table for state locking

4. **Note the outputs**:
   - `state_bucket_name`: The name of the S3 bucket
   - `dynamodb_table_name`: The name of the DynamoDB table

5. **Update GitHub Secrets** (if using GitHub Actions):
   - Ensure the repository has the following secrets:
     - `AWS_ACCESS_KEY_ID`: AWS access key with appropriate permissions
     - `AWS_SECRET_ACCESS_KEY`: Corresponding AWS secret key
     - `MONGO_URI_SECRET_ARN`: ARN of the AWS Secrets Manager secret

### Initializing Main Terraform Configuration with Remote State

After the bootstrap process, initialize the main Terraform configuration with the remote state:

```bash
cd ../
terraform init \
  -backend-config="bucket=personal-journal-terraform-state" \
  -backend-config="key=terraform/state/personal-journal.tfstate" \
  -backend-config="region=us-east-1" \
  -backend-config="dynamodb_table=personal-journal-terraform-locks" \
  -backend-config="encrypt=true"
```

## Deployment Process

The deployment process is fully automated using GitHub Actions. When changes are pushed to the main branch, the following steps are executed:

### 1. Build and Push Docker Images

- Frontend and backend Docker images are built
- Images are tagged with the short SHA of the commit
- Images are pushed to AWS ECR repositories

### 2. Deploy Infrastructure

- Terraform initializes and validates the configuration
- Infrastructure changes are planned and applied
- Variables for image tags and MongoDB URI secret ARN are passed to Terraform

### 3. Verify Deployment

- Environment validation checks that all required AWS resources exist
- Deployment verification confirms that the correct Docker images are deployed
- Smoke tests verify that the application is accessible and functioning correctly

### 4. Rollback (if necessary)

- If verification fails, the deployment is automatically rolled back
- Previous task definitions are used to revert the changes
- Services are monitored until they stabilize

### Manual Deployment

If you need to deploy the application manually, follow these steps:

1. **Build and Push Docker Images**:
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Build and push frontend image
   cd client
   docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/personal-journal-frontend:latest -f Dockerfile.frontend .
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/personal-journal-frontend:latest

   # Build and push backend image
   cd ..
   docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/personal-journal-backend:latest -f Dockerfile.backend .
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/personal-journal-backend:latest
   ```

2. **Deploy Infrastructure**:
   ```bash
   cd infra
   terraform init
   terraform plan -var="frontend_image_tag=latest" -var="backend_image_tag=latest" -var="mongo_uri_secret_arn=<secret-arn>" -out=tfplan
   terraform apply tfplan
   ```

3. **Verify Deployment**:
   ```bash
   cd ../ansible
   ansible-playbook main.yml -e "action=full aws_region=us-east-1 project_name=personal-journal alb_dns_name=<alb-dns-name> frontend_image=<frontend-image> backend_image=<backend-image>"
   ```

## Monitoring and Logging

### CloudWatch Logs

Container logs are sent to CloudWatch Logs. You can view these logs in the AWS Management Console:

1. Go to CloudWatch > Log Groups
2. Look for the following log groups:
   - `/ecs/personal-journal-frontend`
   - `/ecs/personal-journal-backend`

### CloudWatch Alarms

Consider setting up the following CloudWatch Alarms:

1. **CPU Utilization**: Alert when CPU utilization exceeds 80% for 5 minutes
2. **Memory Utilization**: Alert when memory utilization exceeds 80% for 5 minutes
3. **HTTP 5xx Errors**: Alert when the ALB reports more than 5 HTTP 5xx errors in 1 minute

### Health Checks

The application includes a health check endpoint at `/api/health`. You can use this endpoint to monitor the health of the backend API.

## Troubleshooting

### Common Issues

1. **Deployment Fails**:
   - Check the GitHub Actions logs for error messages
   - Verify that all GitHub Secrets are correctly configured
   - Ensure that the AWS credentials have appropriate permissions

2. **Application Not Accessible**:
   - Check the ALB security group to ensure it allows inbound traffic on port 80
   - Verify that the target groups have healthy targets
   - Check the ECS service logs for any application errors

3. **Database Connection Issues**:
   - Verify that the MongoDB URI secret is correctly configured
   - Check that the ECS task execution role has permission to access the secret
   - Ensure that the security group allows outbound traffic to the MongoDB database

### Debugging Steps

1. **Check ECS Service Status**:
   ```bash
   aws ecs describe-services --cluster personal-journal-cluster --services personal-journal-frontend-service personal-journal-backend-service
   ```

2. **View Container Logs**:
   ```bash
   aws logs get-log-events --log-group-name /ecs/personal-journal-frontend --log-stream-name <log-stream-name>
   aws logs get-log-events --log-group-name /ecs/personal-journal-backend --log-stream-name <log-stream-name>
   ```

3. **Check Target Health**:
   ```bash
   aws elbv2 describe-target-health --target-group-arn <frontend-target-group-arn>
   aws elbv2 describe-target-health --target-group-arn <backend-target-group-arn>
   ```

## Rollback Procedures

### Automated Rollback

The deployment process includes automated rollback in case of verification failure. If the smoke tests fail, the previous task definitions are used to revert the changes.

### Manual Rollback

If you need to roll back manually, follow these steps:

1. **Get Previous Task Definitions**:
   ```bash
   aws ecs describe-services --cluster personal-journal-cluster --services personal-journal-frontend-service --query 'services[0].taskDefinition' --output text
   aws ecs describe-services --cluster personal-journal-cluster --services personal-journal-backend-service --query 'services[0].taskDefinition' --output text
   ```

2. **Roll Back to Previous Task Definitions**:
   ```bash
   aws ecs update-service --cluster personal-journal-cluster --service personal-journal-frontend-service --task-definition <previous-frontend-task-def>
   aws ecs update-service --cluster personal-journal-cluster --service personal-journal-backend-service --task-definition <previous-backend-task-def>
   ```

3. **Wait for Services to Stabilize**:
   ```bash
   aws ecs wait services-stable --cluster personal-journal-cluster --services personal-journal-frontend-service personal-journal-backend-service
   ```

4. **Verify Rollback**:
   ```bash
   cd ansible
   ansible-playbook main.yml -e "action=smoke aws_region=us-east-1 project_name=personal-journal alb_dns_name=<alb-dns-name>"
   ```

## Security Considerations

### Network Security

- The application uses a VPC with public and private subnets
- The ALB is deployed in public subnets and is internet-facing
- ECS services are deployed in private subnets and are not directly accessible from the internet
- NAT Gateway allows outbound traffic from private subnets

### Authentication and Authorization

- The application uses JWT for authentication
- User passwords are hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies
- API endpoints are protected with authentication middleware

### Secrets Management

- MongoDB URI is stored in AWS Secrets Manager
- ECS task execution role has permission to access the secret
- Secret is injected into the container at runtime

### Security Best Practices

1. **Regularly Update Dependencies**:
   - Keep Node.js, React, and other dependencies up to date
   - Use tools like npm audit to identify and fix vulnerabilities

2. **Implement HTTPS**:
   - Configure the ALB to use HTTPS with a valid SSL certificate
   - Redirect HTTP traffic to HTTPS

3. **Enable AWS CloudTrail**:
   - Monitor and log all API calls to AWS services
   - Set up alerts for suspicious activity
