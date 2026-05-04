@echo off
chcp 65001 >nul
echo ========================================
echo   11408考研经验贴分享版 - 打包工具
echo ========================================
echo.

REM 检查7-Zip是否安装
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ 检测到7-Zip,使用7-Zip压缩...
    echo.
    
    REM 使用7-Zip压缩(高压缩率)
    7z a -tzip "11408考研经验贴-分享版.zip" ".\*" -xr!*.zip -mx=9
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ 压缩成功!
        echo 📦 文件位置: %cd%\11408考研经验贴-分享版.zip
        echo.
        echo 💡 提示: 可以直接发送压缩包给同学
    ) else (
        echo.
        echo ❌ 压缩失败
    )
) else (
    echo ℹ 未检测到7-Zip,使用Windows自带压缩...
    echo.
    
    REM 使用PowerShell压缩
    powershell -Command "Compress-Archive -Path '.\*' -DestinationPath '11408考研经验贴-分享版.zip' -Force -CompressionLevel Optimal"
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ 压缩成功!
        echo 📦 文件位置: %cd%\11408考研经验贴-分享版.zip
        echo.
        echo 💡 提示: 可以直接发送压缩包给同学
    ) else (
        echo.
        echo ❌ 压缩失败
    )
)

echo.
echo ========================================
pause
