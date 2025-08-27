import { test, expect } from '@playwright/test';

test.describe('Flutter Web Login Interaction Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Interact with Flutter login elements', async ({ page }) => {
    console.log('🎯 Starting Flutter Web login interaction test...');

    // Navigate to login page
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(5000); // Wait for Flutter app to load

    // Take initial screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/flutter-login-initial.png',
      fullPage: true
    });

    console.log('=== FLUTTER APP ANALYSIS ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    // Check for Flutter-specific elements
    const flutterView = page.locator('flutter-view');
    const fltElements = page.locator('[class*="flt-"], [id*="flt-"]');
    const semanticsElements = page.locator('flt-semantics, [class*="semantics"]');

    console.log('Flutter elements found:');
    console.log('  flutter-view:', await flutterView.count());
    console.log('  flt-* elements:', await fltElements.count());
    console.log('  semantics elements:', await semanticsElements.count());

    // Analyze the button-like element we found
    const buttonElement = page.locator('[role="button"], flt-semantics-placeholder[role="button"]');
    const buttonCount = await buttonElement.count();

    console.log('\n=== BUTTON ANALYSIS ===');
    console.log('Button-like elements:', buttonCount);

    if (buttonCount > 0) {
      for (let i = 0; i < buttonCount; i++) {
        const button = buttonElement.nth(i);
        const tagName = await button.evaluate(el => el.tagName);
        const role = await button.getAttribute('role');
        const text = await button.textContent();
        const className = await button.getAttribute('class');
        const id = await button.getAttribute('id');
        const boundingBox = await button.boundingBox();

        console.log(`\nButton ${i + 1} details:`);
        console.log(`  Tag: ${tagName}`);
        console.log(`  Role: ${role}`);
        console.log(`  Text: "${text}"`);
        console.log(`  Class: ${className}`);
        console.log(`  ID: ${id}`);
        console.log(`  Visible: ${boundingBox !== null}`);
        console.log(`  Position: ${boundingBox ? `x:${boundingBox.x}, y:${boundingBox.y}, w:${boundingBox.width}, h:${boundingBox.height}` : 'N/A'}`);

        // Check if button is visible and enabled
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();

        console.log(`  Is visible: ${isVisible}`);
        console.log(`  Is enabled: ${isEnabled}`);

        // Try to click the button if it's visible and enabled
        if (isVisible && isEnabled) {
          console.log(`  🔄 Attempting to click button ${i + 1}...`);

          try {
            // Take screenshot before click
            await page.screenshot({
              path: `test_results/playwright/screenshots/before-click-button-${i + 1}.png`,
              fullPage: true
            });

            // Click the button
            await button.click();
            await page.waitForTimeout(3000);

            // Take screenshot after click
            await page.screenshot({
              path: `test_results/playwright/screenshots/after-click-button-${i + 1}.png`,
              fullPage: true
            });

            console.log(`  ✅ Button ${i + 1} clicked successfully`);

            // Check if page changed
            const newUrl = page.url();
            const newTitle = await page.title();
            const newButtonCount = await buttonElement.count();

            console.log(`  New URL: ${newUrl}`);
            console.log(`  New title: ${newTitle}`);
            console.log(`  New button count: ${newButtonCount}`);

            // Check for new elements that might appear
            const newInputs = page.locator('input, flt-semantics input');
            const newInputCount = await newInputs.count();
            console.log(`  New input elements: ${newInputCount}`);

            const newForms = page.locator('form, flt-semantics form');
            const newFormCount = await newForms.count();
            console.log(`  New form elements: ${newFormCount}`);

            // Check for login-related text that might appear
            const pageText = await page.textContent('body');
            const hasLoginText = pageText?.toLowerCase().includes('login') ||
                                pageText?.toLowerCase().includes('登入') ||
                                pageText?.toLowerCase().includes('username') ||
                                pageText?.toLowerCase().includes('password');

            console.log(`  Login-related text appeared: ${hasLoginText}`);

            if (hasLoginText) {
              console.log(`  🚨 LOGIN FORM DETECTED AFTER CLICK!`);
              console.log(`  Page text preview: ${pageText?.substring(0, 200)}...`);
            }

          } catch (error) {
            console.log(`  ❌ Failed to click button ${i + 1}: ${error.message}`);
          }
        } else {
          console.log(`  ⏭️  Skipping button ${i + 1} (not visible or not enabled)`);
        }
      }
    }

    // Check for any text input areas in Flutter
    console.log('\n=== FLUTTER INPUT DETECTION ===');
    const flutterInputs = page.locator('flt-semantics input, flt-semantics textarea, [contenteditable]');
    const flutterInputCount = await flutterInputs.count();
    console.log('Flutter input elements:', flutterInputCount);

    if (flutterInputCount > 0) {
      console.log('Flutter input details:');
      for (let i = 0; i < flutterInputCount; i++) {
        const input = flutterInputs.nth(i);
        const tagName = await input.evaluate(el => el.tagName);
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        const boundingBox = await input.boundingBox();

        console.log(`  Input ${i + 1}: ${tagName} type=${type} placeholder=${placeholder}`);
        console.log(`    Position: ${boundingBox ? `x:${boundingBox.x}, y:${boundingBox.y}` : 'N/A'}`);
        console.log(`    Visible: ${boundingBox !== null}`);
      }
    }

    // Try to find any clickable areas that might reveal login
    console.log('\n=== CLICKABLE AREA DETECTION ===');
    const clickableAreas = page.locator('*').filter({ hasText: /login|登入|sign|auth/i });
    const clickableAreaCount = await clickableAreas.count();
    console.log('Clickable areas with auth text:', clickableAreaCount);

    // Try keyboard navigation
    console.log('\n=== KEYBOARD NAVIGATION TEST ===');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    const focusedElement = page.locator(':focus');
    const focusedTag = await focusedElement.evaluate(el => el.tagName);
    const focusedText = await focusedElement.textContent();

    console.log('Focused element after Tab:');
    console.log('  Tag:', focusedTag);
    console.log('  Text:', focusedText);

    // Try multiple tabs
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);

      const currentFocused = page.locator(':focus');
      const currentTag = await currentFocused.evaluate(el => el.tagName);
      const currentText = await currentFocused.textContent();

      console.log(`  Tab ${i + 2} - Tag: ${currentTag}, Text: "${currentText}"`);
    }

    // Check for any modal or overlay that might contain login
    console.log('\n=== MODAL/OVERLAY DETECTION ===');
    const modals = page.locator('[role="dialog"], [class*="modal"], [class*="overlay"], [class*="popup"]');
    const modalCount = await modals.count();
    console.log('Modal/overlay elements:', modalCount);

    // Final assessment
    console.log('\n=== FINAL ASSESSMENT ===');

    const hasFlutterButton = buttonCount > 0;
    const hasFlutterInputs = flutterInputCount > 0;
    const hasClickableAuthAreas = clickableAreaCount > 0;

    console.log('Flutter Web App Assessment:');
    console.log('  Has Flutter button elements:', hasFlutterButton);
    console.log('  Has Flutter input elements:', hasFlutterInputs);
    console.log('  Has clickable auth areas:', hasClickableAuthAreas);
    console.log('  Appears to be functional Flutter app:', hasFlutterButton || hasFlutterInputs);

    if (hasFlutterButton) {
      console.log('✅ CONCLUSION: This Flutter Web app HAS interactive elements that could be login functionality!');
      console.log('💡 RECOMMENDATION: The login functionality exists but may need specific user interaction to activate.');
    } else {
      console.log('❌ CONCLUSION: No interactive elements found in this Flutter Web app.');
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/flutter-login-final.png',
      fullPage: true
    });

    console.log('\n🎉 Flutter Web login interaction test completed!');
  });
});