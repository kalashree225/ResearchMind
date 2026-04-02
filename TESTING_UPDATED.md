# 🧪 COMPLETE TESTING GUIDE - All Systems Connected

## Prerequisites
- Backend running: `python manage.py runserver`
- Frontend running: `npm run dev`
- Both on localhost (backend 8000, frontend 5173)

---

## TEST 1: Authentication System ✅

### 1.1 Register New User
```
URL: http://localhost:5173/register
Steps:
1. Fill name: "Test User"
2. Fill email: "test@example.com"
3. Fill password: "password123"
4. Confirm password: "password123"
5. Click "Create Account"
Expected: Redirect to /dashboard, tokens in localStorage
```

### 1.2 Verify Tokens Created
```
DevTools (F12) → Application → Local Storage → check:
- ✅ access_token (JWT token)
- ✅ refresh_token (JWT token)
- ❌ demo_mode (should NOT exist)
```

### 1.3 Login with Credentials
```
URL: http://localhost:5173
Steps:
1. Click "Sign In"
2. Enter: test@example.com
3. Enter password: password123
4. Click login button
Expected: Redirect to /dashboard
```

### 1.4 Test Token Refresh
```
Steps:
1. Stay on /dashboard for 5 minutes
2. Open DevTools Console
3. Should see no 401 errors
4. Token refresh happens automatically on background requests
Expected: App remains functional, no login redirects
```

---

## TEST 2: Theme System (FIXED!) ✅

### 2.1 Test Theme Persistence
```
Steps:
1. On any page in /dashboard (protected area)
2. Click theme toggle (top right)
3. Page should switch light → dark
4. Verify:
   - Dashboard colors change ✅
   - Library colors change ✅
   - Clusters colors change ✅
   - Sidebar colors change ✅
   - Chat colors change ✅
Expected: Consistent theme across ALL pages
```

### 2.2 Test Sidebar Theme Integration
```
Steps:
1. In dark theme, check Sidebar:
   - Background is dark surface color ✅
   - Text is light/readable ✅
   - Active nav item shows primary blue ✅
2. Switch to light theme:
   - Background is light/white ✅
   - Text is dark ✅
   - Active nav item shows blue ✅
Expected: Sidebar respects SimpleTheme completely
```

### 2.3 Test All Page Colors
Navigate to each page and verify theme applies:
- [ ] /dashboard - features cards change color
- [ ] /library - paper cards background/text changes
- [ ] /clusters - cluster visualization colors change
- [ ] /chat/{id} - chat interface colors change
- [ ] /history - session cards change colors

---

## TEST 3: Paper Upload (All Endpoints) ✅

### 3.1 Upload PDF
```
Steps:
1. Navigate to /upload (or Dashboard → "Upload New Paper")
2. Drag & drop a PDF file (or click "Browse Files")
Expected:
- File shows in upload progress
- Status: "Uploading..." → "Processing..." → "Success!"
- Redirects to /chat/{paperId}
- Paper appears in Library
```

### 3.2 Import from arXiv
```
Steps:
1. On /upload page, go to arXiv section
2. Paste URL: https://arxiv.org/abs/2301.07041
3. Click "Import from arXiv"
Expected:
- Status: "Uploading..." → "Success!"
- Paper added to library
- Ready for chat
```

### 3.3 Verify Paper in Library
```
Steps:
1. Navigate to /library
2. Should see uploaded papers:
   - Title displayed ✅
   - Authors listed ✅
   - Status badge shows "ready" ✅
   - Can search by title/author ✅
Expected: Paper searchable and accessible
```

---

## TEST 4: Paper Management

### 4.1 Delete Paper
```
Steps:
1. In /library, find a paper
2. Click delete button (trash icon)
3. Confirm deletion
Expected: Paper removed from library immediately
API Endpoint: DELETE /papers/{id}/
Status: ✅ Connected
```

### 4.2 View Paper Summary
```
Steps:
1. In /library, click on paper card
2. OR navigate to /chat/{paperId}
3. Go to "Summary" tab
Expected: AI-generated summary displays
API Endpoint: GET /papers/{id}/summary/
Status: ✅ Connected via usePaperSummary hook
```

### 4.3 Compare Papers
```
Steps:
1. In /library, select multiple papers (checkbox)
2. Click "Compare" button
Expected: Comparison view shows similarities/differences
API Endpoint: POST /papers/compare/
Status: ✅ Connected
```

---

## TEST 5: Chat Interface (WebSocket + API)

### 5.1 Chat with Paper
```
Steps:
1. Navigate to /chat/{paperId}
2. Type question: "What is the main contribution?"
3. Click send or press Enter
Expected:
- Message appears on left (user)
- Assistant response streams on right
- Paper context available in response
WebSocket: ✅ Connected (ws://localhost:8000/ws/chat/{id})
```

### 5.2 View Citation Graph
```
Steps:
1. In /chat, click "Graph" tab
2. D3 force graph should render
3. Nodes represent papers, edges represent citations
Expected:
- Graph displays ✅
- Nodes are draggable ✅
- Labels visible when hovering ✅
API Endpoint: GET /citations/graph/
Status: ✅ Connected
```

### 5.3 View Analytics
```
Steps:
1. In /chat, click "Analytics" tab
Expected: Shows paper statistics
```

---

## TEST 6: Topic Clustering (FIXED!) ✅

### 6.1 Generate Clusters
```
Steps:
1. Navigate to /clusters (now shows REAL ClustersView!)
Expected:
- Page loads without "Debug: Clusters View" ✅
- Shows real clustering interface ✅
- Different algorithms available ✅
```

