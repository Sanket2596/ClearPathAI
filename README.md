# ClearPath AI - Logistics Package Recovery System

An Agentic AI system for detecting, investigating, and recovering lost/misrouted packages in logistics operations.

## Architecture Overview

This system implements a comprehensive solution for package loss prevention using:

- **Real-time package tracking** across multiple data sources
- **Agentic AI** for autonomous investigation and recovery
- **Multi-agent collaboration** for complex problem-solving
- **Proactive customer communication** with transparency

## Core Components

### 1. Data Ingestion Layer
- API Gateway for external integrations
- Kafka streaming for real-time events
- Support for scanner events, GPS data, warehouse systems

### 2. Agent Layer
- **Investigator Agent**: Root-cause analysis and location inference
- **Recovery Agent**: Coordinates rerouting and staff notifications
- **Evidence Agent**: Computer vision analysis of CCTV/photos
- **Customer Agent**: Automated customer communications

### 3. Storage & Processing
- PostgreSQL for operational data
- ClickHouse for analytics
- Redis for caching and real-time state
- S3-compatible storage for images/videos

## Technology Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy
- **Streaming**: Apache Kafka
- **Databases**: PostgreSQL, ClickHouse, Redis
- **AI/ML**: OpenAI GPT-4, LangChain, OpenCV
- **Infrastructure**: Docker, Kubernetes, Terraform
- **Monitoring**: Prometheus, Grafana, ELK Stack

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+ (for frontend)

### Development Setup

1. **Clone and setup environment**
```bash
git clone <repository-url>
cd ClearPathAI
cp .env.example .env
# Edit .env with your configuration
```

2. **Start infrastructure services**
```bash
docker-compose up -d kafka postgres redis clickhouse
```

3. **Install dependencies and run services**
```bash
# Backend services
cd services
pip install -r requirements.txt
uvicorn main:app --reload

# Start agents
cd agents
python agent_manager.py
```

4. **Access the system**
- API Documentation: http://localhost:8000/docs
- Monitoring Dashboard: http://localhost:3000
- Agent Management: http://localhost:8001

## Project Structure

```
ClearPathAI/
├── services/           # Core microservices
├── agents/            # AI agents implementation
├── infrastructure/    # Docker, K8s, Terraform configs
├── frontend/         # Web dashboard
├── docs/             # Documentation
├── tests/            # Test suites
└── scripts/          # Utility scripts
```

## Key Features

- 🔍 **Real-time anomaly detection** for package tracking
- 🤖 **Autonomous AI agents** for investigation and recovery
- 📱 **Proactive customer updates** with detailed explanations
- 📊 **Comprehensive monitoring** and analytics
- 🔐 **Enterprise security** with audit trails
- 🎯 **Human-in-the-loop** for complex cases

## Metrics & KPIs

- Mean time to detect lost packages: < 2 hours
- Automated recovery rate: > 80%
- Customer satisfaction improvement: > 25%
- Investigation time reduction: > 60%

## Development Phases

1. **Phase 1**: Foundation & Data Platform (4-8 weeks)
2. **Phase 2**: Anomaly Detection (4-6 weeks)
3. **Phase 3**: Basic Agent MVP (6-8 weeks)
4. **Phase 4**: Full Agentic Automation (8-12 weeks)
5. **Phase 5**: Pilot & Iteration (6-12 weeks)
6. **Phase 6**: Scale & Production (12-20 weeks)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
