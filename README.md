# Flutter Web 自動化測試腳本

這是一個專為 Flutter Web 網站設計的 Playwright 自動化測試腳本，能夠自動探索網頁並執行隨機互動操作。

## 🎯 功能特色

### 🔧 核心功能
- ✅ **增強元素檢測**：支援 Flutter Web 特定選擇器和語義化元素
- ✅ **專門測試場景**：登入、搜索、商品瀏覽等業務場景自動化測試
- ✅ **多種操作類型**：按鈕點擊、連結導航、文字輸入、核取方塊、下拉選單、滑動元件、滾動操作
- ✅ **自動截圖**：每次操作後自動截圖，便於問題追蹤和結果分析
- ✅ **智能等待**：針對 Flutter Web 應用的載入特性優化等待邏輯
- ✅ **彈窗處理**：自動處理 JavaScript 對話框和模態視窗

### 📊 性能監控
- ✅ **頁面載入時間**：詳細的導航性能數據收集
- ✅ **操作執行時間**：每個操作的執行時間測量
- ✅ **記憶體監控**：JavaScript 堆記憶體使用情況追蹤
- ✅ **網路請求監控**：HTTP 請求和響應監控
- ✅ **錯誤收集**：控制台錯誤和頁面錯誤自動收集

### 📋 測試報告
- ✅ **HTML 報告**：美觀的可視化測試報告
- ✅ **JSON 數據**：詳細的測試數據 JSON 格式
- ✅ **統計分析**：操作成功率、平均執行時間等統計
- ✅ **錯誤分析**：錯誤類型和頻率分析

## 🛠️ 系統需求

- **Node.js**: >= 16.0.0
- **作業系統**: Windows, macOS, Linux
- **瀏覽器**: 自動安裝 Chromium (也支援 Firefox, Safari)

## 📦 安裝步驟

### 1. 克隆或下載專案

```bash
git clone <repository-url>
cd flutter-web-automation
```

### 2. 安裝依賴

```bash
# 安裝 Node.js 依賴
npm install

# 安裝 Playwright 瀏覽器
npm run install-browsers
```

### 3. 快速設置 (一鍵安裝)

```bash
npm run setup
```

## 🚀 使用方法

### 基本使用 (推薦)

```bash
# 基本測試 (有界面模式)
npm test

# 無界面模式 (更快速，適合 CI/CD)
npm run test:headless

# 快速測試 (只執行5次操作)
npm run test:quick

# 測試本地開發服務器
npm run test:local
```

### 自定義測試參數

```bash
# 指定測試網址
node run-test.js --url=https://your-flutter-app.com

# 指定操作次數
node run-test.js --operations=20

# 組合使用
node run-test.js --url=https://example.com --operations=15 --headless

# 查看所有選項
node run-test.js --help
```

### 直接執行原始腳本

```bash
# 使用原始腳本
npm run test:original

# 或直接執行
node flutter-web-automation.js
```

## 📊 測試結果

### 測試報告
測試完成後會在 `screenshots/` 目錄生成：

```
screenshots/
├── test-report.html      # 📄 可視化測試報告 (推薦查看)
├── test-report.json      # 📋 詳細測試數據
├── 001_initial_load_*.png
├── 002_click_button_*.png
└── 003_fill_input_*.png
```

#### HTML 報告內容
- 📊 **測試概況**：總操作數、成功率、執行時間
- ⚡ **性能數據**：頁面載入時間、DOM 互動時間、記憶體使用
- 🔧 **操作統計**：各類操作的成功率和平均時間
- 🌐 **網路監控**：HTTP 請求和響應統計
- ❌ **錯誤報告**：詳細的錯誤信息和發生時間

```bash
# Windows 用戶可直接打開報告
npm run report
```

### 控制台輸出
測試過程中會即時輸出詳細日誌：
```
🚀 啟動 Chromium 瀏覽器...
✅ 瀏覽器初始化完成
🌐 導航到 https://redandan.github.io/...
⏳ 等待 Flutter Web 應用載入...
✅ Flutter Web 應用載入完成
📸 截圖已保存: 001_initial_load_2024-01-15T10-30-45-123Z.png
🔍 找到 15 個可互動元素
🖱️  點擊 button: 登入
📸 截圖已保存: 002_click_button_2024-01-15T10-30-48-456Z.png
```

## ⚙️ 配置選項

### 主要配置參數

在 `flutter-web-automation.js` 中可以調整以下參數：

```javascript
class FlutterWebAutomation {
  constructor() {
    // 目標網站 URL
    this.testUrl = 'https://redandan.github.io/';
    
    // 每個頁面最大操作次數
    this.maxOperationsPerPage = 10;
    
    // 截圖保存目錄
    this.screenshotDir = 'screenshots';
  }
}
```

### 瀏覽器配置

```javascript
this.browser = await chromium.launch({
  headless: false,           // 是否無界面模式
  args: [
    '--no-sandbox',          // 沙盒模式
    '--disable-web-security' // Web 安全性 (Flutter Web 可能需要)
  ]
});
```

### 視窗大小

```javascript
await this.page.setViewportSize({ 
  width: 1920,   // 寬度
  height: 1080   // 高度
});
```

## 🎲 支援的操作類型

### 1. 按鈕和連結點擊
- 自動識別所有可見的按鈕和連結
- 排除 JavaScript 連結和禁用元素
- 智能滾動到元素位置

