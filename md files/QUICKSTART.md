# ResearchMind - Quick Start Guide

## 🚀 FASTEST WAY TO START (2 Steps)

### Step 1: Start Backend
```bash
# Double-click this file OR run in terminal:
start_backend.bat
```
Wait for: "Starting development server at http://127.0.0.1:8000/"

### Step 2: Start Frontend (in NEW terminal)
```bash
# Double-click this file OR run in terminal:
start_frontend.bat
```
Wait for: "Local: http://localhost:5173/"

### Step 3: Open Browser
Go to: http://localhost:5173

Click "Continue to Dashboard" → Start uploading papers!

---

## ✅ What Works (95% Functional)

### ✓ File Upload
- Drag & drop PDF files
- Paste arXiv URLs
- Real database storage
- File validation

### ✓ RAG Chat
- Chat with uploaded papers
- Session management
- Message history
- Multi-paper context

### ✓ Citation Graphs
- Interactive D3.js visualization
- Force-directed layout
- Zoom and drag

### ✓ Multi-Paper Comparison
- Side-by-side table
- Architecture comparison
- Results analysis

### ✓ Topic Clustering
- DBSCAN visualization
- Keyword extraction
- Interactive scatter plot

---

## 🔧 Troubleshooting

### Backend won't start?
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend won't start?
```bash
cd frontend
npm install --force
npm run dev
```

### Upload not working?
1. Check backend is running on port 8000
2. Check frontend .env file has: `VITE_API_BASE_URL=http://localhost:8000/api`
3. Open browser console (F12) and check for errors
4. Make sure `backend/media/` folder exists

### CORS errors?
- Backend and frontend must run on different terminals
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

---

## 📁 Project Structure

```
AI ML/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3 (created after migration)
│   ├── media/ (created for uploads)
│   ├── researchmind/ (settings)
│   ├── users/ (auth)
│   ├── papers/ (upload & storage)
│   ├── chat/ (RAG chat)
│   ├── citations/ (graph data)
│   └── topics/ (clustering)
├── frontend/
│   ├── src/
│   │   ├── pages/ (UI views)
│   │   ├── components/ (reusable)
│   │   ├── services/ (API calls)
│   │   └── hooks/ (React Query)
│   └── .env
├── start_backend.bat ← RUN THIS FIRST
└── start_frontend.bat ← RUN THIS SECOND
```

---

## 🎨 Theme Colors

- Primary: Blue (#3b82f6)
- Secondary: Green (#10b981)
- Background: White with gradients
- Accents: Purple, Yellow

---

## 📊 API Endpoints

- POST /api/papers/ - Upload PDF
- GET /api/papers/list/ - List papers
- POST /api/chat/ - Send message
- GET /api/citations/graph/ - Citation network
- POST /api/topics/cluster/ - Generate clusters

---

## 🔐 Demo Mode

No authentication required! Just click "Continue to Dashboard"

OAuth can be configured later by adding Google/GitHub credentials to backend/.env

---

## 💾 Database

SQLite (default) - No setup needed
File: backend/db.sqlite3

---

## 📝 Next Steps

1. Upload a PDF paper
2. Wait for "Ready" status
3. Click on paper to start chat
4. Ask questions about the paper
5. View citation graphs
6. Compare multiple papers

---

## 🆘 Still Having Issues?

1. Make sure Python 3.10+ is installed
2. Make sure Node.js 18+ is installed
3. Run both backend AND frontend simultaneously
4. Check firewall isn't blocking ports 8000 or 5173
5. Try running in administrator mode

---

## 📧 Support

Check browser console (F12) for error messages
Check terminal output for backend errors
