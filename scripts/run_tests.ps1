# AgoraMarket 自動化測試執行腳本 (Windows)

Write-Host "🚀 開始執行 AgoraMarket 自動化測試..." -ForegroundColor Green

# 設置環境變數
$env:CI = "true"
$env:HEADLESS = "true"

# 創建測試結果目錄
New-Item -ItemType Directory -Force -Path "test_results\screenshots"
New-Item -ItemType Directory -Force -Path "test_results\reports"
New-Item -ItemType Directory -Force -Path "test_results\logs"

# 記錄開始時間
$startTime = Get-Date

try {
    # 執行煙霧測試
    Write-Host "📋 執行煙霧測試..." -ForegroundColor Yellow
    $smokeResult = flutter test integration_test/smoke_tests/ --reporter=json
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 煙霧測試通過" -ForegroundColor Green
        $smokePassed = $true
    } else {
        Write-Host "❌ 煙霧測試失敗" -ForegroundColor Red
        $smokePassed = $false
    }
    
    # 如果煙霧測試通過，執行完整測試
    if ($smokePassed) {
        Write-Host "👤 執行用戶流程測試..." -ForegroundColor Yellow
        $flowResult = flutter test integration_test/user_flows/ --reporter=json
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 用戶流程測試通過" -ForegroundColor Green
        } else {
            Write-Host "❌ 用戶流程測試失敗" -ForegroundColor Red
        }
    } else {
        Write-Host "⏭️  跳過完整測試套件（煙霧測試失敗）" -ForegroundColor Yellow
    }
    
    # 計算執行時間
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "⏱️  測試執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 測試結果保存在: test_results\" -ForegroundColor Cyan
    Write-Host "✅ 測試執行完成！" -ForegroundColor Green
    
} catch {
    Write-Host "❌ 測試執行失敗: $_" -ForegroundColor Red
    exit 1
}
