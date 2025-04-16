#!/bin/bash
# Script to push placeholder images to ECR for initial deployment

# Set variables
AWS_REGION=${1:-us-east-1}
PROJECT_NAME=${2:-personal-journal}
FRONTEND_REPO="${PROJECT_NAME}-frontend"
BACKEND_REPO="${PROJECT_NAME}-backend"
TAG="latest"

# Login to ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Create a simple nginx container for frontend placeholder
echo "Creating frontend placeholder image..."
cat > Dockerfile.frontend.placeholder << EOF
FROM nginx:alpine
RUN echo "Placeholder for Personal Journal Frontend" > /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create a simple node container for backend placeholder
echo "Creating backend placeholder image..."
cat > Dockerfile.backend.placeholder << EOF
FROM node:14-alpine
WORKDIR /app
RUN echo '{"name":"placeholder","version":"1.0.0","scripts":{"start":"node server.js"}}' > package.json
RUN echo 'const http = require("http"); const server = http.createServer((req, res) => { res.statusCode = 200; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({status: "ok", message: "Placeholder for Personal Journal Backend"})); }); server.listen(5000, () => { console.log("Server running on port 5000"); });' > server.js
EXPOSE 5000
CMD ["node", "server.js"]
EOF

# Build and push frontend placeholder
echo "Building frontend placeholder image..."
docker build -t ${FRONTEND_REPO}:${TAG} -f Dockerfile.frontend.placeholder .

echo "Pushing frontend placeholder image..."
docker tag ${FRONTEND_REPO}:${TAG} $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/${FRONTEND_REPO}:${TAG}
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/${FRONTEND_REPO}:${TAG}

# Build and push backend placeholder
echo "Building backend placeholder image..."
docker build -t ${BACKEND_REPO}:${TAG} -f Dockerfile.backend.placeholder .

echo "Pushing backend placeholder image..."
docker tag ${BACKEND_REPO}:${TAG} $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/${BACKEND_REPO}:${TAG}
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/${BACKEND_REPO}:${TAG}

echo "Placeholder images pushed successfully!"

# Cleanup
rm Dockerfile.frontend.placeholder Dockerfile.backend.placeholder
