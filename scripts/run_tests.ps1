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
            $flowPassed = $true
        } else {
            Write-Host "❌ 用戶流程測試失敗" -ForegroundColor Red
            $flowPassed = $false
        }

        # 執行業務場景測試
        Write-Host "🏢 執行業務場景測試..." -ForegroundColor Yellow
        $businessResult = flutter test integration_test/business_scenarios/ --reporter=json

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 業務場景測試通過" -ForegroundColor Green
            $businessPassed = $true
        } else {
            Write-Host "❌ 業務場景測試失敗" -ForegroundColor Red
            $businessPassed = $false
        }
    } else {
        Write-Host "⏭️  跳過完整測試套件（煙霧測試失敗）" -ForegroundColor Yellow
        $flowPassed = $false
        $businessPassed = $false
    }
    
    # 計算執行時間
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    # 生成測試摘要
    Write-Host "`n📊 測試執行摘要:" -ForegroundColor Cyan
    Write-Host "   煙霧測試: $(if($smokePassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($smokePassed){"Green"}else{"Red"})
    Write-Host "   用戶流程測試: $(if($flowPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($flowPassed){"Green"}else{"Red"})
    Write-Host "   業務場景測試: $(if($businessPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($businessPassed){"Green"}else{"Red"})

    # 計算總體成功率
    $totalTests = 3
    $passedTests = @($smokePassed, $flowPassed, $businessPassed).Where({$_ -eq $true}).Count
    $successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)

    Write-Host "`n⏱️  測試執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 測試結果保存在: test_results\" -ForegroundColor Cyan
    Write-Host "📈 總體成功率: $successRate% ($passedTests/$totalTests)" -ForegroundColor $(if($successRate -ge 80){"Green"}elseif($successRate -ge 60){"Yellow"}else{"Red"})
    Write-Host "✅ 測試執行完成！" -ForegroundColor Green
    
} catch {
    Write-Host "❌ 測試執行失敗: $_" -ForegroundColor Red
    exit 1
}
