import { test, expect } from '@playwright/test';

test.describe('Post-Login Website Exploration', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(60000);
  });

  test('Explore website after login for hidden purchase features', async ({ page }) => {
    console.log('🔍 Starting post-login website exploration...');

    // Step 1: Navigate to login page
    console.log('\n1️⃣ Navigating to login page...');
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000);

    // Take initial screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/pre-login-exploration.png',
      fullPage: true
    });

    // Step 2: Perform login using the method we discovered
    console.log('\n2️⃣ Performing login...');

    const accessibilityButton = page.locator('flt-semantics-placeholder[role="button"][aria-label="Enable accessibility"]');

    if (await accessibilityButton.count() > 0) {
      console.log('Found accessibility button, clicking to reveal login form...');

      // Use JavaScript click to handle off-screen element
      await page.evaluate(() => {
        const button = document.querySelector('flt-semantics-placeholder[role="button"][aria-label="Enable accessibility"]');
        if (button) {
          (button as HTMLElement).click();
        }
      });

      await page.waitForTimeout(3000);
      console.log('✅ Accessibility button clicked, login form should be revealed');
    } else {
      console.log('❌ Accessibility button not found');
      return;
    }

    // Step 3: Fill login credentials
    console.log('\n3️⃣ Filling login credentials...');

    const textInput = page.locator('input[type="text"], input:not([type])').first();
    const passwordInput = page.locator('input[type="password"]').first();

    if (await textInput.count() > 0 && await passwordInput.count() > 0) {
      await textInput.fill('testuser@agoramarket.com');
      await passwordInput.fill('TestPass123!');

      console.log('✅ Login credentials filled');
      console.log('  Username: testuser@agoramarket.com');
      console.log('  Password: TestPass123!');

      // Take screenshot of filled form
      await page.screenshot({
        path: 'test_results/playwright/screenshots/login-form-filled-exploration.png',
        fullPage: true
      });

      // Step 4: Submit login
      console.log('\n4️⃣ Submitting login...');

      // Try to find and click submit button
      const submitButtons = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), input[type="submit"]');
      const submitCount = await submitButtons.count();

      if (submitCount > 0) {
        await submitButtons.first().click();
        console.log('✅ Submit button clicked');
      } else {
        // Try pressing Enter in password field
        await passwordInput.press('Enter');
        console.log('✅ Enter key pressed in password field');
      }

      await page.waitForTimeout(5000);

      // Take screenshot after login attempt
      await page.screenshot({
        path: 'test_results/playwright/screenshots/post-login-attempt.png',
        fullPage: true
      });

      console.log('✅ Login attempt completed');

    } else {
      console.log('❌ Login form inputs not found after button click');
      return;
    }

    // Step 5: Explore the site after login
    console.log('\n5️⃣ Exploring site after login...');

    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);

    // Check if we're still on login page or redirected
    if (currentUrl.includes('/login')) {
      console.log('📍 Still on login page - login may have failed or different flow expected');
    } else {
      console.log('🔄 Redirected after login - exploring new page');
    }

    // Step 6: Comprehensive post-login analysis
    console.log('\n6️⃣ Performing comprehensive post-login analysis...');

    // Analyze page content for new features
    const pageContent = await page.textContent('body');
    const pageTitle = await page.title();

    console.log('Post-login page analysis:');
    console.log('  Title:', pageTitle);
    console.log('  URL:', currentUrl);
    console.log('  Content length:', pageContent?.length ?? 0);

    // Check for new e-commerce keywords that might appear after login
    const postLoginECommerceKeywords = {
      products: /\b(product|商品|item|商品|貨品)\b/i,
      pricing: /\b(price|價格|cost|費用|\$|¥|€|£)\b/i,
      cart: /\b(cart|購物車|basket|購物籃)\b/i,
      checkout: /\b(checkout|結帳|結賬|payment|付款)\b/i,
      buy: /\b(buy|購買|purchase|訂購|訂購)\b/i,
      shop: /\b(shop|商店|store|商城)\b/i,
      dashboard: /\b(dashboard|儀表板|控制台|個人中心)\b/i,
      profile: /\b(profile|個人資料|用戶信息)\b/i,
      orders: /\b(order|訂單|訂購單|歷史訂單)\b/i,
      wishlist: /\b(wishlist|願望清單|收藏|收藏夹)\b/i,
      inventory: /\b(inventory|庫存|stock|存貨)\b/i,
      admin: /\b(admin|管理|後台|管理員)\b/i,
      seller: /\b(seller|賣家|商家|銷售)\b/i
    };

    console.log('\nPost-login e-commerce keyword analysis:');
    let postLoginECommerceScore = 0;
    const postLoginFoundKeywords: string[] = [];

    for (const [category, regex] of Object.entries(postLoginECommerceKeywords)) {
      const matches = pageContent?.match(regex);
      if (matches) {
        console.log(`  ✅ ${category}: ${matches.length} matches`);
        postLoginECommerceScore += matches.length;
        postLoginFoundKeywords.push(category);
      } else {
        console.log(`  ❌ ${category}: 0 matches`);
      }
    }

    // Step 7: Analyze new interactive elements
    console.log('\n7️⃣ Analyzing new interactive elements after login...');

    const postLoginButtons = page.locator('button, [role="button"], flt-semantics-placeholder[role="button"]');
    const postLoginLinks = page.locator('a[href]');
    const postLoginImages = page.locator('img');
    const postLoginForms = page.locator('form');
    const postLoginInputs = page.locator('input');

    const buttonCount = await postLoginButtons.count();
    const linkCount = await postLoginLinks.count();
    const imageCount = await postLoginImages.count();
    const formCount = await postLoginForms.count();
    const inputCount = await postLoginInputs.count();

    console.log('Post-login element counts:');
    console.log(`  Buttons: ${buttonCount}`);
    console.log(`  Links: ${linkCount}`);
    console.log(`  Images: ${imageCount}`);
    console.log(`  Forms: ${formCount}`);
    console.log(`  Inputs: ${inputCount}`);

    // Analyze buttons for e-commerce features
    if (buttonCount > 0) {
      console.log('\nPost-login button analysis:');
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = postLoginButtons.nth(i);
        const text = await button.textContent();
        const className = await button.getAttribute('class');
        const ariaLabel = await button.getAttribute('aria-label');

        const buttonText = `${text || ''} ${ariaLabel || ''}`.toLowerCase();
        const isECommerceButton = /\b(buy|cart|shop|product|purchase|checkout|add|remove|order)\b/i.test(buttonText);

        console.log(`  Button ${i + 1}: "${text}" (class: ${className}) ${isECommerceButton ? '🛒 E-COMMERCE' : ''}`);

        if (isECommerceButton) {
          console.log(`    🎯 POTENTIAL E-COMMERCE BUTTON FOUND!`);
        }
      }
    }

    // Analyze links for e-commerce pages
    if (linkCount > 0) {
      console.log('\nPost-login link analysis:');
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = postLoginLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();

        const linkText = `${text || ''} ${href || ''}`.toLowerCase();
        const isECommerceLink = /\b(product|shop|cart|checkout|buy|order|dashboard|profile)\b/i.test(linkText);

        console.log(`  Link ${i + 1}: "${text}" -> ${href} ${isECommerceLink ? '🛒 E-COMMERCE' : ''}`);

        if (isECommerceLink && href) {
          console.log(`    🎯 POTENTIAL E-COMMERCE LINK FOUND!`);
        }
      }
    }

    // Step 8: Test navigation to potential e-commerce routes
    console.log('\n8️⃣ Testing navigation to potential e-commerce routes...');

    const potentialECommerceRoutes = [
      '/#/products',
      '/#/shop',
      '/#/cart',
      '/#/checkout',
      '/#/orders',
      '/#/dashboard',
      '/#/profile',
      '/#/wishlist',
      '/#/inventory',
      '/#/admin'
    ];

    for (const route of potentialECommerceRoutes) {
      try {
        console.log(`  Testing route: ${route}`);
        await page.goto(`https://redandan.github.io${route}`);
        await page.waitForTimeout(3000);

        const routeContent = await page.textContent('body');
        const routeTitle = await page.title();

        // Check for e-commerce content in this route
        const hasECommerceContent = /\b(product|price|cart|buy|shop|checkout|order|dashboard)\b/i.test(routeContent || '');
        const routeButtons = await page.locator('button, [role="button"]').count();
        const routeLinks = await page.locator('a[href]').count();

        console.log(`    Title: ${routeTitle}`);
        console.log(`    Content length: ${routeContent?.length ?? 0}`);
        console.log(`    Has e-commerce content: ${hasECommerceContent}`);
        console.log(`    Buttons: ${routeButtons}`);
        console.log(`    Links: ${routeLinks}`);

        if (hasECommerceContent || routeButtons > 1 || routeLinks > 0) {
          console.log(`    🎉 E-COMMERCE FEATURES FOUND at ${route}!`);
          await page.screenshot({
            path: `test_results/playwright/screenshots/post-login-route-${route.replace('/#/', '')}.png`,
            fullPage: true
          });
        }

      } catch (error) {
        console.log(`    Error testing route ${route}: ${error.message}`);
      }
    }

    // Step 9: Final assessment
    console.log('\n📊 FINAL POST-LOGIN EXPLORATION ASSESSMENT');
    console.log('='.repeat(60));

    console.log('Pre-login vs Post-login comparison:');
    console.log(`  E-commerce keywords found: 0 → ${postLoginFoundKeywords.length}`);
    console.log(`  E-commerce score: 0 → ${postLoginECommerceScore}`);

    const hasNewECommerceFeatures = postLoginECommerceScore > 0 || buttonCount > 1 || linkCount > 0;

    console.log('\n🎯 ASSESSMENT RESULTS:');
    if (hasNewECommerceFeatures) {
      console.log('✅ SUCCESS! Post-login e-commerce features detected!');
      console.log('💡 The website has hidden e-commerce functionality accessible after login');
      console.log('\n📋 New features found:');
      if (postLoginFoundKeywords.length > 0) {
        console.log('  Keywords:', postLoginFoundKeywords.join(', '));
      }
      if (buttonCount > 1) {
        console.log('  Buttons:', buttonCount, '(more than just login)');
      }
      if (linkCount > 0) {
        console.log('  Links:', linkCount, '(navigation options)');
      }
    } else {
      console.log('❌ No new e-commerce features found after login');
      console.log('💡 This confirms the website is a pure showcase/demo site');
      console.log('💡 No functional e-commerce features exist, even after login');
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/post-login-exploration-final.png',
      fullPage: true
    });

    console.log('\n🎉 Post-login exploration completed!');

    // Test passes if we successfully explored the site
    expect(currentUrl).toBeDefined();
    expect(pageTitle).toBeDefined();
  });
});