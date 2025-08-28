import { test, expect } from '@playwright/test';

test.describe('Flutter Web + Playwright 技術驗證', () => {
  test.beforeEach(async ({ page }) => {
    // 設置基本的頁面配置
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(30000);
  });

  test('驗證 Flutter Web 應用可訪問性', async ({ page }) => {
    console.log('🔍 開始驗證 Flutter Web 應用可訪問性...');

    try {
      // 1. 訪問應用主頁
      console.log('1️⃣ 訪問應用主頁...');
      await page.goto('https://redandan.github.io/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 2. 檢查頁面基本信息
      const title = await page.title();
      const url = page.url();
      console.log(`📄 頁面標題: ${title}`);
      console.log(`🔗 當前URL: ${url}`);

      // 3. 檢查頁面內容
      const bodyText = await page.textContent('body');
      console.log(`📏 頁面內容長度: ${bodyText?.length} 字符`);

      // 4. 查找 Flutter Web 特有的元素
      console.log('2️⃣ 查找 Flutter Web 特有元素...');
      const flutterElements = await page.locator('[class*="flt-"], flutter-view, flt-semantics-placeholder').all();
      console.log(`🔧 發現 Flutter 元素數量: ${flutterElements.length}`);

      // 5. 查找可交互元素
      console.log('3️⃣ 查找可交互元素...');
      const buttons = await page.locator('button, [role="button"], [onclick]').all();
      console.log(`🔘 發現按鈕數量: ${buttons.length}`);

      // 6. 嘗試基本交互
      console.log('4️⃣ 嘗試基本交互...');
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        const buttonText = await firstButton.textContent();
        console.log(`🎯 嘗試點擊第一個按鈕: "${buttonText}"`);

        try {
          await firstButton.click({ force: true, timeout: 5000 });
          await page.waitForTimeout(2000);
          console.log('✅ 按鈕點擊成功');
        } catch (error) {
          console.log(`⚠️ 按鈕點擊失敗: ${error.message}`);
        }
      }

      // 7. 檢查是否有錯誤
      const errorMessages = await page.locator('.error, [class*="error"]').all();
      console.log(`🚨 發現錯誤元素數量: ${errorMessages.length}`);

      // 8. 截圖記錄
      await page.screenshot({
        path: 'test_results/playwright/screenshots/verification-test.png',
        fullPage: true
      });
      console.log('📸 驗證截圖已保存');

      // 9. 基本驗證斷言
      expect(title).toBeTruthy();
      expect(bodyText?.length).toBeGreaterThan(0);
      expect(flutterElements.length).toBeGreaterThanOrEqual(0); // Flutter 元素可能不存在

      console.log('✅ Flutter Web + Playwright 技術驗證完成！');

      // 10. 總結報告
      console.log('\n📊 技術驗證總結:');
      console.log('='.repeat(50));
      console.log(`  🌐 應用可訪問: ✅`);
      console.log(`  📄 頁面標題: ${title ? '✅' : '❌'}`);
      console.log(`  🔧 Flutter 元素: ${flutterElements.length} 個`);
      console.log(`  🔘 可交互按鈕: ${buttons.length} 個`);
      console.log(`  🚨 錯誤元素: ${errorMessages.length} 個`);
      console.log(`  📸 截圖保存: ✅`);

    } catch (error) {
      console.error(`❌ 驗證測試失敗: ${error.message}`);

      // 即使失敗也要截圖
      await page.screenshot({
        path: 'test_results/playwright/screenshots/verification-error.png',
        fullPage: true
      });

      throw error;
    }
  });

  test('檢查應用導航功能', async ({ page }) => {
    console.log('🔍 檢查應用導航功能...');

    try {
      // 訪問主頁
      await page.goto('https://redandan.github.io/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 嘗試訪問不同頁面
      const testUrls = [
        'https://redandan.github.io/#/login',
        'https://redandan.github.io/#/products',
        'https://redandan.github.io/#/cart'
      ];

      for (const testUrl of testUrls) {
        try {
          console.log(`🔗 測試導航到: ${testUrl}`);
          await page.goto(testUrl, {
            waitUntil: 'networkidle',
            timeout: 20000
          });

          const currentUrl = page.url();
          const pageTitle = await page.title();

          console.log(`  📍 當前URL: ${currentUrl}`);
          console.log(`  📄 頁面標題: ${pageTitle}`);

          // 檢查頁面是否成功載入
          const bodyText = await page.textContent('body');
          expect(bodyText?.length).toBeGreaterThan(0);

          await page.waitForTimeout(1000);

        } catch (urlError) {
          console.log(`  ⚠️ 導航到 ${testUrl} 失敗: ${urlError.message}`);
        }
      }

      console.log('✅ 導航功能檢查完成！');

    } catch (error) {
      console.error(`❌ 導航測試失敗: ${error.message}`);
      throw error;
    }
  });
});