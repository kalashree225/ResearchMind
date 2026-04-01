@echo off
echo Setting up ResearchMind Backend...
echo.

cd backend

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Creating superuser (optional - press Ctrl+C to skip)...
python manage.py createsuperuser --noinput --email admin@example.com 2>nul

echo.
echo Setup complete!
echo.
echo Starting development server...
python manage.py runserver
