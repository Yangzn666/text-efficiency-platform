@echo off
chcp 65001 >nul
echo ========================================
echo   考研效率平台 - 后端服务启动器
echo ========================================
echo.
echo 正在启动后端API服务...
echo.

cd /d "%~dp0\00-网站程序\backend"
node index.js

pause
