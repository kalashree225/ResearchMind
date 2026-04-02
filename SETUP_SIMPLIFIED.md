# ResearchMind - Simplified Setup Guide

## 🚀 SUPER SIMPLE SETUP (No PostgreSQL, No Redis, No Celery)

### Prerequisites
- Python 3.8+ 
- Node.js 16+

### Backend Setup (2 minutes)
```bash
cd backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (simplified)
pip install Django==5.1.5 djangorestframework==3.15.2 djangorestframework-simplejwt==5.4.0 django-cors-headers==4.6.0 python-dotenv==1.0.1 PyPDF2==3.0.1 openai==1.57.0 requests==2.32.3 urllib3==2.2.3

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend Setup (2 minutes)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### That's it! 🎉

Open http://localhost:5173 and click "Try Demo" to start using the app.

## ✅ What Works Now

- ✅ **PDF Upload** - Drag & drop PDF files 
- ✅ **arXiv Import** - Paste arXiv URLs
- ✅ **SQLite Database** - No setup required
- ✅ **Synchronous Processing** - No Redis/Celery needed
- ✅ **HTTP Chat** - Real-time chat via HTTP (no WebSockets)
- ✅ **Demo Mode** - No authentication required

## 🔧 Configuration (Optional)

Edit `backend/.env` to add your OpenAI API key for better AI features:
```env
OPENAI_API_KEY=your-actual-openai-api-key
```

## 📁 Simplified Architecture

```
ResearchMind (Simplified)
├── Backend (Django + SQLite)
│   ├── PDF Processing (PyPDF2)
│   ├── AI Integration (OpenAI)
│   └── HTTP API (REST)
└── Frontend (React + Vite)
    ├── File Upload Interface
    ├── Chat Interface (HTTP)
    └── Dashboard
```

## 🚫 What We Removed

- ❌ PostgreSQL → ✅ SQLite (no setup)
- ❌ Redis → ✅ Python memory (no setup)
- ❌ Celery → ✅ Synchronous processing
- ❌ WebSockets → ✅ HTTP polling
- ❌ Social Auth → ✅ Demo mode
- ❌ Complex dependencies → ✅ Minimal setup

## 🐛 Troubleshooting

### Backend Issues?
```bash
# Check Django setup
python manage.py check

# Check database
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### Frontend Issues?
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port availability
npm run dev
```

### PDF Upload Not Working?
1. Check backend is running on port 8000
2. Check `backend/media/` folder exists
3. Open browser console (F12) for errors

## 📊 API Endpoints

- `POST /api/papers/` - Upload PDF or arXiv URL
- `GET /api/papers/list/` - List all papers  
- `POST /api/chat/` - Send chat message
- `GET /api/papers/{id}/summary` - Get paper summary

## 💾 Database

- **Type**: SQLite
- **Location**: `backend/db.sqlite3`
- **Setup**: Automatic (no configuration needed)

## 🎯 Next Steps

1. Upload a PDF paper
2. Wait for processing
3. Start chatting with your paper
4. Generate summaries and insights

**Total setup time: ~5 minutes** 🚀
