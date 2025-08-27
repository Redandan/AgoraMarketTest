# AgoraMarket CI/CD 自動化測試指南

## 概述

本項目實現了完整的 CI/CD 自動化測試流程，涵蓋從代碼提交到生產部署的各個階段。

## 🏗️ CI/CD 架構

### 測試層次

1. **單元測試 (Unit Tests)** - 測試單個函數和類
2. **Widget 測試 (Widget Tests)** - 測試 Flutter UI 組件
3. **集成測試 (Integration Tests)** - 測試完整功能流程
4. **端到端測試 (E2E Tests)** - 使用 Playwright 測試完整用戶旅程
5. **視覺回歸測試 (Visual Regression)** - 檢測 UI 變化
6. **性能測試 (Performance Tests)** - 測試應用性能
7. **安全測試 (Security Tests)** - 測試安全漏洞

### 環境管理

- **Development** - 開發環境，完整調試功能
- **Staging** - 預發環境，模擬生產環境
- **Production** - 生產環境，最小化干擾

## 🚀 GitHub Actions 工作流程

### 1. Flutter Tests (`flutter-tests.yml`)

**觸發條件：**
- Push 到 `main` 或 `develop` 分支
- Pull Request 到 `main` 或 `develop` 分支
- 手動觸發

**測試內容：**
- Flutter 單元測試和 Widget 測試
- 代碼分析和格式檢查
- 測試覆蓋率報告
- Playwright 端到端測試
- 安全和性能測試
- 環境管理測試

**產出：**
- 測試覆蓋率報告
- 測試結果工件
- HTML 測試報告

### 2. Playwright Only (`playwright-only.yml`)

**觸發條件：**
- 手動觸發

**測試內容：**
- 跨瀏覽器測試 (Chrome, Firefox, Safari)
- 用戶旅程測試
- 視覺回歸測試
- 登入功能測試

**產出：**
- 瀏覽器兼容性報告
- 視覺回歸截圖
- 測試視頻錄製

### 3. Scheduled Tests (`scheduled-tests.yml`)

**觸發條件：**
- 每日定時執行 (UTC 2:00, 台北時間 10:00)
- 手動觸發

**測試內容：**
- 冒煙測試 (Smoke Tests)
- 回歸測試 (Regression Tests)
- 環境健康檢查
- 關鍵路徑測試

**產出：**
- 健康檢查報告
- 失敗告警通知

## 🛠️ 本地開發環境設置

### 環境要求

- Flutter 3.19.0+
- Node.js 18+
- Playwright 1.40.0+

### 安裝依賴

```bash
# Flutter 依賴
flutter pub get

# Node.js 依賴
npm install

# Playwright 瀏覽器
npx playwright install --with-deps
```

### 運行測試

```bash
# 運行所有 Flutter 測試
flutter test

# 運行 Playwright 測試
npm run test

# 運行特定環境測試
flutter test test/environment_management_test.dart

# 運行登入測試
flutter test test/enhanced_login_test.dart
```

### 環境管理

```bash
# 查看當前環境
dart run scripts/manage-environments.ps1 -Action info

# 切換環境
dart run scripts/manage-environments.ps1 -Action switch -Environment staging

# 測試環境連通性
dart run scripts/manage-environments.ps1 -Action test

# 導出環境配置
dart run scripts/manage-environments.ps1 -Action export -ConfigFile 'env-backup.json'
```

## 📊 測試報告和監控

### 測試結果位置

```
test_results/
├── screenshots/          # 測試截圖
├── reports/             # 測試報告
├── videos/              # 測試視頻
├── logs/                # 測試日誌
└── playwright/          # Playwright 專用結果
```

### 覆蓋率報告

- 使用 `flutter test --coverage` 生成覆蓋率
- 上傳到 Codecov 進行可視化分析
- 覆蓋率閾值設為 80%

### 視覺回歸

- 自動截圖比較
- 檢測 UI 變化
- 支持多瀏覽器視覺測試

## 🔧 配置和自定義

### 環境變數

```bash
# 測試環境
TEST_ENV=development|staging|production

# CI 模式
CI=true

# 無頭模式
HEADLESS=true

# 調試模式
DEBUG=true
```

### Playwright 配置

位置：`playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests/playwright',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'https://redandan.github.io',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### 自定義測試腳本

```bash
# PowerShell 腳本
.\scripts\run-playwright-tests.ps1
.\scripts\manage-environments.ps1
.\scripts\run_all_tests.ps1
```

## 📈 持續改進

### 測試指標

- **測試覆蓋率** - 目標 95%+
- **測試執行時間** - 控制在 10 分鐘內
- **成功率** - 目標 99%+
- **平均修復時間** - MTTR < 1 小時

### 性能優化

- 並行測試執行
- 測試結果緩存
- 按需截圖和視頻錄製
- 環境特定的測試配置

### 擴展計劃

- [ ] 實現測試數據管理
- [ ] 添加 AI 驅動的測試生成
- [ ] 實現全自動化部署測試
- [ ] 建立性能監控和告警系統

## 🚨 故障排除

### 常見問題

1. **Playwright 瀏覽器安裝失敗**
   ```bash
   npx playwright install --with-deps
   ```

2. **Flutter 測試超時**
   - 檢查網路連通性
   - 調整測試超時設置
   - 查看測試環境狀態

3. **視覺回歸測試失敗**
   - 檢查基準截圖
   - 更新視覺基準
   - 確認 UI 變化是否預期

### 聯繫支持

- 📧 Email: test-support@agoramarket.com
- 📱 Slack: #testing-channel
- 📋 Issues: [GitHub Issues](https://github.com/redandan/AgoraMarketTest/issues)

## 📋 檢查清單

### 新功能測試

- [ ] 編寫單元測試
- [ ] 編寫集成測試
- [ ] 編寫 E2E 測試
- [ ] 更新測試文檔
- [ ] 檢查測試覆蓋率

### 發佈前檢查

- [ ] 所有測試通過
- [ ] 覆蓋率達到標準
- [ ] 視覺回歸測試通過
- [ ] 性能測試通過
- [ ] 安全測試通過

---

*最後更新：2024年8月27日*