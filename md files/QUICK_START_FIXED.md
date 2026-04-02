# ResearchMind - Quick Start (Fixed Version)

## 🎯 What Was Fixed
- ✅ Blank dashboard issue resolved (overflow scrolling)
- ✅ Demo mode bypass removed (real authentication required)
- ✅ Mock data replaced with real API calls
- ✅ Disabled API routes re-enabled
- ✅ AI service using real paper content (not just templates)
- ✅ Better error handling
- ✅ Improved citation extraction

## 🚀 Running the Application

### 1. **Backend Setup & Start**
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start backend server
python manage.py runserver
```
**Backend runs on**: `http://localhost:8000`

### 2. **Frontend Setup & Start** (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
**Frontend runs on**: `http://localhost:5173`

### 3. **Open in Browser**
Navigate to: `http://localhost:5173`

## 📝 First Time Usage (Real Authentication Required)

1. **Create Account**: Click "Register" on login page
   - Email: `test@example.com`
   - Password: `testpassword123`

2. **Login**: Use your credentials

3. **Upload Papers**:
   - Click "Upload New Paper" on dashboard
   - Upload PDF or paste arXiv URL
   - Wait for processing

4. **Chat with Papers**:
   - Go to Library
   - Click on a paper
   - Chat about its content

5. **Search Papers**:
   - Use search bar at top
   - Finds your real uploaded papers

## 🔑 Key Changes You'll Notice

### Before (Demo Version)
- ❌ Demo mode bypassed login
- ❌ Hardcoded mock papers in library
- ❌ Search returned fake results
- ❌ AI responses were templates
- ❌ Blank dashboard

### After (Fixed Version)
- ✅ Real login required
- ✅ Only your uploaded papers shown
- ✅ Search finds real papers
- ✅ AI uses actual paper content
- ✅ Dashboard displays properly

## 🧪 Testing Key Features

### Test 1: Dashboard Appears
**Expected**: Dashboard loads with content visible (no blank screen)
```
If blank: Check browser console for errors in F12 DevTools
```

### Test 2: Upload Paper
**Expected**: Papers upload and appear in library
```
Drag PDF or paste arXiv URL → Paper appears in library with status
```

### Test 3: Real Search
**Expected**: Search only finds papers you uploaded
```
Search box finds your papers (not hardcoded results)
```

### Test 4: Authentication Works
**Expected**: Need login, demo mode doesn't bypass
```
Try accessing /dashboard without login → redirects to /login
```

### Test 5: Chat with Papers
**Expected**: Chat references your uploaded papers
```
Upload paper → Chat uses actual paper content (not templates)
```

## ⚠️ If You Get Errors

### Dashboard Blank?
```
Fix Applied: Changed overflow-hidden to overflow-auto
If still blank: Check SimpleThemeContext in browser console
```

### API Errors?
```
Ensure backend is running on http://localhost:8000
Check: http://localhost:8000/api/health/ (should return 200)
```

### Login Issues?
```
Demo mode is disabled - must use real credentials
Create account first via Register page
```

### Papers Don't Appear?
```
Ensure you uploaded papers while logged in
Check /api/papers/list/ endpoint
```

## 📊 API Endpoints (Now Working)

| Endpoint | Status |
|----------|--------|
| `/api/papers/` | ✅ Upload |
| `/api/papers/list/` | ✅ List papers |
| `/api/chat/` | ✅ Chat |
| `/api/citations/` | ✅ **Now Enabled** |
| `/api/topics/` | ✅ **Now Enabled** |

## 🔧 Configuration

### Backend (.env if needed)
```
SECRET_KEY=your-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env if needed)
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws
```

## 📚 Understanding the Fixes

### Why Dashboard Was Blank
- MainLayout had `overflow-hidden` which cut off content
- Fixed by allowing overflow scrolling

### Why Mock Data Was Used
- LibraryView defined mockPapers but didn't use real papers hook
- Fixed by using API-fetched papers instead

### Why Search Didn't Work
- GlobalSearch had hardcoded results not connected to backend
- Fixed by making real API calls

### Why Authentication Was Bypassed
- ProtectedRoute allowed demo_mode to skip login check
- Fixed by removing all demo mode exceptions

### Why AI Responses Were Generic
- simple_ai_service had template methods (_demo_*)
- Fixed by extracting real content from paper chunks

## ✅ Verification Checklist

After starting both servers:
- [ ] Frontend loads without errors
- [ ] Dashboard shows content (not blank)
- [ ] Can access login page
- [ ] Can create account and login
- [ ] Can upload papers
- [ ] Papers appear in library
- [ ] Search finds papers
- [ ] Chat works with papers
- [ ] No demo mode bypass available

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs appear in terminal where you ran 'python manage.py runserver'
# Frontend logs appear in terminal where you ran 'npm run dev'
# Browser console (F12) shows frontend errors
```

### Common Issues
1. **"Cannot GET /"** → Make sure frontend is running on port 5173
2. **"Connection refused"** → Backend not running on 8000
3. **Blank dashboard** → Browser cache, try Ctrl+Shift+R to hard refresh
4. **Papers not appearing** → Must be logged in when uploading

## 🎉 You're All Set!

The application is now using real data, real authentication, and real paper analysis instead of mocks and templates.

**Next Steps**:
1. Run both servers
2. Create account
3. Upload some papers
4. Chat with them
5. Browse library

For full implementation details, see: `COMPREHENSIVE_FIXES.md`
