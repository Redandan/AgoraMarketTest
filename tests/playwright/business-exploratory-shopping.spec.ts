import { test, expect } from '@playwright/test';

test.describe('AgoraMarket 購物行為業務探索測試', () => {
  test.beforeEach(async ({ page }) => {
    // 使用現有的 Flutter Web 優化配置
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(60000);

    // 啟用業務理解記錄
    page.on('pageerror', (error) => {
      console.log(`🚨 業務邏輯錯誤: ${error.message}`);
    });
  });

  test('探索用戶產品瀏覽行為模式', async ({ page }) => {
    console.log('🛍️ 開始探索用戶產品瀏覽行為模式...');

    // 業務理解記錄 - 定義明確的類型
    const businessInsights = {
      userJourney: [] as Array<{
        step: string;
        observation: string;
        businessLogic: string;
        timestamp: string;
      }>,
      behaviorPatterns: [] as Array<{
        action: string;
        result: string;
        businessLogic: string;
        userIntent: string;
        contentChange: boolean;
      }>,
      businessLogicFindings: [] as Array<{
        element: string;
        observation: string;
        businessLogic: string;
        userBehavior: string;
      }>,
      improvementOpportunities: [] as Array<{
        opportunity: string;
        observation: string;
        suggestion: string;
      }>
    };

    // 1. 訪問產品頁面
    console.log('1️⃣ 訪問產品頁面...');
    await page.goto('https://redandan.github.io/#/products');
    await page.waitForTimeout(3000);

    // 記錄業務理解：用戶如何到達產品頁面
    businessInsights.userJourney.push({
      step: '產品頁面訪問',
      observation: '用戶通過直接URL訪問產品頁面',
      businessLogic: 'URL路由設計支持直接訪問產品列表',
      timestamp: new Date().toISOString()
    });

    // 2. 探索產品頁面元素
    console.log('2️⃣ 探索產品頁面元素...');
    const pageContent = await page.textContent('body');
    const pageTitle = await page.title();

    console.log(`📄 頁面標題: ${pageTitle}`);
    console.log(`📏 頁面內容長度: ${pageContent?.length} 字符`);

    // 記錄業務理解：頁面內容分析
    businessInsights.businessLogicFindings.push({
      element: '頁面內容',
      observation: `頁面包含 ${pageContent?.length} 字符的內容`,
      businessLogic: '產品頁面提供豐富的產品信息展示',
      userBehavior: '用戶可以瀏覽詳細的產品信息'
    });

    // 3. 查找可交互元素
    console.log('3️⃣ 查找可交互元素...');
    const interactiveElements = await page.locator('[role="button"], button, [onclick], flt-semantics-placeholder').all();
    console.log(`🔍 發現 ${interactiveElements.length} 個可交互元素`);

    // 4. 分析前5個可交互元素
    for (let i = 0; i < Math.min(interactiveElements.length, 5); i++) {
      try {
        const element = interactiveElements[i];
        const text = await element.textContent();
        const ariaLabel = await element.getAttribute('aria-label');
        const elementType = await element.getAttribute('role') || 'button';

        const elementInfo = text || ariaLabel || `元素 ${i + 1}`;
        console.log(`🎯 分析元素 ${i + 1}: "${elementInfo}" (類型: ${elementType})`);

        // 記錄業務理解
        businessInsights.businessLogicFindings.push({
          element: elementInfo,
          observation: `發現可交互元素：${elementInfo} (類型: ${elementType})`,
          businessLogic: '產品頁面提供多個交互入口點',
          userBehavior: '用戶有多種方式與產品進行交互'
        });

        // 嘗試交互並觀察結果
        console.log(`🔄 嘗試與 "${elementInfo}" 進行交互...`);
        await element.click({ force: true });
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        const newPageContent = await page.textContent('body');

        // 記錄交互結果
        const interactionResult = {
          action: `點擊 "${elementInfo}"`,
          result: currentUrl.includes('cart') ? '進入購物車' :
                  currentUrl.includes('product') ? '查看產品詳情' :
                  currentUrl.includes('login') ? '進入登入頁面' :
                  currentUrl.includes('checkout') ? '進入結帳頁面' :
                  '其他頁面',
          businessLogic: '點擊行為觸發頁面導航或狀態變化',
          userIntent: '用戶想要查看更多信息或執行操作',
          contentChange: newPageContent !== pageContent
        };

        businessInsights.behaviorPatterns.push(interactionResult);
        console.log(`📊 交互結果: ${interactionResult.result}`);

        // 如果發生了頁面變化，記錄為業務機會
        if (interactionResult.contentChange) {
          businessInsights.improvementOpportunities.push({
            opportunity: `元素 "${elementInfo}" 的交互效果良好`,
            observation: '用戶交互導致頁面內容變化',
            suggestion: '保持這種響應式的交互設計'
          });
        }

        // 返回產品頁面繼續探索
        if (!currentUrl.includes('products')) {
          await page.goto('https://redandan.github.io/#/products');
          await page.waitForTimeout(2000);
        }

      } catch (error) {
        console.log(`⚠️ 元素 ${i + 1} 交互失敗: ${error.message}`);

        businessInsights.improvementOpportunities.push({
          opportunity: `元素 "${await interactiveElements[i].textContent()}" 交互改進`,
          observation: `交互失敗: ${error.message}`,
          suggestion: '檢查元素的無障礙性和交互邏輯'
        });
      }
    }

    // 5. 分析業務模式
    console.log('4️⃣ 分析業務模式...');

    // 檢查是否有搜索功能
    const hasSearch = pageContent?.toLowerCase().includes('search') ||
                     pageContent?.toLowerCase().includes('搜索') ||
                     pageContent?.toLowerCase().includes('find');

    if (hasSearch) {
      businessInsights.businessLogicFindings.push({
        element: '搜索功能',
        observation: '產品頁面包含搜索功能',
        businessLogic: '用戶可以通過搜索快速找到目標產品',
        userBehavior: '用戶傾向於使用搜索功能定位產品'
      });
    }

    // 檢查是否有分類功能
    const hasCategories = pageContent?.toLowerCase().includes('category') ||
                         pageContent?.toLowerCase().includes('分類') ||
                         pageContent?.toLowerCase().includes('filter');

    if (hasCategories) {
      businessInsights.businessLogicFindings.push({
        element: '分類功能',
        observation: '產品頁面包含分類功能',
        businessLogic: '用戶可以通過分類瀏覽相關產品',
        userBehavior: '用戶傾向於通過分類瀏覽產品'
      });
    }

    // 6. 生成業務理解檔案
    console.log('5️⃣ 生成業務理解檔案...');
    const understandingDoc = generateBusinessUnderstandingDoc(businessInsights);

    // 7. 輸出結果摘要
    console.log('\n📊 業務探索測試結果摘要:');
    console.log('='.repeat(60));
    console.log(`🎯 用戶旅程步驟: ${businessInsights.userJourney.length}`);
    console.log(`🔍 業務邏輯發現: ${businessInsights.businessLogicFindings.length}`);
    console.log(`🎪 用戶行為模式: ${businessInsights.behaviorPatterns.length}`);
    console.log(`💡 改進機會: ${businessInsights.improvementOpportunities.length}`);

    // 顯示關鍵發現
    if (businessInsights.businessLogicFindings.length > 0) {
      console.log('\n🔍 關鍵業務邏輯發現:');
      businessInsights.businessLogicFindings.forEach((finding, index) => {
        console.log(`${index + 1}. ${finding.element}: ${finding.businessLogic}`);
      });
    }

    if (businessInsights.behaviorPatterns.length > 0) {
      console.log('\n🎪 用戶行為模式:');
      businessInsights.behaviorPatterns.forEach((pattern, index) => {
        console.log(`${index + 1}. ${pattern.action} → ${pattern.result}`);
      });
    }

    // 8. 保存業務理解檔案（在實際實現中）
    console.log('\n📝 業務理解檔案預覽:');
    console.log('-'.repeat(40));
    console.log(understandingDoc.substring(0, 500) + '...');
    console.log('-'.repeat(40));
    console.log(`💾 在完整實現中，此檔案將保存為: integration_test/business_exploratory_testing/business_logic_findings/product_browsing_behavior_${new Date().toISOString().split('T')[0]}.md`);

    console.log('\n✅ 產品瀏覽行為探索測試完成！');
  });
});

