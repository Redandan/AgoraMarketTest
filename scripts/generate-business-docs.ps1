# AgoraMarket 業務文檔生成腳本

Write-Host "📄 開始生成 AgoraMarket 業務文檔..." -ForegroundColor Green

# 創建必要的目錄
New-Item -ItemType Directory -Force -Path "integration_test/business_exploratory_testing/business_logic_findings"
New-Item -ItemType Directory -Force -Path "integration_test/business_exploratory_testing/user_journey_maps"
New-Item -ItemType Directory -Force -Path "integration_test/business_exploratory_testing/business_process_models"

# 記錄開始時間
$startTime = Get-Date

try {
    Write-Host "🎯 執行增強業務探索測試..." -ForegroundColor Yellow

    # 運行增強業務探索測試
    $testResult = npx playwright test tests/playwright/enhanced-business-exploration.spec.ts --headed --reporter=line

    $exitCode = $LASTEXITCODE

    # 計算執行時間
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds

    if ($exitCode -eq 0) {
        Write-Host "✅ 業務探索測試執行成功！" -ForegroundColor Green

        # 檢查生成的業務文檔
        $findingsPath = "integration_test/business_exploratory_testing/business_logic_findings"
        $files = Get-ChildItem -Path $findingsPath -Filter "*.md" | Sort-Object LastWriteTime -Descending

        if ($files.Count -gt 0) {
            Write-Host "📄 已生成的業務文檔:" -ForegroundColor Cyan
            $files | ForEach-Object {
                Write-Host "   📄 $($_.Name) ($($_.LastWriteTime))" -ForegroundColor White
            }

            # 生成總結報告
            Write-Host "`n📊 生成業務分析總結..." -ForegroundColor Yellow
            $latestFile = $files[0]
            $content = Get-Content $latestFile.FullName -Raw

            # 提取關鍵指標
            $logicFindings = ($content | Select-String -Pattern "業務邏輯發現: (\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }) -join ""
            $userJourneySteps = ($content | Select-String -Pattern "用戶旅程階段: (\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }) -join ""

            Write-Host "🎯 業務探索結果總結:" -ForegroundColor Green
            Write-Host "   🔍 業務邏輯發現: $logicFindings 個" -ForegroundColor White
            Write-Host "   🎯 用戶旅程階段: $userJourneySteps 個" -ForegroundColor White
            Write-Host "   📄 最新報告: $($latestFile.Name)" -ForegroundColor White
        } else {
            Write-Host "⚠️  未找到生成的業務文檔" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ 業務探索測試執行失敗 (退出碼: $exitCode)" -ForegroundColor Red
    }

    Write-Host "`n⏱️  文檔生成執行時間: $([math]::Round($duration, 2)) 秒" -ForegroundColor Cyan
    Write-Host "📁 業務文檔存放位置: integration_test/business_exploratory_testing/business_logic_findings/" -ForegroundColor Cyan

} catch {
    Write-Host "❌ 文檔生成異常: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 使用提示:" -ForegroundColor Magenta
Write-Host "   1. 查看生成的業務文檔了解應用全貌" -ForegroundColor White
Write-Host "   2. 根據發現的業務邏輯優化產品設計" -ForegroundColor White
Write-Host "   3. 定期執行以追蹤業務變化" -ForegroundColor White
Write-Host "   4. 與團隊分享重要業務洞察" -ForegroundColor White

Write-Host "`n🎉 業務文檔生成完成！" -ForegroundColor Green