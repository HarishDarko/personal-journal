# Personal Journal Application Maintenance Guide

This document provides guidelines for maintaining the Personal Journal application deployed on AWS.

## Table of Contents

1. [Routine Maintenance](#routine-maintenance)
2. [Scaling](#scaling)
3. [Updates and Upgrades](#updates-and-upgrades)
4. [Backup and Restore](#backup-and-restore)
5. [Monitoring and Alerting](#monitoring-and-alerting)
6. [Security Maintenance](#security-maintenance)
7. [Cost Optimization](#cost-optimization)

## Routine Maintenance

### Daily Tasks

1. **Monitor Application Health**:
   - Check the health of ECS services
   - Review CloudWatch logs for errors
   - Verify that the application is accessible

2. **Review Security Events**:
   - Check CloudTrail logs for suspicious activity
   - Review AWS GuardDuty findings (if enabled)

### Weekly Tasks

1. **Update Dependencies**:
   - Check for security updates to Node.js, React, and other dependencies
   - Run npm audit to identify vulnerabilities
   - Update dependencies as needed

2. **Review Performance Metrics**:
   - Analyze CPU and memory utilization
   - Check response times and error rates
   - Identify performance bottlenecks

### Monthly Tasks

1. **Infrastructure Review**:
   - Verify that all resources are properly tagged
   - Check for unused or underutilized resources
   - Review security groups and IAM policies

2. **Backup Verification**:
   - Verify that database backups are being created
   - Test restore procedures to ensure backups are valid

## Scaling

### Horizontal Scaling

To scale the application horizontally, adjust the desired count of ECS tasks:

```bash
# Scale frontend service
aws ecs update-service --cluster personal-journal-cluster --service personal-journal-frontend-service --desired-count <count>

# Scale backend service
aws ecs update-service --cluster personal-journal-cluster --service personal-journal-backend-service --desired-count <count>
```

Alternatively, you can update the `frontend_desired_count` and `backend_desired_count` variables in Terraform and apply the changes.

### Vertical Scaling

To scale the application vertically, adjust the CPU and memory allocation for ECS tasks:

1. Update the `frontend_cpu`, `frontend_memory`, `backend_cpu`, and `backend_memory` variables in Terraform
2. Apply the changes using Terraform

### Auto Scaling

Consider implementing auto scaling for the ECS services:

1. Create an Application Auto Scaling target for each service
2. Define scaling policies based on CPU utilization or custom metrics
3. Set minimum and maximum capacity limits

Example Terraform configuration for auto scaling:

```hcl
resource "aws_appautoscaling_target" "frontend" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "frontend_cpu" {
  name               = "${var.project_name}-frontend-cpu-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.frontend.resource_id
  scalable_dimension = aws_appautoscaling_target.frontend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
```

## Updates and Upgrades

### Application Updates

1. **Frontend Updates**:
   - Make changes to the React code
   - Test changes locally
   - Push changes to the main branch
   - GitHub Actions will automatically build and deploy the changes

2. **Backend Updates**:
   - Make changes to the Node.js code
   - Test changes locally
   - Push changes to the main branch
   - GitHub Actions will automatically build and deploy the changes

### Infrastructure Updates

1. **Terraform Updates**:
   - Make changes to the Terraform configuration
   - Test changes locally using `terraform plan`
   - Push changes to the main branch
   - GitHub Actions will automatically apply the changes

2. **AWS Service Updates**:
   - Stay informed about updates to AWS services
   - Test updates in a staging environment before applying to production
   - Update Terraform configuration as needed

### Major Upgrades

For major upgrades (e.g., Node.js version, React version):

1. Create a separate branch for the upgrade
2. Make necessary changes to the code and configuration
3. Test thoroughly in a staging environment
4. Create a pull request to merge the changes
5. Review and approve the pull request
6. Monitor the deployment closely

## Backup and Restore

### Database Backup

For MongoDB Atlas:

1. Configure automated backups in the MongoDB Atlas console
2. Set an appropriate backup schedule (e.g., daily)
3. Define a retention period for backups

For AWS DocumentDB:

1. Enable automated snapshots
2. Set an appropriate backup window
3. Define a retention period for snapshots

### Application State Backup

The application state is stored in the database, so database backups are sufficient for most purposes. However, you may also want to:

1. Backup ECS task definitions
2. Backup Terraform state files
3. Backup ECR images

### Restore Procedures

To restore from a backup:

1. **Database Restore**:
   - For MongoDB Atlas, use the restore feature in the console
   - For AWS DocumentDB, restore from a snapshot

2. **Application Restore**:
   - If necessary, roll back to a previous ECS task definition
   - Use the rollback procedures described in the deployment guide

## Monitoring and Alerting

### CloudWatch Metrics

Monitor the following CloudWatch metrics:

1. **ECS Service Metrics**:
   - CPUUtilization
   - MemoryUtilization
   - RunningTaskCount

2. **ALB Metrics**:
   - HTTPCode_ELB_4XX_Count
   - HTTPCode_ELB_5XX_Count
   - TargetResponseTime

3. **Custom Application Metrics**:
   - API request count
   - API error count
   - User login count

### CloudWatch Alarms

Set up the following CloudWatch Alarms:

1. **Service Health**:
   - Alarm when RunningTaskCount < DesiredTaskCount
   - Alarm when CPUUtilization > 80%
   - Alarm when MemoryUtilization > 80%

2. **Error Rates**:
   - Alarm when HTTPCode_ELB_5XX_Count > 5 in 1 minute
   - Alarm when API error count > threshold

3. **Response Times**:
   - Alarm when TargetResponseTime > threshold

### Notification Channels

Configure notifications for CloudWatch Alarms:

1. Set up an SNS topic for alerts
2. Subscribe email addresses or SMS numbers to the topic
3. Configure alarms to send notifications to the SNS topic

## Security Maintenance

### Regular Security Tasks

1. **Dependency Updates**:
   - Regularly update Node.js, React, and other dependencies
   - Run npm audit to identify and fix vulnerabilities

2. **AWS Security Updates**:
   - Stay informed about security updates for AWS services
   - Apply updates as needed

3. **Security Scanning**:
   - Scan Docker images for vulnerabilities
   - Scan application code for security issues

### Security Best Practices

1. **Least Privilege**:
   - Review IAM policies regularly
   - Ensure that roles have only the permissions they need

2. **Network Security**:
   - Review security groups regularly
   - Ensure that only necessary ports are open

3. **Secret Management**:
   - Rotate secrets regularly
   - Use AWS Secrets Manager for all sensitive information

### Security Incident Response

In case of a security incident:

1. **Isolate**:
   - Identify affected resources
   - Isolate affected resources if possible

2. **Investigate**:
   - Analyze logs to understand the incident
   - Determine the root cause

3. **Remediate**:
   - Fix vulnerabilities
   - Update affected resources

4. **Report**:
   - Document the incident
   - Report to relevant stakeholders

## Cost Optimization

### Cost Monitoring

1. **AWS Cost Explorer**:
   - Regularly review costs in AWS Cost Explorer
   - Identify cost trends and anomalies

2. **Resource Tagging**:
   - Ensure all resources are properly tagged
   - Use tags to track costs by feature or component

### Cost Optimization Strategies

1. **Right-sizing**:
   - Adjust ECS task CPU and memory based on actual usage
   - Scale down during periods of low usage

2. **Reserved Instances**:
   - Consider purchasing Reserved Instances for stable workloads
   - Analyze usage patterns to determine the best reservation strategy

3. **Spot Instances**:
   - Consider using Spot Instances for non-critical workloads
   - Implement appropriate handling for Spot Instance termination

4. **Storage Optimization**:
   - Review and clean up unused ECR images
   - Optimize CloudWatch Logs retention periods

### Regular Cost Review

Conduct a monthly cost review:

1. Analyze costs by service and resource
2. Identify opportunities for optimization
3. Implement cost-saving measures
4. Track the impact of optimization efforts