// 業務理解檔案生成器
function generateBusinessUnderstandingDoc(insights: any): string {
  return `# 產品瀏覽行為業務理解報告

## 生成時間
${new Date().toISOString()}

## 測試目標
探索 AgoraMarket Flutter Web 應用的產品瀏覽行為模式，理解用戶如何與產品頁面進行交互。

## 用戶旅程分析
${insights.userJourney.map((step: any) =>
  `### ${step.step}\n- **觀察**: ${step.observation}\n- **業務邏輯**: ${step.businessLogic}\n- **時間戳**: ${step.timestamp}\n`
).join('\n')}

## 業務邏輯發現
${insights.businessLogicFindings.map((finding: any, index: number) =>
  `### 發現 ${index + 1}: ${finding.element}\n- **觀察**: ${finding.observation}\n- **業務邏輯**: ${finding.businessLogic}\n- **用戶行為**: ${finding.userBehavior}\n`
).join('\n')}

## 用戶行為模式
${insights.behaviorPatterns.map((pattern: any, index: number) =>
  `### 模式 ${index + 1}: ${pattern.action}\n- **結果**: ${pattern.result}\n- **業務邏輯**: ${pattern.businessLogic}\n- **用戶意圖**: ${pattern.userIntent}\n- **內容變化**: ${pattern.contentChange ? '是' : '否'}\n`
).join('\n')}

## 業務改進機會
${insights.improvementOpportunities.map((opportunity: any, index: number) =>
  `### 機會 ${index + 1}: ${opportunity.opportunity}\n- **觀察**: ${opportunity.observation}\n- **建議**: ${opportunity.suggestion}\n`
).join('\n')}

## 總結與建議

### 核心發現
- 產品頁面提供了 ${insights.businessLogicFindings.length} 種業務功能
- 用戶展示了 ${insights.behaviorPatterns.length} 種不同的交互模式
- 發現了 ${insights.improvementOpportunities.length} 個改進機會

### 業務建議
1. **用戶體驗優化**: 基於發現的用戶行為模式優化交互流程
2. **功能完善**: 確保所有交互元素都能正常工作
3. **業務邏輯完善**: 根據發現的模式優化業務規則
4. **性能監控**: 關注頁面載入和交互響應時間

### 下一步行動
- 深入探索具體的產品詳情頁面
- 測試購物車和結帳流程
- 分析不同設備的響應式表現
- 驗證搜索和分類功能的有效性

---
*此報告由 Flutter Web 業務探索測試自動生成*
*測試框架: Playwright + Flutter Web*
*測試目標: 業務理解而非功能驗證*
`;
}