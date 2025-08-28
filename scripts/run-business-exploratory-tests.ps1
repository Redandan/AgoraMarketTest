# AgoraMarket 業務探索測試執行腳本

Write-Host "🛍️ 開始執行 AgoraMarket 業務探索測試..." -ForegroundColor Green

# 設置環境變數
$env:CI = "false"  # 允許 headed 模式查看測試過程
$env:HEADLESS = "false"

# 創建測試結果目錄
New-Item -ItemType Directory -Force -Path "integration_test/business_exploratory_testing/business_logic_findings"
New-Item -ItemType Directory -Force -Path "test_results/playwright"

# 記錄開始時間
$startTime = Get-Date

try {
    Write-Host "🎯 執行產品瀏覽行為業務探索測試..." -ForegroundColor Yellow

    # 運行業務探索測試（非 headless 模式，以便觀察）
    $testResult = npx playwright test tests/playwright/business-exploratory-shopping.spec.ts --headed --reporter=line

    $exitCode = $LASTEXITCODE

    # 計算執行時間
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds

    if ($exitCode -eq 0) {
        Write-Host "✅ 業務探索測試執行成功！" -ForegroundColor Green

        # 檢查生成的業務理解檔案
        $findingsPath = "integration_test/business_exploratory_testing/business_logic_findings"
        $files = Get-ChildItem -Path $findingsPath -Filter "*.md" | Sort-Object LastWriteTime -Descending

        if ($files.Count -gt 0) {
            Write-Host "📝 已生成的業務理解檔案:" -ForegroundColor Cyan
            $files | ForEach-Object {
                Write-Host "   📄 $($_.Name)" -ForegroundColor White
            }
        } else {
            Write-Host "⚠️  未找到生成的業務理解檔案" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ 業務探索測試執行失敗 (退出碼: $exitCode)" -ForegroundColor Red
    }

    Write-Host "`n⏱️  測試執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 業務理解檔案位置: integration_test/business_exploratory_testing/business_logic_findings/" -ForegroundColor Cyan

} catch {
    Write-Host "❌ 測試執行異常: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 使用提示:" -ForegroundColor Magenta
Write-Host "   1. 查看生成的業務理解檔案了解測試發現" -ForegroundColor White
Write-Host "   2. 根據發現的業務洞察優化產品設計" -ForegroundColor White
Write-Host "   3. 重複執行測試觀察用戶行為變化" -ForegroundColor White
Write-Host "   4. 擴展測試覆蓋更多業務場景" -ForegroundColor White

Write-Host "`n🎉 業務探索測試完成！" -ForegroundColor Green