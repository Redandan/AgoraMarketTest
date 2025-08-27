import { test, expect } from '@playwright/test';

test.describe('AgoraMarket User Journey Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Complete user login journey', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');

    // Wait for page to load
    await expect(page).toHaveTitle(/AgoraMarket|Agora Market|redandan/);

    // Look for login elements
    const loginButton = page.locator('button:has-text("Login")').or(
      page.locator('button:has-text("登入")')
    ).or(
      page.locator('a:has-text("Login")')
    ).or(
      page.locator('a:has-text("登入")')
    );

    // If login button exists, click it
    if (await loginButton.count() > 0) {
      await loginButton.first().click();

      // Wait for login form or redirect
      await page.waitForTimeout(2000);

      // Check if we're on a login page
      const currentUrl = page.url();
      if (currentUrl.includes('login') || currentUrl.includes('signin')) {
        // Try to fill login form
        const emailInput = page.locator('input[type="email"]').or(
          page.locator('input[placeholder*="email"]').or(
            page.locator('input[placeholder*="郵箱"]')
          )
        );

        const passwordInput = page.locator('input[type="password"]').or(
          page.locator('input[placeholder*="password"]').or(
            page.locator('input[placeholder*="密碼"]')
          )
        );

        if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
          await emailInput.fill('autotest@agoramarket.com');
          await passwordInput.fill('AutoTest123!');

          const submitButton = page.locator('button[type="submit"]').or(
            page.locator('button:has-text("Login")').or(
              page.locator('button:has-text("登入")').or(
                page.locator('input[type="submit"]')
              )
            )
          );

          if (await submitButton.count() > 0) {
            await submitButton.click();
            await page.waitForTimeout(3000);
          }
        }
      }
    }

    // Verify we're logged in or on the correct page
    await expect(page).toHaveURL(/.*redandan\.github\.io.*/);
  });

  test('Product browsing journey', async ({ page }) => {
    await page.goto('/');

    // Look for product-related elements
    const products = page.locator('[class*="product"]').or(
      page.locator('[class*="item"]').or(
        page.locator('[class*="card"]')
      )
    );

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'test_results/playwright/screenshots/product-browse.png',
      fullPage: true
    });

    // If products exist, interact with them
    if (await products.count() > 0) {
      await products.first().click();
      await page.waitForTimeout(2000);

      // Look for product details
      const productTitle = page.locator('h1').or(page.locator('h2')).or(page.locator('[class*="title"]'));
      if (await productTitle.count() > 0) {
        console.log('Found product title:', await productTitle.first().textContent());
      }
    }

    // Check for navigation elements
    const navLinks = page.locator('nav a').or(page.locator('.nav a')).or(page.locator('a[href]'));
    console.log('Found navigation links:', await navLinks.count());
  });

  test('Shopping cart journey', async ({ page }) => {
    await page.goto('/');

    // Look for cart-related elements
    const cartButton = page.locator('[class*="cart"]').or(
      page.locator('[class*="basket"]').or(
        page.locator('button:has-text("Cart")').or(
          page.locator('button:has-text("購物車")')
        )
      )
    );

    if (await cartButton.count() > 0) {
      await cartButton.first().click();
      await page.waitForTimeout(2000);

      // Take screenshot of cart page
      await page.screenshot({
        path: 'test_results/playwright/screenshots/cart-page.png',
        fullPage: true
      });
    }

    // Look for add to cart buttons
    const addToCartButtons = page.locator('button:has-text("Add to Cart")').or(
      page.locator('button:has-text("加入購物車")').or(
        page.locator('[class*="add-cart"]')
      )
    );

    if (await addToCartButtons.count() > 0) {
      await addToCartButtons.first().click();
      await page.waitForTimeout(2000);
      console.log('Added item to cart');
    }
  });

  test('Mobile responsiveness test', async ({ page, browserName }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.waitForTimeout(2000);

    // Take mobile screenshot
    await page.screenshot({
      path: `test_results/playwright/screenshots/mobile-${browserName}.png`,
      fullPage: true
    });

    // Check if page is responsive
    const body = page.locator('body');
    const boundingBox = await body.boundingBox();

    if (boundingBox) {
      console.log(`Mobile viewport test - Page width: ${boundingBox.width}`);
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
  });

  test('Cross-browser compatibility', async ({ page, browserName }) => {
    await page.goto('/');

    // Basic functionality test across browsers
    const title = await page.title();
    expect(title).toBeTruthy();

    // Take browser-specific screenshot
    await page.screenshot({
      path: `test_results/playwright/screenshots/browser-${browserName}.png`,
      fullPage: true
    });

    console.log(`Test completed on ${browserName}`);
  });
});