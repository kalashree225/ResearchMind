@echo off
color 0A
echo.
echo ========================================
echo    ResearchMind - Complete Setup
echo ========================================
echo.
echo This will set up both backend and frontend
echo.
pause

echo.
echo [BACKEND SETUP]
echo ========================================
cd backend

echo [1/6] Installing Python packages...
pip install Django==5.1.5 djangorestframework==3.15.2 djangorestframework-simplejwt==5.4.0 django-cors-headers==4.6.0 social-auth-app-django==5.4.2 python-dotenv==1.0.1 Pillow==11.1.0
if errorlevel 1 (
    echo ERROR: Failed to install Python packages
    pause
    exit /b 1
)

echo.
echo [2/6] Creating database migrations...
python manage.py makemigrations users
python manage.py makemigrations papers
python manage.py makemigrations chat

echo.
echo [3/6] Applying migrations...
python manage.py migrate

echo.
echo [4/6] Creating media directory...
if not exist "media\papers" mkdir media\papers

cd ..

echo.
echo [FRONTEND SETUP]
echo ========================================
cd frontend

echo [5/6] Installing Node packages...
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install Node packages
        pause
        exit /b 1
    )
) else (
    echo Node modules already installed
)

cd ..

echo.
echo [6/6] Setup complete!
echo.
echo ========================================
echo           SETUP SUCCESSFUL!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start_backend.bat
echo 2. Run: start_frontend.bat (in new terminal)
echo 3. Open: http://localhost:5173
echo.
echo Read QUICKSTART.md for detailed instructions
echo.
pause
