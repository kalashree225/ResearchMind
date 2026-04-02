# OAuth Setup Guide

## Current Status
✅ OAuth is **optional** - you can skip it and use demo mode
✅ App works without OAuth configuration

## To Enable Google OAuth (Optional)

### 1. Go to Google Cloud Console
https://console.cloud.google.com/

### 2. Create a New Project
- Click "Select a project" → "New Project"
- Name: "ResearchMind"
- Click "Create"

### 3. Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click "Enable"

### 4. Create OAuth Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- Application type: "Web application"
- Name: "ResearchMind Web Client"

### 5. Configure Authorized URLs
**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:8000
```

**Authorized redirect URIs:**
```
http://localhost:8000/complete/google-oauth2/
```

### 6. Copy Credentials
- Copy "Client ID"
- Copy "Client Secret"

### 7. Update backend/.env
```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 8. Restart Backend
```bash
cd backend
python manage.py runserver
```

---

## To Enable GitHub OAuth (Optional)

### 1. Go to GitHub Developer Settings
https://github.com/settings/developers

### 2. Create New OAuth App
- Click "New OAuth App"
- Application name: "ResearchMind"
- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:8000/complete/github/`

### 3. Copy Credentials
- Copy "Client ID"
- Click "Generate a new client secret"
- Copy "Client Secret"

### 4. Update backend/.env
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 5. Restart Backend
```bash
cd backend
python manage.py runserver
```

---

## Testing OAuth

1. Visit http://localhost:5173/login
2. Click "Continue with Google" or "Continue with GitHub"
3. Authorize the app
4. You'll be redirected to the dashboard

---

## Demo Mode (No OAuth Needed)

1. Visit http://localhost:5173/login
2. Click "Skip for now (Demo Mode)"
3. Access the dashboard directly

---

## Troubleshooting

**Error: "invalid_client"**
- Check Client ID and Secret are correct
- Verify redirect URIs match exactly
- Make sure OAuth is enabled in Google Cloud Console

**Error: "redirect_uri_mismatch"**
- Add `http://localhost:8000/complete/google-oauth2/` to authorized redirect URIs

**OAuth buttons disabled**
- This is normal - OAuth is not configured
- Use "Skip for now" button to access demo mode

---

**OAuth is completely optional for development!**
