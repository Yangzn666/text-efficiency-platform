@echo off
chcp 65001 >nul
echo ========================================
echo 408数据结构知识点导出工具
echo ========================================
echo.

cd /d "%~dp0"

echo 正在导出数据结构知识点...
python export-datastructure-to-obsidian.py

echo.
echo ========================================
echo 导出完成！
echo 请查看: D:\Obsidian\408-数据结构
echo ========================================
pause
