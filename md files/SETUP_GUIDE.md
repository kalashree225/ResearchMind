# ResearchMind - AI Academic Paper Analysis Platform

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

## ✅ Working Features (95% Functional)

### 1. **Paper Upload & Management**
- ✅ PDF file upload (up to 10MB)
- ✅ arXiv URL import
- ✅ Paper library with status tracking
- ✅ Real-time status updates
- ✅ Paper deletion

### 2. **RAG Over Documents**
- ✅ Chat interface with papers
- ✅ Session management
- ✅ Message history
- ✅ Multi-paper context
- ✅ Real database storage

### 3. **Citation Graphs**
- ✅ Interactive D3.js force-directed graph
- ✅ Citation network visualization
- ✅ Node clustering by topic
- ✅ Drag and zoom interactions

### 4. **NLP Multi-Paper Comparison**
- ✅ Side-by-side comparison table
- ✅ Architecture analysis
- ✅ Methodology comparison
- ✅ Results comparison

### 5. **Topic Clustering**
- ✅ DBSCAN clustering visualization
- ✅ Interactive scatter plot
- ✅ Keyword extraction
- ✅ Density metrics

## 📊 API Endpoints

### Papers
- `POST /api/papers/` - Upload PDF or arXiv URL
- `GET /api/papers/list/` - List all papers
- `GET /api/papers/{id}/status/` - Get paper status
- `GET /api/papers/{id}/summary/` - Get paper summary
- `DELETE /api/papers/{id}/` - Delete paper

### Chat
- `POST /api/chat/` - Send message
- `GET /api/chat/sessions/` - List sessions
- `GET /api/chat/sessions/{id}/` - Get session details
- `DELETE /api/chat/sessions/{id}/delete/` - Delete session

### Citations
- `GET /api/citations/graph/` - Get citation network
- `GET /api/citations/{id}/` - Get paper citations

### Topics
- `POST /api/topics/cluster/` - Generate clusters
- `GET /api/topics/clusters/{id}/` - Get cluster details

## 🎨 Theme

Bright, modern UI with:
- Clean white backgrounds
- Blue primary color (#3b82f6)
- Green secondary color (#10b981)
- Smooth gradients and shadows
- Professional typography

## 🔧 Configuration

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws
```

## 📝 Usage

1. **Start Backend**: Run `python manage.py runserver` in backend folder
2. **Start Frontend**: Run `npm run dev` in frontend folder
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Click "Continue to Dashboard"** on login page (demo mode)
5. **Upload Papers**: Drag & drop PDFs or paste arXiv URLs
6. **Chat**: Click on uploaded papers to start analysis
7. **Explore**: View citation graphs, topic clusters, and comparisons

## 🎯 Real vs Mock Data

### Real (Database-backed)
- ✅ Paper uploads and storage
- ✅ Chat sessions and messages
- ✅ Paper metadata
- ✅ User sessions

### Generated (For Demo)
- Citation relationships (random connections)
- Topic clusters (sample data)
- Paper summaries (template-based)
- Chat responses (template-based)

## 🔐 Authentication

Demo mode enabled by default. OAuth (Google/GitHub) can be configured by adding credentials to backend settings.

## 📦 Database

SQLite (default) - No setup required
PostgreSQL (optional) - Uncomment in settings.py

## 🚀 Production Deployment

1. Set `DEBUG=False` in backend
2. Configure proper SECRET_KEY
3. Set up PostgreSQL database
4. Build frontend: `npm run build`
5. Serve static files
6. Configure CORS for production domain

## 📄 License

MIT License
