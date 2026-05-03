# 考研效率平台快速启动脚本

$frontendPath = "D:\学习\效率\00-网站程序\frontend"
$localFile = Join-Path $frontendPath "考研效率平台.html"

if (Test-Path $localFile) {
    Start-Process $localFile
}