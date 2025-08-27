import { test, expect } from '@playwright/test';

test.describe('Complete Purchase Flow with Login Investigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Complete purchase flow with login investigation', async ({ page }) => {
    console.log('🔍 Starting complete purchase flow with login investigation...');

    // Step 1: Check main page
    console.log('\n1️⃣ Checking main page...');
    await page.goto('https://redandan.github.io/');
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: 'test_results/playwright/screenshots/main-page-analysis.png',
      fullPage: true
    });

    console.log('Main page URL:', page.url());
    console.log('Main page title:', await page.title());
    console.log('Main page content length:', (await page.textContent('body'))?.length ?? 0);

    // Look for any navigation or links
    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();
    console.log('Links found on main page:', linkCount);

    if (linkCount > 0) {
      console.log('Links:');
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = allLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.log(`  ${i + 1}. "${text?.trim()}" -> ${href}`);
      }
    }

    // Step 2: Try login page
    console.log('\n2️⃣ Investigating login page...');
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(5000); // Longer wait for dynamic content

    await page.screenshot({
      path: 'test_results/playwright/screenshots/login-page-detailed.png',
      fullPage: true
    });

    console.log('Login page URL:', page.url());
    console.log('Login page title:', await page.title());
    console.log('Login page content length:', (await page.textContent('body'))?.length ?? 0);

    // Check for dynamic content loading
    console.log('Waiting for dynamic content...');
    await page.waitForTimeout(5000);

    // Re-check for login elements after waiting
    const loginFormAfterWait = page.locator('form');
    const emailInputAfterWait = page.locator('input[type="email"], input[placeholder*="email" i]');
    const passwordInputAfterWait = page.locator('input[type="password"], input[placeholder*="password" i]');
    const loginButtonAfterWait = page.locator('button:has-text("Login"), button:has-text("Sign In")');

    console.log('After waiting 5s:');
    console.log('  Forms:', await loginFormAfterWait.count());
    console.log('  Email inputs:', await emailInputAfterWait.count());
    console.log('  Password inputs:', await passwordInputAfterWait.count());
    console.log('  Login buttons:', await loginButtonAfterWait.count());

    // Check for any interactive elements
    const allButtons = page.locator('button');
    const allInputs = page.locator('input');
    const allClickable = page.locator('button, a, [role="button"]');

    console.log('All buttons:', await allButtons.count());
    console.log('All inputs:', await allInputs.count());
    console.log('All clickable elements:', await allClickable.count());

    // Step 3: Try other potential routes
    console.log('\n3️⃣ Investigating other potential routes...');
    const potentialRoutes = [
      'https://redandan.github.io/#/home',
      'https://redandan.github.io/#/dashboard',
      'https://redandan.github.io/#/products',
      'https://redandan.github.io/#/shop',
      'https://redandan.github.io/#/cart',
      'https://redandan.github.io/#/checkout',
      'https://redandan.github.io/#/profile',
      'https://redandan.github.io/#/main'
    ];

    for (const route of potentialRoutes) {
      try {
        console.log(`Checking route: ${route}`);
        await page.goto(route);
        await page.waitForTimeout(3000);

        const title = await page.title();
        const contentLength = (await page.textContent('body'))?.length ?? 0;
        const hasForms = await page.locator('form').count() > 0;
        const hasButtons = await page.locator('button').count() > 0;
        const hasInputs = await page.locator('input').count() > 0;

        console.log(`  Title: ${title}`);
        console.log(`  Content length: ${contentLength}`);
        console.log(`  Has forms: ${hasForms}`);
        console.log(`  Has buttons: ${hasButtons}`);
        console.log(`  Has inputs: ${hasInputs}`);

        if (hasForms || hasButtons || hasInputs) {
          console.log(`  🚨 Found interactive elements at: ${route}`);
          await page.screenshot({
            path: `test_results/playwright/screenshots/route-${route.split('/').pop()}.png`,
            fullPage: true
          });
        }

        // Check for purchase-related content
        const hasPurchaseContent = await page.locator('text=/product|cart|buy|purchase|shop|checkout/i').count() > 0;
        if (hasPurchaseContent) {
          console.log(`  🛒 Found purchase-related content at: ${route}`);
        }

      } catch (error) {
        console.log(`  Error checking route: ${error.message}`);
      }
    }

    // Step 4: Try to simulate user interactions that might trigger login
    console.log('\n4️⃣ Testing user interactions that might trigger login...');
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(3000);

    // Try clicking on various elements
    const clickableElements = page.locator('button, a, div[role="button"], span[role="button"]');
    const clickableCount = await clickableElements.count();

    if (clickableCount > 0) {
      console.log(`Found ${clickableCount} clickable elements, testing first few...`);

      for (let i = 0; i < Math.min(clickableCount, 5); i++) {
        try {
          const element = clickableElements.nth(i);
          const tagName = await element.evaluate(el => el.tagName);
          const text = await element.textContent();
          const className = await element.getAttribute('class');

          console.log(`Testing element ${i + 1}: ${tagName} "${text?.trim()}" class="${className}"`);

          await element.click();
          await page.waitForTimeout(2000);

          // Check if new elements appeared
          const newForms = await page.locator('form').count();
          const newInputs = await page.locator('input').count();
          const newButtons = await page.locator('button').count();

          if (newForms > 0 || newInputs > 0 || newButtons > 0) {
            console.log(`  🚨 Click revealed new elements! Forms: ${newForms}, Inputs: ${newInputs}, Buttons: ${newButtons}`);
            await page.screenshot({
              path: `test_results/playwright/screenshots/after-click-${i}.png`,
              fullPage: true
            });
          }

          // Go back if we navigated away
          if (page.url() !== 'https://redandan.github.io/#/login') {
            await page.goto('https://redandan.github.io/#/login');
            await page.waitForTimeout(2000);
          }

        } catch (error) {
          console.log(`  Error testing element ${i + 1}: ${error.message}`);
        }
      }
    }

    // Step 5: Check for JavaScript-based authentication
    console.log('\n5️⃣ Checking for JavaScript-based authentication...');
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(3000);

    // Try to execute JavaScript that might show login form
    try {
      const jsResult = await page.evaluate(() => {
        // Try to find any authentication-related JavaScript
        const scripts = Array.from(document.querySelectorAll('script'));
        const authRelated = scripts.filter(script => {
          const content = script.textContent || '';
          return content.includes('login') || content.includes('auth') || content.includes('signin');
        });

        // Try to trigger any authentication functions
        const windowAny = window as any;
        if (windowAny.auth || windowAny.login || windowAny.signin) {
          return 'Found global auth functions';
        }

        // Check for common authentication libraries
        const hasFirebase = !!windowAny.firebase;
        const hasAuth0 = !!windowAny.auth0;
        const hasCognito = !!windowAny.AWS && !!windowAny.AWS.CognitoIdentityProvider;

        return {
          authScripts: authRelated.length,
          hasFirebase,
          hasAuth0,
          hasCognito,
          globalAuthFunctions: !!(windowAny.auth || windowAny.login || windowAny.signin)
        };
      });

      console.log('JavaScript authentication check:', jsResult);

    } catch (error) {
      console.log('JavaScript evaluation error:', error.message);
    }

    // Step 6: Final assessment
    console.log('\n📊 Final Assessment:');

    const finalUrl = page.url();
    const finalTitle = await page.title();
    const finalContentLength = (await page.textContent('body'))?.length ?? 0;
    const finalForms = await page.locator('form').count();
    const finalInputs = await page.locator('input').count();
    const finalButtons = await page.locator('button').count();

    console.log('Final state:');
    console.log('  URL:', finalUrl);
    console.log('  Title:', finalTitle);
    console.log('  Content length:', finalContentLength);
    console.log('  Forms:', finalForms);
    console.log('  Inputs:', finalInputs);
    console.log('  Buttons:', finalButtons);

    if (finalForms > 0 || finalInputs > 0 || finalButtons > 0) {
      console.log('✅ SUCCESS: Found interactive elements - login functionality exists!');
    } else {
      console.log('❌ CONCLUSION: No login functionality found on this page');
      console.log('   This appears to be a static showcase website without functional authentication');
      console.log('   The purchase functionality cannot succeed because there is no login system');
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/final-investigation.png',
      fullPage: true
    });

    console.log('\n🎉 Investigation completed!');
  });
});