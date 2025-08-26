// playwright.config.js
// Playwright 配置文件，用於 Flutter Web 自動化測試

const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright 測試配置
 * 針對 Flutter Web 應用優化的設置
 */
module.exports = defineConfig({
  // 測試目錄
  testDir: './tests',
  
  // 全域測試超時時間 (30分鐘)
  globalTimeout: 30 * 60 * 1000,
  
  // 單個測試超時時間 (5分鐘)
  timeout: 5 * 60 * 1000,
  
  // 期待超時時間 (30秒)
  expect: {
    timeout: 30 * 1000,
  },
  
  // 測試失敗時重試次數
  retries: process.env.CI ? 2 : 1,
  
  // 並行執行的工作進程數
  workers: process.env.CI ? 1 : undefined,
  
  // 測試報告配置
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  
  // 全域設定
  use: {
    // 基礎 URL (可通過環境變數覆蓋)
    baseURL: process.env.BASE_URL || 'https://redandan.github.io/',
    
    // 瀏覽器設定
    headless: process.env.HEADLESS === 'true',
    
    // 視窗大小
    viewport: { width: 1920, height: 1080 },
    
    // 忽略 HTTPS 錯誤 (Flutter Web 開發環境可能需要)
    ignoreHTTPSErrors: true,
    
    // 截圖設定
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    
    // 影片錄製 (僅在失敗時)
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }
    },
    
    // 追蹤設定 (用於調試)
    trace: 'retain-on-failure',
    
    // 動作超時時間
    actionTimeout: 15 * 1000,
    
    // 導航超時時間
    navigationTimeout: 30 * 1000,
    
    // 用戶代理
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Playwright-Test',
    
    // 額外的 HTTP 標頭
    extraHTTPHeaders: {
      'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
    },
    
    // 地理位置 (台北)
    geolocation: { latitude: 25.0330, longitude: 121.5654 },
    permissions: ['geolocation'],
    
    // 時區
    timezoneId: 'Asia/Taipei',
    
    // 語言設定
    locale: 'zh-TW',
  },

  // 測試專案配置
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Flutter Web 在 Chrome 上的特定設定
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--allow-running-insecure-content',
          '--disable-features=VizDisplayCompositor'
        ]
      },
    },
    
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox 特定設定
        firefoxUserPrefs: {
          'security.tls.insecure_fallback_hosts': 'localhost,127.0.0.1',
          'security.fileuri.strict_origin_policy': false
        }
      },
    },
    
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    
    // 移動端測試 (可選)
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // 平板端測試 (可選)
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 }
      },
    },
  ],

  // 網頁伺服器設定 (如果需要本地伺服器)
  webServer: process.env.START_LOCAL_SERVER ? {
    command: 'npm run start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  } : undefined,

  // 輸出目錄
  outputDir: 'test-results/artifacts',
  
  // 全域設置和拆卸
  globalSetup: require.resolve('./global-setup.js'),
  globalTeardown: require.resolve('./global-teardown.js'),
});
