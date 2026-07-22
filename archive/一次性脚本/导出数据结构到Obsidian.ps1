# 408数据结构知识点导出到Obsidian
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "408数据结构知识点导出工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置工作目录
Set-Location $PSScriptRoot

Write-Host "正在导出数据结构知识点..." -ForegroundColor Yellow
Write-Host ""

# 运行Python脚本
python export-datastructure-to-obsidian.py

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ 导出完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "📁 输出位置: D:\Obsidian\408-数据结构" -ForegroundColor White
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
