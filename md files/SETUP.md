# ResearchMind - Complete Setup Guide

AI-powered academic paper analysis platform with RAG, citation graphs, and topic clustering.

---

## 📋 Prerequisites

### Required Software
- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **Redis 7+** - [Download](https://redis.io/download/)
- **Git** - [Download](https://git-scm.com/)

### Optional (for production)
- **MinIO** (S3-compatible storage) - [Download](https://min.io/download)
- **Docker** - [Download](https://www.docker.com/)

---

## 🚀 Quick Start (Development)

### 1. Clone Repository
```bash
cd "C:\Users\Development\Desktop\AI ML"
```

### 2. Backend Setup

#### Install PostgreSQL
1. Download and install PostgreSQL
2. Create database:
```sql
CREATE DATABASE researchmind;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE researchmind TO postgres;
```

3. Enable pgvector extension:
```sql
\c researchmind
CREATE EXTENSION vector;
```

#### Install Redis
1. Download Redis for Windows from [GitHub](https://github.com/microsoftarchive/redis/releases)
2. Extract and run `redis-server.exe`
3. Verify: `redis-cli ping` (should return PONG)

#### Setup Python Environment
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install spaCy model
python -m spacy download en_core_web_sm
```

#### Configure Environment Variables
Edit `backend/.env`:
```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=researchmind
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key

# OAuth (Get from Google/GitHub developer console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend
FRONTEND_URL=http://localhost:5173

# AWS S3 (or use MinIO for local development)
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_STORAGE_BUCKET_NAME=researchmind-papers
AWS_S3_ENDPOINT_URL=http://localhost:9000
```

#### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser
```bash
python manage.py createsuperuser
```

#### Start Django Server
```bash
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

#### Start Celery Worker (New Terminal)
```bash
cd backend
venv\Scripts\activate
celery -A researchmind worker -l info
```

#### Start Celery Beat (New Terminal)
```bash
cd backend
venv\Scripts\activate
celery -A researchmind beat -l info
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Edit .env file with:
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔐 OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:8000/api/auth/github/callback`
4. Copy Client ID and Secret to `.env`

---

## 📁 Project Structure

```
AI ML/
├── backend/
│   ├── researchmind/          # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── asgi.py
│   ├── users/                 # User authentication
│   │   ├── models.py
│   │   ├── views.py
│   │   └── serializers.py
│   ├── papers/                # Paper management
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── tasks.py           # Celery tasks
│   │   └── processors/        # PDF processing
│   ├── chat/                  # Chat functionality
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── consumers.py       # WebSocket
│   │   └── services/          # RAG pipeline
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── pages/             # React pages
    │   ├── components/        # Reusable components
    │   ├── services/          # API integration
    │   ├── hooks/             # React Query hooks
    │   └── contexts/          # Global state
    ├── package.json
    └── vite.config.ts
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "localhost refused to connect"**
- Ensure Django server is running: `python manage.py runserver`
- Check if port 8000 is available

**Error: "No module named 'pgvector'"**
```bash
pip install pgvector
```

**Error: "connection to server failed"**
- Ensure PostgreSQL is running
- Check database credentials in `.env`

**Error: "Redis connection refused"**
- Start Redis server: `redis-server`
- Check Redis is running: `redis-cli ping`

### Frontend Issues

**Error: "Failed to resolve import"**
```bash
cd frontend
npm install
```

**Error: "CORS policy blocked"**
- Ensure Django CORS settings allow `http://localhost:5173`
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`

**Error: "WebSocket connection failed"**
- Ensure Django Channels is configured
- Check Redis is running
- Verify WebSocket URL in `.env`

---

## 📊 Database Schema

### Users
- id, email, username, password
- google_id, github_id, avatar_url
- created_at, updated_at

### Papers
- id, user_id, title, authors[], abstract
- file_url, arxiv_id, status
- content_hash, metadata
- uploaded_at, processed_at

### DocumentChunks
- id, paper_id, text, embedding (vector)
- section, page_number, token_count, chunk_index

### ChatSessions
- id, user_id, title
- created_at, updated_at

### ChatMessages
- id, session_id, role, content
- paper_ids[], created_at

### Citations
- id, citing_paper_id, cited_paper_id
- cited_title, context, doi, arxiv_id

---

## 🔄 Development Workflow

1. **Start Services**
   - PostgreSQL
   - Redis
   - Django server
   - Celery worker
   - Frontend dev server

2. **Make Changes**
   - Backend: Edit Python files
   - Frontend: Edit React components
   - Hot reload enabled for both

3. **Test Changes**
   - Backend: `python manage.py test`
   - Frontend: Check browser console

4. **Commit**
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```

---

## 🚢 Production Deployment

### Backend (Django)
```bash
# Install production dependencies
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn researchmind.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (React)
```bash
# Build for production
npm run build

# Serve with nginx or deploy to Vercel/Netlify
```

### Docker Deployment
```bash
docker-compose up -d
```

---

## 📚 API Documentation

Once backend is running, visit:
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **Admin Panel**: `http://localhost:8000/admin/`

---

## 🎯 Features Checklist

### Authentication
- [x] Google OAuth
- [x] GitHub OAuth
- [x] JWT tokens
- [x] Protected routes

### Paper Management
- [x] PDF upload
- [x] arXiv import
- [x] Status tracking
- [x] Content deduplication

### Chat System
- [x] WebSocket streaming
- [x] RAG pipeline
- [x] Session management
- [x] Multi-paper context

### Visualizations
- [x] Citation graphs (D3.js)
- [x] Topic clustering
- [x] Force-directed layouts

### Background Processing
- [x] Celery tasks
- [x] PDF extraction
- [x] Embedding generation
- [x] Vector search

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review error logs
3. Check browser console (F12)
4. Verify all services are running

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
SECRET_KEY=              # Django secret key
DEBUG=                   # True/False
ALLOWED_HOSTS=           # Comma-separated hosts
DB_NAME=                 # PostgreSQL database name
DB_USER=                 # PostgreSQL username
DB_PASSWORD=             # PostgreSQL password
DB_HOST=                 # PostgreSQL host
DB_PORT=                 # PostgreSQL port
REDIS_URL=               # Redis connection URL
OPENAI_API_KEY=          # OpenAI API key
GOOGLE_CLIENT_ID=        # Google OAuth client ID
GOOGLE_CLIENT_SECRET=    # Google OAuth secret
GITHUB_CLIENT_ID=        # GitHub OAuth client ID
GITHUB_CLIENT_SECRET=    # GitHub OAuth secret
FRONTEND_URL=            # Frontend URL for CORS
AWS_ACCESS_KEY_ID=       # S3/MinIO access key
AWS_SECRET_ACCESS_KEY=   # S3/MinIO secret key
AWS_STORAGE_BUCKET_NAME= # S3/MinIO bucket name
AWS_S3_ENDPOINT_URL=     # S3/MinIO endpoint
```

### Frontend (.env)
```env
VITE_API_BASE_URL=       # Backend API URL
VITE_WS_BASE_URL=        # WebSocket URL
```

---

**Built with ❤️ for researchers**
