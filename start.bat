@echo off
echo ========================================================
echo        Starting Number Hunt (Backend + Frontend)
echo ========================================================

echo Starting Backend Server on http://localhost:8000...
start "Number Hunt - Backend" cmd /k "cd /d "%~dp0Number Hunt\backend" && python run.py"

echo Starting Frontend Dev Server on http://localhost:5173...
start "Number Hunt - Frontend" cmd /k "cd /d "%~dp0Number Hunt\frontend" && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo Open your browser at: http://localhost:5173
echo ========================================================
pause
