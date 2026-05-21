@echo off
chcp 65001 >nul
echo ========================================
echo   数学强化阶段学习系统 - 快速启动
echo ========================================
echo.

echo [1/3] 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Node.js,请先安装Node.js
    pause
    exit /b 1
)
echo ✅ Node.js已安装

echo.
echo [2/3] 进入前端目录...
cd /d "%~dp0frontend"
echo ✅ 当前目录: %CD%

echo.
echo [3/3] 启动开发服务器...
echo.
echo 🚀 正在启动Vite开发服务器...
echo.
echo 📍 访问地址:
echo    - 强化学习仪表盘: http://localhost:5173/math/reinforcement
echo    - 知识点管理:     http://localhost:5173/math/reinforcement/topics
echo    - 智能错题本:     http://localhost:5173/math/reinforcement/wrong-book
echo    - 专题突破中心:   http://localhost:5173/math/reinforcement/special-training
echo.
echo 💡 提示:
echo    - 按 Ctrl+C 可停止服务器
echo    - 首次使用请查看"数学强化阶段系统-使用指南.md"
echo.
echo ========================================
echo.

npm run dev

pause
