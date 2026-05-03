@echo off
title 考研效率平台 - 直接Vite启动
chcp 65001 >nul
color 0A

echo ========================================
echo    考研效率平台 直接Vite启动
echo ========================================
echo.

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
npx vite

echo.
echo 服务器已停止
pause