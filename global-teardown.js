// global-teardown.js
// Playwright 全域清理腳本

const fs = require('fs');
const path = require('path');

/**
 * 全域測試清理
 * 在所有測試結束後執行
 */
async function globalTeardown(config) {
  console.log('🧹 開始全域測試清理...');
  
  try {
    // 計算測試總耗時
    const startTime = parseInt(process.env.TEST_START_TIME || '0');
    const endTime = Date.now();
    const duration = startTime ? (endTime - startTime) / 1000 : 0;
    
    // 生成測試摘要
    const summary = {
      testEndTime: new Date().toISOString(),
      totalDuration: `${duration.toFixed(2)} 秒`,
      screenshotsGenerated: 0,
      artifactsGenerated: 0
    };
    
    // 統計生成的截圖數量
    if (fs.existsSync('screenshots')) {
      const screenshots = fs.readdirSync('screenshots').filter(file => 
        file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
      );
      summary.screenshotsGenerated = screenshots.length;
    }
    
    // 統計生成的測試產物數量
    if (fs.existsSync('test-results/artifacts')) {
      const artifacts = fs.readdirSync('test-results/artifacts');
      summary.artifactsGenerated = artifacts.length;
    }
    
    // 保存測試摘要
    fs.writeFileSync('test-results/summary.json', JSON.stringify(summary, null, 2));
    
    // 輸出測試結果摘要
    console.log('📊 測試摘要:');
    console.log(`   ⏱️  總耗時: ${summary.totalDuration}`);
    console.log(`   📸 截圖數量: ${summary.screenshotsGenerated}`);
    console.log(`   📁 產物數量: ${summary.artifactsGenerated}`);
    
    // 如果是 CI 環境，壓縮測試結果
    if (process.env.CI) {
      console.log('🗜️  CI 環境，準備壓縮測試結果...');
      // 這裡可以添加壓縮邏輯
    }
    
    console.log('✅ 全域測試清理完成');
    
  } catch (error) {
    console.error('❌ 全域測試清理失敗:', error);
    // 不拋出錯誤，避免影響測試結果
  }
}

module.exports = globalTeardown;
