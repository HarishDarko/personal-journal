output "state_bucket_name" {
  description = "The name of the S3 bucket for Terraform state storage"
  value       = aws_s3_bucket.terraform_state.id
}

output "dynamodb_table_name" {
  description = "The name of the DynamoDB table for Terraform state locking"
  value       = aws_dynamodb_table.terraform_locks.id
}

output "state_bucket_arn" {
  description = "The ARN of the S3 bucket for Terraform state storage"
  value       = aws_s3_bucket.terraform_state.arn
}

output "dynamodb_table_arn" {
  description = "The ARN of the DynamoDB table for Terraform state locking"
  value       = aws_dynamodb_table.terraform_locks.arn
}
