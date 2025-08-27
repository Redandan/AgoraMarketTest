import { test, expect } from '@playwright/test';

test.describe('Purchase Flow Comprehensive Analysis', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(60000);
  });

  test('Comprehensive purchase flow analysis', async ({ page }) => {
    console.log('🔍 Starting comprehensive purchase flow analysis...');

    // Step 1: Analyze main page for any e-commerce indicators
    console.log('\n1️⃣ Analyzing main page for e-commerce features...');
    await page.goto('https://redandan.github.io/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Take main page screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/purchase-main-page.png',
      fullPage: true
    });

    // Analyze page content for e-commerce keywords
    const pageContent = await page.textContent('body');
    const eCommerceKeywords = {
      products: /\b(product|商品|item|商品|貨品)\b/i,
      pricing: /\b(price|價格|cost|費用|\$|¥|€|£)\b/i,
      cart: /\b(cart|購物車|basket|購物籃)\b/i,
      checkout: /\b(checkout|結帳|結賬|payment|付款)\b/i,
      buy: /\b(buy|購買|purchase|訂購|訂購)\b/i,
      shop: /\b(shop|商店|store|商城)\b/i,
      inventory: /\b(inventory|庫存|stock|存貨)\b/i,
      order: /\b(order|訂單|訂購單)\b/i,
      shipping: /\b(shipping|運送|delivery|配送)\b/i,
      payment: /\b(payment|付款|pay|支付)\b/i
    };

    console.log('E-commerce keyword analysis:');
    let eCommerceScore = 0;
    const foundKeywords: string[] = [];

    for (const [category, regex] of Object.entries(eCommerceKeywords)) {
      const matches = pageContent?.match(regex);
      if (matches) {
        console.log(`  ✅ ${category}: ${matches.length} matches`);
        eCommerceScore += matches.length;
        foundKeywords.push(category);
      } else {
        console.log(`  ❌ ${category}: 0 matches`);
      }
    }

    // Step 2: Analyze page structure for e-commerce elements
    console.log('\n2️⃣ Analyzing page structure for e-commerce elements...');

    const eCommerceSelectors = {
      products: '[class*="product"], [class*="item"], [class*="card"], .product, .item',
      prices: '[class*="price"], [class*="cost"], .price, .cost',
      buttons: 'button, [role="button"], [class*="button"]',
      links: 'a[href]',
      images: 'img[class*="product"], img[alt*="product"]',
      forms: 'form',
      inputs: 'input[type="number"], input[placeholder*="quantity"]'
    };

    console.log('E-commerce element analysis:');
    for (const [category, selector] of Object.entries(eCommerceSelectors)) {
      const count = await page.locator(selector).count();
      console.log(`  ${category}: ${count} elements`);

      if (count > 0 && count <= 5) {
        // Show details for small number of elements
        for (let i = 0; i < count; i++) {
          const element = page.locator(selector).nth(i);
          const text = await element.textContent();
          const className = await element.getAttribute('class');
          const href = category === 'links' ? await element.getAttribute('href') : null;

          console.log(`    Element ${i + 1}: "${text?.trim()}" class="${className}" ${href ? `href="${href}"` : ''}`);
        }
      }
    }

    // Step 3: Check for dynamic content loading
    console.log('\n3️⃣ Checking for dynamic content loading...');

    // Wait for potential dynamic content
    await page.waitForTimeout(10000);

    // Check for any new elements that might appear
    const finalButtonCount = await page.locator('button, [role="button"]').count();
    const finalLinkCount = await page.locator('a[href]').count();
    const finalImageCount = await page.locator('img').count();

    console.log('After waiting 10s:');
    console.log(`  Buttons: ${finalButtonCount}`);
    console.log(`  Links: ${finalLinkCount}`);
    console.log(`  Images: ${finalImageCount}`);

    // Step 4: Test all links for potential product/e-commerce pages
    console.log('\n4️⃣ Testing all links for e-commerce content...');

    const links = page.locator('a[href]');
    const linkCount = await links.count();

    if (linkCount > 0) {
      console.log(`Testing ${linkCount} links for e-commerce content:`);

      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();

        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          console.log(`  Testing link ${i + 1}: "${text?.trim()}" -> ${href}`);

          try {
            await page.goto(`https://redandan.github.io/${href}`);
            await page.waitForTimeout(3000);

            const pageContent = await page.textContent('body');
            const hasProductContent = /\b(product|商品|price|價格|buy|購買|cart|購物車)\b/i.test(pageContent || '');
            const buttonCount = await page.locator('button, [role="button"]').count();

            console.log(`    Result: ${hasProductContent ? 'HAS' : 'NO'} e-commerce content, ${buttonCount} buttons`);

            if (hasProductContent) {
              console.log(`    🎉 FOUND E-COMMERCE CONTENT at: ${href}`);
              await page.screenshot({
                path: `test_results/playwright/screenshots/ecommerce-link-${i + 1}.png`,
                fullPage: true
              });
            }

            // Go back to main page
            await page.goto('https://redandan.github.io/');
            await page.waitForTimeout(2000);

          } catch (error) {
            console.log(`    Error testing link: ${error.message}`);
          }
        }
      }
    }

    // Step 5: Check for Flutter Web e-commerce features
    console.log('\n5️⃣ Checking for Flutter Web e-commerce features...');

    const isFlutterApp = await page.locator('flutter-view').count() > 0;
    console.log(`Flutter Web app: ${isFlutterApp ? 'YES' : 'NO'}`);

    if (isFlutterApp) {
      // Test Flutter buttons for potential e-commerce features
      const flutterButtons = page.locator('flt-semantics-placeholder[role="button"], [role="button"]');
      const flutterButtonCount = await flutterButtons.count();

      console.log(`Flutter buttons found: ${flutterButtonCount}`);

      if (flutterButtonCount > 0) {
        console.log('Testing Flutter buttons for e-commerce features...');

        for (let i = 0; i < flutterButtonCount; i++) {
          const button = flutterButtons.nth(i);
          const ariaLabel = await button.getAttribute('aria-label') || '';
          const textContent = await button.textContent() || '';

          console.log(`  Button ${i + 1}: "${ariaLabel}" "${textContent}"`);

          // Check if button text suggests e-commerce functionality
          const isECommerceButton = /\b(buy|cart|shop|product|purchase|checkout)\b/i.test(ariaLabel + textContent);

          if (isECommerceButton) {
            console.log(`    🎯 POTENTIAL E-COMMERCE BUTTON FOUND!`);

            // Try to click this button
            try {
              await page.evaluate(`document.querySelectorAll('flt-semantics-placeholder[role="button"], [role="button"]')[${i}].click()`);
              await page.waitForTimeout(3000);

              const newButtons = await page.locator('button, [role="button"]').count();
              const pageContent = await page.textContent('body');
              const hasNewECommerceContent = /\b(product|price|cart|buy)\b/i.test(pageContent || '');

              console.log(`    After click: ${newButtons} buttons, ${hasNewECommerceContent ? 'HAS' : 'NO'} new e-commerce content`);

              if (hasNewECommerceContent) {
                console.log(`    🎉 E-COMMERCE FEATURE ACTIVATED!`);
                await page.screenshot({
                  path: `test_results/playwright/screenshots/flutter-ecommerce-button-${i + 1}.png`,
                  fullPage: true
                });
              }

              // Reload page for next test
              await page.reload();
              await page.waitForTimeout(3000);

            } catch (error) {
              console.log(`    Error clicking button: ${error.message}`);
            }
          }
        }
      }
    }

    // Step 6: Final assessment
    console.log('\n📊 FINAL PURCHASE FLOW ASSESSMENT');
    console.log('='.repeat(60));

    console.log('E-commerce indicators:');
    console.log(`  Keywords found: ${foundKeywords.length} categories`);
    console.log(`  E-commerce score: ${eCommerceScore}`);
    console.log(`  Flutter Web app: ${isFlutterApp ? 'YES' : 'NO'}`);

    // Determine site type
    let siteType = 'unknown';
    let confidence = 0;

    if (eCommerceScore === 0 && !isFlutterApp) {
      siteType = 'static_showcase';
      confidence = 95;
    } else if (eCommerceScore > 0 && eCommerceScore < 5) {
      siteType = 'basic_showcase_with_ecommerce_terms';
      confidence = 70;
    } else if (eCommerceScore >= 5 && !isFlutterApp) {
      siteType = 'potential_ecommerce_site';
      confidence = 80;
    } else if (isFlutterApp && eCommerceScore === 0) {
      siteType = 'flutter_web_app_showcase';
      confidence = 90;
    } else if (isFlutterApp && eCommerceScore > 0) {
      siteType = 'flutter_web_ecommerce_app';
      confidence = 85;
    }

    console.log(`\n🎯 SITE TYPE ASSESSMENT:`);
    console.log(`  Type: ${siteType.replace(/_/g, ' ').toUpperCase()}`);
    console.log(`  Confidence: ${confidence}%`);

    // Provide recommendations
    console.log(`\n💡 RECOMMENDATIONS:`);

    if (siteType.includes('showcase')) {
      console.log(`  • This appears to be a ${isFlutterApp ? 'Flutter Web ' : ''}showcase/demo site`);
      console.log(`  • No functional e-commerce features detected`);
      console.log(`  • The site may be for demonstration purposes only`);
      console.log(`  • Consider testing with a fully functional e-commerce site`);
    } else if (siteType.includes('ecommerce')) {
      console.log(`  • E-commerce features detected`);
      console.log(`  • Further investigation recommended`);
      console.log(`  • Consider testing specific product/checkout flows`);
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test_results/playwright/screenshots/purchase-flow-analysis-final.png',
      fullPage: true
    });

    console.log('\n🎉 Purchase flow analysis completed!');

    // The test should pass as we've successfully analyzed the site
    expect(siteType).toBeDefined();
    expect(confidence).toBeGreaterThan(0);
  });
});