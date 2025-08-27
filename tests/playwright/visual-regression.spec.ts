import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Homepage visual regression', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot for visual comparison
    await page.screenshot({
      path: 'test_results/playwright/screenshots/homepage-current.png',
      fullPage: true
    });

    // Additional screenshots for different sections
    const sections = [
      { name: 'header', selector: 'header, nav, .header, .nav' },
      { name: 'main-content', selector: 'main, .main, #main' },
      { name: 'footer', selector: 'footer, .footer, #footer' }
    ];

    for (const section of sections) {
      const element = page.locator(section.selector).first();
      if (await element.count() > 0) {
        await element.screenshot({
          path: `test_results/playwright/screenshots/${section.name}-current.png`
        });
      }
    }

    console.log('Visual regression screenshots captured');
  });

  test('Responsive design visual test', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `test_results/playwright/screenshots/responsive-${viewport.name}.png`,
        fullPage: true
      });

      console.log(`Captured ${viewport.name} viewport screenshot`);
    }
  });

  test('Interactive elements visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test button hover states
    const buttons = page.locator('button, .button, [role="button"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // Take screenshot before hover
      await page.screenshot({
        path: 'test_results/playwright/screenshots/buttons-normal.png'
      });

      // Hover over first button
      await buttons.first().hover();
      await page.waitForTimeout(500);

      // Take screenshot after hover
      await page.screenshot({
        path: 'test_results/playwright/screenshots/buttons-hover.png'
      });

      console.log('Button hover states captured');
    }

    // Test link hover states
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    if (linkCount > 0) {
      await links.first().hover();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'test_results/playwright/screenshots/links-hover.png'
      });

      console.log('Link hover states captured');
    }
  });

  test('Form elements visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for form elements
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      // Take screenshot of form in normal state
      await page.screenshot({
        path: 'test_results/playwright/screenshots/form-normal.png'
      });

      // Focus on first input
      await inputs.first().focus();
      await page.waitForTimeout(500);

      // Take screenshot of focused state
      await page.screenshot({
        path: 'test_results/playwright/screenshots/form-focused.png'
      });

      // Type some text if it's a text input
      const firstInput = inputs.first();
      const inputType = await firstInput.getAttribute('type');

      if (!inputType || inputType === 'text' || inputType === 'email') {
        await firstInput.fill('Test input');
        await page.waitForTimeout(500);

        await page.screenshot({
          path: 'test_results/playwright/screenshots/form-filled.png'
        });
      }

      console.log('Form element states captured');
    }
  });

  test('Loading states visual test', async ({ page }) => {
    // Navigate to page and capture loading states
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Take early screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/loading-early.png'
    });

    // Wait for more content to load
    await page.waitForLoadState('networkidle');

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/loading-complete.png'
    });

    console.log('Loading states captured');
  });

  test('Cross-browser visual comparison', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take browser-specific screenshot
    await page.screenshot({
      path: `test_results/playwright/screenshots/browser-${browserName}.png`,
      fullPage: true
    });

    // Get page metrics for comparison
    const metrics = await page.evaluate(() => {
      return {
        title: document.title,
        bodyHeight: document.body.scrollHeight,
        bodyWidth: document.body.scrollWidth,
        hasHeader: !!document.querySelector('header, nav, .header, .nav'),
        hasFooter: !!document.querySelector('footer, .footer, #footer'),
        linkCount: document.querySelectorAll('a[href]').length,
        imageCount: document.querySelectorAll('img').length
      };
    });

    console.log(`Browser ${browserName} metrics:`, metrics);

    // Save metrics for comparison
    const fs = require('fs');
    const path = require('path');

    const metricsPath = path.join('test_results', 'playwright', `metrics-${browserName}.json`);
    fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
  });
});