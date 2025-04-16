terraform {
  backend "s3" {
    # These values must be provided via backend-config or environment variables
    # bucket         = "personal-journal-terraform-state"
    # key            = "terraform/state/personal-journal.tfstate"
    # region         = "us-east-1"
    # dynamodb_table = "personal-journal-terraform-locks"
    # encrypt        = true
  }
}
