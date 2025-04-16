# Personal Journal Application Documentation

This directory contains comprehensive documentation for the Personal Journal application deployed on AWS.

## Documentation Overview

- [Deployment Guide](deployment.md): Instructions for deploying the application to AWS
- [Maintenance Guide](maintenance.md): Guidelines for maintaining the application
- [Monitoring Guide](monitoring.md): Information on monitoring the application
- [Troubleshooting Guide](troubleshooting.md): Guidance for troubleshooting common issues

## Architecture

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

## Deployment Process

The deployment process is fully automated using GitHub Actions. When changes are pushed to the main branch, the following steps are executed:

1. **Build and Push Docker Images**: Frontend and backend Docker images are built and pushed to ECR
2. **Deploy Infrastructure**: Terraform applies infrastructure changes
3. **Verify Deployment**: Ansible verifies that the deployment is successful
4. **Rollback (if necessary)**: If verification fails, the deployment is automatically rolled back

## Maintenance

Regular maintenance tasks include:

- **Monitoring**: Regularly monitor the application for issues
- **Updates**: Keep dependencies and infrastructure up to date
- **Backups**: Ensure that database backups are being created
- **Security**: Regularly review security configurations and apply updates

## Troubleshooting

Common issues and their solutions are documented in the [Troubleshooting Guide](troubleshooting.md). If you encounter an issue that is not covered, please add it to the documentation.

## Contributing to Documentation

If you find any issues or have suggestions for improving the documentation, please submit a pull request or create an issue in the repository.
