@echo off
echo Setting up ResearchMind Frontend...
echo.

cd frontend

echo Installing dependencies...
call npm install

echo.
echo Setup complete!
echo.
echo Starting development server...
call npm run dev
