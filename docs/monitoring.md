# Personal Journal Application Monitoring Guide

This document provides detailed information on monitoring the Personal Journal application deployed on AWS.

## Table of Contents

1. [Monitoring Strategy](#monitoring-strategy)
2. [Key Metrics](#key-metrics)
3. [CloudWatch Dashboards](#cloudwatch-dashboards)
4. [Alerting](#alerting)
5. [Log Analysis](#log-analysis)
6. [Performance Monitoring](#performance-monitoring)
7. [Health Checks](#health-checks)

## Monitoring Strategy

The monitoring strategy for the Personal Journal application focuses on:

1. **Infrastructure Health**: Monitoring the health and performance of AWS resources
2. **Application Health**: Monitoring the health and performance of the application
3. **User Experience**: Monitoring the user experience and application usability
4. **Security**: Monitoring for security threats and vulnerabilities

## Key Metrics

### Infrastructure Metrics

1. **ECS Service Metrics**:
   - CPUUtilization
   - MemoryUtilization
   - RunningTaskCount
   - PendingTaskCount

2. **ALB Metrics**:
   - RequestCount
   - HTTPCode_ELB_4XX_Count
   - HTTPCode_ELB_5XX_Count
   - TargetResponseTime
   - HealthyHostCount
   - UnHealthyHostCount

3. **Network Metrics**:
   - VPC Flow Logs
   - NAT Gateway Bytes
   - ALB Connection Count

### Application Metrics

1. **API Metrics**:
   - Request Count (by endpoint)
   - Error Count (by endpoint)
   - Response Time (by endpoint)
   - Authentication Success/Failure

2. **Database Metrics**:
   - Connection Count
   - Query Performance
   - Storage Usage

3. **Custom Business Metrics**:
   - User Registration Count
   - Journal Entry Creation Count
   - Active User Count

## CloudWatch Dashboards

Create CloudWatch Dashboards to visualize key metrics. Here's a sample dashboard configuration:

### Infrastructure Dashboard

```json
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", "ServiceName", "personal-journal-frontend-service", "ClusterName", "personal-journal-cluster"],
          ["AWS/ECS", "CPUUtilization", "ServiceName", "personal-journal-backend-service", "ClusterName", "personal-journal-cluster"]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "ECS CPU Utilization",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          ["AWS/ECS", "MemoryUtilization", "ServiceName", "personal-journal-frontend-service", "ClusterName", "personal-journal-cluster"],
          ["AWS/ECS", "MemoryUtilization", "ServiceName", "personal-journal-backend-service", "ClusterName", "personal-journal-cluster"]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "ECS Memory Utilization",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 0,
      "y": 6,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "app/personal-journal-alb/abcdef1234567890"]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "ALB Request Count",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 6,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          ["AWS/ApplicationELB", "HTTPCode_ELB_4XX_Count", "LoadBalancer", "app/personal-journal-alb/abcdef1234567890"],
          ["AWS/ApplicationELB", "HTTPCode_ELB_5XX_Count", "LoadBalancer", "app/personal-journal-alb/abcdef1234567890"]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "ALB Error Count",
        "period": 300
      }
    }
  ]
}
```

### Application Dashboard

For application-specific metrics, you'll need to implement custom metrics using CloudWatch Logs or a third-party monitoring solution.

## Alerting

Set up CloudWatch Alarms to alert on critical metrics:

### Infrastructure Alarms

1. **ECS CPU Utilization**:
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name personal-journal-frontend-cpu-high \
     --alarm-description "Alarm when CPU exceeds 80%" \
     --metric-name CPUUtilization \
     --namespace AWS/ECS \
     --statistic Average \
     --period 300 \
     --threshold 80 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=ClusterName,Value=personal-journal-cluster Name=ServiceName,Value=personal-journal-frontend-service \
     --evaluation-periods 2 \
     --alarm-actions arn:aws:sns:us-east-1:123456789012:alerts
   ```

2. **ECS Memory Utilization**:
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name personal-journal-frontend-memory-high \
     --alarm-description "Alarm when Memory exceeds 80%" \
     --metric-name MemoryUtilization \
     --namespace AWS/ECS \
     --statistic Average \
     --period 300 \
     --threshold 80 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=ClusterName,Value=personal-journal-cluster Name=ServiceName,Value=personal-journal-frontend-service \
     --evaluation-periods 2 \
     --alarm-actions arn:aws:sns:us-east-1:123456789012:alerts
   ```

3. **ALB 5XX Errors**:
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name personal-journal-alb-5xx \
     --alarm-description "Alarm when 5XX errors exceed threshold" \
     --metric-name HTTPCode_ELB_5XX_Count \
     --namespace AWS/ApplicationELB \
     --statistic Sum \
     --period 60 \
     --threshold 5 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=LoadBalancer,Value=app/personal-journal-alb/abcdef1234567890 \
     --evaluation-periods 1 \
     --alarm-actions arn:aws:sns:us-east-1:123456789012:alerts
   ```

### Application Alarms

For application-specific alarms, you'll need to implement custom metrics and alarms.

## Log Analysis

### CloudWatch Logs Insights

Use CloudWatch Logs Insights to analyze application logs:

1. **Error Analysis**:
   ```
   fields @timestamp, @message
   | filter @message like /ERROR/
   | sort @timestamp desc
   | limit 100
   ```

2. **API Request Analysis**:
   ```
   fields @timestamp, @message
   | filter @message like /API request/
   | stats count() as requestCount by bin(30m)
   | sort @timestamp desc
   ```

3. **Authentication Analysis**:
   ```
   fields @timestamp, @message
   | filter @message like /Authentication/
   | stats count() as authCount by bin(30m)
   | sort @timestamp desc
   ```

### Log Exports

Consider exporting logs to a log analytics platform (e.g., Elasticsearch, Splunk) for more advanced analysis.

## Performance Monitoring

### API Performance

Monitor API performance using CloudWatch Logs or a third-party APM solution:

1. **Response Time**:
   - Track response time by endpoint
   - Set thresholds for acceptable response times
   - Alert when response times exceed thresholds

2. **Throughput**:
   - Monitor requests per second
   - Track throughput by endpoint
   - Identify bottlenecks

3. **Error Rate**:
   - Monitor error rate by endpoint
   - Track error types and frequencies
   - Alert when error rates exceed thresholds

### Frontend Performance

Monitor frontend performance using browser-based monitoring:

1. **Page Load Time**:
   - Track time to first byte (TTFB)
   - Track time to interactive (TTI)
   - Track first contentful paint (FCP)

2. **JavaScript Errors**:
   - Monitor JavaScript errors in the browser
   - Track error types and frequencies
   - Alert when error rates exceed thresholds

3. **User Experience**:
   - Track user interactions
   - Monitor user flows
   - Identify usability issues

## Health Checks

### Infrastructure Health Checks

1. **ECS Service Health**:
   - Monitor the number of running tasks
   - Ensure that the desired count matches the running count
   - Check for task failures

2. **ALB Health Checks**:
   - Monitor target health
   - Ensure that targets are healthy
   - Check for unhealthy targets

3. **Network Health**:
   - Monitor NAT Gateway health
   - Check VPC Flow Logs for connectivity issues
   - Verify that security groups allow necessary traffic

### Application Health Checks

1. **API Health Check**:
   - Use the `/api/health` endpoint to check API health
   - Monitor response status and content
   - Alert when health check fails

2. **Database Health Check**:
   - Monitor database connectivity
   - Check for connection errors
   - Verify that queries are executing successfully

3. **End-to-End Health Check**:
   - Implement synthetic transactions
   - Simulate user flows
   - Alert when transactions fail
