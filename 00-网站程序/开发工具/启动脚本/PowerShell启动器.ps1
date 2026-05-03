# 考研效率平台 PowerShell 启动脚本
# 作者：AI助手
# 版本：2.0

Clear-Host
Write-Host "========================================" -ForegroundColor Green
Write-Host "   考研效率平台 PowerShell 启动器" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 设置工作目录
$projectPath = "D:\学习\效率\00-网站程序\frontend"
Set-Location $projectPath

# 检查项目文件
Write-Host "[1/4] 检查项目文件..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "❌ 错误：找不到 package.json 文件" -ForegroundColor Red
    Write-Host "请检查项目路径是否正确: $projectPath" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "✅ package.json 文件存在" -ForegroundColor Green

# 检查依赖环境
Write-Host "[2/4] 检查依赖环境..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  检测到首次使用，正在安装依赖..." -ForegroundColor Yellow
    Write-Host "这可能需要几分钟时间，请耐心等待..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        npm install --silent
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        Write-Host "✅ 依赖安装完成！" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ 依赖安装失败！" -ForegroundColor Red
        Write-Host "可能的原因：" -ForegroundColor Red
        Write-Host "1. 网络连接问题" -ForegroundColor Red
        Write-Host "2. Node.js 未正确安装" -ForegroundColor Red
        Write-Host "3. 磁盘空间不足" -ForegroundColor Red
        Write-Host ""
        Write-Host "建议解决方案：" -ForegroundColor Yellow
        Write-Host "1. 检查网络连接" -ForegroundColor Yellow
        Write-Host "2. 重新安装 Node.js" -ForegroundColor Yellow
        Write-Host "3. 清理磁盘空间" -ForegroundColor Yellow
        Read-Host "按回车键退出"
        exit 1
    }
} else {
    Write-Host "✅ 依赖环境已就绪" -ForegroundColor Green
}

# 启动开发服务器
Write-Host "[3/4] 启动开发服务器..." -ForegroundColor Yellow
Write-Host "正在启动 Vite 开发服务器..." -ForegroundColor Yellow

try {
    # 在新进程中启动服务器
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectPath'; npm run dev" -WindowStyle Minimized
    
    Write-Host "[4/4] 等待服务器启动..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ 启动成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 访问地址：http://localhost:6900" -ForegroundColor Cyan
    Write-Host "📝 如果端口被占用，会自动切换到其他端口" -ForegroundColor Gray
    Write-Host "🔧 服务器已在后台运行" -ForegroundColor Gray
    Write-Host ""
    Write-Host "提示：" -ForegroundColor Yellow
    Write-Host "• 关闭此窗口不影响服务器运行" -ForegroundColor Gray
    Write-Host "• 如需停止服务器，请在任务管理器中结束node进程" -ForegroundColor Gray
    Write-Host "• 修改代码后会自动刷新浏览器" -ForegroundColor Gray
    Write-Host ""
    
    $openBrowser = Read-Host "是否立即打开浏览器访问？(Y/N)"
    if ($openBrowser -eq 'Y' -or $openBrowser -eq 'y') {
        Write-Host "正在打开浏览器..." -ForegroundColor Yellow
        Start-Process "http://localhost:6900"
        Write-Host "🎉 浏览器已打开！" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🎉 享受你的学习时光！" -ForegroundColor Green
    Start-Sleep -Seconds 3
}
catch {
    Write-Host "❌ 启动失败：$_" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}