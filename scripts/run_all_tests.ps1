# AgoraMarket 完整測試套件執行腳本 (Windows)

Write-Host "🚀 開始執行 AgoraMarket 完整測試套件..." -ForegroundColor Green

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
    # 步驟1: 煙霧測試
    Write-Host "📋 步驟1: 執行煙霧測試..." -ForegroundColor Yellow
    $smokeResult = flutter test integration_test/smoke_tests/ --reporter=json
    $smokePassed = ($LASTEXITCODE -eq 0)
    Write-Host $([string]::Format("煙霧測試: {0}", $(if($smokePassed){"✅ 通過"}else{"❌ 失敗"}))) -ForegroundColor $(if($smokePassed){"Green"}else{"Red"})
    
    # 步驟2: 用戶流程測試
    Write-Host "👤 步驟2: 執行用戶流程測試..." -ForegroundColor Yellow
    $flowResult = flutter test integration_test/user_flows/ --reporter=json
    $flowPassed = ($LASTEXITCODE -eq 0)
    Write-Host $([string]::Format("用戶流程測試: {0}", $(if($flowPassed){"✅ 通過"}else{"❌ 失敗"}))) -ForegroundColor $(if($flowPassed){"Green"}else{"Red"})
    
    # 步驟3: 業務場景測試
    Write-Host "🏢 步驟3: 執行業務場景測試..." -ForegroundColor Yellow
    $businessResult = flutter test integration_test/business_scenarios/ --reporter=json
    $businessPassed = ($LASTEXITCODE -eq 0)
    Write-Host $([string]::Format("業務場景測試: {0}", $(if($businessPassed){"✅ 通過"}else{"❌ 失敗"}))) -ForegroundColor $(if($businessPassed){"Green"}else{"Red"})
    
    # 步驟4: 回歸測試
    Write-Host "🔄 步驟4: 執行回歸測試..." -ForegroundColor Yellow
    $regressionResult = flutter test integration_test/regression_tests/ --reporter=json
    $regressionPassed = ($LASTEXITCODE -eq 0)
    Write-Host $([string]::Format("回歸測試: {0}", $(if($regressionPassed){"✅ 通過"}else{"❌ 失敗"}))) -ForegroundColor $(if($regressionPassed){"Green"}else{"Red"})
    
    # 計算執行時間
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "⏱️  測試執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 測試結果保存在: test_results\" -ForegroundColor Cyan
    Write-Host "✅ 完整測試套件執行完成！" -ForegroundColor Green
    
} catch {
    Write-Host "❌ 測試執行失敗: $_" -ForegroundColor Red
    exit 1
}
