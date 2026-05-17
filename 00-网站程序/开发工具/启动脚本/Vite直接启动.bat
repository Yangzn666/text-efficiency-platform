@echo off
title 考研效率平台 - 完整启动（前端+后端）
chcp 65001 >nul
color 0A

echo ========================================
echo    考研效率平台 完整启动
echo    前端 + 后端API服务
echo ========================================
echo.

REM 第一步：启动后端API服务
echo [1/3] 正在启动后端API服务...
cd /d "D:\学习\效率\00-网站程序\backend"
start "后端API服务" cmd /k "node index.js"
timeout /t 2 /nobreak >nul
echo ✅ 后端API服务已启动 (http://localhost:3001)
echo.

REM 第二步：启动前端Vite服务器
echo [2/3] 正在启动前端开发服务器...
cd /d "D:\学习\效率\00-网站程序\frontend"

echo 检查环境...
if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
    if errorlevel 1 (
        echo 依赖安装失败
        pause
        exit /b 1
    )
)

echo 启动Vite开发服务器...
echo 请稍候...
echo.

REM 直接使用npx vite而不是npm run dev
start "前端Vite服务器" cmd /k "npx vite"

echo.
echo [3/3] 所有服务已启动！
echo.
echo 📊 后端API: http://localhost:3001
echo 🌐 前端页面: http://localhost:5173 (或其他端口)
echo.
echo ⚠️  请手动关闭终端窗口来停止服务
echo.
pause