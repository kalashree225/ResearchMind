@echo off
echo Starting ResearchMind Backend...
cd /d "%~dp0"
python manage.py runserver
pause
