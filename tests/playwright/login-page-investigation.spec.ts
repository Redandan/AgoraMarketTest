import { test, expect } from '@playwright/test';

test.describe('Login Page Investigation', () => {
  test('Investigate specific login page URL', async ({ page }) => {
    console.log('🔍 Investigating login page: https://redandan.github.io/#/login');

    // Navigate directly to the login page
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(3000); // Wait for any dynamic content

    // Take screenshot of the login page
    await page.screenshot({
      path: 'test_results/playwright/screenshots/login-page-investigation.png',
      fullPage: true
    });

    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());

    // Check for login-related elements
    const loginForm = page.locator('form');
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i], input[placeholder*="郵箱"]');
    const passwordInput = page.locator('input[type="password"], input[placeholder*="password" i], input[placeholder*="密碼"]');
    const loginButton = page.locator('button:has-text("Login"), button:has-text("登入"), button:has-text("Sign In"), button[type="submit"]');

    console.log('Login form found:', await loginForm.count());
    console.log('Email input found:', await emailInput.count());
    console.log('Password input found:', await passwordInput.count());
    console.log('Login button found:', await loginButton.count());

    // Check page content
    const pageContent = await page.textContent('body');
    console.log('Page contains "login":', pageContent?.toLowerCase().includes('login') ?? false);
    console.log('Page contains "登入":', pageContent?.toLowerCase().includes('登入') ?? false);
    console.log('Page contains "auth":', pageContent?.toLowerCase().includes('auth') ?? false);

    // Check for any form elements
    const allInputs = page.locator('input');
    const allButtons = page.locator('button');
    const allForms = page.locator('form');

    console.log('Total input elements:', await allInputs.count());
    console.log('Total button elements:', await allButtons.count());
    console.log('Total form elements:', await allForms.count());

    // List all input elements
    if (await allInputs.count() > 0) {
      console.log('Input elements:');
      for (let i = 0; i < await allInputs.count(); i++) {
        const input = allInputs.nth(i);
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        const name = await input.getAttribute('name');
        console.log(`  Input ${i}: type=${type}, placeholder=${placeholder}, name=${name}`);
      }
    }

    // List all button elements
    if (await allButtons.count() > 0) {
      console.log('Button elements:');
      for (let i = 0; i < await allButtons.count(); i++) {
        const button = allButtons.nth(i);
        const text = await button.textContent();
        const type = await button.getAttribute('type');
        console.log(`  Button ${i}: text="${text}", type=${type}`);
      }
    }

    // Check for any links that might lead to login
    const loginLinks = page.locator('a[href*="login"], a[href*="auth"], a[href*="signin"]');
    console.log('Login-related links found:', await loginLinks.count());

    if (await loginLinks.count() > 0) {
      for (let i = 0; i < await loginLinks.count(); i++) {
        const link = loginLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.log(`  Link ${i}: "${text}" -> ${href}`);
      }
    }

    // Check if this is a Flutter web app
    const flutterElements = page.locator('[data-flutter-app], .flutter-view, #flutter_target');
    console.log('Flutter app elements found:', await flutterElements.count());

    // Check for any JavaScript that might handle login
    const scripts = page.locator('script');
    console.log('Script tags found:', await scripts.count());

    // Try to detect if there's any authentication state
    const hasAuthIndicators = page.locator('[class*="auth"], [class*="login"], [id*="auth"], [id*="login"]');
    console.log('Authentication-related elements:', await hasAuthIndicators.count());

    // Summary
    const hasLoginFunctionality = (await loginForm.count() > 0) ||
                                 (await emailInput.count() > 0 && await passwordInput.count() > 0) ||
                                 (await loginButton.count() > 0);

    console.log('\n📊 Investigation Summary:');
    console.log('Has login functionality:', hasLoginFunctionality ? 'YES' : 'NO');
    console.log('Page appears to be:', await flutterElements.count() > 0 ? 'Flutter Web App' : 'Static Website');
    console.log('Current URL:', page.url());

    if (!hasLoginFunctionality) {
      console.log('\n💡 Possible reasons:');
      console.log('1. Login functionality is loaded dynamically');
      console.log('2. Login requires specific conditions or user interaction');
      console.log('3. This is a static showcase page without functional login');
      console.log('4. Login functionality is on a different route or page');
    }
  });

  test('Compare main page vs login page', async ({ page }) => {
    console.log('🔄 Comparing main page vs login page...');

    // Check main page
    await page.goto('https://redandan.github.io/');
    await page.waitForTimeout(2000);
    const mainPageContent = await page.textContent('body');
    const mainPageTitle = await page.title();
    const mainPageUrl = page.url();

    console.log('Main page:');
    console.log('  URL:', mainPageUrl);
    console.log('  Title:', mainPageTitle);
    console.log('  Content length:', mainPageContent?.length ?? 0);

    // Check login page
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(3000);
    const loginPageContent = await page.textContent('body');
    const loginPageTitle = await page.title();
    const loginPageUrl = page.url();

    console.log('Login page:');
    console.log('  URL:', loginPageUrl);
    console.log('  Title:', loginPageTitle);
    console.log('  Content length:', loginPageContent?.length ?? 0);

    // Compare content
    const contentChanged = mainPageContent !== loginPageContent;
    const urlChanged = mainPageUrl !== loginPageUrl;
    const titleChanged = mainPageTitle !== loginPageTitle;

    console.log('\nComparison results:');
    console.log('Content changed:', contentChanged);
    console.log('URL changed:', urlChanged);
    console.log('Title changed:', titleChanged);

    if (contentChanged) {
      console.log('✅ Login page has different content than main page');
    } else {
      console.log('❌ Login page has same content as main page (might be client-side routing issue)');
    }

    // Check if it's a single-page application
    const hasHashRouting = loginPageUrl.includes('#');
    console.log('Uses hash routing:', hasHashRouting);

    if (hasHashRouting) {
      console.log('This appears to be a Single Page Application (SPA) with client-side routing');
      console.log('The login functionality might be implemented in JavaScript/React/Vue/Flutter Web');
    }
  });

  test('Test navigation to login and back', async ({ page }) => {
    console.log('🧭 Testing navigation flow...');

    // Start at main page
    await page.goto('https://redandan.github.io/');
    await page.waitForTimeout(2000);

    const initialUrl = page.url();
    const initialTitle = await page.title();

    console.log('Starting at:', initialUrl, 'Title:', initialTitle);

    // Try to navigate to login
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(3000);

    const loginUrl = page.url();
    const loginTitle = await page.title();

    console.log('At login page:', loginUrl, 'Title:', loginTitle);

    // Check if we can interact with any elements
    const clickableElements = page.locator('button, a, input[type="submit"]');
    const clickableCount = await clickableElements.count();

    console.log('Clickable elements found:', clickableCount);

    if (clickableCount > 0) {
      console.log('Testing first clickable element...');
      try {
        await clickableElements.first().click();
        await page.waitForTimeout(2000);
        console.log('After click - URL:', page.url(), 'Title:', await page.title());
      } catch (error) {
        console.log('Click failed:', error.message);
      }
    }

    // Try going back to main page
    await page.goto('https://redandan.github.io/');
    await page.waitForTimeout(2000);

    const finalUrl = page.url();
    const finalTitle = await page.title();

    console.log('Back to main page:', finalUrl, 'Title:', finalTitle);

    console.log('\nNavigation test completed');
  });
});