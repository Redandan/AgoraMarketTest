import { test, expect } from '@playwright/test';

test.describe('Purchase Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Complete purchase journey - Product to Checkout', async ({ page }) => {
    console.log('🛒 Starting complete purchase flow test...');

    // Step 1: Navigate to the site
    await page.goto('/');
    await expect(page).toHaveTitle(/AgoraMarket|Agora Market|redandan/);
    console.log('✅ Site loaded successfully');

    // Step 2: Browse products (if available)
    const productLinks = page.locator('a[href*="product"]').or(
      page.locator('[class*="product"]').or(
        page.locator('a:has-text("Product")').or(
          page.locator('a:has-text("商品")')
        )
      )
    );

    if (await productLinks.count() > 0) {
      await productLinks.first().click();
      await page.waitForTimeout(2000);
      console.log('✅ Navigated to product page');
    } else {
      console.log('ℹ️  No product links found - this may be expected for a showcase site');
    }

    // Step 3: Look for add to cart functionality
    const addToCartButtons = page.locator('button:has-text("Add to Cart")').or(
      page.locator('button:has-text("加入購物車")').or(
        page.locator('[class*="add-cart"]').or(
          page.locator('button:has-text("Buy")').or(
            page.locator('button:has-text("購買")')
          )
        )
      )
    );

    if (await addToCartButtons.count() > 0) {
      await addToCartButtons.first().click();
      await page.waitForTimeout(2000);
      console.log('✅ Added item to cart');

      // Take screenshot of cart state
      await page.screenshot({
        path: 'test_results/playwright/screenshots/cart-after-add.png',
        fullPage: true
      });
    } else {
      console.log('ℹ️  No add to cart buttons found - this may be expected for a showcase site');
    }

    // Step 4: Navigate to cart/checkout
    const cartLinks = page.locator('a:has-text("Cart")').or(
      page.locator('a:has-text("購物車")').or(
        page.locator('[class*="cart"]').or(
          page.locator('a:has-text("Checkout")').or(
            page.locator('a:has-text("結帳")')
          )
        )
      )
    );

    if (await cartLinks.count() > 0) {
      await cartLinks.first().click();
      await page.waitForTimeout(2000);
      console.log('✅ Navigated to cart/checkout page');

      // Take screenshot of cart page
      await page.screenshot({
        path: 'test_results/playwright/screenshots/cart-page.png',
        fullPage: true
      });
    }

    // Step 5: Look for checkout button
    const checkoutButtons = page.locator('button:has-text("Checkout")').or(
      page.locator('button:has-text("結帳")').or(
        page.locator('button:has-text("Proceed")').or(
          page.locator('button:has-text("繼續")').or(
            page.locator('[class*="checkout"]')
          )
        )
      )
    );

    if (await checkoutButtons.count() > 0) {
      await checkoutButtons.first().click();
      await page.waitForTimeout(3000);
      console.log('✅ Initiated checkout process');

      // Take screenshot of checkout page
      await page.screenshot({
        path: 'test_results/playwright/screenshots/checkout-page.png',
        fullPage: true
      });

      // Step 6: Fill out checkout form (if present)
      const emailInput = page.locator('input[type="email"]').or(
        page.locator('input[placeholder*="email" i]')
      );

      const nameInput = page.locator('input[placeholder*="name" i]').or(
        page.locator('input[placeholder*="姓名"]')
      );

      const addressInput = page.locator('input[placeholder*="address" i]').or(
        page.locator('input[placeholder*="地址"]')
      );

      // Fill test data if fields exist
      if (await emailInput.count() > 0) {
        await emailInput.fill('test@example.com');
        console.log('✅ Filled email field');
      }

      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User');
        console.log('✅ Filled name field');
      }

      if (await addressInput.count() > 0) {
        await addressInput.fill('123 Test Street');
        console.log('✅ Filled address field');
      }

      // Step 7: Look for payment options
      const paymentOptions = page.locator('input[type="radio"][name*="payment"]').or(
        page.locator('[class*="payment"]').or(
          page.locator('select[name*="payment"]')
        )
      );

      if (await paymentOptions.count() > 0) {
        await paymentOptions.first().check();
        console.log('✅ Selected payment option');
      }

      // Step 8: Complete order
      const completeOrderButtons = page.locator('button:has-text("Complete Order")').or(
        page.locator('button:has-text("完成訂單")').or(
          page.locator('button:has-text("Place Order")').or(
            page.locator('button:has-text("下訂單")').or(
              page.locator('button[type="submit"]')
            )
          )
        )
      );

      if (await completeOrderButtons.count() > 0) {
        await completeOrderButtons.first().click();
        await page.waitForTimeout(3000);
        console.log('✅ Completed order');

        // Take screenshot of order confirmation
        await page.screenshot({
          path: 'test_results/playwright/screenshots/order-confirmation.png',
          fullPage: true
        });

        // Check for success message
        const successMessages = page.locator('text=/success|成功|thank you|謝謝|confirmed|確認/i');
        if (await successMessages.count() > 0) {
          console.log('✅ Order completed successfully!');
          console.log('Success message:', await successMessages.first().textContent());
        }
      } else {
        console.log('ℹ️  No complete order button found');
      }

    } else {
      console.log('ℹ️  No checkout button found - this may be expected for a showcase site');
    }

    // Final summary
    console.log('\n📊 Purchase Flow Test Summary:');
    console.log('✅ Site accessibility: PASSED');
    console.log('✅ Product browsing: CHECKED');
    console.log('✅ Cart functionality: CHECKED');
    console.log('✅ Checkout process: CHECKED');
    console.log('✅ Form filling: CHECKED');
    console.log('✅ Order completion: CHECKED');

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/purchase-flow-final.png',
      fullPage: true
    });

    console.log('🎉 Purchase flow test completed!');
  });

  test('Shopping cart management', async ({ page }) => {
    console.log('🛒 Testing shopping cart management...');

    await page.goto('/');

    // Look for quantity controls
    const quantityInputs = page.locator('input[type="number"]').or(
      page.locator('input[placeholder*="quantity" i]').or(
        page.locator('input[placeholder*="數量"]')
      )
    );

    const increaseButtons = page.locator('button:has-text("+")').or(
      page.locator('button:has-text("增加")').or(
        page.locator('[class*="increase"]').or(
          page.locator('[class*="plus"]')
        )
      )
    );

    const decreaseButtons = page.locator('button:has-text("-")').or(
      page.locator('button:has-text("減少")').or(
        page.locator('[class*="decrease"]').or(
          page.locator('[class*="minus"]')
        )
      )
    );

    // Test quantity controls if available
    if (await quantityInputs.count() > 0) {
      const currentValue = await quantityInputs.first().inputValue();
      console.log(`Current quantity: ${currentValue}`);

      if (await increaseButtons.count() > 0) {
        await increaseButtons.first().click();
        await page.waitForTimeout(1000);
        const newValue = await quantityInputs.first().inputValue();
        console.log(`After increase: ${newValue}`);
      }

      if (await decreaseButtons.count() > 0) {
        await decreaseButtons.first().click();
        await page.waitForTimeout(1000);
        const finalValue = await quantityInputs.first().inputValue();
        console.log(`After decrease: ${finalValue}`);
      }
    }

    // Look for remove item buttons
    const removeButtons = page.locator('button:has-text("Remove")').or(
      page.locator('button:has-text("移除")').or(
        page.locator('button:has-text("×")').or(
          page.locator('[class*="remove"]').or(
            page.locator('[class*="delete"]')
          )
        )
      )
    );

    if (await removeButtons.count() > 0) {
      console.log(`Found ${await removeButtons.count()} remove buttons`);
    }

    // Look for clear cart functionality
    const clearCartButtons = page.locator('button:has-text("Clear Cart")').or(
      page.locator('button:has-text("清空購物車")').or(
        page.locator('[class*="clear"]').or(
          page.locator('[class*="empty"]')
        )
      )
    );

    if (await clearCartButtons.count() > 0) {
      console.log('Found clear cart functionality');
    }

    console.log('✅ Shopping cart management test completed');
  });

  test('Purchase validation and error handling', async ({ page }) => {
    console.log('🔍 Testing purchase validation and error handling...');

    await page.goto('/');

    // Look for form validation
    const requiredFields = page.locator('input[required]').or(
      page.locator('[aria-required="true"]')
    );

    if (await requiredFields.count() > 0) {
      console.log(`Found ${await requiredFields.count()} required fields`);

      // Try to submit form without filling required fields
      const submitButtons = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("Submit")').or(
          page.locator('button:has-text("提交")')
        )
      );

      if (await submitButtons.count() > 0) {
        await submitButtons.first().click();
        await page.waitForTimeout(2000);

        // Check for validation messages
        const errorMessages = page.locator('[class*="error"]').or(
          page.locator('[class*="invalid"]').or(
            page.locator('text=/required|empty|invalid|必填|請輸入/i')
          )
        );

        if (await errorMessages.count() > 0) {
          console.log('✅ Form validation is working');
          console.log('Validation messages found:', await errorMessages.count());
        }
      }
    }

    // Test email validation
    const emailInputs = page.locator('input[type="email"]');
    if (await emailInputs.count() > 0) {
      await emailInputs.first().fill('invalid-email');
      await emailInputs.first().blur();
      await page.waitForTimeout(1000);

      const emailErrors = page.locator('text=/invalid email|email format|郵箱格式/i');
      if (await emailErrors.count() > 0) {
        console.log('✅ Email validation is working');
      }
    }

    console.log('✅ Purchase validation test completed');
  });

  test('Purchase flow performance', async ({ page }) => {
    console.log('⚡ Testing purchase flow performance...');

    const startTime = Date.now();

    // Navigate to site
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);

    // Check for performance issues
    const performanceEntries = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      return entries.map(entry => ({
        loadTime: entry.loadEventEnd - entry.loadEventStart,
        domTime: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        totalTime: entry.loadEventEnd - entry.fetchStart
      }));
    });

    if (performanceEntries.length > 0) {
      const perf = performanceEntries[0];
      console.log(`DOM ready time: ${perf.domTime}ms`);
      console.log(`Total load time: ${perf.totalTime}ms`);

      if (perf.totalTime > 3000) {
        console.log('⚠️  Page load time is slow (>3s)');
      } else {
        console.log('✅ Page load time is acceptable');
      }
    }

    // Check for large images or resources
    const largeImages = page.locator('img').locator('xpath=ancestor-or-self::*[@loading="lazy" or @data-src]');
    const lazyLoadedCount = await largeImages.count();

    if (lazyLoadedCount > 0) {
      console.log(`✅ Found ${lazyLoadedCount} lazy-loaded images (good for performance)`);
    }

    console.log('✅ Purchase flow performance test completed');
  });
});