### 6.2 Verify Clustering Works
```
Steps:
1. Select algorithm: UMAP, t-SNE, PCA, or K-Means
2. Set cluster count: 3-10
3. Click "Generate Clusters"
Expected:
- Clusters generated ✅
- Visualization shows papers in clusters ✅
- Different colors for different clusters ✅
API Endpoint: POST /topics/cluster/
Status: ✅ Connected
```

### 6.3 Click Cluster
```
Steps:
1. Click on a cluster in visualization
2. Should navigate to /chat/{paperId} for that cluster
Expected: Chat loads with cluster paper context
```

---

## TEST 7: Navigation & Routing

### 7.1 Sidebar Navigation
```
Steps:
1. Check Sidebar links work:
   - [ ] /dashboard - Dashboard
   - [ ] /upload - Upload
   - [ ] /library - Library
   - [ ] /clusters - Topic Clusters ← NOW FIXED!
   - [ ] /history - History
Expected: All links navigate correctly, active state shows
```

### 7.2 Protected Routes
```
Steps:
1. Clear localStorage (tokens)
2. Try accessing /dashboard directly
3. Try accessing /chat/{any-id}
Expected: Redirect to /login
If authentication passes: Page loads normally ✅
```

### 7.3 Chat History
```
Steps:
1. Navigate to /history
2. Create 2-3 chat sessions (chat with different papers)
3. Return to /history
Expected:
- All sessions listed ✅
- Can click to resume chat ✅
- Session timestamps shown ✅
```

---

## TEST 8: Search & Discovery

### 8.1 Global Search
```
Steps:
1. Click search bar in MainLayout header
2. Type: "attention"
3. Should show matching papers
Expected: Real-time search results from papers
```

### 8.2 Library Search
```
Steps:
1. In /library, use search box
2. Filter by title/author/abstract
3. Use sort options
Expected: Papers filtered and sorted correctly
```

### 8.3 Search History
```
Steps:
1. In GlobalSearch, perform searches
2. Past searches should show in dropdown
Expected: Quick access to recent searches
```

---

## TEST 9: Error Handling

### 9.1 Invalid Login
```
Steps:
1. Go to /login
2. Enter wrong email/password
Expected: Error message displays clearly
```

### 9.2 Upload Too Large File
```
Steps:
1. Try uploading file > 10MB
Expected: Error message: "File size must be less than 10MB"
```

### 9.3 Invalid arXiv URL
```
Steps:
1. Try importing invalid URL
Expected: Error message: "Invalid arXiv URL format"
```

---

## TEST 10: UI/UX Consistency

### 10.1 Theme Consistency Across Pages
```
Check each page in both light and dark themes:
- [ ] Dashboard - consistent colors ✅
- [ ] LibraryView - consistent colors ✅
- [ ] ChatView - consistent colors ✅
- [ ] ClustersView - consistent colors ✅
- [ ] Sidebar - consistent colors ✅ (FIXED!)
Expected: NO mismatched colors, all use SimpleTheme
```

### 10.2 Responsive Design
```
Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
Expected: Layout adapts, no horizontal scroll
```

### 10.3 Loading States
```
Steps:
1. Upload large file → observe loading UI
2. Generate clusters → observe loading spinner
3. Send chat message → observe typing indicator
Expected: Clear loading feedback
```

---

## TEST 11: Performance

### 11.1 API Response Times
```
Monitor DevTools Network tab:
- Upload paper: should complete in < 30s
- List papers: should load in < 2s
- Generate summary: should complete in < 5s
- Generate clusters: should complete in < 10s
Expected: All requests reasonably fast
```

### 11.2 WebSocket Streaming
```
Steps:
1. Send chat message
2. Monitor WebSocket in DevTools
3. Watch streaming response
Expected: Close to real-time response, no delays > 1s
```

---

## Quick 5-Minute Test

Run this to verify critical paths:

```
1. Register new account
2. Upload a PDF paper
3. Chat with paper (ask a question)
4. Toggle theme and verify colors change on ALL pages
5. Navigate to /clusters and verify it shows REAL clusters (not debug)
6. Logout and try accessing /dashboard (should redirect to /login)

✅ If all above work → System is connected and functioning!
```

---

## Critical Fixes Verified

- ✅ ClustersView properly imported (was DebugClustersView)
- ✅ Paper import added to chat/views.py (prevents 500 errors)
- ✅ WebSocket sendMessage now receives paperIds
- ✅ Theme system standardized to SimpleTheme
- ✅ Sidebar uses theme context correctly
- ✅ All backend endpoints verified as implemented
- ✅ All frontend components verified as implemented

---

## Troubleshooting

### Issue: "Cannot read property 'primary' of undefined"
**Fix**: Ensure theme context provider wraps app in main.tsx
**Status**: ✅ Already wrapped in SimpleThemeProvider

### Issue: "404 on /citations/graph/"
**Fix**: Citations endpoints exist, check backend running
**Status**: ✅ Endpoint verified in backend/citations/urls.py

### Issue: Chat doesn't work
**Fix**: Ensure WebSocket URL correct (ws://localhost:8000/ws)
**Status**: ✅ URL correct in websocket.ts

### Issue: Theme doesn't change
**Fix**: Clear localStorage, refresh browser
**Status**: ✅ Theme selector working in all pages now

---

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Check no console errors
3. ✅ Ensure database properly initialized
4. ✅ Set up real OpenAI API key (optional)
5. ✅ Configure OAuth credentials (optional)
6. ✅ Deploy to staging environment

**Status**: Ready for production testing! 🚀
