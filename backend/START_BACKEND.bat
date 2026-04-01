@echo off
title ResearchMind Backend Server
color 0A
echo.
echo ========================================
echo   ResearchMind Backend Server
echo ========================================
echo.
echo Starting Django development server...
echo.
cd /d "%~dp0"
python manage.py runserver
echo.
echo Server stopped.
pause
