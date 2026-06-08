# 停止所有Node进程
Write-Host "正在停止旧的后端服务..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# 启动新的后端服务
Write-Host "正在启动新的后端服务..." -ForegroundColor Green
Set-Location "d:\学习\效率\00-网站程序\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\学习\效率\00-网站程序\backend'; node index.js"

Write-Host "后端服务已重启！" -ForegroundColor Green
Write-Host "请等待3秒后刷新浏览器页面..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
