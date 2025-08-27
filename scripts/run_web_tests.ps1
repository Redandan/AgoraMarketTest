# AgoraMarket Web 平台測試執行腳本 (Windows)

Write-Host "🌐 開始執行 AgoraMarket Web 平台測試..." -ForegroundColor Green

# 設置環境變數
$env:CI = "true"
$env:HEADLESS = "true"
$env:PLATFORM = "web"

# 創建 Web 測試結果目錄
New-Item -ItemType Directory -Force -Path "test_results\screenshots\web"
New-Item -ItemType Directory -Force -Path "test_results\reports\web"
New-Item -ItemType Directory -Force -Path "test_results\logs\web"

# 記錄開始時間
$startTime = Get-Date

try {
    Write-Host "🔍 檢查 Flutter Web 環境..." -ForegroundColor Yellow
    
    # 檢查 Flutter Web 支持
    $webCheck = flutter devices | Select-String "chrome"
    if ($webCheck) {
        Write-Host "✅ Flutter Web 環境正常" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Flutter Web 環境可能需要配置" -ForegroundColor Yellow
    }
    
    # 步驟1: 執行 Web 登入測試
    Write-Host "📋 步驟1: 執行 Web 登入測試..." -ForegroundColor Yellow
    $loginResult = flutter test integration_test/smoke_tests/web_login_test.dart --reporter=json
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Web 登入測試通過" -ForegroundColor Green
        $loginPassed = $true
    } else {
        Write-Host "❌ Web 登入測試失敗" -ForegroundColor Red
        $loginPassed = $false
    }
    
    # 步驟2: 執行基礎導航測試
    Write-Host "🧭 步驟2: 執行基礎導航測試..." -ForegroundColor Yellow
    $navigationResult = flutter test integration_test/smoke_tests/basic_navigation_test.dart --reporter=json
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 基礎導航測試通過" -ForegroundColor Green
        $navigationPassed = $true
    } else {
        Write-Host "❌ 基礎導航測試失敗" -ForegroundColor Red
        $navigationPassed = $false
    }
    
    # 步驟3: 執行單元測試
    Write-Host "🧪 步驟3: 執行單元測試..." -ForegroundColor Yellow
    $unitResult = flutter test --reporter=json
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 單元測試通過" -ForegroundColor Green
        $unitPassed = $true
    } else {
        Write-Host "❌ 單元測試失敗" -ForegroundColor Red
        $unitPassed = $false
    }
    
    # 步驟4: 驗證測試 Keys
    Write-Host "🔑 步驟4: 驗證測試 Keys..." -ForegroundColor Yellow
    $keysResult = dart run scripts/validate_keys.dart
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 測試 Keys 驗證通過" -ForegroundColor Green
        $keysPassed = $true
    } else {
        Write-Host "❌ 測試 Keys 驗證失敗" -ForegroundColor Red
        $keysPassed = $false
    }
    
    # 計算執行時間
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    # 生成測試摘要
    Write-Host "`n📊 Web 測試執行摘要:" -ForegroundColor Cyan
    Write-Host "   Web 登入測試: $(if($loginPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($loginPassed){"Green"}else{"Red"})
    Write-Host "   基礎導航測試: $(if($navigationPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($navigationPassed){"Green"}else{"Red"})
    Write-Host "   單元測試: $(if($unitPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($unitPassed){"Green"}else{"Red"})
    Write-Host "   測試 Keys 驗證: $(if($keysPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($keysPassed){"Green"}else{"Red"})
    
    Write-Host "`n⏱️  Web 測試執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 Web 測試結果保存在: test_results\web\" -ForegroundColor Cyan
    Write-Host "✅ Web 平台測試執行完成！" -ForegroundColor Green
    
    # 計算總體成功率
    $totalTests = 4
    $passedTests = @($loginPassed, $navigationPassed, $unitPassed, $keysPassed).Where({$_ -eq $true}).Count
    $successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)
    
    Write-Host "📈 總體成功率: $successRate% ($passedTests/$totalTests)" -ForegroundColor $(if($successRate -ge 80){"Green"}elseif($successRate -ge 60){"Yellow"}else{"Red"})
    
} catch {
    Write-Host "❌ Web 測試執行失敗: $_" -ForegroundColor Red
    exit 1
}
