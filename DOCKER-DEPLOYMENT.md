# 🐳 Docker Deployment Guide for ClearPath AI

This guide provides comprehensive instructions for deploying the ClearPath AI frontend using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- At least 2GB RAM available
- Port 3000 available (or configure different port)

## 🏗️ Project Structure

```
ClearPathAI/
├── frontend/
│   ├── Dockerfile              # Frontend Docker configuration
│   ├── .dockerignore          # Files to exclude from Docker build
│   ├── next.config.js         # Next.js config with standalone output
│   └── env.production.example # Production environment template
├── docker-compose.yml         # Multi-service orchestration
├── nginx.conf                 # Reverse proxy configuration
└── DOCKER-DEPLOYMENT.md      # This guide
```

## 🚀 Quick Start

### 1. **Frontend Only Deployment**

```bash
# Navigate to frontend directory
cd frontend

# Build the Docker image
docker build -t clearpath-ai-frontend .

# Run the container
docker run -p 3000:3000 --name clearpath-frontend clearpath-ai-frontend
```

### 2. **Full Stack Deployment with Docker Compose**

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f clearpath-frontend

# Stop services
docker-compose down
```

## 📦 Docker Configuration Files

### **Dockerfile (Multi-stage Build)**

```dockerfile
# Optimized for production with multi-stage build
FROM node:18-alpine AS base
FROM base AS deps          # Install dependencies
FROM base AS builder       # Build application  
FROM base AS runner        # Production runtime
```

**Key Features:**
- ✅ Multi-stage build for smaller image size
- ✅ Non-root user for security
- ✅ Standalone output for optimal performance
- ✅ Alpine Linux for minimal footprint

### **Docker Compose Services**

```yaml
services:
  clearpath-frontend:     # Next.js frontend
  clearpath-backend:      # API backend (placeholder)
  clearpath-websocket:    # WebSocket server (placeholder)
  nginx:                  # Reverse proxy (optional)
```

## 🔧 Configuration Options

### **Environment Variables**

Copy and customize the environment template:

```bash
# Copy template
cp frontend/env.production.example frontend/.env.production

# Edit variables
nano frontend/.env.production
```

**Key Variables:**
```bash
NODE_ENV=production
BACKEND_API_URL=http://clearpath-backend:8000/api
WEBSOCKET_URL=http://clearpath-websocket:8001/ws
NEXT_TELEMETRY_DISABLED=1
```

### **Port Configuration**

```bash
# Custom port mapping
docker run -p 8080:3000 clearpath-ai-frontend

# Docker Compose port override
ports:
  - "8080:3000"  # Host:Container
```

## 🌐 Deployment Scenarios

### **Scenario 1: Development Testing**

```bash
# Quick frontend-only testing
docker-compose up clearpath-frontend

# With hot reload (development)
docker-compose -f docker-compose.dev.yml up
```

### **Scenario 2: Production Deployment**

```bash
# Full production stack with Nginx
docker-compose --profile production up -d

# Health check
curl http://localhost/api/health
```

### **Scenario 3: Cloud Deployment**

#### **AWS ECS/Fargate**
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker build -t clearpath-ai-frontend ./frontend
docker tag clearpath-ai-frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/clearpath-ai:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/clearpath-ai:latest
```

#### **Google Cloud Run**
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/clearpath-ai ./frontend
gcloud run deploy --image gcr.io/PROJECT-ID/clearpath-ai --platform managed
```

#### **Azure Container Instances**
```bash
# Create resource group and deploy
az group create --name clearpath-rg --location eastus
az container create --resource-group clearpath-rg --name clearpath-ai --image clearpath-ai-frontend --ports 3000
```

## 🔒 Security Best Practices

### **1. Image Security**
```bash
# Scan for vulnerabilities
docker scout cves clearpath-ai-frontend

# Use specific versions, not 'latest'
FROM node:18.17.0-alpine
```

### **2. Runtime Security**
```bash
# Run as non-root user
USER nextjs

# Read-only root filesystem
docker run --read-only clearpath-ai-frontend

# Resource limits
docker run --memory=512m --cpus="0.5" clearpath-ai-frontend
```

### **3. Network Security**
```bash
# Custom network
docker network create clearpath-network

# Isolated containers
docker-compose up --no-deps clearpath-frontend
```

## 📊 Monitoring & Logging

### **Container Health Checks**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### **Log Management**
```bash
# View logs
docker-compose logs -f clearpath-frontend

# Log rotation
docker run --log-opt max-size=10m --log-opt max-file=3 clearpath-ai-frontend

# Export logs
docker logs clearpath-frontend > clearpath.log 2>&1
```

### **Resource Monitoring**
```bash
# Container stats
docker stats clearpath-frontend

# Detailed resource usage
docker-compose exec clearpath-frontend top
```

## 🛠️ Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t clearpath-ai-frontend ./frontend
```

#### **Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :3000

# Use different port
docker run -p 3001:3000 clearpath-ai-frontend
```

#### **Memory Issues**
```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory

# Check container memory usage
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

#### **Permission Issues**
```bash
# Fix file permissions
chmod +x frontend/entrypoint.sh

# Run with proper user
docker run --user $(id -u):$(id -g) clearpath-ai-frontend
```

### **Debug Mode**
```bash
# Interactive shell
docker run -it clearpath-ai-frontend sh

# Debug build process
docker build --progress=plain --no-cache -t clearpath-ai-frontend ./frontend
```

## 📈 Performance Optimization

### **Image Size Optimization**
```bash
# Check image size
docker images clearpath-ai-frontend

# Use multi-stage builds (already implemented)
# Use .dockerignore (already implemented)
# Use Alpine Linux (already implemented)
```

### **Runtime Optimization**
```bash
# Resource limits
docker run --memory=1g --cpus="1.0" clearpath-ai-frontend

# Production environment
docker run -e NODE_ENV=production clearpath-ai-frontend
```

## 🔄 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t clearpath-ai-frontend ./frontend
      - name: Deploy to production
        run: docker-compose up -d
```

### **GitLab CI Example**
```yaml
build:
  stage: build
  script:
    - docker build -t clearpath-ai-frontend ./frontend
    - docker push $CI_REGISTRY_IMAGE
```

## 📞 Support

### **Health Endpoints**
- Frontend: `http://localhost:3000`
- Health Check: `http://localhost:3000/api/health` (if implemented)
- Metrics: `http://localhost:3000/_next/static/` (build info)

### **Useful Commands**
```bash
# Container inspection
docker inspect clearpath-frontend

# Resource usage
docker exec clearpath-frontend df -h

# Network connectivity
docker exec clearpath-frontend ping clearpath-backend

# Environment variables
docker exec clearpath-frontend env
```

## 🎯 Next Steps

1. **Backend Integration**: Replace placeholder backend services
2. **SSL/HTTPS**: Configure SSL certificates for production
3. **Database**: Add PostgreSQL/MongoDB services
4. **Caching**: Implement Redis for session/data caching
5. **Monitoring**: Add Prometheus/Grafana for metrics
6. **Backup**: Implement automated backup strategies

---

**🚀 Your ClearPath AI application is now ready for Docker deployment!**

For additional support or questions, please refer to the main project documentation or create an issue in the repository.
