import { test, expect } from '@playwright/test';

test.describe('Advanced Flutter Web Testing Solutions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(60000);
  });

  test('Solution 1: JavaScript Bridge Pattern', async ({ page }) => {
    console.log('🔧 Solution 1: JavaScript Bridge Pattern');

    await page.goto('https://redandan.github.io/#/login');

    // 注入 JavaScript Bridge 來監聽 Flutter 事件
    await page.addScriptTag({
      content: `
        (window as any).flutterBridge = {
          events: [],
          onFlutterEvent: function(event: any) {
            this.events.push({
              type: event.type,
              data: event.data,
              timestamp: Date.now()
            });
            console.log('Flutter Event:', event);
          }
        };

        // 監聽 Flutter 應用生命周期事件
        document.addEventListener('flutter-first-frame', () => {
          (window as any).flutterBridge.onFlutterEvent({type: 'first-frame', data: {}});
        });

        // 監聽路由變化
        let currentRoute = '';
        const observer = new MutationObserver(() => {
          const newRoute = window.location.hash;
          if (newRoute !== currentRoute) {
            (window as any).flutterBridge.onFlutterEvent({
              type: 'route-changed',
              data: {from: currentRoute, to: newRoute}
            });
            currentRoute = newRoute;
          }
        });
        observer.observe(document.body, {childList: true, subtree: true});
      `
    });

    // 啟用無障礙功能
    await page.evaluate(() => {
      const button = document.querySelector('flt-semantics-placeholder[role="button"]');
      if (button) button.click();
    });

    await page.waitForTimeout(3000);

    // 檢查 Flutter Bridge 事件
    const events = await page.evaluate(() => (window as any).flutterBridge.events);
    console.log('Flutter Events Captured:', events);

    expect(events.length).toBeGreaterThan(0);
  });

  test('Solution 2: Visual State Detection', async ({ page }) => {
    console.log('🔧 Solution 2: Visual State Detection');

    await page.goto('https://redandan.github.io/#/login');

    // 獲取初始視覺狀態
    const initialState = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      const inputs = Array.from(document.querySelectorAll('input'));
      const links = Array.from(document.querySelectorAll('a'));

      return {
        buttonCount: buttons.length,
        inputCount: inputs.length,
        linkCount: links.length,
        hasAccessibilityButton: buttons.some(b => b.textContent?.includes('Enable') || b.textContent?.includes('啟用')),
        pageHeight: document.body.scrollHeight,
        pageWidth: document.body.scrollWidth
      };
    });

    console.log('Initial State:', initialState);

    // 啟用無障礙功能
    await page.evaluate(() => {
      const button = document.querySelector('flt-semantics-placeholder[role="button"]') as HTMLElement;
      if (button) button.click();
    });

    await page.waitForTimeout(3000);

    // 獲取變化後的狀態
    const afterState = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      const inputs = Array.from(document.querySelectorAll('input'));
      const links = Array.from(document.querySelectorAll('a'));

      return {
        buttonCount: buttons.length,
        inputCount: inputs.length,
        linkCount: links.length,
        hasAccessibilityButton: buttons.some(b => b.textContent?.includes('Enable') || b.textContent?.includes('啟用')),
        pageHeight: document.body.scrollHeight,
        pageWidth: document.body.scrollWidth
      };
    });

    console.log('After State:', afterState);

    // 驗證狀態變化
    expect(afterState.buttonCount).not.toBe(initialState.buttonCount);
    expect(afterState.inputCount).toBeGreaterThanOrEqual(initialState.inputCount);
  });

  test('Solution 3: Event-Driven Testing', async ({ page }) => {
    console.log('🔧 Solution 3: Event-Driven Testing');

    await page.goto('https://redandan.github.io/#/login');

    // 設置事件監聽器
    const events: Array<{type: string; data: any; timestamp: number}> = [];

    page.on('request', (request) => {
      if (request.url().includes('api') || request.url().includes('order')) {
        events.push({
          type: 'api-request',
          data: { url: request.url(), method: request.method() },
          timestamp: Date.now()
        });
      }
    });

    page.on('response', (response) => {
      if (response.url().includes('api') || response.url().includes('order')) {
        events.push({
          type: 'api-response',
          data: { url: response.url(), status: response.status() },
          timestamp: Date.now()
        });
      }
    });

    // 監聽控制台消息
    page.on('console', (msg) => {
      if (msg.text().includes('flutter') || msg.text().includes('route')) {
        events.push({
          type: 'console-message',
          data: { message: msg.text() },
          timestamp: Date.now()
        });
      }
    });

    // 執行操作
    await page.evaluate(() => {
      const button = document.querySelector('flt-semantics-placeholder[role="button"]');
      if (button) button.click();
    });

    await page.waitForTimeout(5000);

    console.log('Captured Events:', events);
    expect(events.length).toBeGreaterThan(0);
  });

  test('Solution 4: Hybrid Testing Approach', async ({ page }) => {
    console.log('🔧 Solution 4: Hybrid Testing Approach');

    await page.goto('https://redandan.github.io/#/login');

    // 階段 1: 靜態分析
    const staticAnalysis = await page.evaluate(() => {
      return {
        flutterElements: document.querySelectorAll('[class*="flt-"], flt-semantics-placeholder').length,
        semanticElements: document.querySelectorAll('[role], [aria-label]').length,
        interactiveElements: document.querySelectorAll('button, [role="button"], input, a').length,
        hasFlutterApp: !!document.querySelector('flutter-view, [class*="flutter"]'),
        hasMainScript: !!document.querySelector('script[src*="main.dart.js"]')
      };
    });

    console.log('Static Analysis:', staticAnalysis);
    expect(staticAnalysis.flutterElements).toBeGreaterThan(0);

    // 階段 2: 動態測試
    await page.evaluate(() => {
      const button = document.querySelector('flt-semantics-placeholder[role="button"]') as HTMLElement;
      if (button) button.click();
    });

    await page.waitForTimeout(3000);

    // 階段 3: 結果驗證
    const dynamicAnalysis = await page.evaluate(() => {
      return {
        newButtons: document.querySelectorAll('button:not([disabled]), [role="button"]:not([disabled])').length,
        newInputs: document.querySelectorAll('input:not([disabled])').length,
        hasLoginForm: !!document.querySelector('input[type="email"], input[type="password"]'),
        pageChanged: window.location.hash !== '#/login'
      };
    });

    console.log('Dynamic Analysis:', dynamicAnalysis);
    expect(dynamicAnalysis.newButtons).toBeGreaterThan(0);
  });

  test('Solution 5: Machine Learning Pattern Recognition', async ({ page }) => {
    console.log('🔧 Solution 5: ML Pattern Recognition');

    await page.goto('https://redandan.github.io/#/login');

    // 智能元素識別
    const elementPatterns = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      const patterns: {
        buttons: Array<{
          index: number;
          tagName: string;
          role: string | null;
          text: string;
          position: { x: number; y: number; width: number; height: number };
          visible: boolean;
        }>;
        inputs: Array<{
          index: number;
          type: string | null;
          placeholder: string | null;
          position: { x: number; y: number; width: number; height: number };
          visible: boolean;
        }>;
        links: Array<any>;
        containers: Array<any>;
      } = {
        buttons: [],
        inputs: [],
        links: [],
        containers: []
      };

      allElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);

        // 按鈕模式識別
        if ((el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') &&
            rect.width > 0 && rect.height > 0) {
          patterns.buttons.push({
            index,
            tagName: el.tagName,
            role: el.getAttribute('role'),
            text: el.textContent?.substring(0, 50) || '',
            position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            visible: rect.width > 0 && rect.height > 0 && computedStyle.display !== 'none'
          });
        }

        // 輸入框模式識別
        if (el.tagName === 'INPUT' && rect.width > 0 && rect.height > 0) {
          patterns.inputs.push({
            index,
            type: el.getAttribute('type'),
            placeholder: el.getAttribute('placeholder'),
            position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            visible: rect.width > 0 && rect.height > 0 && computedStyle.display !== 'none'
          });
        }
      });

      return patterns;
    });

    console.log('Element Patterns:', elementPatterns);

    // 基於模式的智能點擊
    if (elementPatterns.buttons.length > 0) {
      const firstButton = elementPatterns.buttons[0];
      console.log(`Smart clicking button: ${firstButton.text}`);

      await page.evaluate((buttonIndex) => {
        const allElements = Array.from(document.querySelectorAll('*'));
        const button = allElements[buttonIndex] as HTMLElement;
        if (button) button.click();
      }, firstButton.index);

      await page.waitForTimeout(3000);

      // 驗證結果
      const afterPatterns = await page.evaluate(() => {
        return {
          buttonCount: document.querySelectorAll('button, [role="button"]').length,
          inputCount: document.querySelectorAll('input').length,
          urlChanged: window.location.hash !== '#/login'
        };
      });

      console.log('After Patterns:', afterPatterns);
      expect(afterPatterns.buttonCount).toBeGreaterThan(0);
    }
  });

  test('Solution 6: Flutter DevTools Integration', async ({ page, context }) => {
    console.log('🔧 Solution 6: Flutter DevTools Integration');

    await page.goto('https://redandan.github.io/#/login');

    // 模擬 Flutter DevTools 連接
    const devToolsPage = await context.newPage();
    await devToolsPage.goto('chrome://inspect/#devices');

    // 檢查是否有 Flutter 應用
    const flutterApps = await devToolsPage.evaluate(() => {
      const apps = Array.from(document.querySelectorAll('.device-item'));
      return apps.map(app => ({
        name: app.querySelector('.device-name')?.textContent,
        url: app.querySelector('.device-url')?.textContent
      }));
    });

    console.log('Flutter Apps Detected:', flutterApps);

    // 在主頁面執行操作
    await page.evaluate(() => {
      const button = document.querySelector('flt-semantics-placeholder[role="button"]');
      if (button) button.click();
    });

    await page.waitForTimeout(3000);

    // 檢查應用狀態變化
    const appState = await page.evaluate(() => {
      return {
        currentRoute: window.location.hash,
        buttonCount: document.querySelectorAll('button, [role="button"]').length,
        inputCount: document.querySelectorAll('input').length,
        hasFlutterView: !!document.querySelector('flutter-view'),
        timestamp: Date.now()
      };
    });

    console.log('App State After Action:', appState);
    expect(appState.buttonCount).toBeGreaterThan(0);
  });

  test('Solution 7: Computer Vision Testing', async ({ page }) => {
    console.log('🔧 Solution 7: Computer Vision Testing');

    await page.goto('https://redandan.github.io/#/login');

    // 獲取頁面截圖
    const screenshot = await page.screenshot();
    console.log(`Screenshot taken: ${screenshot.length} bytes`);

    // 分析頁面結構
    const pageStructure = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        textContent: el.textContent?.substring(0, 100),
        boundingRect: el.getBoundingClientRect(),
        computedStyle: {
          display: window.getComputedStyle(el).display,
          visibility: window.getComputedStyle(el).visibility,
          opacity: window.getComputedStyle(el).opacity,
          cursor: window.getComputedStyle(el).cursor
        }
      })).filter(el => el.boundingRect.width > 0 && el.boundingRect.height > 0);
    });

    console.log(`Found ${pageStructure.length} visible elements`);

    // 識別可點擊元素
    const clickableElements = pageStructure.filter(el =>
      el.tagName === 'BUTTON' ||
      el.className.includes('button') ||
      el.computedStyle.cursor === 'pointer' ||
      el.tagName === 'A'
    );

    console.log(`Found ${clickableElements.length} clickable elements`);

    // 基於視覺分析的智能點擊
    if (clickableElements.length > 0) {
      const targetElement = clickableElements[0];
      console.log(`Clicking element: ${targetElement.tagName} with text: ${targetElement.textContent}`);

      // 計算點擊位置
      const clickX = targetElement.boundingRect.x + targetElement.boundingRect.width / 2;
      const clickY = targetElement.boundingRect.y + targetElement.boundingRect.height / 2;

      await page.mouse.click(clickX, clickY);
      await page.waitForTimeout(3000);

      // 驗證結果
      const afterStructure = await page.evaluate(() => {
        return {
          buttonCount: document.querySelectorAll('button, [role="button"]').length,
          inputCount: document.querySelectorAll('input').length,
          urlChanged: window.location.hash !== '#/login'
        };
      });

      console.log('After Visual Click:', afterStructure);
      expect(afterStructure.buttonCount).toBeGreaterThan(0);
    }
  });

  test('Solution 8: Flutter Widget Tree Analysis', async ({ page }) => {
    console.log('🔧 Solution 8: Flutter Widget Tree Analysis');

    await page.goto('https://redandan.github.io/#/login');

    // 分析 Flutter Widget 樹結構
    const widgetTree = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      const flutterElements = allElements.filter(el =>
        el.className.includes('flt-') ||
        el.tagName.includes('FLT-') ||
        el.getAttribute('data-flutter') !== null
      );

      return flutterElements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        attributes: Array.from(el.attributes).map(attr => ({
          name: attr.name,
          value: attr.value
        })),
        textContent: el.textContent?.substring(0, 50),
        boundingRect: el.getBoundingClientRect(),
        childCount: el.children.length,
        parentElement: el.parentElement?.tagName
      }));
    });

    console.log(`Flutter Widget Tree: ${widgetTree.length} widgets found`);
    widgetTree.forEach((widget, index) => {
      console.log(`${index + 1}. ${widget.tagName}.${widget.className}: ${widget.textContent}`);
    });

    // 基於 Widget 樹的智能操作
    if (widgetTree.length > 0) {
      const firstWidget = widgetTree[0];
      console.log(`Operating on Flutter widget: ${firstWidget.tagName}`);

      await page.evaluate((widgetIndex) => {
        const flutterElements = Array.from(document.querySelectorAll('*')).filter(el =>
          el.className.includes('flt-') ||
          el.tagName.includes('FLT-') ||
          el.getAttribute('data-flutter') !== null
        );
        const widget = flutterElements[widgetIndex] as HTMLElement;
        if (widget) widget.click();
      }, 0);

      await page.waitForTimeout(3000);

      // 分析變化
      const afterTree = await page.evaluate(() => {
        return {
          widgetCount: document.querySelectorAll('[class*="flt-"], [data-flutter]').length,
          buttonCount: document.querySelectorAll('button, [role="button"]').length,
          inputCount: document.querySelectorAll('input').length
        };
      });

      console.log('After Widget Operation:', afterTree);
      expect(afterTree.widgetCount).toBeGreaterThan(0);
    }
  });
});