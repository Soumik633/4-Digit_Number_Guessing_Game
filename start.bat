@echo off
echo ========================================================
echo        Starting Number Hunt (Backend + Frontend)
echo ========================================================

set "BACKEND_DIR=%~dp0backend"
set "FRONTEND_DIR=%~dp0frontend"
if not exist "%BACKEND_DIR%" set "BACKEND_DIR=%~dp0Number Hunt\backend"
if not exist "%FRONTEND_DIR%" set "FRONTEND_DIR=%~dp0Number Hunt\frontend"

echo Starting Backend Server on http://localhost:8000...
start "Number Hunt - Backend" cmd /k "cd /d "%BACKEND_DIR%" && python run.py"

echo Starting Frontend Dev Server on http://localhost:5173...
start "Number Hunt - Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo Open your browser at: http://localhost:5173
echo ========================================================
pause
