@echo off
echo.
echo ====================================
echo    🎉 LOVEEEE APP - QUICK START 🎉
echo ====================================
echo.
echo 🚀 Starting development server...
echo 📱 App will be available at: http://localhost:3000
echo.
echo 🔐 TEST ACCOUNTS:
echo ├─ Admin: admin@loveeee.app / admin123
echo ├─ Demo1: demo@loveeee.app / demo123  
echo └─ Demo2: test@loveeee.app / test123
echo.
echo 💡 Press Ctrl+C to stop the server
echo.
timeout /t 3 /nobreak > nul
npm run dev
