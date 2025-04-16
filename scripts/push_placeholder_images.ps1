# PowerShell script to push placeholder images to ECR for initial deployment

# Set variables
param(
    [string]$AwsRegion = "us-east-1",
    [string]$ProjectName = "personal-journal"
)

$FrontendRepo = "$ProjectName-frontend"
$BackendRepo = "$ProjectName-backend"
$Tag = "latest"

# Login to ECR
Write-Host "Logging in to Amazon ECR..."
$AccountId = (aws sts get-caller-identity --query Account --output text)
$LoginCmd = (aws ecr get-login-password --region $AwsRegion)
$LoginCmd | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$AwsRegion.amazonaws.com"

# Create a simple nginx container for frontend placeholder
Write-Host "Creating frontend placeholder image..."
@"
FROM nginx:alpine
RUN echo "Placeholder for Personal Journal Frontend" > /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
"@ | Out-File -FilePath "Dockerfile.frontend.placeholder" -Encoding utf8

# Create a simple node container for backend placeholder
Write-Host "Creating backend placeholder image..."
@"
FROM node:14-alpine
WORKDIR /app
RUN echo '{"name":"placeholder","version":"1.0.0","scripts":{"start":"node server.js"}}' > package.json
RUN echo 'const http = require("http"); const server = http.createServer((req, res) => { res.statusCode = 200; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({status: "ok", message: "Placeholder for Personal Journal Backend"})); }); server.listen(5000, () => { console.log("Server running on port 5000"); });' > server.js
EXPOSE 5000
CMD ["node", "server.js"]
"@ | Out-File -FilePath "Dockerfile.backend.placeholder" -Encoding utf8

# Build and push frontend placeholder
Write-Host "Building frontend placeholder image..."
docker build -t "${FrontendRepo}:${Tag}" -f Dockerfile.frontend.placeholder .

Write-Host "Pushing frontend placeholder image..."
docker tag "${FrontendRepo}:${Tag}" "${AccountId}.dkr.ecr.${AwsRegion}.amazonaws.com/${FrontendRepo}:${Tag}"
docker push "${AccountId}.dkr.ecr.${AwsRegion}.amazonaws.com/${FrontendRepo}:${Tag}"

# Build and push backend placeholder
Write-Host "Building backend placeholder image..."
docker build -t "${BackendRepo}:${Tag}" -f Dockerfile.backend.placeholder .

Write-Host "Pushing backend placeholder image..."
docker tag "${BackendRepo}:${Tag}" "${AccountId}.dkr.ecr.${AwsRegion}.amazonaws.com/${BackendRepo}:${Tag}"
docker push "${AccountId}.dkr.ecr.${AwsRegion}.amazonaws.com/${BackendRepo}:${Tag}"

Write-Host "Placeholder images pushed successfully!"

# Cleanup
Remove-Item -Path "Dockerfile.frontend.placeholder" -Force
Remove-Item -Path "Dockerfile.backend.placeholder" -Force
