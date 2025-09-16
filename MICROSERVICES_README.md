# ClearPathAI Microservices Architecture

This document explains the microservices architecture implementation for ClearPathAI.

## 🏗️ Architecture Overview

The application has been refactored from a monolithic FastAPI application into a microservices architecture with the following services:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API Gateway (Nginx)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Load Balancing │  Rate Limiting │  Authentication │  Request Routing          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼───────┐ ┌─────▼─────┐ ┌──────▼──────┐
            │   Package     │ │   AI      │ │  WebSocket  │
            │   Service     │ │  Service  │ │   Service   │
            │   (Port 8001) │ │ (Port 8002)│ │ (Port 8003) │
            └───────────────┘ └───────────┘ └─────────────┘
                    │               │               │
            ┌───────▼───────┐ ┌─────▼─────┐ ┌──────▼──────┐
            │   PostgreSQL  │ │  MongoDB  │ │    Redis    │
            │   Database    │ │  Database │ │   Cache     │
            └───────────────┘ └───────────┘ └─────────────┘
```

## 🚀 Services

### 1. API Gateway (Nginx)
- **Port**: 80
- **Purpose**: Entry point for all requests
- **Features**:
  - Load balancing
  - Rate limiting
  - CORS handling
  - SSL termination
  - Request routing

### 2. Package Service
- **Port**: 8001
- **Purpose**: Package management and tracking
- **Database**: PostgreSQL
- **Features**:
  - Package CRUD operations
  - Tracking event management
  - Package analytics
  - Export functionality
  - Search and filtering

### 3. AI Agent Service
- **Port**: 8002
- **Purpose**: AI-powered analysis and investigation
- **Database**: MongoDB (for investigation results)
- **Features**:
  - Anomaly investigation
  - Delay analysis
  - Route optimization
  - Predictive analysis
  - LangChain integration

### 4. WebSocket Service
- **Port**: 8003
- **Purpose**: Real-time communication
- **Database**: Redis (for connection management)
- **Features**:
  - Real-time updates
  - Connection management
  - Event broadcasting
  - Notification delivery

## 🐳 Running the Microservices

### Prerequisites
- Docker and Docker Compose
- Environment variables set up

### Environment Variables
Create a `.env` file with the following variables:

```env
# Database URLs
DATABASE_URL=postgresql://admin:password@postgres:5432/clearpath_ai
MONGODB_URL=mongodb://admin:password@mongodb:27017/ai_service
REDIS_URL=redis://redis:6379

# Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# AI Service
OPENAI_API_KEY=your_openai_api_key
```

### Start All Services
```bash
# Start all microservices
docker-compose -f docker-compose.microservices.yml up -d

# View logs
docker-compose -f docker-compose.microservices.yml logs -f

# Stop all services
docker-compose -f docker-compose.microservices.yml down
```

### Individual Service Management
```bash
# Start specific service
docker-compose -f docker-compose.microservices.yml up -d package-service

# Rebuild specific service
docker-compose -f docker-compose.microservices.yml build package-service
docker-compose -f docker-compose.microservices.yml up -d package-service

# View service logs
docker-compose -f docker-compose.microservices.yml logs -f package-service
```

## 🔧 Development

### Running Services Locally

#### 1. Package Service
```bash
cd package-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

#### 2. AI Agent Service
```bash
cd ai-agent-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

#### 3. WebSocket Service
```bash
cd websocket-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

#### 4. API Gateway
```bash
cd api-gateway
docker build -t api-gateway .
docker run -p 80:80 api-gateway
```

## 📡 API Endpoints

### Through API Gateway (Port 80)

#### Package Management
- `GET /api/v1/packages` - List packages
- `POST /api/v1/packages` - Create package
- `GET /api/v1/packages/{id}` - Get package
- `PUT /api/v1/packages/{id}` - Update package
- `DELETE /api/v1/packages/{id}` - Delete package
- `GET /api/v1/packages/stats` - Package statistics

