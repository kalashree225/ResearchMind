# ResearchMind - START HERE

## The error "localhost refused to connect" means the backend isn't running.

## Quick Start (2 steps):

### Step 1: Start Backend
Open a terminal and run:
```bash
cd "c:\Users\Development\Desktop\AI ML\backend"
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Step 2: Start Frontend
Open ANOTHER terminal and run:
```bash
cd "c:\Users\Development\Desktop\AI ML\frontend"
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

### Step 3: Open Browser
Visit: http://localhost:5173

---

## If Backend Fails to Start

### Error: "No module named 'rest_framework'"
```bash
cd backend
pip install djangorestframework django-cors-headers djangorestframework-simplejwt social-auth-app-django python-dotenv
```

### Error: "No such file or directory: 'db.sqlite3'"
```bash
cd backend
python manage.py migrate
```

### Error: Port 8000 already in use
```bash
# Kill the process or use different port
python manage.py runserver 8001
# Then update frontend .env:
# VITE_API_BASE_URL=http://localhost:8001/api
```

---

## If Frontend Fails to Start

### Error: "Cannot find module"
```bash
cd frontend
npm install
```

### Error: Port 5173 already in use
The dev server will automatically use next available port (5174, 5175, etc.)

---

## Verify Everything Works

1. Backend running: Visit http://localhost:8000/admin (should see Django admin)
2. Frontend running: Visit http://localhost:5173 (should see landing page)
3. API working: Visit http://localhost:8000/api/auth/me/ (should see 401 error - this is correct!)

---

## Current Status

✅ Frontend: 100% Complete
✅ Backend: Basic structure ready
✅ Database: SQLite configured (no PostgreSQL needed for testing)
✅ Models: User, Paper, Chat created
✅ OAuth: Google & GitHub configured (needs API keys)

⏳ To Add Later:
- PDF processing
- OpenAI integration
- Vector embeddings
- Celery tasks

---

## Need Help?

1. Make sure you're in the correct directory
2. Check both terminals are running
3. Look for error messages in the terminal
4. Try refreshing the browser

---

**Both servers MUST be running at the same time!**
