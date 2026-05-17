# 考研效率平台 - 后端服务启动器 (PowerShell版本)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  考研效率平台 - 后端服务启动器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "正在启动后端API服务..." -ForegroundColor Green
Write-Host ""

Set-Location "$PSScriptRoot\00-网站程序\backend"
node index.js
