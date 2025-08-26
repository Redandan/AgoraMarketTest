const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Flutter Web 自動化測試腳本
 * 針對 AgoraMarket C2C 交易平台進行隨機探索測試
 */
class FlutterWebAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
    this.operationCount = 0;
    this.maxOperationsPerPage = 10;
    this.screenshotDir = 'screenshots';
    this.testUrl = 'https://redandan.github.io/';
    
    // 性能監控數據
    this.performanceData = {
      pageLoadTime: 0,
      totalTestTime: 0,
      operationTimes: [],
      networkRequests: [],
      consoleErrors: [],
      memoryUsage: [],
      navigationTiming: null
    };
    
    // 確保截圖目錄存在
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  /**
   * 初始化瀏覽器和頁面
   */
  async initialize() {
    try {
      console.log('🚀 啟動 Chromium 瀏覽器...');
      
      // 啟動瀏覽器，配置適合 Flutter Web 的設置
      this.browser = await chromium.launch({
        headless: false, // 設為 true 可在背景執行
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security', // Flutter Web 可能需要
          '--allow-running-insecure-content',
          '--disable-features=VizDisplayCompositor'
        ]
      });

      // 創建新頁面並設定用戶代理
      this.page = await this.browser.newPage({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      
      // 設定視窗大小（桌面端測試）
      await this.page.setViewportSize({ width: 1920, height: 1080 });
      
      console.log('✅ 瀏覽器初始化完成');
      
    } catch (error) {
      console.error('❌ 瀏覽器初始化失敗:', error.message);
      throw error;
    }
  }

  /**
   * 導航到指定 URL (含性能監控)
   */
  async navigateToUrl(url = this.testUrl) {
    try {
      console.log(`🌐 導航到 ${url}...`);
      
      const navigationStartTime = Date.now();
      
      // 設置網路監控
      await this.setupNetworkMonitoring();
      
      // 導航到目標 URL，等待網路空閒
      await this.page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // 等待 Flutter Web 應用載入完成
      console.log('⏳ 等待 Flutter Web 應用載入...');
      
      // 等待 Flutter 框架載入（檢查常見的 Flutter 元素）
      try {
        await this.page.waitForSelector('flt-glass-pane, flutter-view, [flt-renderer]', { 
          timeout: 15000 
        });
        console.log('✅ Flutter Web 應用載入完成');
        
        // 額外等待時間讓 Flutter 應用完全渲染
        await this.page.waitForTimeout(5000);
        console.log('⏳ 等待 Flutter 應用完全渲染...');
        
      } catch {
        console.log('⚠️  未檢測到 Flutter 特定元素，繼續執行...');
        // 仍然等待一些時間以防萬一
        await this.page.waitForTimeout(3000);
      }
      
      // 計算頁面載入時間
      const navigationEndTime = Date.now();
      this.performanceData.pageLoadTime = navigationEndTime - navigationStartTime;
      
      // 獲取導航性能數據
      await this.collectNavigationTiming();
      
      // 獲取記憶體使用情況
      await this.collectMemoryUsage();
      
      console.log(`⚡ 頁面載入時間: ${this.performanceData.pageLoadTime}ms`);
      
      // 初始截圖
      await this.takeScreenshot('initial_load');
      
      // 調試頁面元素 (僅在開發模式下)
      if (process.env.DEBUG === 'true') {
        await this.debugPageElements();
      }
      
    } catch (error) {
      console.error('❌ 頁面導航失敗:', error.message);
      await this.takeScreenshot('navigation_error');
      throw error;
    }
  }

  /**
   * 設置網路監控
   */
  async setupNetworkMonitoring() {
    try {
      // 監控網路請求
      this.page.on('request', request => {
        this.performanceData.networkRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
          type: 'request'
        });
      });
      
      this.page.on('response', response => {
        this.performanceData.networkRequests.push({
          url: response.url(),
          status: response.status(),
          timestamp: Date.now(),
          type: 'response'
        });
      });
      
      this.page.on('requestfailed', request => {
        this.performanceData.networkRequests.push({
          url: request.url(),
          failure: request.failure()?.errorText,
          timestamp: Date.now(),
          type: 'failed'
        });
      });
      
    } catch (error) {
      console.log(`⚠️  設置網路監控時出錯: ${error.message}`);
    }
  }

  /**
   * 收集導航性能數據
   */
  async collectNavigationTiming() {
    try {
      this.performanceData.navigationTiming = await this.page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          return {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            domInteractive: perfData.domInteractive - perfData.fetchStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
          };
        }
        return null;
      });
      
      if (this.performanceData.navigationTiming) {
        console.log('📊 導航性能數據:', this.performanceData.navigationTiming);
      }
      
    } catch (error) {
      console.log(`⚠️  收集導航性能數據時出錯: ${error.message}`);
    }
  }

  /**
   * 收集記憶體使用情況
   */
  async collectMemoryUsage() {
    try {
      const memoryUsage = await this.page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            timestamp: Date.now()
          };
        }
        return null;
      });
      
      if (memoryUsage) {
        this.performanceData.memoryUsage.push(memoryUsage);
        console.log(`💾 記憶體使用: ${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      }
      
    } catch (error) {
      console.log(`⚠️  收集記憶體數據時出錯: ${error.message}`);
    }
  }

  /**
   * 截取螢幕截圖
   */
  async takeScreenshot(actionName) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${String(this.operationCount).padStart(3, '0')}_${actionName}_${timestamp}.png`;
      const filepath = path.join(this.screenshotDir, filename);
      
      await this.page.screenshot({ 
        path: filepath,
        fullPage: true // 截取完整頁面
      });
      
      console.log(`📸 截圖已保存: ${filename}`);
    } catch (error) {
      console.error('❌ 截圖失敗:', error.message);
    }
  }

  /**
   * 調試頁面元素 - 輸出所有可能的元素信息
   */
  async debugPageElements() {
    try {
      console.log('🔍 調試頁面元素...');
      
      const debugInfo = await this.page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const elementInfo = [];
        
        allElements.forEach((el, index) => {
          if (el.offsetParent !== null || el.tagName === 'INPUT') {
            const info = {
              tagName: el.tagName,
              id: el.id || '',
              className: el.className || '',
              textContent: (el.textContent || '').trim().substring(0, 50),
              type: el.type || '',
              placeholder: el.placeholder || '',
              role: el.getAttribute('role') || '',
              ariaLabel: el.getAttribute('aria-label') || '',
              dataSemantics: el.getAttribute('data-semantics-role') || ''
            };
            
            if (info.textContent || info.placeholder || info.role || info.ariaLabel || 
                info.tagName === 'INPUT' || info.tagName === 'BUTTON') {
              elementInfo.push(info);
            }
          }
        });
        
        return elementInfo.slice(0, 20); // 限制輸出數量
      });
      
      console.log('📋 找到的元素:', debugInfo);
      return debugInfo;
      
    } catch (error) {
      console.error('❌ 調試頁面元素失敗:', error.message);
      return [];
    }
  }

  /**
   * 獲取所有可互動的元素 (增強 Flutter Web 支援)
   */
  async getInteractableElements() {
    try {
      // 等待頁面穩定
      await this.page.waitForTimeout(2000);
      
      const elements = await this.page.evaluate(() => {
        const interactable = [];
        
        // Helper function to check if element is visible and interactable
        const isElementInteractable = (el) => {
          if (!el || el.offsetParent === null) return false;
          if (el.disabled || el.readOnly) return false;
          
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (style.opacity === '0' || style.pointerEvents === 'none') return false;
          
          return true;
        };

        // Helper function to generate unique selector
        const generateSelector = (el, type, index) => {
          // Try to use Flutter-specific attributes first
          if (el.getAttribute('data-semantics-role')) {
            return `[data-semantics-role="${el.getAttribute('data-semantics-role')}"]`;
          }
          if (el.getAttribute('aria-label')) {
            return `[aria-label="${el.getAttribute('aria-label')}"]`;
          }
          if (el.id) {
            return `#${el.id}`;
          }
          if (el.className && el.className.trim()) {
            const classes = el.className.trim().split(/\s+/).slice(0, 2).join('.');
            return `.${classes}`;
          }
          
          // Fallback to nth-of-type
          return `${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`;
        };
        
        // 1. 獲取所有按鈕 (包含 Flutter Web 特定元素)
        const buttonSelectors = [
          'button', 
          '[role="button"]', 
          'input[type="button"]', 
          'input[type="submit"]',
          // Flutter Web 特定選擇器
          'flt-semantics[role="button"]',
          '[data-semantics-role="button"]',
          'flt-semantics-host',
          // Flutter 渲染的可點擊元素
          'flt-glass-pane [role="button"]',
          'flutter-view [role="button"]',
          // 通用按鈕樣式
          '.btn', '.button', 
          '[class*="button"]',
          '[class*="btn"]',
          // Material Design 按鈕
          'md-elevated-button', 'md-filled-button', 'md-outlined-button',
          // 可點擊的 div 和 span 元素
          'div[onclick]', 'span[onclick]',
          // Flutter Web 中常見的可點擊元素
          'div[role="button"]', 'span[role="button"]',
          // 排除無障礙按鈕
          ':not([aria-label*="Enable accessibility"])'
        ];
        
        buttonSelectors.forEach(selector => {
          const buttons = document.querySelectorAll(selector);
          buttons.forEach((el, index) => {
            if (isElementInteractable(el)) {
              interactable.push({
                type: 'button',
                selector: generateSelector(el, 'button', index),
                text: el.textContent?.trim() || el.value || el.getAttribute('aria-label') || `Button ${index + 1}`,
                semanticsRole: el.getAttribute('data-semantics-role'),
                ariaLabel: el.getAttribute('aria-label')
              });
            }
          });
        });
        
        // 2. 獲取所有連結 (包含 Flutter Web 路由)
        const linkSelectors = [
          'a[href]',
          '[role="link"]',
          'flt-semantics[role="link"]',
          '[data-semantics-role="link"]'
        ];
        
        linkSelectors.forEach(selector => {
          const links = document.querySelectorAll(selector);
          links.forEach((el, index) => {
            if (isElementInteractable(el) && el.href && !el.href.startsWith('javascript:')) {
              interactable.push({
                type: 'link',
                selector: generateSelector(el, 'link', index),
                text: el.textContent?.trim() || el.href,
                href: el.href,
                semanticsRole: el.getAttribute('data-semantics-role'),
                ariaLabel: el.getAttribute('aria-label')
              });
            }
          });
        });
        
        // 3. 獲取文字輸入框 (包含 Flutter Web 輸入元件)
        const inputSelectors = [
          'input[type="text"]', 'input[type="email"]', 'input[type="password"]', 
          'input[type="search"]', 'input[type="tel"]', 'input[type="url"]',
          'input:not([type])', 'textarea',
          // Flutter Web 特定輸入元素
          'flt-semantics[role="textbox"]',
          '[data-semantics-role="textbox"]',
          '[contenteditable="true"]',
          // Material Design 輸入框
          'md-outlined-text-field input', 'md-filled-text-field input'
        ];
        
        inputSelectors.forEach(selector => {
          const inputs = document.querySelectorAll(selector);
          inputs.forEach((el, index) => {
            if (isElementInteractable(el)) {
              interactable.push({
                type: 'text_input',
                selector: generateSelector(el, 'input', index),
                placeholder: el.placeholder || el.getAttribute('aria-label') || `Text input ${index + 1}`,
                inputType: el.type || 'text',
                semanticsRole: el.getAttribute('data-semantics-role'),
                ariaLabel: el.getAttribute('aria-label')
              });
            }
          });
        });
        
        // 4. 獲取核取方塊和開關
        const checkboxSelectors = [
          'input[type="checkbox"]',
          'input[type="radio"]',
          '[role="checkbox"]',
          '[role="radio"]',
          '[role="switch"]',
          'flt-semantics[role="checkbox"]',
          'flt-semantics[role="radio"]',
          'flt-semantics[role="switch"]',
          '[data-semantics-role="checkbox"]',
          '[data-semantics-role="radio"]',
          '[data-semantics-role="switch"]'
        ];
        
        checkboxSelectors.forEach(selector => {
          const checkboxes = document.querySelectorAll(selector);
          checkboxes.forEach((el, index) => {
            if (isElementInteractable(el)) {
              interactable.push({
                type: 'checkbox',
                selector: generateSelector(el, 'checkbox', index),
                checked: el.checked || el.getAttribute('aria-checked') === 'true',
                inputType: el.type || 'checkbox',
                semanticsRole: el.getAttribute('data-semantics-role'),
                ariaLabel: el.getAttribute('aria-label')
              });
            }
          });
        });
        
        // 5. 獲取下拉選單和選擇器
        const selectSelectors = [
          'select',
          '[role="combobox"]',
          '[role="listbox"]',
          'flt-semantics[role="combobox"]',
          'flt-semantics[role="listbox"]',
          '[data-semantics-role="combobox"]',
          '[data-semantics-role="listbox"]'
        ];
        
        selectSelectors.forEach(selector => {
          const selects = document.querySelectorAll(selector);
          selects.forEach((el, index) => {
            if (isElementInteractable(el)) {
              let options = [];
              if (el.tagName === 'SELECT') {
                options = Array.from(el.options).map(opt => opt.value);
              } else {
                // For custom dropdowns, try to find options
                const optionElements = el.querySelectorAll('[role="option"], option, .option');
                options = Array.from(optionElements).map(opt => opt.textContent?.trim() || opt.value);
              }
              
              interactable.push({
                type: 'select',
                selector: generateSelector(el, 'select', index),
                options: options,
                semanticsRole: el.getAttribute('data-semantics-role'),
                ariaLabel: el.getAttribute('aria-label')
              });
            }
          });
        });
        
        // 6. 獲取滑動元件和範圍輸入
        const sliderSelectors = [
          'input[type="range"]',
          '[role="slider"]',
          'flt-semantics[role="slider"]',
          '[data-semantics-role="slider"]',
          '.slider', '[class*="slider"]'
        ];
        
        sliderSelectors.forEach(selector => {
          const sliders = document.querySelectorAll(selector);
          sliders.forEach((el, index) => {
            if (isElementInteractable(el)) {
              interactable.push({
                type: 'slider',
                selector: generateSelector(el, 'slider', index),
                min: el.min || el.getAttribute('aria-valuemin') || 0,
                max: el.max || el.getAttribute('aria-valuemax') || 100,
                value: el.value || el.getAttribute('aria-valuenow') || 50,
                semanticsRole: el.getAttribute('data-semantics-role'),
                ariaLabel: el.getAttribute('aria-label')
              });
            }
          });
        });

        // 7. 獲取可滾動區域
        const scrollableElements = document.querySelectorAll('[class*="scroll"], .scrollable, [style*="overflow"]');
        scrollableElements.forEach((el, index) => {
          if (isElementInteractable(el) && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)) {
            interactable.push({
              type: 'scrollable',
              selector: generateSelector(el, 'scrollable', index),
              scrollHeight: el.scrollHeight,
              clientHeight: el.clientHeight,
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth
            });
          }
        });
        
        // Remove duplicates based on selector
        const uniqueElements = [];
        const seenSelectors = new Set();
        
        interactable.forEach(item => {
          if (!seenSelectors.has(item.selector)) {
            seenSelectors.add(item.selector);
            uniqueElements.push({
              type: item.type,
              selector: item.selector,
              text: item.text,
              placeholder: item.placeholder,
              href: item.href,
              checked: item.checked,
              options: item.options,
              inputType: item.inputType,
              semanticsRole: item.semanticsRole,
              ariaLabel: item.ariaLabel,
              min: item.min,
              max: item.max,
              value: item.value,
              scrollHeight: item.scrollHeight,
              clientHeight: item.clientHeight,
              scrollWidth: item.scrollWidth,
              clientWidth: item.clientWidth
            });
          }
        });
        
        return uniqueElements;
      });
      
      console.log(`🔍 找到 ${elements.length} 個可互動元素`);
      
      // 按類型統計
      const typeCount = elements.reduce((acc, el) => {
        acc[el.type] = (acc[el.type] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 元素類型統計:', typeCount);
      
      return elements;
      
    } catch (error) {
      console.error('❌ 獲取可互動元素失敗:', error.message);
      return [];
    }
  }

  /**
   * 隨機點擊按鈕或連結
   */
  async clickRandomElement(elements) {
    const clickableElements = elements.filter(el => el.type === 'button' || el.type === 'link');
    
    if (clickableElements.length === 0) {
      console.log('⚠️  沒有找到可點擊的元素');
      return false;
    }
    
    const randomElement = clickableElements[Math.floor(Math.random() * clickableElements.length)];
    
    try {
      console.log(`🖱️  點擊 ${randomElement.type}: ${randomElement.text || randomElement.href}`);
      
      // 使用更精確的選擇器
      const element = await this.page.$(randomElement.selector);
      if (element) {
        // 滾動到元素位置
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        
        // 點擊元素
        await element.click();
        
        // 等待頁面響應
        await this.page.waitForTimeout(3000);
        
        this.operationCount++;
        await this.takeScreenshot(`click_${randomElement.type}_${this.operationCount}`);
        
        return true;
      }
      
    } catch (error) {
      console.error(`❌ 點擊失敗: ${error.message}`);
      await this.takeScreenshot(`click_error_${this.operationCount}`);
      return false;
    }
  }

  /**
   * 隨機填寫文字輸入框
   */
  async fillRandomTextInput(elements) {
    const textInputs = elements.filter(el => el.type === 'text_input');
    
    if (textInputs.length === 0) {
      console.log('⚠️  沒有找到文字輸入框');
      return false;
    }
    
    const randomInput = textInputs[Math.floor(Math.random() * textInputs.length)];
    
    // 根據輸入類型生成測試數據
    const testData = this.generateTestData(randomInput.inputType, randomInput.placeholder);
    
    try {
      console.log(`✏️  填寫輸入框 (${randomInput.inputType}): ${testData}`);
      
      const element = await this.page.$(randomInput.selector);
      if (element) {
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        // 清空現有內容並填入新內容
        await element.click({ clickCount: 3 }); // 全選
        await element.fill(testData);
        
        this.operationCount++;
        await this.takeScreenshot(`fill_input_${this.operationCount}`);
        
        return true;
      }
      
    } catch (error) {
      console.error(`❌ 填寫輸入框失敗: ${error.message}`);
      await this.takeScreenshot(`input_error_${this.operationCount}`);
      return false;
    }
  }

  /**
   * 隨機操作核取方塊
   */
  async toggleRandomCheckbox(elements) {
    const checkboxes = elements.filter(el => el.type === 'checkbox');
    
    if (checkboxes.length === 0) {
      console.log('⚠️  沒有找到核取方塊');
      return false;
    }
    
    const randomCheckbox = checkboxes[Math.floor(Math.random() * checkboxes.length)];
    
    try {
      console.log(`☑️  切換核取方塊狀態`);
      
      const element = await this.page.$(randomCheckbox.selector);
      if (element) {
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        await element.click();
        
        this.operationCount++;
        await this.takeScreenshot(`toggle_checkbox_${this.operationCount}`);
        
        return true;
      }
      
    } catch (error) {
      console.error(`❌ 核取方塊操作失敗: ${error.message}`);
      await this.takeScreenshot(`checkbox_error_${this.operationCount}`);
      return false;
    }
  }

  /**
   * 隨機選擇下拉選單選項
   */
  async selectRandomOption(elements) {
    const selects = elements.filter(el => el.type === 'select' && el.options && el.options.length > 0);
    
    if (selects.length === 0) {
      console.log('⚠️  沒有找到下拉選單');
      return false;
    }
    
    const randomSelect = selects[Math.floor(Math.random() * selects.length)];
    const randomOption = randomSelect.options[Math.floor(Math.random() * randomSelect.options.length)];
    
    try {
      console.log(`📋 選擇下拉選單選項: ${randomOption}`);
      
      const element = await this.page.$(randomSelect.selector);
      if (element) {
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        await element.selectOption(randomOption);
        
        this.operationCount++;
        await this.takeScreenshot(`select_option_${this.operationCount}`);
        
        return true;
      }
      
    } catch (error) {
      console.error(`❌ 下拉選單操作失敗: ${error.message}`);
      await this.takeScreenshot(`select_error_${this.operationCount}`);
      return false;
    }
  }

  /**
   * 隨機操作滑動元件
   */
  async operateRandomSlider(elements) {
    const sliders = elements.filter(el => el.type === 'slider');
    
    if (sliders.length === 0) {
      console.log('⚠️  沒有找到滑動元件');
      return false;
    }
    
    const randomSlider = sliders[Math.floor(Math.random() * sliders.length)];
    
    try {
      const min = parseFloat(randomSlider.min) || 0;
      const max = parseFloat(randomSlider.max) || 100;
      const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
      
      console.log(`🎚️  設定滑動元件值: ${randomValue} (範圍: ${min}-${max})`);
      
      const element = await this.page.$(randomSlider.selector);
      if (element) {
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        // 對於 input[type="range"]，直接設定值
        if (await element.evaluate(el => el.tagName === 'INPUT' && el.type === 'range')) {
          await element.fill(randomValue.toString());
        } else {
          // 對於自定義滑動元件，嘗試拖拽操作
          const box = await element.boundingBox();
          if (box) {
            const targetX = box.x + (box.width * (randomValue - min) / (max - min));
            const targetY = box.y + box.height / 2;
            await this.page.mouse.click(targetX, targetY);
          }
        }
        
        this.operationCount++;
        await this.takeScreenshot(`slider_${this.operationCount}`);
        
        return true;
      }
      
    } catch (error) {
      console.error(`❌ 滑動元件操作失敗: ${error.message}`);
      await this.takeScreenshot(`slider_error_${this.operationCount}`);
      return false;
    }
  }

  /**
   * 隨機滾動操作
   */
  async performRandomScroll(elements) {
    const scrollables = elements.filter(el => el.type === 'scrollable');
    
    if (scrollables.length === 0) {
      console.log('⚠️  沒有找到可滾動區域，嘗試頁面滾動');
      // 如果沒有特定的滾動區域，就滾動整個頁面
      const scrollDirection = Math.random() > 0.5 ? 'down' : 'up';
      const scrollAmount = Math.floor(Math.random() * 500) + 200;
      
      try {
        if (scrollDirection === 'down') {
          await this.page.mouse.wheel(0, scrollAmount);
          console.log(`⬇️  向下滾動 ${scrollAmount}px`);
        } else {
          await this.page.mouse.wheel(0, -scrollAmount);
          console.log(`⬆️  向上滾動 ${scrollAmount}px`);
        }
        
        this.operationCount++;
        await this.takeScreenshot(`page_scroll_${scrollDirection}_${this.operationCount}`);
        return true;
        
      } catch (error) {
        console.error(`❌ 頁面滾動失敗: ${error.message}`);
        return false;
      }
    }
    
    const randomScrollable = scrollables[Math.floor(Math.random() * scrollables.length)];
    
    try {
      console.log(`📜 滾動區域操作`);
      
      const element = await this.page.$(randomScrollable.selector);
      if (element) {
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        const scrollDirection = Math.random() > 0.5 ? 'vertical' : 'horizontal';
        const scrollAmount = Math.floor(Math.random() * 300) + 100;
        
        if (scrollDirection === 'vertical') {
          const direction = Math.random() > 0.5 ? scrollAmount : -scrollAmount;
          await element.evaluate((el, delta) => {
            el.scrollTop += delta;
          }, direction);
          console.log(`📜 垂直滾動 ${direction > 0 ? '向下' : '向上'} ${Math.abs(direction)}px`);
        } else {
          const direction = Math.random() > 0.5 ? scrollAmount : -scrollAmount;
          await element.evaluate((el, delta) => {
            el.scrollLeft += delta;
          }, direction);
          console.log(`📜 水平滾動 ${direction > 0 ? '向右' : '向左'} ${Math.abs(direction)}px`);
        }
        
        this.operationCount++;
        await this.takeScreenshot(`scroll_${scrollDirection}_${this.operationCount}`);
        
        return true;
      }
      
    } catch (error) {
      console.error(`❌ 滾動操作失敗: ${error.message}`);
      await this.takeScreenshot(`scroll_error_${this.operationCount}`);
      return false;
    }
  }

  /**
   * 生成測試數據
   */
  generateTestData(inputType, placeholder = '') {
    const testStrings = {
      text: ['測試文字', 'Test Text', '自動化測試', 'Automation Test'],
      email: ['test@example.com', 'automation@test.com', 'user@agoramarket.com'],
      password: ['TestPassword123!', 'AutoTest2024', 'SecurePass456'],
      search: ['商品', '服務', 'USDT', '配送'],
      name: ['測試用戶', 'Test User', '自動化測試員'],
      phone: ['0912345678', '+886912345678', '02-12345678'],
      address: ['台北市信義區', '新北市板橋區', '台中市西屯區']
    };
    
    // 根據 placeholder 或 inputType 選擇合適的測試數據
    const lowerPlaceholder = placeholder.toLowerCase();
    
    if (lowerPlaceholder.includes('email') || inputType === 'email') {
      return testStrings.email[Math.floor(Math.random() * testStrings.email.length)];
    } else if (lowerPlaceholder.includes('password') || inputType === 'password') {
      return testStrings.password[Math.floor(Math.random() * testStrings.password.length)];
    } else if (lowerPlaceholder.includes('search') || lowerPlaceholder.includes('搜尋')) {
      return testStrings.search[Math.floor(Math.random() * testStrings.search.length)];
    } else if (lowerPlaceholder.includes('name') || lowerPlaceholder.includes('姓名')) {
      return testStrings.name[Math.floor(Math.random() * testStrings.name.length)];
    } else if (lowerPlaceholder.includes('phone') || lowerPlaceholder.includes('電話')) {
      return testStrings.phone[Math.floor(Math.random() * testStrings.phone.length)];
    } else if (lowerPlaceholder.includes('address') || lowerPlaceholder.includes('地址')) {
      return testStrings.address[Math.floor(Math.random() * testStrings.address.length)];
    } else {
      return testStrings.text[Math.floor(Math.random() * testStrings.text.length)];
    }
  }

  /**
   * 執行隨機探索
   */
  async performRandomExploration() {
    console.log(`🎲 開始隨機探索 (最多 ${this.maxOperationsPerPage} 次操作)...`);
    
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 3;
    
    while (this.operationCount < this.maxOperationsPerPage && consecutiveFailures < maxConsecutiveFailures) {
      try {
        // 獲取當前頁面的所有可互動元素
        const elements = await this.getInteractableElements();
        
        if (elements.length === 0) {
          console.log('⚠️  沒有找到可互動元素，結束探索');
          break;
        }
        
        // 隨機選擇操作類型
        const operations = [];
        
        if (elements.some(el => el.type === 'button' || el.type === 'link')) {
          operations.push('click');
        }
        if (elements.some(el => el.type === 'text_input')) {
          operations.push('fill');
        }
        if (elements.some(el => el.type === 'checkbox')) {
          operations.push('checkbox');
        }
        if (elements.some(el => el.type === 'select' && el.options && el.options.length > 0)) {
          operations.push('select');
        }
        if (elements.some(el => el.type === 'slider')) {
          operations.push('slider');
        }
        if (elements.some(el => el.type === 'scrollable') || elements.length > 0) {
          operations.push('scroll'); // 總是可以嘗試滾動
        }
        
        if (operations.length === 0) {
          console.log('⚠️  沒有可執行的操作');
          break;
        }
        
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        let success = false;
        
        // 執行隨機操作
        switch (randomOperation) {
          case 'click':
            success = await this.clickRandomElement(elements);
            break;
          case 'fill':
            success = await this.fillRandomTextInput(elements);
            break;
          case 'checkbox':
            success = await this.toggleRandomCheckbox(elements);
            break;
          case 'select':
            success = await this.selectRandomOption(elements);
            break;
          case 'slider':
            success = await this.operateRandomSlider(elements);
            break;
          case 'scroll':
            success = await this.performRandomScroll(elements);
            break;
        }
        
        if (success) {
          consecutiveFailures = 0;
          console.log(`✅ 操作 ${this.operationCount} 完成`);
          
          // 檢查是否有彈出視窗或對話框
          await this.handlePopups();
          
        } else {
          consecutiveFailures++;
          console.log(`⚠️  操作失敗 (連續失敗: ${consecutiveFailures})`);
        }
        
        // 隨機等待時間，模擬真實用戶行為
        const waitTime = Math.random() * 3000 + 1000; // 1-4秒
        await this.page.waitForTimeout(waitTime);
        
      } catch (error) {
        console.error(`❌ 探索過程發生錯誤: ${error.message}`);
        consecutiveFailures++;
        await this.takeScreenshot(`exploration_error_${this.operationCount}`);
      }
    }
    
    console.log(`🏁 隨機探索完成，共執行 ${this.operationCount} 次操作`);
  }

  /**
   * 處理彈出視窗和對話框
   */
  async handlePopups() {
    try {
      // 處理 JavaScript 警告框
      this.page.on('dialog', async dialog => {
        console.log(`🔔 檢測到對話框: ${dialog.message()}`);
        await this.takeScreenshot(`dialog_${this.operationCount}`);
        await dialog.accept();
      });
      
      // 檢查是否有模態視窗
      const modals = await this.page.$$('[role="dialog"], .modal, .popup');
      if (modals.length > 0) {
        console.log('🔔 檢測到模態視窗');
        await this.takeScreenshot(`modal_${this.operationCount}`);
        
        // 嘗試關閉模態視窗
        const closeButtons = await this.page.$$('[aria-label*="close"], [aria-label*="關閉"], .close, .modal-close');
        if (closeButtons.length > 0) {
          await closeButtons[0].click();
          console.log('✅ 模態視窗已關閉');
        }
      }
      
    } catch (error) {
      console.log(`⚠️  處理彈出視窗時出錯: ${error.message}`);
    }
  }

  /**
   * 檢查頁面錯誤 (含性能監控)
   */
  async checkForErrors() {
    try {
      // 監聽控制台錯誤
      this.page.on('console', msg => {
        if (msg.type() === 'error') {
          const errorInfo = {
            message: msg.text(),
            type: 'console',
            timestamp: Date.now()
          };
          this.performanceData.consoleErrors.push(errorInfo);
          console.log(`🔴 控制台錯誤: ${msg.text()}`);
        }
      });
      
      // 監聽頁面錯誤
      this.page.on('pageerror', error => {
        const errorInfo = {
          message: error.message,
          stack: error.stack,
          type: 'page',
          timestamp: Date.now()
        };
        this.performanceData.consoleErrors.push(errorInfo);
        console.log(`🔴 頁面錯誤: ${error.message}`);
      });
      
      // 檢查是否有錯誤訊息元素
      const errorElements = await this.page.$$('.error, .alert-danger, [role="alert"]');
      if (errorElements.length > 0) {
        console.log(`⚠️  檢測到 ${errorElements.length} 個錯誤訊息`);
        await this.takeScreenshot(`page_errors_${this.operationCount}`);
      }
      
    } catch (error) {
      console.log(`⚠️  檢查頁面錯誤時出錯: ${error.message}`);
    }
  }

  /**
   * 測量操作執行時間
   */
  async measureOperationTime(operationName, operationFunction) {
    const startTime = Date.now();
    
    try {
      const result = await operationFunction();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.performanceData.operationTimes.push({
        operation: operationName,
        duration: duration,
        timestamp: startTime,
        success: true
      });
      
      console.log(`⚡ ${operationName} 執行時間: ${duration}ms`);
      return result;
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.performanceData.operationTimes.push({
        operation: operationName,
        duration: duration,
        timestamp: startTime,
        success: false,
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * 生成測試報告
   */
  async generateTestReport() {
    try {
      console.log('📊 生成測試報告...');
      
      const reportData = {
        testInfo: {
          testUrl: this.testUrl,
          totalOperations: this.operationCount,
          testDuration: this.performanceData.totalTestTime,
          timestamp: new Date().toISOString(),
          screenshotDir: path.resolve(this.screenshotDir)
        },
        performance: {
          pageLoadTime: this.performanceData.pageLoadTime,
          navigationTiming: this.performanceData.navigationTiming,
          operationTimes: this.performanceData.operationTimes,
          memoryUsage: this.performanceData.memoryUsage
        },
        errors: {
          consoleErrors: this.performanceData.consoleErrors,
          totalErrors: this.performanceData.consoleErrors.length
        },
        network: {
          totalRequests: this.performanceData.networkRequests.filter(r => r.type === 'request').length,
          totalResponses: this.performanceData.networkRequests.filter(r => r.type === 'response').length,
          failedRequests: this.performanceData.networkRequests.filter(r => r.type === 'failed').length,
          requests: this.performanceData.networkRequests
        }
      };
      
      // 計算統計數據
      const operationStats = this.calculateOperationStats();
      reportData.statistics = operationStats;
      
      // 生成 JSON 報告
      const jsonReportPath = path.join(this.screenshotDir, 'test-report.json');
      fs.writeFileSync(jsonReportPath, JSON.stringify(reportData, null, 2), 'utf8');
      
      // 生成 HTML 報告
      const htmlReportPath = path.join(this.screenshotDir, 'test-report.html');
      const htmlContent = this.generateHtmlReport(reportData);
      fs.writeFileSync(htmlReportPath, htmlContent, 'utf8');
      
      console.log(`📋 JSON 報告已保存: ${jsonReportPath}`);
      console.log(`📄 HTML 報告已保存: ${htmlReportPath}`);
      
      return reportData;
      
    } catch (error) {
      console.error('❌ 生成測試報告失敗:', error.message);
    }
  }

  /**
   * 計算操作統計數據
   */
  calculateOperationStats() {
    const operations = this.performanceData.operationTimes;
    
    if (operations.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageOperationTime: 0,
        minOperationTime: 0,
        maxOperationTime: 0
      };
    }
    
    const successful = operations.filter(op => op.success);
    const failed = operations.filter(op => !op.success);
    const durations = operations.map(op => op.duration);
    
    return {
      totalOperations: operations.length,
      successfulOperations: successful.length,
      failedOperations: failed.length,
      successRate: ((successful.length / operations.length) * 100).toFixed(2) + '%',
      averageOperationTime: (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2) + 'ms',
      minOperationTime: Math.min(...durations) + 'ms',
      maxOperationTime: Math.max(...durations) + 'ms',
      operationTypes: this.groupOperationsByType(operations)
    };
  }

  /**
   * 按類型分組操作
   */
  groupOperationsByType(operations) {
    const grouped = {};
    
    operations.forEach(op => {
      if (!grouped[op.operation]) {
        grouped[op.operation] = {
          count: 0,
          successCount: 0,
          failCount: 0,
          totalTime: 0
        };
      }
      
      grouped[op.operation].count++;
      grouped[op.operation].totalTime += op.duration;
      
      if (op.success) {
        grouped[op.operation].successCount++;
      } else {
        grouped[op.operation].failCount++;
      }
    });
    
    // 計算平均時間
    Object.keys(grouped).forEach(key => {
      grouped[key].averageTime = (grouped[key].totalTime / grouped[key].count).toFixed(2) + 'ms';
      grouped[key].successRate = ((grouped[key].successCount / grouped[key].count) * 100).toFixed(2) + '%';
    });
    
    return grouped;
  }

  /**
   * 生成 HTML 報告
   */
  generateHtmlReport(reportData) {
    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flutter Web 自動化測試報告</title>
    <style>
        body { font-family: 'Microsoft JhengHei', Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { font-size: 0.9em; opacity: 0.9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #3498db; color: white; }
        tr:hover { background: #f8f9fa; }
        .success { color: #27ae60; font-weight: bold; }
        .error { color: #e74c3c; font-weight: bold; }
        .performance-chart { background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .memory-info { background: #e8f6f3; padding: 15px; border-left: 4px solid #1abc9c; margin: 10px 0; }
        .error-list { background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 5px; padding: 15px; }
        .timestamp { color: #7f8c8d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Flutter Web 自動化測試報告</h1>
        <p class="timestamp">生成時間: ${reportData.testInfo.timestamp}</p>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-value">${reportData.testInfo.totalOperations}</div>
                <div class="stat-label">總操作數</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${(reportData.testInfo.testDuration / 1000).toFixed(1)}s</div>
                <div class="stat-label">總測試時間</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${reportData.performance.pageLoadTime}ms</div>
                <div class="stat-label">頁面載入時間</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${reportData.statistics.successRate}</div>
                <div class="stat-label">成功率</div>
            </div>
        </div>

        <h2>📊 測試概況</h2>
        <table>
            <tr><td><strong>測試網址</strong></td><td>${reportData.testInfo.testUrl}</td></tr>
            <tr><td><strong>截圖目錄</strong></td><td>${reportData.testInfo.screenshotDir}</td></tr>
            <tr><td><strong>成功操作</strong></td><td class="success">${reportData.statistics.successfulOperations}</td></tr>
            <tr><td><strong>失敗操作</strong></td><td class="error">${reportData.statistics.failedOperations}</td></tr>
            <tr><td><strong>平均操作時間</strong></td><td>${reportData.statistics.averageOperationTime}</td></tr>
        </table>

        <h2>⚡ 性能數據</h2>
        <div class="performance-chart">
            <h3>導航性能</h3>
            ${reportData.performance.navigationTiming ? `
            <table>
                <tr><td>DOM 內容載入</td><td>${reportData.performance.navigationTiming.domContentLoaded}ms</td></tr>
                <tr><td>載入完成</td><td>${reportData.performance.navigationTiming.loadComplete}ms</td></tr>
                <tr><td>DOM 互動</td><td>${reportData.performance.navigationTiming.domInteractive}ms</td></tr>
                <tr><td>首次繪製</td><td>${reportData.performance.navigationTiming.firstPaint}ms</td></tr>
                <tr><td>首次內容繪製</td><td>${reportData.performance.navigationTiming.firstContentfulPaint}ms</td></tr>
            </table>
            ` : '<p>無導航性能數據</p>'}
        </div>

        ${reportData.performance.memoryUsage.length > 0 ? `
        <div class="memory-info">
            <h3>💾 記憶體使用情況</h3>
            <p>最大使用量: ${Math.max(...reportData.performance.memoryUsage.map(m => m.usedJSHeapSize)) / 1024 / 1024} MB</p>
            <p>平均使用量: ${(reportData.performance.memoryUsage.reduce((a, b) => a + b.usedJSHeapSize, 0) / reportData.performance.memoryUsage.length / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        ` : ''}

        <h2>🔧 操作統計</h2>
        <table>
            <thead>
                <tr><th>操作類型</th><th>執行次數</th><th>成功次數</th><th>成功率</th><th>平均時間</th></tr>
            </thead>
            <tbody>
                ${Object.entries(reportData.statistics.operationTypes).map(([type, stats]) => `
                <tr>
                    <td>${type}</td>
                    <td>${stats.count}</td>
                    <td class="success">${stats.successCount}</td>
                    <td>${stats.successRate}</td>
                    <td>${stats.averageTime}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <h2>🌐 網路請求</h2>
        <table>
            <tr><td><strong>總請求數</strong></td><td>${reportData.network.totalRequests}</td></tr>
            <tr><td><strong>總響應數</strong></td><td>${reportData.network.totalResponses}</td></tr>
            <tr><td><strong>失敗請求數</strong></td><td class="error">${reportData.network.failedRequests}</td></tr>
        </table>

        ${reportData.errors.totalErrors > 0 ? `
        <h2>❌ 錯誤報告</h2>
        <div class="error-list">
            <p><strong>總錯誤數: ${reportData.errors.totalErrors}</strong></p>
            ${reportData.errors.consoleErrors.slice(0, 10).map(error => `
                <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">
                    <strong>${error.type}錯誤:</strong> ${error.message}<br>
                    <small>時間: ${new Date(error.timestamp).toLocaleString()}</small>
                </div>
            `).join('')}
            ${reportData.errors.totalErrors > 10 ? '<p><em>... 更多錯誤請查看 JSON 報告</em></p>' : ''}
        </div>
        ` : '<h2>✅ 無錯誤發生</h2>'}

        <footer style="margin-top: 40px; text-align: center; color: #7f8c8d;">
            <p>AgoraMarket Flutter Web 自動化測試 - 生成於 ${new Date().toLocaleString()}</p>
        </footer>
    </div>
</body>
</html>`;
  }

  /**
   * 清理資源
   */
  async cleanup() {
    try {
      console.log('🧹 清理瀏覽器資源...');
      
      if (this.page) {
        await this.page.close();
      }
      
      if (this.browser) {
        await this.browser.close();
      }
      
      console.log('✅ 清理完成');
      
    } catch (error) {
      console.error('❌ 清理失敗:', error.message);
    }
  }

  /**
   * 專門的登入頁面測試 (針對 Flutter Web)
   */
  async performFlutterLoginTest() {
    console.log('🔐 執行 Flutter Web 登入頁面專門測試...');
    
    try {
      // 等待更長時間確保 Flutter 應用完全載入
      await this.page.waitForTimeout(5000);
      console.log('⏳ 額外等待 Flutter 登入頁面載入...');
      
      // 嘗試查找任何文字輸入框（可能是用戶名或密碼）
      const inputElements = await this.page.evaluate(() => {
        const inputs = document.querySelectorAll('input, flt-semantics[role="textbox"], [contenteditable="true"]');
        const inputInfo = [];
        
        inputs.forEach((input, index) => {
          if (input.offsetParent !== null || input.style.display !== 'none') {
            inputInfo.push({
              tagName: input.tagName,
              type: input.type || 'text',
              placeholder: input.placeholder || '',
              id: input.id || '',
              className: input.className || '',
              role: input.getAttribute('role') || '',
              ariaLabel: input.getAttribute('aria-label') || '',
              index: index
            });
          }
        });
        
        return inputInfo;
      });
      
      console.log('📝 找到的輸入框:', inputElements);
      
      // 嘗試查找任何包含登入相關文字的元素
      const loginRelatedElements = await this.page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const loginElements = [];
        
        const loginKeywords = ['登入', 'login', 'sign in', '會員', 'member', '用戶', 'user', '密碼', 'password', '帳號', 'account'];
        
        allElements.forEach((el, index) => {
          const text = (el.textContent || '').toLowerCase();
          const placeholder = (el.placeholder || '').toLowerCase();
          const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
          
          const hasLoginKeyword = loginKeywords.some(keyword => 
            text.includes(keyword) || placeholder.includes(keyword) || ariaLabel.includes(keyword)
          );
          
          if (hasLoginKeyword && (el.offsetParent !== null || el.tagName === 'INPUT')) {
            loginElements.push({
              tagName: el.tagName,
              textContent: (el.textContent || '').trim().substring(0, 100),
              placeholder: el.placeholder || '',
              ariaLabel: el.getAttribute('aria-label') || '',
              role: el.getAttribute('role') || '',
              type: el.type || '',
              className: el.className || '',
              index: index
            });
          }
        });
        
        return loginElements.slice(0, 10);
      });
      
      console.log('🔑 找到的登入相關元素:', loginRelatedElements);
      
      // 如果找到輸入框，嘗試填寫
      if (inputElements.length > 0) {
        console.log(`📝 找到 ${inputElements.length} 個輸入框，嘗試填寫...`);
        
        for (let i = 0; i < Math.min(inputElements.length, 2); i++) {
          const input = inputElements[i];
          const selector = input.id ? `#${input.id}` : `${input.tagName.toLowerCase()}:nth-of-type(${input.index + 1})`;
          
          try {
            const element = await this.page.$(selector);
            if (element) {
              const testValue = i === 0 ? 'test@agoramarket.com' : 'TestPassword123!';
              await element.scrollIntoViewIfNeeded();
              await element.click();
              await element.fill(testValue);
              
              this.operationCount++;
              await this.takeScreenshot(`flutter_login_input_${i + 1}_${this.operationCount}`);
              console.log(`✅ 已填寫輸入框 ${i + 1}: ${testValue}`);
              
              await this.page.waitForTimeout(1000);
            }
          } catch (error) {
            console.log(`⚠️  填寫輸入框 ${i + 1} 失敗: ${error.message}`);
          }
        }
      }
      
      // 嘗試點擊任何登入相關按鈕
      if (loginRelatedElements.length > 0) {
        console.log('🔘 嘗試點擊登入相關按鈕...');
        
        for (const element of loginRelatedElements.slice(0, 2)) {
          if (element.tagName === 'BUTTON' || element.role === 'button') {
            try {
              const selector = element.className ? `.${element.className.split(' ')[0]}` : 
                              `${element.tagName.toLowerCase()}:nth-of-type(${element.index + 1})`;
              
              const el = await this.page.$(selector);
              if (el) {
                await el.scrollIntoViewIfNeeded();
                await el.click();
                
                this.operationCount++;
                await this.takeScreenshot(`flutter_login_click_${this.operationCount}`);
                console.log(`✅ 已點擊登入按鈕: ${element.textContent}`);
                
                await this.page.waitForTimeout(3000);
                break;
              }
            } catch (error) {
              console.log(`⚠️  點擊登入按鈕失敗: ${error.message}`);
            }
          }
        }
      }
      
      // 最終截圖
      await this.takeScreenshot(`flutter_login_final_${this.operationCount}`);
      
    } catch (error) {
      console.error('❌ Flutter 登入測試失敗:', error.message);
      await this.takeScreenshot(`flutter_login_error_${this.operationCount}`);
    }
  }

  /**
   * 執行登入測試場景
   */
  async performLoginScenario() {
    console.log('🔐 執行登入測試場景...');
    
    try {
      // 先執行 Flutter 專門測試
      await this.performFlutterLoginTest();
      
      // 然後執行原有的通用測試
      const elements = await this.getInteractableElements();
      
      // 尋找登入按鈕或連結
      const loginElements = elements.filter(el => {
        const text = (el.text || '').toLowerCase();
        const ariaLabel = (el.ariaLabel || '').toLowerCase();
        return text.includes('login') || text.includes('登入') || text.includes('登錄') ||
               text.includes('sign in') || text.includes('會員') ||
               ariaLabel.includes('login') || ariaLabel.includes('登入');
      });
      
      if (loginElements.length > 0) {
        const loginElement = loginElements[0];
        console.log(`🔐 點擊登入元素: ${loginElement.text}`);
        
        const element = await this.page.$(loginElement.selector);
        if (element) {
          await element.scrollIntoViewIfNeeded();
          await element.click();
          await this.page.waitForTimeout(3000);
          
          this.operationCount++;
          await this.takeScreenshot(`login_click_${this.operationCount}`);
          
          // 等待登入表單出現
          await this.page.waitForTimeout(2000);
          
          // 尋找用戶名和密碼輸入框
          const newElements = await this.getInteractableElements();
          const usernameInputs = newElements.filter(el => {
            const placeholder = (el.placeholder || '').toLowerCase();
            const ariaLabel = (el.ariaLabel || '').toLowerCase();
            return placeholder.includes('username') || placeholder.includes('email') || 
                   placeholder.includes('用戶') || placeholder.includes('信箱') ||
                   ariaLabel.includes('username') || ariaLabel.includes('email');
          });
          
          const passwordInputs = newElements.filter(el => {
            return el.inputType === 'password' || 
                   (el.placeholder || '').toLowerCase().includes('password') ||
                   (el.placeholder || '').toLowerCase().includes('密碼');
          });
          
          // 填寫用戶名
          if (usernameInputs.length > 0) {
            const usernameElement = await this.page.$(usernameInputs[0].selector);
            if (usernameElement) {
              await usernameElement.fill('test@agoramarket.com');
              this.operationCount++;
              await this.takeScreenshot(`login_username_${this.operationCount}`);
              console.log('📧 已填寫測試用戶名');
            }
          }
          
          // 填寫密碼
          if (passwordInputs.length > 0) {
            const passwordElement = await this.page.$(passwordInputs[0].selector);
            if (passwordElement) {
              await passwordElement.fill('TestPassword123!');
              this.operationCount++;
              await this.takeScreenshot(`login_password_${this.operationCount}`);
              console.log('🔒 已填寫測試密碼');
            }
          }
          
          // 尋找提交按鈕
          const submitElements = newElements.filter(el => {
            const text = (el.text || '').toLowerCase();
            return text.includes('login') || text.includes('登入') || text.includes('submit') ||
                   text.includes('確認') || text.includes('送出') || el.inputType === 'submit';
          });
          
          if (submitElements.length > 0) {
            const submitElement = await this.page.$(submitElements[0].selector);
            if (submitElement) {
              await submitElement.click();
              this.operationCount++;
              await this.takeScreenshot(`login_submit_${this.operationCount}`);
              console.log('✅ 已點擊登入提交按鈕');
              
              // 等待登入結果
              await this.page.waitForTimeout(5000);
              await this.takeScreenshot(`login_result_${this.operationCount}`);
            }
          }
        }
      } else {
        console.log('⚠️  未找到登入元素，跳過登入測試');
      }
      
    } catch (error) {
      console.error('❌ 登入測試場景失敗:', error.message);
      await this.takeScreenshot(`login_scenario_error_${this.operationCount}`);
    }
  }

  /**
   * 執行搜索測試場景
   */
  async performSearchScenario() {
    console.log('🔍 執行搜索測試場景...');
    
    try {
      const elements = await this.getInteractableElements();
      
      // 尋找搜索輸入框
      const searchInputs = elements.filter(el => {
        const placeholder = (el.placeholder || '').toLowerCase();
        const ariaLabel = (el.ariaLabel || '').toLowerCase();
        return placeholder.includes('search') || placeholder.includes('搜尋') || 
               placeholder.includes('搜索') || placeholder.includes('查找') ||
               ariaLabel.includes('search') || ariaLabel.includes('搜尋');
      });
      
      if (searchInputs.length > 0) {
        const searchInput = searchInputs[0];
        const searchTerms = ['USDT', '商品', '服務', '配送', 'Bitcoin', '以太幣', '交易'];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        
        console.log(`🔍 在搜索框中輸入: ${randomTerm}`);
        
        const element = await this.page.$(searchInput.selector);
        if (element) {
          await element.scrollIntoViewIfNeeded();
          await element.fill(randomTerm);
          
          this.operationCount++;
          await this.takeScreenshot(`search_input_${this.operationCount}`);
          
          // 按 Enter 或尋找搜索按鈕
          await this.page.keyboard.press('Enter');
          await this.page.waitForTimeout(3000);
          
          this.operationCount++;
          await this.takeScreenshot(`search_results_${this.operationCount}`);
          console.log('✅ 搜索操作完成');
        }
      } else {
        console.log('⚠️  未找到搜索輸入框，跳過搜索測試');
      }
      
    } catch (error) {
      console.error('❌ 搜索測試場景失敗:', error.message);
      await this.takeScreenshot(`search_scenario_error_${this.operationCount}`);
    }
  }

  /**
   * 執行商品瀏覽測試場景
   */
  async performProductBrowsingScenario() {
    console.log('🛍️ 執行商品瀏覽測試場景...');
    
    try {
      const elements = await this.getInteractableElements();
      
      // 尋找商品相關連結
      const productLinks = elements.filter(el => {
        const text = (el.text || '').toLowerCase();
        const href = (el.href || '').toLowerCase();
        return text.includes('商品') || text.includes('產品') || text.includes('服務') ||
               text.includes('product') || text.includes('item') || text.includes('service') ||
               href.includes('product') || href.includes('item') || href.includes('shop');
      });
      
      if (productLinks.length > 0) {
        // 隨機點擊商品連結
        const randomLink = productLinks[Math.floor(Math.random() * productLinks.length)];
        console.log(`🛍️ 點擊商品連結: ${randomLink.text}`);
        
        const element = await this.page.$(randomLink.selector);
        if (element) {
          await element.scrollIntoViewIfNeeded();
          await element.click();
          await this.page.waitForTimeout(5000);
          
          this.operationCount++;
          await this.takeScreenshot(`product_page_${this.operationCount}`);
          
          // 在商品頁面執行一些操作
          const newElements = await this.getInteractableElements();
          
          // 尋找加入購物車或購買按鈕
          const actionButtons = newElements.filter(el => {
            const text = (el.text || '').toLowerCase();
            return text.includes('加入') || text.includes('購買') || text.includes('buy') ||
                   text.includes('add') || text.includes('cart') || text.includes('購物車');
          });
          
          if (actionButtons.length > 0) {
            const actionButton = actionButtons[Math.floor(Math.random() * actionButtons.length)];
            console.log(`🛒 點擊操作按鈕: ${actionButton.text}`);
            
            const actionElement = await this.page.$(actionButton.selector);
            if (actionElement) {
              await actionElement.scrollIntoViewIfNeeded();
              await actionElement.click();
              await this.page.waitForTimeout(3000);
              
              this.operationCount++;
              await this.takeScreenshot(`product_action_${this.operationCount}`);
            }
          }
        }
      } else {
        console.log('⚠️  未找到商品連結，跳過商品瀏覽測試');
      }
      
    } catch (error) {
      console.error('❌ 商品瀏覽測試場景失敗:', error.message);
      await this.takeScreenshot(`product_scenario_error_${this.operationCount}`);
    }
  }

  /**
   * 執行完整測試流程 (含性能監控和報告生成)
   */
  async run() {
    const startTime = Date.now();
    
    try {
      console.log('🎯 開始 Flutter Web 自動化測試');
      console.log('='.repeat(50));
      
      // 初始化瀏覽器
      await this.measureOperationTime('瀏覽器初始化', () => this.initialize());
      
      // 設定錯誤監聽
      await this.checkForErrors();
      
      // 導航到目標網站
      await this.measureOperationTime('頁面導航', () => this.navigateToUrl());
      
      // 執行專門測試場景
      console.log('🎭 執行專門測試場景...');
      
      await this.measureOperationTime('搜索場景測試', async () => {
        await this.performSearchScenario();
        await this.page.waitForTimeout(2000);
      });
      
      await this.measureOperationTime('商品瀏覽場景測試', async () => {
        await this.performProductBrowsingScenario();
        await this.page.waitForTimeout(2000);
      });
      
      await this.measureOperationTime('登入場景測試', async () => {
        await this.performLoginScenario();
        await this.page.waitForTimeout(2000);
      });
      
      // 執行隨機探索
      console.log('🎲 開始隨機探索...');
      await this.measureOperationTime('隨機探索', () => this.performRandomExploration());
      
      // 定期收集記憶體使用情況
      await this.collectMemoryUsage();
      
      // 最終截圖
      await this.takeScreenshot('final_state');
      
      const endTime = Date.now();
      this.performanceData.totalTestTime = endTime - startTime;
      
      // 生成測試報告
      const reportData = await this.generateTestReport();
      
      console.log('='.repeat(50));
      console.log('🎉 測試完成！');
      console.log(`⏱️  總耗時: ${(this.performanceData.totalTestTime / 1000).toFixed(2)} 秒`);
      console.log(`📊 總操作數: ${this.operationCount}`);
      console.log(`🎯 成功率: ${reportData?.statistics?.successRate || 'N/A'}`);
      console.log(`📸 截圖保存在: ${path.resolve(this.screenshotDir)}`);
      console.log(`📋 測試報告: ${path.resolve(this.screenshotDir, 'test-report.html')}`);
      
      // 顯示性能摘要
      if (this.performanceData.navigationTiming) {
        console.log('⚡ 性能摘要:');
        console.log(`   - 頁面載入時間: ${this.performanceData.pageLoadTime}ms`);
        console.log(`   - DOM 互動時間: ${this.performanceData.navigationTiming.domInteractive}ms`);
        console.log(`   - 首次內容繪製: ${this.performanceData.navigationTiming.firstContentfulPaint}ms`);
      }
      
      if (this.performanceData.memoryUsage.length > 0) {
        const avgMemory = this.performanceData.memoryUsage.reduce((a, b) => a + b.usedJSHeapSize, 0) / this.performanceData.memoryUsage.length;
        console.log(`💾 平均記憶體使用: ${(avgMemory / 1024 / 1024).toFixed(2)} MB`);
      }
      
      if (this.performanceData.consoleErrors.length > 0) {
        console.log(`⚠️  發現 ${this.performanceData.consoleErrors.length} 個錯誤`);
      }
      
    } catch (error) {
      console.error('❌ 測試執行失敗:', error.message);
      await this.takeScreenshot('test_failure');
      
      // 即使測試失敗也嘗試生成報告
      this.performanceData.totalTestTime = Date.now() - startTime;
      await this.generateTestReport();
      
      throw error;
      
    } finally {
      // 清理資源
      await this.cleanup();
    }
  }
}

// 主執行函數
async function main() {
  const automation = new FlutterWebAutomation();
  
  try {
    await automation.run();
  } catch (error) {
    console.error('❌ 主程序執行失敗:', error);
    process.exit(1);
  }
}

// 處理未捕獲的異常
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未處理的 Promise 拒絕:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ 未捕獲的異常:', error);
  process.exit(1);
});

// 如果直接執行此腳本，則運行主函數
if (require.main === module) {
  main();
}

module.exports = FlutterWebAutomation;
