# ResearchMind Frontend - Complete Integration Guide

React + TypeScript + Vite frontend for ResearchMind AI Academic Paper Chatbot.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx          # Public landing page
│   ├── auth/
│   │   ├── LoginPage.tsx        # Sign in page
│   │   └── RegisterPage.tsx     # Sign up page
│   ├── Dashboard.tsx            # Upload papers
│   ├── ChatView.tsx             # Chat with papers
│   ├── HistoryView.tsx          # Chat history
│   ├── LibraryView.tsx          # Papers library
│   └── ClustersView.tsx         # Topic clustering
├── components/
│   ├── Layout/
│   │   ├── MainLayout.tsx       # App layout wrapper
│   │   └── Sidebar.tsx          # Navigation sidebar
│   └── ProtectedRoute.tsx       # Auth guard
├── services/
│   ├── api.ts                   # Axios config + JWT
│   ├── auth.ts                  # Authentication
│   ├── papers.ts                # Paper management
│   ├── chat.ts                  # Chat sessions
│   ├── citations.ts             # Citation graphs
│   ├── topics.ts                # Topic clustering
│   └── websocket.ts             # Real-time chat
├── hooks/
│   ├── usePapers.ts             # Paper queries
│   ├── useChat.ts               # Chat queries
│   ├── useCitations.ts          # Citation queries
│   └── useTopics.ts             # Clustering queries
└── contexts/
    └── AuthContext.tsx          # Global auth state
```

---

## 🔐 Authentication Flow

### Pages
- **Landing** (`/`) - Public homepage
- **Login** (`/login`) - Sign in
- **Register** (`/register`) - Sign up
- **Protected Routes** - Require authentication:
  - `/dashboard` - Upload papers
  - `/chat/:id` - Chat interface
  - `/history` - Chat sessions
  - `/library` - Papers library
  - `/clusters` - Topic visualization

### JWT Token Management
- Tokens stored in `localStorage`
- Automatic refresh on 401 errors
- Redirect to login on auth failure

---

## 🎨 Features Implemented

### ✅ Authentication
- Landing page with hero section
- Login with email/password
- Registration with validation
- Password strength indicator
- Protected routes with auth guard
- JWT token refresh
- Logout functionality

### ✅ Paper Management
- Drag & drop PDF upload
- arXiv URL import
- Real-time status polling
- Processing progress tracking
- Paper library with filters
- Status indicators (uploading, processing, ready, failed)

### ✅ Chat System
- WebSocket streaming responses
- Real-time message updates
- Session management
- Message history
- Multi-paper context

### ✅ Visualizations
- D3.js citation graphs
- Force-directed layouts
- Topic clustering scatter plots
- Interactive network exploration

### ✅ UI/UX
- Framer Motion animations
- Glass morphism design
- Dark theme
- Responsive layout
- Loading states
- Error handling

---

## 🔌 Backend API Requirements

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
```

### Paper Endpoints
```
POST   /api/papers/              # Upload PDF or arXiv
GET    /api/papers/              # List papers
GET    /api/papers/{id}/status   # Get status
GET    /api/papers/{id}/summary  # Get summary
DELETE /api/papers/{id}          # Delete paper
```

### Chat Endpoints
```
POST   /api/chat/                # Send message
GET    /api/chat/sessions/       # List sessions
GET    /api/chat/sessions/{id}   # Get session
DELETE /api/chat/sessions/{id}   # Delete session
WS     /ws/chat/{session_id}/    # WebSocket stream
```

### Analysis Endpoints
```
GET  /api/citations/graph        # Citation network
POST /api/topics/cluster          # Generate clusters
GET  /api/topics/clusters/{id}   # Cluster details
```

---

## 📊 Data Models

### Paper
```typescript
{
  id: string;
  title: string;
  authors: string[];
  abstract?: string;
  file_url?: string;
  arxiv_id?: string;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  uploaded_at: string;
  processed_at?: string;
  content_hash?: string;
  metadata?: any;
}
```

### ChatSession
```typescript
{
  id: string;
  title: string;
  created_at: string;
  papers: Array<{ id: string; title: string }>;
  messages?: ChatMessage[];
}
```

### ChatMessage
```typescript
{
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  paper_ids?: string[];
  created_at?: string;
}
```

---

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Tech Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 8** - Build tool
- **React Query** - Server state
- **Axios** - HTTP client
- **React Router** - Routing
- **Framer Motion** - Animations
- **D3.js** - Visualizations
- **Tailwind CSS** - Styling

---

## 🐛 Troubleshooting

### CORS Errors
Ensure Django CORS settings allow `http://localhost:5173`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### WebSocket Connection Fails
- Check Django Channels configuration
- Verify WebSocket URL in `.env`
- Ensure Redis is running

### API Calls Fail
- Verify backend is running on `http://localhost:8000`
- Check API base URL in `.env`
- Inspect network tab for errors

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT token format
- Verify token expiry settings

---

## 🚢 Production Build

```bash
npm run build
```

Output in `dist/` directory. Serve with:
```bash
npm run preview
```

Or deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Docker container

---

## 📝 Environment Variables

```bash
# Required
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Optional
VITE_APP_NAME=ResearchMind
VITE_MAX_FILE_SIZE=10485760  # 10MB
```

---

## 🎯 Next Steps

1. **Start Django backend** on port 8000
2. **Run frontend** with `npm run dev`
3. **Visit** `http://localhost:5173`
4. **Register** a new account
5. **Upload** a research paper
6. **Chat** with your papers!

---

## 📚 Additional Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [D3.js Gallery](https://d3-graph-gallery.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Built with ❤️ for researchers**
