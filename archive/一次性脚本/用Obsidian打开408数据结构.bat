@echo off
chcp 65001 >nul

:: 设置Obsidian安装路径（常见路径）
set "OBSIDIAN_PATH=C:\Users\%USERNAME%\AppData\Local\Obsidian\Obsidian.exe"

:: 如果上面的路径不存在，尝试其他常见路径
if not exist "%OBSIDIAN_PATH%" (
    set "OBSIDIAN_PATH=C:\Program Files\Obsidian\Obsidian.exe"
)

if not exist "%OBSIDIAN_PATH%" (
    set "OBSIDIAN_PATH=D:\Program Files\Obsidian\Obsidian.exe"
)

:: 检查Obsidian是否安装
if not exist "%OBSIDIAN_PATH%" (
    echo ❌ 未找到Obsidian程序
    echo.
    echo 请手动打开Obsidian，然后：
    echo 1. 点击左下角"打开另一个库"按钮
    echo 2. 选择"打开文件夹作为库"
    echo 3. 浏览到: D:\Obsidian\408-数据结构
    echo.
    pause
    exit /b 1
)

:: 使用Obsidian打开文件夹
echo 🚀 正在使用Obsidian打开408数据结构知识库...
start "" "%OBSIDIAN_PATH%" "D:\Obsidian\408-数据结构"

echo ✅ 已启动Obsidian
echo.
echo 💡 提示：如果Obsidian没有自动打开该文件夹，请手动选择：
echo    文件 → 打开文件夹作为库 → D:\Obsidian\408-数据结构
echo.
pause
