# Deployment Scripts

This directory contains utility scripts for deploying the Personal Journal application.

## push_placeholder_images.ps1 (Windows PowerShell)

This script creates and pushes placeholder Docker images to ECR repositories for the initial deployment. These placeholder images are used by Terraform when creating the initial ECS services.

### Prerequisites

- AWS CLI installed and configured with appropriate credentials
- Docker Desktop installed and running
- PowerShell 5.1 or later

### Usage

```powershell
# Run with default settings (us-east-1 region, personal-journal project name)
.\push_placeholder_images.ps1

# Run with custom region and project name
.\push_placeholder_images.ps1 -AwsRegion "us-west-2" -ProjectName "my-journal-app"
```

## push_placeholder_images.sh (Linux/macOS)

This is the bash version of the script for Linux or macOS users.

### Usage

```bash
# Make the script executable
chmod +x push_placeholder_images.sh

# Run with default settings (us-east-1 region, personal-journal project name)
./push_placeholder_images.sh

# Run with custom region and project name
./push_placeholder_images.sh us-west-2 my-journal-app
```

### What it does

1. Logs in to Amazon ECR
2. Creates a simple Nginx container as a placeholder for the frontend
3. Creates a simple Node.js container as a placeholder for the backend
4. Builds and pushes both images with the "latest" tag
5. Cleans up temporary files

### When to use

Run this script before the initial deployment if you're using the "deploy-infrastructure-first" approach. This ensures that the ECR repositories have valid images that can be referenced by the ECS task definitions during the initial deployment.

After the initial deployment, the CI/CD pipeline will build and push the actual application images, and update the ECS services accordingly.
