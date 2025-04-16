# Personal Journal Application Troubleshooting Guide

This document provides guidance for troubleshooting common issues with the Personal Journal application deployed on AWS.

## Table of Contents

1. [Deployment Issues](#deployment-issues)
2. [Infrastructure Issues](#infrastructure-issues)
3. [Application Issues](#application-issues)
4. [Performance Issues](#performance-issues)
5. [Security Issues](#security-issues)
6. [Database Issues](#database-issues)

## Deployment Issues

### GitHub Actions Workflow Failures

#### Issue: Build and Push Job Fails

**Symptoms**:
- GitHub Actions workflow fails during the build and push job
- Error messages related to Docker build or ECR push

**Troubleshooting Steps**:
1. Check if AWS credentials are correctly configured in GitHub Secrets
2. Verify that the ECR repositories exist
3. Check if the Docker build process is failing due to code issues
4. Verify that the Docker images are being built correctly

**Resolution**:
- Update AWS credentials in GitHub Secrets
- Create missing ECR repositories
- Fix code issues causing Docker build failures
- Update Dockerfiles if necessary

#### Issue: Terraform Apply Fails

**Symptoms**:
- GitHub Actions workflow fails during the deploy-infra job
- Error messages from Terraform apply

**Troubleshooting Steps**:
1. Check the Terraform error message for specific issues
2. Verify that the AWS credentials have appropriate permissions
3. Check if the MongoDB URI secret ARN is correctly configured
4. Verify that the Terraform state is not corrupted

**Resolution**:
- Grant necessary permissions to the AWS credentials
- Update the MongoDB URI secret ARN in GitHub Secrets
- Fix Terraform configuration issues
- Reinitialize Terraform state if necessary

#### Issue: Smoke Tests Fail

**Symptoms**:
- GitHub Actions workflow fails during the smoke-test job
- Error messages from Ansible playbook

**Troubleshooting Steps**:
1. Check if the application is accessible at the ALB DNS name
2. Verify that the ECS services are running
3. Check the ECS task logs for application errors
4. Verify that the smoke tests are correctly configured

**Resolution**:
- Fix application issues causing smoke test failures
- Update ECS task definitions if necessary
- Fix smoke test configuration issues
- Manually verify application functionality

### Manual Deployment Issues

#### Issue: Docker Build Fails

**Symptoms**:
- Docker build command fails
- Error messages from Docker build

**Troubleshooting Steps**:
1. Check if Docker is installed and running
2. Verify that the Dockerfile is correctly configured
3. Check if the code has syntax errors
4. Verify that all dependencies are available

**Resolution**:
- Install or start Docker
- Fix Dockerfile configuration issues
- Fix code syntax errors
- Install missing dependencies

#### Issue: Terraform Apply Fails

**Symptoms**:
- Terraform apply command fails
- Error messages from Terraform

**Troubleshooting Steps**:
1. Check if Terraform is installed and initialized
2. Verify that the AWS credentials are correctly configured
3. Check if the Terraform configuration has syntax errors
4. Verify that all required variables are provided

**Resolution**:
- Install or initialize Terraform
- Configure AWS credentials
- Fix Terraform configuration syntax errors
- Provide missing variables

## Infrastructure Issues

### ECS Service Issues

#### Issue: ECS Tasks Failing to Start

**Symptoms**:
- ECS service shows 0 running tasks
- Tasks are being created but failing to start

**Troubleshooting Steps**:
1. Check the ECS task events for error messages
2. Verify that the task definition is correctly configured
3. Check if the container is failing to start
4. Verify that the security groups allow necessary traffic

**Resolution**:
- Fix task definition configuration issues
- Update container configuration
- Fix security group rules
- Update IAM roles if necessary

#### Issue: ECS Tasks Crashing

**Symptoms**:
- ECS tasks start but crash shortly after
- Task status changes from RUNNING to STOPPED

**Troubleshooting Steps**:
1. Check the container logs in CloudWatch Logs
2. Verify that the container has enough memory and CPU
3. Check if the application is crashing due to code issues
4. Verify that the container can connect to the database

**Resolution**:
- Fix application code issues
- Increase memory or CPU allocation
- Fix database connection issues
- Update environment variables if necessary

### ALB Issues

#### Issue: ALB Health Checks Failing

**Symptoms**:
- ALB target group shows unhealthy targets
- Health check responses are not 200 OK

**Troubleshooting Steps**:
1. Check if the ECS tasks are running
2. Verify that the health check path is correct
3. Check if the application is responding to health checks
4. Verify that the security groups allow health check traffic

**Resolution**:
- Fix ECS task issues
- Update health check path
- Fix application health check endpoint
- Update security group rules

#### Issue: ALB Not Routing Traffic

**Symptoms**:
- Application is not accessible at the ALB DNS name
- ALB is not routing traffic to the targets

**Troubleshooting Steps**:
1. Check if the ALB listener is correctly configured
2. Verify that the target group has healthy targets
3. Check if the ALB security group allows inbound traffic
4. Verify that the listener rules are correctly configured

**Resolution**:
- Fix ALB listener configuration
- Fix target group issues
- Update security group rules
- Fix listener rule configuration

### Networking Issues

#### Issue: VPC Connectivity Issues

**Symptoms**:
- ECS tasks cannot connect to external services
- Application cannot connect to the database

**Troubleshooting Steps**:
1. Check if the NAT Gateway is correctly configured
2. Verify that the route tables are correctly configured
3. Check if the security groups allow necessary traffic
4. Verify that the VPC endpoints are correctly configured (if used)

**Resolution**:
- Fix NAT Gateway configuration
- Update route tables
- Update security group rules
- Fix VPC endpoint configuration

#### Issue: DNS Resolution Issues

**Symptoms**:
- Application cannot resolve DNS names
- Connection errors with hostnames

**Troubleshooting Steps**:
1. Check if DNS support is enabled in the VPC
2. Verify that the DHCP options set is correctly configured
3. Check if the application is using the correct DNS servers
4. Verify that the DNS records exist for the hostnames

**Resolution**:
- Enable DNS support in the VPC
- Update DHCP options set
- Configure the application to use the correct DNS servers
- Create missing DNS records

## Application Issues

### Frontend Issues

#### Issue: Frontend Not Loading

**Symptoms**:
- Browser shows blank page or error
- Console errors in the browser

**Troubleshooting Steps**:
1. Check if the frontend ECS service is running
2. Verify that the ALB is routing traffic to the frontend
3. Check the frontend container logs for errors
4. Verify that the frontend build was successful

**Resolution**:
- Fix ECS service issues
- Update ALB configuration
- Fix frontend code issues
- Rebuild and redeploy the frontend

#### Issue: Frontend Authentication Issues

**Symptoms**:
- Users cannot log in
- Authentication errors in the console

**Troubleshooting Steps**:
1. Check if the backend authentication API is working
2. Verify that the frontend is sending correct authentication requests
3. Check the browser console for CORS errors
4. Verify that cookies are being set correctly

**Resolution**:
- Fix backend authentication API issues
- Update frontend authentication code
- Fix CORS configuration
- Update cookie configuration

### Backend Issues

#### Issue: Backend API Errors

**Symptoms**:
- API requests return errors
- Error messages in the backend logs

**Troubleshooting Steps**:
1. Check the backend container logs for error messages
2. Verify that the API routes are correctly configured
3. Check if the database connection is working
4. Verify that the request data is valid

**Resolution**:
- Fix backend code issues
- Update API route configuration
- Fix database connection issues
- Validate request data

#### Issue: Backend Authentication Issues

**Symptoms**:
- Authentication API requests fail
- JWT token issues

**Troubleshooting Steps**:
1. Check if the JWT secret is correctly configured
2. Verify that the authentication middleware is working
3. Check if the user data is being stored correctly
4. Verify that the password hashing is working

**Resolution**:
- Update JWT secret configuration
- Fix authentication middleware issues
- Fix user data storage issues
- Update password hashing configuration

## Performance Issues

### Slow Response Times

#### Issue: API Response Time is Slow

**Symptoms**:
- API requests take a long time to complete
- Timeout errors in the frontend

**Troubleshooting Steps**:
1. Check if the backend ECS service has enough resources
2. Verify that the database queries are optimized
3. Check if there are long-running operations in the API
4. Verify that the network latency is not excessive

**Resolution**:
- Increase CPU or memory allocation for the backend
- Optimize database queries
- Improve API code efficiency
- Reduce network latency

#### Issue: Frontend Loading Time is Slow

**Symptoms**:
- Frontend takes a long time to load
- Slow rendering in the browser

**Troubleshooting Steps**:
1. Check if the frontend bundle size is optimized
2. Verify that assets are being cached correctly
3. Check if there are render-blocking resources
4. Verify that the frontend code is optimized

**Resolution**:
- Optimize frontend bundle size
- Configure caching for assets
- Remove render-blocking resources
- Improve frontend code efficiency

### Resource Utilization Issues

#### Issue: High CPU Utilization

**Symptoms**:
- CPU utilization is consistently high
- Performance degradation

**Troubleshooting Steps**:
1. Check which processes are consuming CPU
2. Verify that the application is not in an infinite loop
3. Check if there are CPU-intensive operations
4. Verify that the CPU allocation is sufficient

**Resolution**:
- Fix code issues causing high CPU usage
- Optimize CPU-intensive operations
- Increase CPU allocation if necessary
- Scale horizontally to distribute load

#### Issue: High Memory Utilization

**Symptoms**:
- Memory utilization is consistently high
- Container restarts due to memory limits

**Troubleshooting Steps**:
1. Check if there are memory leaks in the application
2. Verify that the memory allocation is sufficient
3. Check if there are memory-intensive operations
4. Verify that garbage collection is working correctly

**Resolution**:
- Fix memory leaks
- Increase memory allocation if necessary
- Optimize memory-intensive operations
- Improve garbage collection

## Security Issues

### Authentication and Authorization Issues

#### Issue: Unauthorized Access

**Symptoms**:
- Users can access resources they shouldn't have access to
- Authorization checks are not working

**Troubleshooting Steps**:
1. Check if the authorization middleware is correctly configured
2. Verify that the JWT token contains necessary claims
3. Check if the authorization logic is correctly implemented
4. Verify that the frontend enforces authorization

**Resolution**:
- Fix authorization middleware configuration
- Update JWT token claims
- Improve authorization logic
- Enhance frontend authorization enforcement

#### Issue: JWT Token Issues

**Symptoms**:
- JWT tokens are not being validated correctly
- Token expiration is not working

**Troubleshooting Steps**:
1. Check if the JWT secret is correctly configured
2. Verify that the token expiration is set correctly
3. Check if the token validation logic is correct
4. Verify that the token is being stored securely

**Resolution**:
- Update JWT secret configuration
- Fix token expiration settings
- Improve token validation logic
- Enhance token storage security

### Data Security Issues

#### Issue: Sensitive Data Exposure

**Symptoms**:
- Sensitive data is visible in logs or responses
- Data is not being encrypted

**Troubleshooting Steps**:
1. Check if sensitive data is being logged
2. Verify that data is encrypted in transit
3. Check if data is encrypted at rest
4. Verify that sensitive data is not exposed in API responses

**Resolution**:
- Remove sensitive data from logs
- Enable HTTPS for all traffic
- Encrypt sensitive data at rest
- Filter sensitive data from API responses

#### Issue: CORS Configuration Issues

**Symptoms**:
- CORS errors in the browser console
- API requests from the frontend are blocked

**Troubleshooting Steps**:
1. Check if the CORS configuration is correct
2. Verify that the allowed origins are correctly set
3. Check if credentials are allowed if needed
4. Verify that the preflight requests are handled correctly

**Resolution**:
- Fix CORS configuration
- Update allowed origins
- Configure credentials handling
- Improve preflight request handling

## Database Issues

### Connection Issues

#### Issue: MongoDB Atlas Connection Failures

**Symptoms**:
- Application cannot connect to MongoDB Atlas
- Connection timeout errors
- Error messages like "connection refused" or "no route to host"

**Troubleshooting Steps**:
1. **Check NAT Gateway**:
   - Verify that the NAT Gateway is properly deployed in a public subnet
   - Check that the private route table has a route to the NAT Gateway for 0.0.0.0/0
   - Verify that the NAT Gateway has an Elastic IP assigned

2. **Check MongoDB Atlas Network Access**:
   - Get the NAT Gateway's public IP from Terraform outputs: `terraform output nat_gateway_public_ip`
   - Verify this IP is whitelisted in MongoDB Atlas Network Access settings
   - Temporarily try "Allow Access from Anywhere" (0.0.0.0/0) to test if it's an IP whitelisting issue

3. **Check Security Groups**:
   - Verify that the ECS service security group allows outbound traffic to port 27017
   - Check if there are any NACLs blocking outbound traffic

4. **Verify Connection String**:
   - Check that the MongoDB URI in AWS Secrets Manager is correct
   - Ensure the URI includes the correct database name and authentication parameters
   - Try connecting to MongoDB Atlas from a local machine using the same connection string

**Resolution**:
- Add the NAT Gateway's public IP to MongoDB Atlas IP Access List
- Update security group rules to allow outbound traffic to port 27017
- Fix the MongoDB URI in AWS Secrets Manager
- If using a free tier MongoDB Atlas cluster, ensure you're not hitting connection limits

#### Issue: Connection Pool Exhaustion

**Symptoms**:
- Database connection errors during high load
- "Too many connections" errors

**Troubleshooting Steps**:
1. Check the current connection pool size
2. Verify that connections are being released properly
3. Check if there are connection leaks
4. Verify that the database can handle the connection load

**Resolution**:
- Increase connection pool size
- Fix connection release issues
- Fix connection leaks
- Scale the database if necessary

### Query Performance Issues

#### Issue: Slow Queries

**Symptoms**:
- Database queries take a long time to complete
- API requests that involve database queries are slow

**Troubleshooting Steps**:
1. Identify slow queries using database monitoring
2. Check if indexes are properly configured
3. Verify that queries are optimized
4. Check if there are N+1 query issues

**Resolution**:
- Add or update indexes
- Optimize queries
- Fix N+1 query issues
- Consider database scaling or sharding

#### Issue: Database Lock Contention

**Symptoms**:
- Queries are blocked waiting for locks
- Deadlock errors

**Troubleshooting Steps**:
1. Identify transactions that hold locks for a long time
2. Check if transactions are properly scoped
3. Verify that the application handles concurrent updates correctly
4. Check if there are long-running transactions

**Resolution**:
- Reduce transaction duration
- Improve transaction scoping
- Enhance concurrency handling
- Fix long-running transactions
