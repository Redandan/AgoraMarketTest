import { test, expect } from '@playwright/test';

test.describe('Flutter Web Diagnostic Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(30000);

    // Add error handlers
    page.on('pageerror', (error) => {
      console.log(`🚨 Page error: ${error.message}`);
    });

    page.on('crash', () => {
      console.log('🚨 Page crashed!');
    });

    page.on('close', () => {
      console.log('🚨 Page closed unexpectedly!');
    });
  });

  test('Basic Flutter Web page load diagnostic', async ({ page }) => {
    console.log('🔍 Starting Flutter Web diagnostic test...');

    try {
      console.log('1️⃣ Loading page...');
      await page.goto('https://redandan.github.io/#/login', {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      });

      console.log('✅ Page load initiated');

      // Wait for page to stabilize
      await page.waitForTimeout(3000);

      // Take initial screenshot
      await page.screenshot({
        path: 'test_results/playwright/screenshots/diagnostic-initial.png',
        fullPage: true
      });

      console.log('📸 Initial screenshot taken');

      // Get basic page information
      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          hasBody: !!document.body,
          bodyText: document.body?.textContent?.substring(0, 200) || '',
          hasFlutterElements: !!document.querySelector('flt-semantics-placeholder, [class*="flt-"]'),
          buttonCount: document.querySelectorAll('button, [role="button"]').length,
          flutterElementCount: document.querySelectorAll('flt-semantics-placeholder, [class*="flt-"]').length,
          readyState: document.readyState,
          hasScript: !!document.querySelector('script[src*="main.dart.js"]')
        };
      });

      console.log('📊 Page Information:');
      console.log(`  Title: ${pageInfo.title}`);
      console.log(`  URL: ${pageInfo.url}`);
      console.log(`  Has Body: ${pageInfo.hasBody}`);
      console.log(`  Ready State: ${pageInfo.readyState}`);
      console.log(`  Has Flutter Elements: ${pageInfo.hasFlutterElements}`);
      console.log(`  Button Count: ${pageInfo.buttonCount}`);
      console.log(`  Flutter Element Count: ${pageInfo.flutterElementCount}`);
      console.log(`  Has Flutter Script: ${pageInfo.hasScript}`);
      console.log(`  Body Text Preview: ${pageInfo.bodyText}`);

      // Wait for network to be idle
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        console.log('⚠️ Network idle timeout - continuing anyway');
      });

      // Take screenshot after network idle
      await page.screenshot({
        path: 'test_results/playwright/screenshots/diagnostic-after-network-idle.png',
        fullPage: true
      });

      console.log('📸 Network idle screenshot taken');

      // Try to find and list all interactive elements
      const interactiveElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, [role="button"], flt-semantics-placeholder, [onclick]'));
        return elements.map((el, index) => ({
          index: index + 1,
          tagName: el.tagName,
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          text: el.textContent?.substring(0, 50) || '',
          className: el.className,
          isVisible: (el as HTMLElement).offsetWidth > 0 && (el as HTMLElement).offsetHeight > 0,
          boundingRect: el.getBoundingClientRect()
        }));
      });

      console.log(`\n🎯 Found ${interactiveElements.length} interactive elements:`);
      interactiveElements.slice(0, 10).forEach(el => {
        console.log(`  ${el.index}. ${el.tagName}[${el.role}] "${el.text}" (visible: ${el.isVisible})`);
      });

      // Take final screenshot
      await page.screenshot({
        path: 'test_results/playwright/screenshots/diagnostic-final.png',
        fullPage: true
      });

      console.log('📸 Final screenshot taken');

      // Test passes if we can load the page and get information
      expect(pageInfo.hasBody).toBe(true);
      expect(pageInfo.title).toBeTruthy();

      console.log('✅ Diagnostic test completed successfully!');

    } catch (error) {
      console.log(`❌ Diagnostic test failed: ${error.message}`);

      // Take error screenshot
      await page.screenshot({
        path: 'test_results/playwright/screenshots/diagnostic-error.png',
        fullPage: true
      }).catch(() => console.log('Could not take error screenshot'));

      throw error;
    }
  });

  test('Flutter element interaction diagnostic', async ({ page }) => {
    console.log('🔍 Starting Flutter element interaction diagnostic...');

    try {
      await page.goto('https://redandan.github.io/#/login', {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      });

      await page.waitForTimeout(5000);

      // Try to find accessibility button specifically
      const accessibilityButton = page.locator('flt-semantics-placeholder[role="button"][aria-label="Enable accessibility"]');

      if (await accessibilityButton.count() > 0) {
        console.log('🎯 Found accessibility button!');

        // Get button information
        const buttonInfo = await accessibilityButton.evaluate((el) => ({
          tagName: el.tagName,
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          text: el.textContent,
          className: el.className,
          boundingRect: el.getBoundingClientRect(),
          isVisible: el.offsetWidth > 0 && el.offsetHeight > 0,
          isInViewport: el.getBoundingClientRect().top >= 0 && el.getBoundingClientRect().bottom <= window.innerHeight
        }));

        console.log('📊 Accessibility Button Info:');
        console.log(`  Tag: ${buttonInfo.tagName}`);
        console.log(`  Role: ${buttonInfo.role}`);
        console.log(`  Aria Label: ${buttonInfo.ariaLabel}`);
        console.log(`  Text: ${buttonInfo.text}`);
        console.log(`  Visible: ${buttonInfo.isVisible}`);
        console.log(`  In Viewport: ${buttonInfo.isInViewport}`);
        console.log(`  Position: ${buttonInfo.boundingRect.top}, ${buttonInfo.boundingRect.left}`);

        // Take screenshot of button area
        await page.screenshot({
          path: 'test_results/playwright/screenshots/diagnostic-accessibility-button.png',
          fullPage: true
        });

        // Try to scroll button into view
        await accessibilityButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);

        console.log('✅ Button scrolled into view');

        // Take screenshot after scroll
        await page.screenshot({
          path: 'test_results/playwright/screenshots/diagnostic-after-scroll.png',
          fullPage: true
        });

        // Try gentle click
        console.log('🖱️ Attempting gentle click...');
        await accessibilityButton.click({ force: false, timeout: 5000 });

        console.log('✅ Gentle click successful!');

        // Wait and take screenshot
        await page.waitForTimeout(2000);
        await page.screenshot({
          path: 'test_results/playwright/screenshots/diagnostic-after-click.png',
          fullPage: true
        });

      } else {
        console.log('❌ Accessibility button not found');

        // List all flt-semantics-placeholder elements
        const flutterElements = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('flt-semantics-placeholder'));
          return elements.map((el, index) => ({
            index: index + 1,
            tagName: el.tagName,
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label'),
            text: el.textContent?.substring(0, 50) || '',
            boundingRect: el.getBoundingClientRect()
          }));
        });

        console.log(`📊 Found ${flutterElements.length} Flutter elements:`);
        flutterElements.forEach(el => {
          console.log(`  ${el.index}. ${el.tagName}[${el.role}] "${el.text}"`);
        });
      }

      console.log('✅ Flutter interaction diagnostic completed!');

    } catch (error) {
      console.log(`❌ Flutter interaction diagnostic failed: ${error.message}`);
      throw error;
    }
  });
});