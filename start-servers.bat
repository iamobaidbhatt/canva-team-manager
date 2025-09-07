@echo off
echo Starting Canva Pro Team Manager...

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd server && "C:\Program Files\nodejs\node.exe" index.js"

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd client && set PATH=C:\Program Files\nodejs;%PATH% && npm start"

echo.
echo Waiting 5 seconds for servers to start...
timeout /t 5 /nobreak >nul

echo.
echo Opening browser...
start http://localhost:3000

echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000/api
echo Admin Panel: http://localhost:3000/admin/login
echo.
echo Admin Login: admin / admin123
echo.
pause

