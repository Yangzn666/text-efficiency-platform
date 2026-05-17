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

REM 第二步：打开前端页面
echo [2/3] 正在打开前端页面...
start "" "D:\学习\效率\00-网站程序\frontend\考研效率平台.html"
echo ✅ 前端页面已打开
echo.

echo [3/3] 所有服务已启动！
echo.
echo 📊 后端API: http://localhost:3001
echo 🌐 前端页面: 已在浏览器中打开
echo.
echo ⚠️  请手动关闭终端窗口来停止后端服务
echo.
pause