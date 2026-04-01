@echo off
echo ========================================
echo ResearchMind Frontend Setup
echo ========================================
echo.

cd frontend

if not exist "node_modules" (
    echo [1/2] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [1/2] Dependencies already installed
)

echo.
echo [2/2] Setup complete!
echo.
echo ========================================
echo Starting Vite dev server on port 5173...
echo ========================================
echo.
call npm run dev
