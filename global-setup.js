// global-setup.js
// Playwright 全域設置腳本

const fs = require('fs');
const path = require('path');

/**
 * 全域測試設置
 * 在所有測試開始前執行
 */
async function globalSetup(config) {
  console.log('🚀 開始全域測試設置...');
  
  try {
    // 創建必要的目錄
    const directories = [
      'screenshots',
      'test-results',
      'test-results/html-report',
      'test-results/artifacts'
    ];
    
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 創建目錄: ${dir}`);
      }
    });
    
    // 清理舊的測試結果
    const testResultsDir = 'test-results';
    if (fs.existsSync(testResultsDir)) {
      const files = fs.readdirSync(testResultsDir);
      files.forEach(file => {
        const filePath = path.join(testResultsDir, file);
        const stat = fs.statSync(filePath);
        
        // 刪除超過 7 天的檔案
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (stat.mtime.getTime() < sevenDaysAgo) {
          if (stat.isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
          console.log(`🗑️  刪除舊檔案: ${filePath}`);
        }
      });
    }
    
    // 設置環境變數
    process.env.TEST_START_TIME = Date.now().toString();
    
    // 記錄測試環境資訊
    const envInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      testStartTime: new Date().toISOString(),
      baseURL: config.use?.baseURL || 'https://redandan.github.io/',
      headless: process.env.HEADLESS === 'true',
      ci: !!process.env.CI
    };
    
    fs.writeFileSync('test-results/environment.json', JSON.stringify(envInfo, null, 2));
    console.log('📋 測試環境資訊已記錄');
    
    console.log('✅ 全域測試設置完成');
    
  } catch (error) {
    console.error('❌ 全域測試設置失敗:', error);
    throw error;
  }
}

module.exports = globalSetup;
