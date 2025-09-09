# ClearPath AI Backend Setup Guide

## Overview
This guide will help you set up the ClearPath AI backend with FastAPI and PostgreSQL, and connect it to the frontend.

## Prerequisites
- Python 3.11+
- Docker and Docker Compose
- Node.js 18+ (for frontend)

## Backend Setup

### 1. Start PostgreSQL Database
```bash
cd backend
docker-compose up -d postgres
```

### 2. Set up Python Environment
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clearpath_ai
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
```

### 4. Start the Backend Server
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure API URL
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Start the Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Packages
- `GET /api/v1/packages` - Get all packages with filtering
- `GET /api/v1/packages/{id}` - Get package by ID
- `GET /api/v1/packages/tracking/{tracking_number}` - Get package by tracking number
- `POST /api/v1/packages` - Create new package
- `PUT /api/v1/packages/{id}` - Update package
- `DELETE /api/v1/packages/{id}` - Delete package
- `GET /api/v1/packages/stats` - Get package statistics
- `GET /api/v1/packages/export/csv` - Export packages as CSV
- `GET /api/v1/packages/export/json` - Export packages as JSON
- `POST /api/v1/packages/refresh` - Refresh packages data

### Health Check
- `GET /api/v1/health` - Check API health

## Database Schema

### Packages Table
- `id` (UUID, Primary Key)
- `tracking_number` (String, Unique)
- `sender_name`, `sender_company`, `sender_address` (JSONB)
- `receiver_name`, `receiver_company`, `receiver_address` (JSONB)
- `origin`, `destination` (String)
- `status` (Enum: in_transit, delivered, delayed, lost, investigating)
- `priority` (Enum: low, medium, high, critical)
- `weight`, `value` (Float)
- `ai_confidence` (Float)
- `anomaly_type`, `investigation_status` (String)
- `created_at`, `updated_at` (DateTime)

### Tracking Events Table
- `id` (UUID, Primary Key)
- `package_id` (UUID, Foreign Key)
- `event_type`, `scan_type` (String/Enum)
- `timestamp` (DateTime)
- `location` (String)
- `description` (Text)
- `ai_analysis` (Text)
- `anomaly_detected` (Boolean)

## Features

### Real-time Package Tracking
- Live package status updates
- AI-powered anomaly detection
- Multi-agent investigation system
- Real-time notifications

### Advanced Filtering & Search
- Search by tracking number, sender, receiver, location
- Filter by status, priority, date range
- Sort by various fields
- Pagination support

### Data Export
- CSV export with all package data
- JSON export for API integration
- Filtered exports based on current search criteria

### AI Integration
- Confidence scoring for package status
- Anomaly detection and classification
- Investigation status tracking
- AI analysis results storage

## Troubleshooting

### Backend Issues
1. **Database Connection Error**: Ensure PostgreSQL is running with `docker ps`
2. **Port Already in Use**: Change port in `main.py` or stop conflicting services
3. **Import Errors**: Ensure virtual environment is activated and dependencies installed

### Frontend Issues
1. **API Connection Error**: Check if backend is running on port 8000
2. **CORS Issues**: Backend includes CORS middleware for localhost:3000
3. **Environment Variables**: Ensure `.env.local` file exists with correct API URL

### Database Issues
1. **Tables Not Created**: Run `python seed_data.py` to create tables and sample data
2. **Connection Refused**: Check PostgreSQL container status with `docker ps`

## Development

### Adding New Features
1. Create new models in `app/models/`
2. Add schemas in `app/schemas/`
3. Implement services in `app/services/`
4. Create API endpoints in `app/api/`
5. Update frontend API client in `lib/api.ts`

### Database Migrations
Use Alembic for database migrations:
```bash
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Production Deployment

### Environment Variables
- Set `DEBUG=False`
- Use strong `SECRET_KEY`
- Configure production database URL
- Set up proper CORS origins

### Security
- Use HTTPS in production
- Implement authentication/authorization
- Validate all input data
- Use environment variables for secrets

## Support

For issues or questions:
1. Check the logs in the terminal
2. Verify all services are running
3. Check network connectivity between frontend and backend
4. Review the API documentation at `http://localhost:8000/docs`
