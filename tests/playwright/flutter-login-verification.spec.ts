import { test, expect } from '@playwright/test';

test.describe('Flutter Web Login Functionality Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    // Set longer timeout for Flutter app loading
    page.setDefaultTimeout(60000);
  });

  test('Verify Flutter Web login functionality can be tested', async ({ page }) => {
    console.log('🔬 Starting Flutter Web login functionality verification...');

    // Step 1: Navigate and wait for Flutter app to load
    console.log('\n1️⃣ Loading Flutter Web application...');
    await page.goto('https://redandan.github.io/#/login');

    // Wait for Flutter app to initialize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000); // Give Flutter app time to fully load

    console.log('✅ Flutter app loaded');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    // Step 2: Verify this is a Flutter Web app
    console.log('\n2️⃣ Verifying Flutter Web app characteristics...');
    const flutterView = page.locator('flutter-view');
    const fltElements = page.locator('[class*="flt-"], [id*="flt-"]');
    const flutterScripts = page.locator('script[src*="main.dart.js"]');

    const isFlutterApp = (await flutterView.count() > 0) &&
                        (await fltElements.count() > 0) &&
                        (await flutterScripts.count() > 0);

    console.log('Flutter Web app verification:');
    console.log('  flutter-view elements:', await flutterView.count());
    console.log('  flt-* elements:', await fltElements.count());
    console.log('  Flutter scripts:', await flutterScripts.count());
    console.log('  Is Flutter Web app:', isFlutterApp ? '✅ YES' : '❌ NO');

    if (!isFlutterApp) {
      console.log('❌ This does not appear to be a Flutter Web application');
      return;
    }

    // Step 3: Analyze all interactive elements
    console.log('\n3️⃣ Analyzing interactive elements...');

    // Get all button-like elements (including Flutter semantics)
    const allButtons = page.locator(`
      button,
      [role="button"],
      input[type="submit"],
      input[type="button"],
      flt-semantics-placeholder[role="button"],
      [aria-label*="button" i],
      [onclick],
      [onmousedown]
    `);

    const buttonCount = await allButtons.count();
    console.log('Total button-like elements found:', buttonCount);

    // Analyze each button
    const buttonDetails: any[] = [];
    for (let i = 0; i < buttonCount; i++) {
      const button = allButtons.nth(i);
      const details = await button.evaluate((el, index) => {
        const htmlEl = el as HTMLElement;
        return {
          index: index + 1,
          tagName: el.tagName,
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          textContent: el.textContent?.trim() || '',
          className: htmlEl.className || '',
          id: htmlEl.id || '',
          boundingBox: el.getBoundingClientRect(),
          isVisible: htmlEl.offsetWidth > 0 && htmlEl.offsetHeight > 0,
          isEnabled: !(htmlEl as any).disabled,
          hasClickHandler: htmlEl.onclick !== null || htmlEl.hasAttribute('onclick')
        };
      }, i);

      buttonDetails.push(details);

      console.log(`\nButton ${details.index} analysis:`);
      console.log(`  Tag: ${details.tagName}`);
      console.log(`  Role: ${details.role}`);
      console.log(`  Aria-label: ${details.ariaLabel}`);
      console.log(`  Text: "${details.textContent}"`);
      console.log(`  Position: x:${details.boundingBox.x}, y:${details.boundingBox.y}`);
      console.log(`  Size: ${details.boundingBox.width} x ${details.boundingBox.height}`);
      console.log(`  Visible: ${details.isVisible}`);
      console.log(`  Enabled: ${details.isEnabled}`);
      console.log(`  Has click handler: ${details.hasClickHandler}`);
    }

    // Step 4: Test button interactions safely
    console.log('\n4️⃣ Testing button interactions...');

    let loginFunctionalityDetected = false;
    let testResults: any[] = [];

    for (let i = 0; i < buttonDetails.length; i++) {
      const buttonDetail = buttonDetails[i];
      const button = allButtons.nth(i);

      console.log(`\n🧪 Testing Button ${buttonDetail.index} (${buttonDetail.ariaLabel || buttonDetail.textContent || 'No label'})`);

      // Skip if button is not visible or not enabled
      if (!buttonDetail.isVisible || !buttonDetail.isEnabled) {
        console.log(`  ⏭️  Skipping - not visible or not enabled`);
        testResults.push({
          button: buttonDetail.index,
          result: 'skipped',
          reason: 'not visible or not enabled'
        });
        continue;
      }

      try {
        // Take screenshot before interaction
        await page.screenshot({
          path: `test_results/playwright/screenshots/before-button-${buttonDetail.index}.png`
        });

        // Try to click the button with error handling
        console.log(`  🔄 Attempting to click...`);

        // Use a safer click method for Flutter elements
        if (buttonDetail.tagName.includes('FLT-SEMANTICS')) {
          // For Flutter semantics elements, try different interaction methods
          await button.focus();
          await page.keyboard.press('Enter');
        } else {
          // For regular HTML elements
          await button.click({ timeout: 5000 });
        }

        // Wait for potential state changes
        await page.waitForTimeout(3000);

        // Take screenshot after interaction
        await page.screenshot({
          path: `test_results/playwright/screenshots/after-button-${buttonDetail.index}.png`
        });

        // Check for new elements that might indicate login functionality
        const newInputs = page.locator('input:not([type="hidden"]), flt-semantics input');
        const newTextareas = page.locator('textarea, flt-semantics textarea');
        const newSelects = page.locator('select, flt-semantics select');
        const newButtons = page.locator('button:not(:nth-child(-n+3))'); // Exclude original buttons

        const inputCount = await newInputs.count();
        const textareaCount = await newTextareas.count();
        const selectCount = await newSelects.count();
        const newButtonCount = await newButtons.count();

        console.log(`  📊 Elements after click:`);
        console.log(`    New inputs: ${inputCount}`);
        console.log(`    New textareas: ${textareaCount}`);
        console.log(`    New selects: ${selectCount}`);
        console.log(`    New buttons: ${newButtonCount}`);

        // Check for login-related content
        const pageText = await page.textContent('body');
        const hasLoginKeywords = /\b(login|signin|sign in|log in|auth|authentication|username|password|email)\b/i.test(pageText || '');
        const hasChineseLoginKeywords = /\b(登入|登錄|註冊|注冊|用戶名|密碼|郵箱|邮箱)\b/.test(pageText || '');

        console.log(`  🔍 Login keywords found: ${hasLoginKeywords || hasChineseLoginKeywords}`);

        // Determine if this revealed login functionality
        const revealedLoginElements = (inputCount > 0) || (textareaCount > 0) || (hasLoginKeywords) || (hasChineseLoginKeywords);

        if (revealedLoginElements) {
          console.log(`  🎉 LOGIN FUNCTIONALITY DETECTED!`);
          loginFunctionalityDetected = true;

          // Analyze the revealed elements
          if (inputCount > 0) {
            console.log(`  📝 Found ${inputCount} input fields:`);
            for (let j = 0; j < inputCount; j++) {
              const input = newInputs.nth(j);
              const type = await input.getAttribute('type');
              const placeholder = await input.getAttribute('placeholder');
              console.log(`    Input ${j + 1}: type="${type}", placeholder="${placeholder}"`);
            }
          }
        }

        testResults.push({
          button: buttonDetail.index,
          result: revealedLoginElements ? 'success' : 'no_change',
          revealedElements: {
            inputs: inputCount,
            textareas: textareaCount,
            selects: selectCount,
            buttons: newButtonCount,
            hasLoginKeywords: hasLoginKeywords || hasChineseLoginKeywords
          }
        });

      } catch (error) {
        console.log(`  ❌ Click failed: ${error.message}`);
        testResults.push({
          button: buttonDetail.index,
          result: 'error',
          error: error.message
        });
      }
    }

    // Step 5: Test keyboard navigation
    console.log('\n5️⃣ Testing keyboard navigation...');

    try {
      // Reset to login page
      await page.reload();
      await page.waitForTimeout(5000);

      console.log('Testing Tab navigation...');

      // Press Tab multiple times to navigate through focusable elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500);

        const focusedElement = page.locator(':focus');
        const focusedCount = await focusedElement.count();

        if (focusedCount > 0) {
          const tagName = await focusedElement.evaluate(el => el.tagName);
          const role = await focusedElement.getAttribute('role');
          const text = await focusedElement.textContent();
          console.log(`  Tab ${i + 1}: Focused on ${tagName}[role="${role}"] "${text?.trim()}"`);
        }
      }

      // Try Enter key on focused elements
      console.log('Testing Enter key on focused elements...');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      // Check if Enter revealed anything
      const postEnterInputs = await page.locator('input:not([type="hidden"])').count();
      console.log(`Inputs after Enter press: ${postEnterInputs}`);

    } catch (error) {
      console.log(`Keyboard navigation test failed: ${error.message}`);
    }

    // Step 6: Final assessment
    console.log('\n📊 FINAL VERIFICATION RESULTS');
    console.log('='.repeat(50));

    console.log('Flutter Web App Status: ✅ CONFIRMED');
    console.log('Interactive Elements Found:', buttonCount);
    console.log('Login Functionality Detected:', loginFunctionalityDetected ? '✅ YES' : '❌ NO');

    console.log('\nButton Test Results:');
    testResults.forEach(result => {
      const status = result.result === 'success' ? '✅' :
                    result.result === 'error' ? '❌' :
                    result.result === 'skipped' ? '⏭️' : '➡️';
      console.log(`  Button ${result.button}: ${status} ${result.result}`);

      if (result.revealedElements) {
        console.log(`    Revealed: ${result.revealedElements.inputs} inputs, ${result.revealedElements.hasLoginKeywords ? 'login keywords' : 'no keywords'}`);
      }
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });

    // Overall conclusion
    const canTestLogin = buttonCount > 0 && (loginFunctionalityDetected || testResults.some(r => r.result === 'success'));

    console.log('\n🎯 VERIFICATION CONCLUSION:');
    if (canTestLogin) {
      console.log('✅ LOGIN FUNCTIONALITY CAN BE TESTED!');
      console.log('💡 The Flutter Web app has interactive elements that respond to user input');
      console.log('🔧 Recommendation: Use Flutter-specific locators and interaction methods');
    } else {
      console.log('❌ LOGIN FUNCTIONALITY CANNOT BE TESTED');
      console.log('💡 The app may not have login functionality or it requires different access methods');
    }

    // Take final verification screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/login-verification-final.png',
      fullPage: true
    });

    console.log('\n🎉 Flutter Web login verification completed!');

    // Assert the result for the test
    expect(canTestLogin).toBe(true); // This will fail if login cannot be tested, providing clear feedback
  });
});