#### AI Agent Services
- `POST /api/v1/agents/investigate/anomaly/{package_id}` - Investigate anomaly
- `POST /api/v1/agents/investigate/delay/{package_id}` - Investigate delay
- `POST /api/v1/agents/optimize/route/{package_id}` - Optimize route
- `GET /api/v1/agents/investigations/{package_id}` - Get investigation status

#### WebSocket Endpoints
- `WS /ws/connect` - Main WebSocket connection
- `WS /ws/packages` - Package updates
- `WS /ws/dashboard` - Dashboard metrics
- `WS /ws/map` - Map updates
- `WS /ws/agents` - Agent monitoring

## 🔄 Inter-Service Communication

### HTTP Communication
Services communicate via HTTP using internal service URLs:
- Package Service → AI Service: `http://ai-agent-service:8002`
- Package Service → WebSocket Service: `http://websocket-service:8003`

### Event-Driven Communication
Services can broadcast events through the WebSocket service for real-time updates.

## 🗄️ Database Strategy

### Package Service
- **Database**: PostgreSQL
- **Purpose**: Transactional data, package information
- **Tables**: packages, tracking_events, users

### AI Agent Service
- **Database**: MongoDB
- **Purpose**: Investigation results, agent logs
- **Collections**: investigations, agent_logs, model_cache

### WebSocket Service
- **Database**: Redis
- **Purpose**: Connection management, message queuing
- **Keys**: connections, subscriptions, message_queue

## 🔐 Authentication

All services use the same Clerk authentication system:
- JWT tokens are validated at the service level
- User information is passed through the API Gateway
- Each service can access user context

## 📊 Monitoring and Health Checks

### Health Check Endpoints
- API Gateway: `GET /health`
- Package Service: `GET /health`
- AI Agent Service: `GET /health`
- WebSocket Service: `GET /health`

### Docker Health Checks
All services have Docker health checks configured to monitor service availability.

## 🚀 Deployment

### Production Considerations
1. **Load Balancing**: Use multiple instances of each service
2. **Database Scaling**: Configure PostgreSQL and MongoDB for production
3. **Redis Clustering**: Set up Redis cluster for high availability
4. **Monitoring**: Implement comprehensive logging and monitoring
5. **Security**: Configure proper network policies and secrets management

### Scaling Services
```bash
# Scale specific service
docker-compose -f docker-compose.microservices.yml up -d --scale package-service=3

# Scale all services
docker-compose -f docker-compose.microservices.yml up -d --scale package-service=3 --scale ai-agent-service=2 --scale websocket-service=2
```

## 🔧 Troubleshooting

### Common Issues

1. **Service Not Starting**
   - Check environment variables
   - Verify database connections
   - Check service logs

2. **Inter-Service Communication Failing**
   - Verify service names in Docker network
   - Check service health status
   - Verify network connectivity

3. **Database Connection Issues**
   - Ensure databases are running
   - Check connection strings
   - Verify database credentials

### Debugging Commands
```bash
# Check service status
docker-compose -f docker-compose.microservices.yml ps

# View service logs
docker-compose -f docker-compose.microservices.yml logs service-name

# Check network connectivity
docker-compose -f docker-compose.microservices.yml exec package-service ping ai-agent-service

# Access service shell
docker-compose -f docker-compose.microservices.yml exec package-service bash
```

## 📈 Benefits of Microservices Architecture

1. **Scalability**: Scale services independently based on demand
2. **Fault Isolation**: Service failures don't affect other services
3. **Technology Diversity**: Use different databases and technologies per service
4. **Team Independence**: Different teams can work on different services
5. **Deployment Independence**: Deploy services independently
6. **Performance**: Optimize each service for its specific use case

## 🔄 Migration from Monolith

The microservices architecture maintains compatibility with the existing frontend:
- Same API endpoints through the API Gateway
- Same authentication system
- Same WebSocket functionality
- Same data models and schemas

This ensures a smooth transition without breaking existing functionality.
