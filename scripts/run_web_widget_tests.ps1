# AgoraMarket Web Widget 測試執行腳本 (Windows)

Write-Host "🌐 開始執行 AgoraMarket Web Widget 測試..." -ForegroundColor Green

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
    Write-Host "🔍 檢查 Flutter 環境..." -ForegroundColor Yellow
    
    # 檢查 Flutter 環境
    $flutterCheck = flutter --version
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Flutter 環境正常" -ForegroundColor Green
    } else {
        Write-Host "❌ Flutter 環境檢查失敗" -ForegroundColor Red
        exit 1
    }
    
    # 步驟1: 執行 Web 登入 Widget 測試
    Write-Host "📋 步驟1: 執行 Web 登入 Widget 測試..." -ForegroundColor Yellow
    $loginResult = flutter test test/web_login_test.dart --reporter=json

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Web 登入 Widget 測試通過" -ForegroundColor Green
        $loginPassed = $true
    } else {
        Write-Host "❌ Web 登入 Widget 測試失敗" -ForegroundColor Red
        $loginPassed = $false
    }

    # 步驟2: 執行基礎單元測試
    Write-Host "🧪 步驟2: 執行基礎單元測試..." -ForegroundColor Yellow
    $unitResult = flutter test test/unit_test.dart --reporter=json

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 基礎單元測試通過" -ForegroundColor Green
        $unitPassed = $true
    } else {
        Write-Host "❌ 基礎單元測試失敗" -ForegroundColor Red
        $unitPassed = $false
    }

    # 步驟3: 執行 API 集成測試
    Write-Host "🔗 步驟3: 執行 API 集成測試..." -ForegroundColor Yellow
    $apiResult = flutter test test/api_integration_test.dart --reporter=json

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ API 集成測試通過" -ForegroundColor Green
        $apiPassed = $true
    } else {
        Write-Host "❌ API 集成測試失敗" -ForegroundColor Red
        $apiPassed = $false
    }

    # 步驟4: 執行性能測試
    Write-Host "⚡ 步驟4: 執行性能測試..." -ForegroundColor Yellow
    $performanceResult = flutter test test/performance_test.dart --reporter=json

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 性能測試通過" -ForegroundColor Green
        $performancePassed = $true
    } else {
        Write-Host "❌ 性能測試失敗" -ForegroundColor Red
        $performancePassed = $false
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
    Write-Host "`n📊 Web Widget 測試執行摘要:" -ForegroundColor Cyan
    Write-Host "   Web 登入 Widget 測試: $(if($loginPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($loginPassed){"Green"}else{"Red"})
    Write-Host "   基礎單元測試: $(if($unitPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($unitPassed){"Green"}else{"Red"})
    Write-Host "   API 集成測試: $(if($apiPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($apiPassed){"Green"}else{"Red"})
    Write-Host "   性能測試: $(if($performancePassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($performancePassed){"Green"}else{"Red"})
    Write-Host "   測試 Keys 驗證: $(if($keysPassed){"✅ 通過"}else{"❌ 失敗"})" -ForegroundColor $(if($keysPassed){"Green"}else{"Red"})

    Write-Host "`n⏱️  Web Widget 測試執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 Web 測試結果保存在: test_results\web\" -ForegroundColor Cyan
    Write-Host "✅ Web Widget 平台測試執行完成！" -ForegroundColor Green

    # 計算總體成功率
    $totalTests = 5
    $passedTests = @($loginPassed, $unitPassed, $apiPassed, $performancePassed, $keysPassed).Where({$_ -eq $true}).Count
    $successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)

    Write-Host "📈 總體成功率: $successRate% ($passedTests/$totalTests)" -ForegroundColor $(if($successRate -ge 80){"Green"}elseif($successRate -ge 60){"Yellow"}else{"Red"})
    
    # 生成測試報告
    $reportContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>AgoraMarket Web Widget 測試報告</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .summary { margin: 20px 0; }
        .test-item { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; }
        .passed { border-left-color: #4CAF50; background: #f1f8e9; }
        .failed { border-left-color: #f44336; background: #ffebee; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-box { flex: 1; padding: 15px; text-align: center; border-radius: 5px; }
        .success { background: #4CAF50; color: white; }
        .warning { background: #FF9800; color: white; }
        .error { background: #f44336; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌐 AgoraMarket Web Widget 測試報告</h1>
        <p>測試執行時間: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</p>
        <p>執行環境: Windows PowerShell</p>
    </div>
    
    <div class="stats">
        <div class="stat-box $(if($successRate -ge 80){'success'}elseif($successRate -ge 60){'warning'}else{'error'})">
            <h2>$successRate%</h2>
            <p>成功率</p>
        </div>
        <div class="stat-box success">
            <h2>$passedTests</h2>
            <p>通過測試</p>
        </div>
        <div class="stat-box error">
            <h2>$(($totalTests - $passedTests))</h2>
            <p>失敗測試</p>
        </div>
        <div class="stat-box warning">
            <h2>$([math]::Round($duration, 2))s</h2>
            <p>執行時間</p>
        </div>
    </div>
    
    <div class="summary">
        <h2>📊 測試摘要</h2>
        <div class="test-item $(if($loginPassed){'passed'}else{'failed'})">
            <strong>Web 登入 Widget 測試:</strong> $(if($loginPassed){"✅ 通過"}else{"❌ 失敗"})
        </div>
        <div class="test-item $(if($unitPassed){'passed'}else{'failed'})">
            <strong>基礎單元測試:</strong> $(if($unitPassed){"✅ 通過"}else{"❌ 失敗"})
        </div>
        <div class="test-item $(if($apiPassed){'passed'}else{'failed'})">
            <strong>API 集成測試:</strong> $(if($apiPassed){"✅ 通過"}else{"❌ 失敗"})
        </div>
        <div class="test-item $(if($performancePassed){'passed'}else{'failed'})">
            <strong>性能測試:</strong> $(if($performancePassed){"✅ 通過"}else{"❌ 失敗"})
        </div>
        <div class="test-item $(if($keysPassed){'passed'}else{'failed'})">
            <strong>測試 Keys 驗證:</strong> $(if($keysPassed){"✅ 通過"}else{"❌ 失敗"})
        </div>
    </div>
    
    <div class="summary">
        <h2>🔧 測試環境</h2>
        <p><strong>平台:</strong> Flutter Web (testWidgets)</p>
        <p><strong>測試框架:</strong> flutter_test</p>
        <p><strong>執行時間:</strong> $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</p>
        <p><strong>總耗時:</strong> $([math]::Round($duration, 2)) 秒</p>
    </div>
</body>
</html>
"@
    
    # 保存報告到文件
    $reportPath = "test_results\reports\web\web_widget_test_report.html"
    $reportContent | Out-File -FilePath $reportPath -Encoding UTF8
    
    Write-Host "📄 測試報告已保存到: $reportPath" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Web Widget 測試執行失敗: $_" -ForegroundColor Red
    exit 1
}
