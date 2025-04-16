# Terraform State Bootstrap

This directory contains Terraform configuration for setting up the remote state management infrastructure for the Personal Journal application.

## Purpose

The configuration in this directory creates:

1. An S3 bucket for storing Terraform state files
2. A DynamoDB table for state locking

These resources are used by the main Terraform configuration to manage state remotely, enabling:

- Collaboration among team members
- State locking to prevent concurrent modifications
- State versioning for history and rollback
- Secure storage of sensitive state information

## Usage

### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (version 1.2.0 or later)

### Steps

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Review the plan:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

4. Note the outputs:
   - `state_bucket_name`: The name of the S3 bucket
   - `dynamodb_table_name`: The name of the DynamoDB table

### Customization

You can customize the names of the S3 bucket and DynamoDB table by modifying the variables:

```bash
terraform apply -var="state_bucket_name=my-custom-bucket-name" -var="dynamodb_table_name=my-custom-table-name"
```

Or by creating a `terraform.tfvars` file:

```hcl
state_bucket_name    = "my-custom-bucket-name"
dynamodb_table_name  = "my-custom-table-name"
```

## Important Notes

1. The S3 bucket has `prevent_destroy` set to `true` to prevent accidental deletion. If you need to delete it, you must first modify this setting in the Terraform configuration.

2. The S3 bucket has versioning enabled, which means it will retain all versions of the state file. This can increase storage costs over time, but provides important protection against data loss.

3. The S3 bucket has server-side encryption enabled to protect sensitive information in the state file.

4. The DynamoDB table uses on-demand capacity mode to avoid costs when not in use.

## After Bootstrap

After creating these resources, you need to configure the main Terraform configuration to use them:

```bash
cd ../
terraform init \
  -backend-config="bucket=<state_bucket_name>" \
  -backend-config="key=terraform/state/personal-journal.tfstate" \
  -backend-config="region=<aws_region>" \
  -backend-config="dynamodb_table=<dynamodb_table_name>" \
  -backend-config="encrypt=true"
```

Replace `<state_bucket_name>`, `<aws_region>`, and `<dynamodb_table_name>` with the appropriate values.
