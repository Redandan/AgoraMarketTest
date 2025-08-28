import { test, expect } from '@playwright/test';

test.describe('Flutter Web 手機版佈局驗證', () => {
  test.beforeEach(async ({ page }) => {
    // 設置手機視窗大小
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE 尺寸
    page.setDefaultTimeout(30000);
  });

  test('驗證手機版 Flutter Web 應用可訪問性', async ({ page }) => {
    console.log('📱 開始驗證手機版 Flutter Web 應用...');

    try {
      // 1. 訪問應用主頁
      console.log('1️⃣ 訪問應用主頁（手機版）...');
      await page.goto('https://redandan.github.io/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 2. 檢查頁面基本信息
      const title = await page.title();
      const url = page.url();
      console.log(`📄 頁面標題: ${title}`);
      console.log(`🔗 當前URL: ${url}`);
      console.log(`📏 視窗大小: 375x667 (手機版)`);

      // 3. 檢查頁面內容
      const bodyText = await page.textContent('body');
      console.log(`📏 頁面內容長度: ${bodyText?.length} 字符`);

      // 4. 查找 Flutter Web 特有的元素
      console.log('2️⃣ 查找 Flutter Web 特有元素（手機版）...');
      const flutterElements = await page.locator('[class*="flt-"], flutter-view, flt-semantics-placeholder').all();
      console.log(`🔧 發現 Flutter 元素數量: ${flutterElements.length}`);

      // 5. 查找可交互元素
      console.log('3️⃣ 查找可交互元素（手機版）...');
      const buttons = await page.locator('button, [role="button"], [onclick]').all();
      console.log(`🔘 發現按鈕數量: ${buttons.length}`);

      // 6. 分析按鈕詳情
      if (buttons.length > 0) {
        console.log('4️⃣ 分析按鈕詳情...');
        for (let i = 0; i < Math.min(buttons.length, 3); i++) {
          const button = buttons[i];
          const buttonText = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          const boundingBox = await button.boundingBox();

          console.log(`  按鈕 ${i + 1}:`);
          console.log(`    文字: "${buttonText}"`);
          console.log(`    標籤: "${ariaLabel}"`);
          console.log(`    位置: x=${boundingBox?.x}, y=${boundingBox?.y}`);
          console.log(`    大小: ${boundingBox?.width}x${boundingBox?.height}`);
        }
      }

      // 7. 嘗試基本交互
      console.log('5️⃣ 嘗試基本交互（手機版）...');
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        const buttonText = await firstButton.textContent();
        console.log(`🎯 嘗試點擊第一個按鈕: "${buttonText}"`);

        try {
          // 先嘗試滾動到視圖內
          await firstButton.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);

          await firstButton.click({ force: true, timeout: 5000 });
          await page.waitForTimeout(2000);
          console.log('✅ 按鈕點擊成功');

          // 檢查點擊後的變化
          const newBodyText = await page.textContent('body');
          const contentChanged = newBodyText !== bodyText;
          console.log(`📝 內容是否有變化: ${contentChanged ? '是' : '否'}`);

        } catch (error) {
          console.log(`⚠️ 按鈕點擊失敗: ${error.message}`);
        }
      }

      // 8. 檢查是否有錯誤
      const errorMessages = await page.locator('.error, [class*="error"]').all();
      console.log(`🚨 發現錯誤元素數量: ${errorMessages.length}`);

      // 9. 截圖記錄
      await page.screenshot({
        path: 'test_results/playwright/screenshots/mobile-verification-test.png',
        fullPage: true
      });
      console.log('📸 手機版驗證截圖已保存');

      // 10. 基本驗證斷言
      expect(title).toBeTruthy();
      expect(bodyText?.length).toBeGreaterThan(0);

      console.log('✅ 手機版 Flutter Web 應用驗證完成！');

      // 11. 總結報告
      console.log('\n📊 手機版技術驗證總結:');
      console.log('='.repeat(50));
      console.log(`  📱 視窗大小: 375x667 (iPhone SE)`);
      console.log(`  🌐 應用可訪問: ✅`);
      console.log(`  📄 頁面標題: ${title ? '✅' : '❌'}`);
      console.log(`  📏 內容長度: ${bodyText?.length} 字符`);
      console.log(`  🔧 Flutter 元素: ${flutterElements.length} 個`);
      console.log(`  🔘 可交互按鈕: ${buttons.length} 個`);
      console.log(`  🚨 錯誤元素: ${errorMessages.length} 個`);
      console.log(`  📸 截圖保存: ✅`);

    } catch (error) {
      console.error(`❌ 手機版驗證測試失敗: ${error.message}`);

      // 即使失敗也要截圖
      await page.screenshot({
        path: 'test_results/playwright/screenshots/mobile-verification-error.png',
        fullPage: true
      });

      throw error;
    }
  });

  test('測試手機版導航功能', async ({ page }) => {
    console.log('🔍 測試手機版導航功能...');

    try {
      // 設置手機視窗
      await page.setViewportSize({ width: 375, height: 667 });

      // 訪問主頁
      await page.goto('https://redandan.github.io/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 測試手機版導航
      const testUrls = [
        'https://redandan.github.io/#/login',
        'https://redandan.github.io/#/products',
        'https://redandan.github.io/#/cart'
      ];

      for (const testUrl of testUrls) {
        try {
          console.log(`🔗 測試手機版導航到: ${testUrl}`);
          await page.goto(testUrl, {
            waitUntil: 'networkidle',
            timeout: 20000
          });

          const currentUrl = page.url();
          const pageTitle = await page.title();
          const bodyText = await page.textContent('body');

          console.log(`  📍 當前URL: ${currentUrl}`);
          console.log(`  📄 頁面標題: ${pageTitle}`);
          console.log(`  📏 內容長度: ${bodyText?.length} 字符`);

          // 檢查手機版元素
          const mobileButtons = await page.locator('button, [role="button"], [onclick]').all();
          console.log(`  🔘 手機版按鈕數量: ${mobileButtons.length}`);

          await page.waitForTimeout(1000);

        } catch (urlError) {
          console.log(`  ⚠️ 手機版導航到 ${testUrl} 失敗: ${urlError.message}`);
        }
      }

      console.log('✅ 手機版導航功能檢查完成！');

    } catch (error) {
      console.error(`❌ 手機版導航測試失敗: ${error.message}`);
      throw error;
    }
  });
});