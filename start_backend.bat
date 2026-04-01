@echo off
echo ========================================
echo ResearchMind Backend Setup
echo ========================================
echo.

cd backend

echo [1/5] Installing Python dependencies...
pip install Django==5.1.5 djangorestframework==3.15.2 djangorestframework-simplejwt==5.4.0 django-cors-headers==4.6.0 social-auth-app-django==5.4.2 python-dotenv==1.0.1 Pillow==11.1.0
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Creating migrations...
python manage.py makemigrations users
python manage.py makemigrations papers
python manage.py makemigrations chat

echo.
echo [3/5] Running migrations...
python manage.py migrate

echo.
echo [4/5] Creating media directory...
if not exist "media" mkdir media

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo Starting Django server on port 8000...
echo ========================================
echo.
python manage.py runserver