### 2. 文字輸入
支援多種輸入框類型，並自動生成對應的測試數據：

| 輸入類型 | 測試數據範例 |
|---------|-------------|
| email | test@example.com, user@agoramarket.com |
| password | TestPassword123!, SecurePass456 |
| text | 測試文字, Automation Test |
| search | 商品, 服務, USDT |
| name | 測試用戶, Test User |
| phone | 0912345678, +886912345678 |
| address | 台北市信義區, 新北市板橋區 |

### 3. 核取方塊操作
- 自動切換核取方塊狀態
- 支援自定義樣式的核取方塊

### 4. 下拉選單
- 隨機選擇可用選項
- 支援 HTML select 元素

## 🛡️ 錯誤處理

### 自動錯誤捕捉
- **控制台錯誤**：監聽並記錄 JavaScript 錯誤
- **頁面錯誤**：捕捉頁面載入和執行錯誤
- **操作失敗**：記錄失敗的操作並繼續執行
- **網路問題**：處理網路超時和連接失敗

### 彈窗處理
- **JavaScript 警告框**：自動接受或關閉
- **確認對話框**：自動處理
- **模態視窗**：嘗試尋找並點擊關閉按鈕

### 失敗重試機制
- 連續失敗 3 次後停止當前頁面的探索
- 每次操作都有獨立的錯誤處理

## 📱 針對 Flutter Web 的優化

### 載入等待策略
```javascript
// 等待 Flutter 框架載入
await this.page.waitForSelector('flt-glass-pane, flutter-view, [flt-renderer]');

// 網路空閒等待
await this.page.goto(url, { waitUntil: 'networkidle' });
```

### 特殊元素識別
- 識別 Flutter 特有的 DOM 結構
- 處理 Canvas 渲染的元素
- 支援 Flutter 的路由系統

### 性能優化
- 智能等待時間調整
- 減少不必要的 DOM 查詢
- 優化截圖頻率

## 🔧 進階使用

### 自定義測試數據

修改 `generateTestData` 方法來自定義測試數據：

```javascript
generateTestData(inputType, placeholder = '') {
  const customData = {
    email: ['your-test@email.com'],
    password: ['YourTestPassword123!'],
    // 添加更多自定義數據
  };
  
  // 您的自定義邏輯
}
```

### 添加自定義操作

```javascript
async customOperation() {
  try {
    // 您的自定義操作邏輯
    console.log('🎯 執行自定義操作');
    
    // 記得截圖
    await this.takeScreenshot('custom_operation');
    
    return true;
  } catch (error) {
    console.error('❌ 自定義操作失敗:', error.message);
    return false;
  }
}
```

### 環境變數配置

```bash
# 設置無界面模式
export HEADLESS=true

# 設置自定義 URL
export TEST_URL=https://your-app.com

# 設置最大操作次數
export MAX_OPERATIONS=20
```

## 🚨 故障排除

### 常見問題

#### 1. 瀏覽器啟動失敗
```bash
# 重新安裝瀏覽器
npm run install-browsers

# 檢查系統依賴
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2
```

#### 2. Flutter Web 載入緩慢
```javascript
// 增加等待時間
await this.page.waitForSelector('flt-glass-pane', { timeout: 30000 });

// 或者禁用等待 Flutter 元素
// 註解掉 Flutter 特定的等待邏輯
```

#### 3. 截圖失敗
```bash
# 檢查目錄權限
chmod 755 screenshots/

# 檢查磁盤空間
df -h
```

#### 4. 記憶體不足
```javascript
// 啟用無界面模式
headless: true

// 減少視窗大小
await this.page.setViewportSize({ width: 1280, height: 720 });
```

### 調試模式

```javascript
// 啟用詳細日誌
await this.page.route('**/*', route => {
  console.log(`📡 請求: ${route.request().method()} ${route.request().url()}`);
  route.continue();
});

// 啟用追蹤
await this.page.tracing.start({ screenshots: true, snapshots: true });
await this.page.tracing.stop({ path: 'trace.zip' });
```

## 📈 性能監控

### 測試指標
- **操作成功率**：成功操作數 / 總操作數
- **平均響應時間**：每次操作的平均等待時間
- **錯誤率**：錯誤次數 / 總操作數
- **覆蓋率**：測試覆蓋的頁面和功能數量

### 自動報告生成

```javascript
// 在測試結束後生成報告
const report = {
  totalOperations: this.operationCount,
  successRate: (successCount / this.operationCount * 100).toFixed(2) + '%',
  duration: duration.toFixed(2) + ' 秒',
  screenshotCount: fs.readdirSync(this.screenshotDir).length
};

fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
```

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request 來改善這個專案！

### 開發環境設置
```bash
git clone <repository-url>
cd flutter-web-automation
npm install
npm run setup
```

### 代碼規範
- 使用 ESLint 進行代碼檢查
- 遵循 JSDoc 註釋規範
- 所有新功能都需要添加對應的錯誤處理

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 技術支援

- **問題回報**：請使用 GitHub Issues
- **功能建議**：歡迎提交 Feature Request
- **技術討論**：可在 Discussions 區域交流

---

**最後更新時間**: 2024年1月
**版本**: 1.0.0
**相容性**: Node.js 16+, Playwright 1.40+
