# AgoraMarket Playwright 測試執行腳本 (Windows)

Write-Host "🎭 開始執行 AgoraMarket Playwright 測試..." -ForegroundColor Green

# 設置環境變數
$env:CI = "true"
$env:HEADLESS = "true"
$env:PLATFORM = "playwright"

# 創建 Playwright 測試結果目錄
New-Item -ItemType Directory -Force -Path "test_results/playwright/screenshots"
New-Item -ItemType Directory -Force -Path "test_results/playwright/reports"
New-Item -ItemType Directory -Force -Path "test_results/playwright/videos"
New-Item -ItemType Directory -Force -Path "test_results/playwright/traces"

# 記錄開始時間
$startTime = Get-Date

try {
    Write-Host "📦 檢查 Node.js 環境..." -ForegroundColor Yellow

    # 檢查 Node.js
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js 未安裝，請先安裝 Node.js" -ForegroundColor Red
        exit 1
    }

    # 檢查 npm
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm 版本: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm 未安裝" -ForegroundColor Red
        exit 1
    }

    Write-Host "📥 安裝 Playwright 依賴..." -ForegroundColor Yellow

    # 安裝依賴
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依賴安裝失敗" -ForegroundColor Red
        exit 1
    }

    Write-Host "🌐 安裝 Playwright 瀏覽器..." -ForegroundColor Yellow

    # 安裝 Playwright 瀏覽器
    npx playwright install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Playwright 瀏覽器安裝失敗" -ForegroundColor Red
        exit 1
    }

    Write-Host "🧪 執行 Playwright 測試..." -ForegroundColor Yellow

    # 執行所有測試
    $testResult = npx playwright test 2>&1
    $testExitCode = $LASTEXITCODE

    # 顯示測試結果
    Write-Host "`n📊 Playwright 測試結果:" -ForegroundColor Cyan
    Write-Host $testResult -ForegroundColor White

    # 生成 HTML 報告
    Write-Host "📋 生成測試報告..." -ForegroundColor Yellow
    npx playwright show-report --reporter=html

    # 計算執行時間
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds

    Write-Host "`n⏱️  Playwright 測試執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 Playwright 測試結果保存在: test_results/playwright/" -ForegroundColor Cyan

    # 檢查測試結果
    if ($testExitCode -eq 0) {
        Write-Host "✅ Playwright 測試全部通過！" -ForegroundColor Green

        # 顯示測試統計
        $screenshotCount = (Get-ChildItem "test_results/playwright/screenshots" -File -Recurse).Count
        $videoCount = (Get-ChildItem "test_results/playwright/videos" -File -Recurse).Count
        $traceCount = (Get-ChildItem "test_results/playwright/traces" -File -Recurse).Count

        Write-Host "📸 截圖數量: $screenshotCount" -ForegroundColor Cyan
        Write-Host "🎬 視頻數量: $videoCount" -ForegroundColor Cyan
        Write-Host "🔍 追蹤數量: $traceCount" -ForegroundColor Cyan

    } else {
        Write-Host "❌ Playwright 測試失敗 (退出碼: $testExitCode)" -ForegroundColor Red

        # 檢查是否有失敗截圖
        $failureScreenshots = Get-ChildItem "test_results/playwright/screenshots" -File -Filter "*failure*" -Recurse
        if ($failureScreenshots.Count -gt 0) {
            Write-Host "📸 失敗截圖:" -ForegroundColor Yellow
            $failureScreenshots | ForEach-Object {
                Write-Host "   - $($_.Name)" -ForegroundColor Yellow
            }
        }
    }

    Write-Host "`n🎭 Playwright 測試執行完成！" -ForegroundColor Green

} catch {
    Write-Host "❌ Playwright 測試執行失敗: $_" -ForegroundColor Red
    exit 1
}