# AgoraMarket 業務探索測試儀表板啟動腳本

Write-Host "🚀 啟動 AgoraMarket 業務探索測試儀表板..." -ForegroundColor Green

# 檢查 Node.js 是否安裝
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 錯誤: 未安裝 Node.js，請先安裝 Node.js" -ForegroundColor Red
    Write-Host "   下載地址: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 檢查是否安裝了必要的依賴
$packageJsonPath = Join-Path $PSScriptRoot ".." "package.json"
if (Test-Path $packageJsonPath) {
    Write-Host "📦 檢查項目依賴..." -ForegroundColor Yellow

    # 安裝依賴（如果需要）
    try {
        npm install
        Write-Host "✅ 依賴安裝完成" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  依賴安裝可能有問題，但繼續嘗試啟動服務器" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  未找到 package.json，跳過依賴安裝" -ForegroundColor Yellow
}

# 設置儀表板服務器路徑
$serverPath = Join-Path $PSScriptRoot "test-dashboard-server.js"

if (!(Test-Path $serverPath)) {
    Write-Host "❌ 錯誤: 找不到儀表板服務器文件" -ForegroundColor Red
    Write-Host "   路徑: $serverPath" -ForegroundColor Red
    exit 1
}

# 啟動儀表板服務器
Write-Host "`n🌐 啟動儀表板服務器..." -ForegroundColor Cyan
Write-Host "   服務器文件: $serverPath" -ForegroundColor White
Write-Host "   預計地址: http://localhost:3001" -ForegroundColor White
Write-Host "   儀表板地址: http://localhost:3001/test-dashboard.html" -ForegroundColor White
Write-Host "" -ForegroundColor White

try {
    # 啟動 Node.js 服務器
    & node $serverPath
} catch {
    Write-Host "❌ 啟動服務器失敗: $_" -ForegroundColor Red
    exit 1
}