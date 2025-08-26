#!/usr/bin/env node

/**
 * AgoraMarket Flutter Web 自動化測試運行器
 * 提供便捷的命令行接口來運行測試
 */

const FlutterWebAutomation = require('./flutter-web-automation.js');

// 解析命令行參數
const args = process.argv.slice(2);
const options = {};

// 解析參數
args.forEach(arg => {
  if (arg.startsWith('--url=')) {
    options.testUrl = arg.split('=')[1];
  } else if (arg.startsWith('--operations=')) {
    options.maxOperations = parseInt(arg.split('=')[1]);
  } else if (arg === '--headless') {
    options.headless = true;
  } else if (arg === '--help' || arg === '-h') {
    showHelp();
    process.exit(0);
  }
});

function showHelp() {
  console.log(`
🎯 AgoraMarket Flutter Web 自動化測試運行器

用法:
  node run-test.js [選項]

選項:
  --url=<URL>           指定測試網址 (預設: https://redandan.github.io/)
  --operations=<數量>   指定最大操作數 (預設: 10)
  --headless           使用無界面模式運行
  --help, -h           顯示此幫助訊息

範例:
  node run-test.js                                    # 使用預設設定
  node run-test.js --url=https://example.com         # 測試指定網址
  node run-test.js --operations=20 --headless        # 20次操作，無界面模式
  node run-test.js --url=localhost:3000 --operations=5   # 本地開發環境測試

報告:
  測試完成後，報告會保存在 screenshots/ 目錄中:
  - test-report.html  (HTML 格式報告)
  - test-report.json  (JSON 格式詳細數據)
  - 各種截圖文件
`);
}

async function runTest() {
  try {
    console.log('🚀 啟動 AgoraMarket Flutter Web 自動化測試...');
    
    const automation = new FlutterWebAutomation();
    
    // 應用命令行選項
    if (options.testUrl) {
      automation.testUrl = options.testUrl;
      console.log(`🌐 測試網址: ${options.testUrl}`);
    }
    
    if (options.maxOperations) {
      automation.maxOperationsPerPage = options.maxOperations;
      console.log(`🎲 最大操作數: ${options.maxOperations}`);
    }
    
    if (options.headless) {
      console.log('👻 使用無界面模式');
    }
    
    // 運行測試
    await automation.run();
    
  } catch (error) {
    console.error('❌ 測試運行失敗:', error.message);
    process.exit(1);
  }
}

// 主程序
if (require.main === module) {
  runTest();
}

module.exports = { runTest, showHelp };
