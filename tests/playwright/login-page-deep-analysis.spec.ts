import { test, expect } from '@playwright/test';

test.describe('Login Page Deep Analysis', () => {
  test('Comprehensive analysis of login page', async ({ page }) => {
    console.log('🔬 Starting deep analysis of login page...');

    // Navigate to the specific login page
    await page.goto('https://redandan.github.io/#/login');
    await page.waitForTimeout(5000); // Wait for any dynamic content

    // Take initial screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/login-page-initial.png',
      fullPage: true
    });

    console.log('=== BASIC PAGE INFORMATION ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    console.log('Ready state:', await page.evaluate(() => document.readyState));

    // Get all text content
    const allText = await page.textContent('body');
    console.log('Total text length:', allText?.length ?? 0);
    console.log('All visible text:', allText?.substring(0, 500) + '...');

    // Analyze HTML structure
    console.log('\n=== HTML STRUCTURE ANALYSIS ===');
    const htmlContent = await page.content();
    console.log('HTML length:', htmlContent.length);

    // Check for specific HTML patterns
    const hasFlutterApp = htmlContent.includes('flutter') || htmlContent.includes('Flutter');
    const hasReactApp = htmlContent.includes('react') || htmlContent.includes('React');
    const hasVueApp = htmlContent.includes('vue') || htmlContent.includes('Vue');
    const hasAngularApp = htmlContent.includes('angular') || htmlContent.includes('Angular');

    console.log('Framework detection:');
    console.log('  Flutter:', hasFlutterApp);
    console.log('  React:', hasReactApp);
    console.log('  Vue:', hasVueApp);
    console.log('  Angular:', hasAngularApp);

    // Check for common SPA patterns
    const hasHashRouter = page.url().includes('#');
    const hasDataAttributes = htmlContent.includes('data-');
    const hasAriaAttributes = htmlContent.includes('aria-');

    console.log('SPA patterns:');
    console.log('  Hash routing:', hasHashRouter);
    console.log('  Data attributes:', hasDataAttributes);
    console.log('  ARIA attributes:', hasAriaAttributes);

    // Analyze all elements on the page
    console.log('\n=== ELEMENT ANALYSIS ===');

    // Get all elements
    const allElements = await page.locator('*').count();
    console.log('Total elements on page:', allElements);

    // Analyze by element type
    const elementTypes = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'input', 'form', 'a', 'img'];
    for (const type of elementTypes) {
      const count = await page.locator(type).count();
      if (count > 0) {
        console.log(`  ${type}: ${count}`);
      }
    }

    // Check for specific interactive elements
    console.log('\n=== INTERACTIVE ELEMENTS ===');

    // Buttons analysis
    const allButtons = page.locator('button, [role="button"], input[type="submit"], input[type="button"]');
    const buttonCount = await allButtons.count();
    console.log('Button-like elements:', buttonCount);

    if (buttonCount > 0) {
      for (let i = 0; i < buttonCount; i++) {
        const button = allButtons.nth(i);
        const tagName = await button.evaluate(el => el.tagName);
        const type = await button.getAttribute('type');
        const role = await button.getAttribute('role');
        const text = await button.textContent();
        const className = await button.getAttribute('class');
        const id = await button.getAttribute('id');

        console.log(`  Button ${i + 1}:`);
        console.log(`    Tag: ${tagName}`);
        console.log(`    Type: ${type}`);
        console.log(`    Role: ${role}`);
        console.log(`    Text: "${text?.trim()}"`);
        console.log(`    Class: ${className}`);
        console.log(`    ID: ${id}`);
        console.log('');
      }
    }

    // Input analysis
    const allInputs = page.locator('input, textarea, select');
    const inputCount = await allInputs.count();
    console.log('Input elements:', inputCount);

    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = allInputs.nth(i);
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const className = await input.getAttribute('class');

        console.log(`  Input ${i + 1}:`);
        console.log(`    Type: ${type}`);
        console.log(`    Placeholder: ${placeholder}`);
        console.log(`    Name: ${name}`);
        console.log(`    ID: ${id}`);
        console.log(`    Class: ${className}`);
        console.log('');
      }
    }

    // Form analysis
    const allForms = page.locator('form');
    const formCount = await allForms.count();
    console.log('Form elements:', formCount);

    if (formCount > 0) {
      for (let i = 0; i < formCount; i++) {
        const form = allForms.nth(i);
        const action = await form.getAttribute('action');
        const method = await form.getAttribute('method');
        const id = await form.getAttribute('id');
        const className = await form.getAttribute('class');

        console.log(`  Form ${i + 1}:`);
        console.log(`    Action: ${action}`);
        console.log(`    Method: ${method}`);
        console.log(`    ID: ${id}`);
        console.log(`    Class: ${className}`);
        console.log('');
      }
    }

    // Link analysis
    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();
    console.log('Links:', linkCount);

    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = allLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        const className = await link.getAttribute('class');

        console.log(`  Link ${i + 1}: "${text?.trim()}" -> ${href} (class: ${className})`);
      }
    }

    // Check for hidden elements
    console.log('\n=== HIDDEN ELEMENTS ===');
    const hiddenElements = page.locator('[style*="display: none"], [style*="visibility: hidden"], [hidden]');
    const hiddenCount = await hiddenElements.count();
    console.log('Hidden elements:', hiddenCount);

    // Check for elements that might be revealed on interaction
    const potentiallyInteractive = page.locator('[onclick], [onmouseover], [onmouseenter], [data-toggle], [data-target]');
    const interactiveCount = await potentiallyInteractive.count();
    console.log('Elements with event handlers:', interactiveCount);

    // JavaScript analysis
    console.log('\n=== JAVASCRIPT ANALYSIS ===');

    // Check for scripts
    const scripts = page.locator('script');
    const scriptCount = await scripts.count();
    console.log('Script tags:', scriptCount);

    if (scriptCount > 0) {
      for (let i = 0; i < scriptCount; i++) {
        const script = scripts.nth(i);
        const src = await script.getAttribute('src');
        const type = await script.getAttribute('type');
        const content = await script.textContent();

        console.log(`  Script ${i + 1}:`);
        console.log(`    Src: ${src}`);
        console.log(`    Type: ${type}`);
        console.log(`    Content length: ${content?.length ?? 0}`);

        // Check for authentication-related code
        if (content && (content.includes('login') || content.includes('auth') || content.includes('signin'))) {
          console.log(`    ⚠️  Contains authentication-related code!`);
          console.log(`    Content preview: ${content.substring(0, 200)}...`);
        }
      }
    }

    // Check for global JavaScript objects
    const jsAnalysis = await page.evaluate(() => {
      const windowAny = window as any;

      return {
        hasAuth: !!windowAny.auth,
        hasLogin: !!windowAny.login,
        hasSignin: !!windowAny.signin,
        hasFirebase: !!windowAny.firebase,
        hasAuth0: !!windowAny.auth0,
        hasAWS: !!windowAny.AWS,
        hasLocalStorage: !!window.localStorage,
        hasSessionStorage: !!window.sessionStorage,
        localStorageKeys: Object.keys(window.localStorage || {}),
        sessionStorageKeys: Object.keys(window.sessionStorage || {}),
        globalFunctions: Object.keys(window).filter(key =>
          typeof (window as any)[key] === 'function' &&
          (key.includes('login') || key.includes('auth') || key.includes('sign'))
        )
      };
    });

    console.log('Global JavaScript objects:');
    console.log('  Auth objects:', {
      auth: jsAnalysis.hasAuth,
      login: jsAnalysis.hasLogin,
      signin: jsAnalysis.hasSignin,
      firebase: jsAnalysis.hasFirebase,
      auth0: jsAnalysis.hasAuth0,
      aws: jsAnalysis.hasAWS
    });
    console.log('  Storage:', {
      localStorage: jsAnalysis.hasLocalStorage,
      sessionStorage: jsAnalysis.hasSessionStorage
    });
    console.log('  Auth functions:', jsAnalysis.globalFunctions);
    console.log('  LocalStorage keys:', jsAnalysis.localStorageKeys);
    console.log('  SessionStorage keys:', jsAnalysis.sessionStorageKeys);

    // Check for CSS that might hide elements
    console.log('\n=== CSS ANALYSIS ===');
    const cssAnalysis = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      const authRelatedRules: string[] = [];

      for (const styleSheet of styles) {
        try {
          const rules = Array.from(styleSheet.cssRules || []);
          for (const rule of rules) {
            const cssText = rule.cssText;
            if (cssText && (cssText.includes('login') || cssText.includes('auth') || cssText.includes('signin'))) {
              authRelatedRules.push(cssText);
            }
          }
        } catch (e) {
          // Ignore CORS errors for external stylesheets
        }
      }

      return {
        totalStyleSheets: styles.length,
        authRelatedRules: authRelatedRules.slice(0, 5) // Limit to first 5
      };
    });

    console.log('CSS analysis:');
    console.log('  Total stylesheets:', cssAnalysis.totalStyleSheets);
    console.log('  Auth-related CSS rules:', cssAnalysis.authRelatedRules.length);
    if (cssAnalysis.authRelatedRules.length > 0) {
      console.log('  Sample rules:');
      cssAnalysis.authRelatedRules.forEach((rule, index) => {
        console.log(`    ${index + 1}. ${rule.substring(0, 100)}...`);
      });
    }

    // Check for meta tags and other head elements
    console.log('\n=== META ANALYSIS ===');
    const metaTags = await page.evaluate(() => {
      const metas = Array.from(document.querySelectorAll('meta'));
      return metas.map(meta => ({
        name: meta.getAttribute('name'),
        property: meta.getAttribute('property'),
        content: meta.getAttribute('content')
      }));
    });

    console.log('Meta tags:');
    metaTags.forEach((meta, index) => {
      if (meta.name || meta.property) {
        console.log(`  ${index + 1}. ${meta.name || meta.property}: ${meta.content}`);
      }
    });

    // Final assessment
    console.log('\n=== FINAL ASSESSMENT ===');

    const hasAnyLoginElements = (await allButtons.count() > 0) ||
                               (await allInputs.count() > 0) ||
                               (await allForms.count() > 0) ||
                               jsAnalysis.hasAuth ||
                               jsAnalysis.hasLogin ||
                               jsAnalysis.hasSignin;

    const hasAuthRelatedContent = allText?.toLowerCase().includes('login') ||
                                 allText?.toLowerCase().includes('auth') ||
                                 allText?.toLowerCase().includes('signin') ||
                                 allText?.toLowerCase().includes('登入');

    console.log('Assessment results:');
    console.log('  Has login elements:', hasAnyLoginElements);
    console.log('  Has auth-related content:', hasAuthRelatedContent);
    console.log('  Appears to be functional login page:', hasAnyLoginElements && hasAuthRelatedContent);

    if (hasAnyLoginElements) {
      console.log('✅ CONCLUSION: This page HAS functional login elements!');
    } else if (hasAuthRelatedContent) {
      console.log('⚠️  CONCLUSION: This page mentions authentication but has no functional elements');
    } else {
      console.log('❌ CONCLUSION: This page has NO login functionality');
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/login-page-deep-analysis.png',
      fullPage: true
    });

    console.log('\n🎉 Deep analysis completed!');
  });
});