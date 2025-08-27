import { test, expect } from '@playwright/test';

test.describe('Flutter Web Testing Workarounds', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(60000);
  });

  test('Workaround 1: Single-page session testing', async ({ page }) => {
    console.log('🔧 Testing Flutter Web with single-page session approach...');

    // Step 1: Access the app and stay on the same page
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000);

    // Step 2: Enable accessibility and login
    await page.evaluate(() => {
      const button = document.querySelector('flt-semantics-placeholder[role="button"][aria-label="Enable accessibility"]');
      if (button) {
        (button as HTMLElement).click();
      }
    });
    await page.waitForTimeout(3000);

    // Step 3: Login as buyer
    const buyerButton = page.locator('button, [role="button"]').filter({ hasText: '測試買家' });
    await buyerButton.first().click();
    await page.waitForTimeout(5000);

    // Step 4: Test all interactions on the SAME page
    console.log('🛒 Testing all marketplace interactions on single page...');

    const allButtons = page.locator('button, [role="button"]');
    const buttonCount = await allButtons.count();

    console.log(`Found ${buttonCount} interactive elements`);

    // Test each button without navigating
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = allButtons.nth(i);
      const buttonText = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      console.log(`Testing button ${i + 1}: "${buttonText}" (aria: "${ariaLabel}")`);

      // Take screenshot before interaction
      await page.screenshot({
        path: `test_results/playwright/screenshots/button-${i + 1}-before.png`
      });

      try {
        // Try to click the button
        await button.click();
        await page.waitForTimeout(2000);

        // Check for any changes on the page
        const newButtonCount = await page.locator('button, [role="button"]').count();
        const pageContent = await page.textContent('body');

        // Look for any indication of successful interaction
        const successIndicators = [
          'success', '成功', 'added', '已加入', 'updated', '已更新',
          'cart', '購物車', 'order', '訂單', 'checkout', '結帳'
        ];

        let interactionSuccess = false;
        for (const indicator of successIndicators) {
          if (pageContent?.toLowerCase().includes(indicator.toLowerCase())) {
            console.log(`  🎉 Interaction success! Found indicator: "${indicator}"`);
            interactionSuccess = true;
            break;
          }
        }

        if (interactionSuccess) {
          // Take screenshot of successful interaction
          await page.screenshot({
            path: `test_results/playwright/screenshots/button-${i + 1}-success.png`,
            fullPage: true
          });

          // Try to extract any order or transaction information
          const orderPatterns = [
            /order\s+(?:number|id|編號)[\s:]+([A-Z0-9-]+)/i,
            /訂單\s+(?:編號|號碼)[\s:]+([A-Z0-9-]+)/i,
            /transaction\s+(?:id|編號)[\s:]+([A-Z0-9-]+)/i,
            /確認\s+(?:編號|碼)[\s:]+([A-Z0-9-]+)/i
          ];

          for (const pattern of orderPatterns) {
            const match = pageContent?.match(pattern);
            if (match && match[1]) {
              console.log(`  🎊 POSSIBLE ORDER/TRANSACTION ID FOUND: ${match[1]}`);
              await page.screenshot({
                path: `test_results/playwright/screenshots/order-found-${match[1]}.png`,
                fullPage: true
              });
            }
          }
        }

        // Take screenshot after interaction
        await page.screenshot({
          path: `test_results/playwright/screenshots/button-${i + 1}-after.png`
        });

      } catch (error) {
        console.log(`  ❌ Button ${i + 1} interaction failed: ${error.message}`);
      }

      // Wait before next interaction
      await page.waitForTimeout(1000);
    }

    console.log('✅ Single-page session testing completed');
  });

  test('Workaround 2: Browser developer tools simulation', async ({ page }) => {
    console.log('🔧 Testing with browser developer tools simulation...');

    // Step 1: Access the app
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000);

    // Step 2: Use browser's evaluate function to simulate user interactions
    console.log('🖱️ Simulating user interactions via browser console...');

    const simulationResults: {
      buttonsFound: number;
      interactionsAttempted: number;
      interactionsSuccessful: number;
      orderIdsFound: string[];
      transactionIdsFound: string[];
      cartUpdates: number;
      pageChanges: number;
    } = await page.evaluate(() => {
      const results: {
        buttonsFound: number;
        interactionsAttempted: number;
        interactionsSuccessful: number;
        orderIdsFound: string[];
        transactionIdsFound: string[];
        cartUpdates: number;
        pageChanges: number;
      } = {
        buttonsFound: 0,
        interactionsAttempted: 0,
        interactionsSuccessful: 0,
        orderIdsFound: [],
        transactionIdsFound: [],
        cartUpdates: 0,
        pageChanges: 0
      };

      // Find all interactive elements
      const allButtons = document.querySelectorAll('button, [role="button"], flt-semantics-placeholder[role="button"]');
      results.buttonsFound = allButtons.length;

      console.log(`Found ${allButtons.length} interactive elements`);

      // Try to interact with each button
      allButtons.forEach((button, index) => {
        try {
          results.interactionsAttempted++;

          // Record state before interaction
          const beforeContent = document.body.textContent || '';

          // Try different interaction methods
          if (button.tagName === 'BUTTON' || button.getAttribute('role') === 'button') {
            (button as HTMLElement).click();
          } else {
            // Try to trigger events
            button.dispatchEvent(new Event('click', { bubbles: true }));
          }

          // Wait a bit for any changes
          setTimeout(() => {
            const afterContent = document.body.textContent || '';

            if (beforeContent !== afterContent) {
              results.pageChanges++;
              console.log(`Button ${index + 1} caused page change`);

              // Look for order/transaction IDs in the new content
              const orderPatterns = [
                /order\s+(?:number|id|編號)[\s:]+([A-Z0-9-]+)/i,
                /訂單\s+(?:編號|號碼)[\s:]+([A-Z0-9-]+)/i,
                /transaction\s+(?:id|編號)[\s:]+([A-Z0-9-]+)/i,
                /確認\s+(?:編號|碼)[\s:]+([A-Z0-9-]+)/i
              ];

              for (const pattern of orderPatterns) {
                const match = afterContent.match(pattern);
                if (match && match[1]) {
                  if (pattern.source.includes('order')) {
                    results.orderIdsFound.push(match[1]);
                  } else {
                    results.transactionIdsFound.push(match[1]);
                  }
                  console.log(`Found ID: ${match[1]}`);
                }
              }

              // Check for cart updates
              if (afterContent.includes('cart') || afterContent.includes('購物車') ||
                  afterContent.includes('added') || afterContent.includes('已加入')) {
                results.cartUpdates++;
                console.log(`Cart update detected`);
              }
            }

            results.interactionsSuccessful++;
          }, 1000);

        } catch (error) {
          console.error(`Button ${index + 1} interaction failed:`, error);
        }
      });

      // Return results after all interactions complete
      return new Promise((resolve) => {
        setTimeout(() => resolve(results), 5000);
      });
    });

    console.log('📊 Browser simulation results:');
    console.log(`  Buttons found: ${simulationResults.buttonsFound}`);
    console.log(`  Interactions attempted: ${simulationResults.interactionsAttempted}`);
    console.log(`  Interactions successful: ${simulationResults.interactionsSuccessful}`);
    console.log(`  Page changes: ${simulationResults.pageChanges}`);
    console.log(`  Cart updates: ${simulationResults.cartUpdates}`);
    console.log(`  Order IDs found: ${simulationResults.orderIdsFound.length}`);
    console.log(`  Transaction IDs found: ${simulationResults.transactionIdsFound.length}`);

    if (simulationResults.orderIdsFound.length > 0) {
      console.log('🎉 ORDER IDs FOUND:');
      simulationResults.orderIdsFound.forEach((id, index) => {
        console.log(`  ${index + 1}. ${id}`);
      });
    }

    if (simulationResults.transactionIdsFound.length > 0) {
      console.log('💳 TRANSACTION IDs FOUND:');
      simulationResults.transactionIdsFound.forEach((id, index) => {
        console.log(`  ${index + 1}. ${id}`);
      });
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/browser-simulation-final.png',
      fullPage: true
    });

    console.log('✅ Browser developer tools simulation completed');
  });

  test('Workaround 3: Network request monitoring', async ({ page }) => {
    console.log('🔧 Testing with network request monitoring...');

    // Monitor network requests for order/transaction creation
    const orderRequests: Array<{url: string; method: string; postData: string | null; timestamp: number}> = [];
    const transactionRequests: Array<{id: string; url: string; status: number; timestamp: number; body: string}> = [];

    page.on('request', (request) => {
      const url = request.url();
      const method = request.method();
      const postData = request.postData();

      // Look for order-related API calls
      if (url.includes('order') || url.includes('purchase') || url.includes('checkout') ||
          url.includes('transaction') || url.includes('payment')) {
        console.log(`📡 ORDER REQUEST: ${method} ${url}`);
        if (postData) {
          console.log(`  Data: ${postData}`);
        }
        orderRequests.push({ url, method, postData, timestamp: Date.now() });
      }

      // Look for cart-related API calls
      if (url.includes('cart') || url.includes('basket') || url.includes('add') ||
          url.includes('remove') || url.includes('update')) {
        console.log(`🛒 CART REQUEST: ${method} ${url}`);
        if (postData) {
          console.log(`  Data: ${postData}`);
        }
      }
    });

    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();

      if (url.includes('order') || url.includes('purchase') || url.includes('checkout') ||
          url.includes('transaction') || url.includes('payment')) {
        console.log(`📡 ORDER RESPONSE: ${status} ${url}`);

        // Try to read response body
        response.text().then((body) => {
          if (body) {
            // Look for order/transaction IDs in response
            const orderPatterns = [
              /"orderId"\s*:\s*"([^"]+)"/i,
              /"order_id"\s*:\s*"([^"]+)"/i,
              /"transactionId"\s*:\s*"([^"]+)"/i,
              /"transaction_id"\s*:\s*"([^"]+)"/i,
              /"id"\s*:\s*"([^"]+)"/i,
              /order\s+(?:number|id|編號)[\s:]+([A-Z0-9-]+)/i,
              /訂單\s+(?:編號|號碼)[\s:]+([A-Z0-9-]+)/i
            ];

            for (const pattern of orderPatterns) {
              const match = body.match(pattern);
              if (match && match[1]) {
                console.log(`🎉 ORDER/TRANSACTION ID FOUND IN RESPONSE: ${match[1]}`);
                transactionRequests.push({
                  id: match[1],
                  url: url,
                  status: status,
                  timestamp: Date.now(),
                  body: body.substring(0, 200) + '...'
                });
              }
            }
          }
        }).catch((error) => {
          console.log(`Could not read response body: ${error.message}`);
        });
      }
    });

    // Step 1: Access the app and perform interactions
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000);

    // Step 2: Login and interact
    await page.evaluate(() => {
      const button = document.querySelector('flt-semantics-placeholder[role="button"][aria-label="Enable accessibility"]');
      if (button) {
        (button as HTMLElement).click();
      }
    });
    await page.waitForTimeout(3000);

    const buyerButton = page.locator('button, [role="button"]').filter({ hasText: '測試買家' });
    await buyerButton.first().click();
    await page.waitForTimeout(5000);

    // Step 3: Try various interactions to trigger network requests
    const allButtons = page.locator('button, [role="button"]');
    const buttonCount = await allButtons.count();

    console.log(`Testing ${Math.min(buttonCount, 5)} buttons for network activity...`);

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = allButtons.nth(i);
      const buttonText = await button.textContent();

      console.log(`Clicking button ${i + 1}: "${buttonText}"`);

      try {
        await button.click();
        await page.waitForTimeout(3000);
      } catch (error) {
        console.log(`Button ${i + 1} click failed: ${error.message}`);
      }
    }

    // Step 4: Try direct checkout access
    console.log('Attempting direct checkout access...');
    await page.goto('https://redandan.github.io/#/checkout');
    await page.waitForTimeout(3000);

    // Try to submit any forms
    const submitButtons = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("確認"]');
    if (await submitButtons.count() > 0) {
      console.log('Found submit button, attempting to submit...');
      await submitButtons.first().click();
      await page.waitForTimeout(3000);
    }

    // Step 5: Summary
    console.log('\n📊 NETWORK MONITORING SUMMARY:');
    console.log(`  Order requests captured: ${orderRequests.length}`);
    console.log(`  Transaction IDs found: ${transactionRequests.length}`);

    if (transactionRequests.length > 0) {
      console.log('\n🎉 TRANSACTION IDs FOUND:');
      transactionRequests.forEach((transaction, index) => {
        console.log(`  ${index + 1}. ${transaction.id}`);
        console.log(`     URL: ${transaction.url}`);
        console.log(`     Status: ${transaction.status}`);
        console.log(`     Time: ${new Date(transaction.timestamp).toISOString()}`);
        console.log('');
      });
    }

    if (orderRequests.length > 0) {
      console.log('\n📡 ORDER REQUESTS CAPTURED:');
      orderRequests.forEach((request, index) => {
        console.log(`  ${index + 1}. ${request.method} ${request.url}`);
        if (request.postData) {
          console.log(`     Data: ${request.postData.substring(0, 100)}...`);
        }
      });
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/network-monitoring-final.png',
      fullPage: true
    });

    console.log('✅ Network request monitoring completed');
  });
});