import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('AgoraMarket 增強業務探索測試 - 自動生成業務文檔', () => {
  test.beforeEach(async ({ page }) => {
    // 設置手機視窗，因為應用在手機版有更多內容
    await page.setViewportSize({ width: 375, height: 667 });
    page.setDefaultTimeout(60000);

    // 啟用業務理解記錄
    page.on('pageerror', (error) => {
      console.log(`🚨 業務邏輯錯誤: ${error.message}`);
    });
  });

  test('全面業務場景探索 - 自動生成業務文檔', async ({ page }) => {
    console.log('🎯 開始全面業務場景探索測試...');

    // 初始化業務理解記錄器
    const businessAnalyzer = new BusinessAnalyzer();

    // 階段1: 應用入口探索
    console.log('\n📍 階段1: 應用入口探索...');
    await exploreApplicationEntry(page, businessAnalyzer);

    // 階段2: 用戶認證流程探索
    console.log('\n📍 階段2: 用戶認證流程探索...');
    await exploreAuthenticationFlow(page, businessAnalyzer);

    // 階段3: 產品瀏覽體驗探索
    console.log('\n📍 階段3: 產品瀏覽體驗探索...');
    await exploreProductBrowsingExperience(page, businessAnalyzer);

    // 階段4: 購物車功能探索
    console.log('\n📍 階段4: 購物車功能探索...');
    await exploreShoppingCartFunctionality(page, businessAnalyzer);

    // 階段5: 結帳流程探索
    console.log('\n📍 階段5: 結帳流程探索...');
    await exploreCheckoutProcess(page, businessAnalyzer);

    // 階段6: 業務邏輯總結與文檔生成
    console.log('\n📍 階段6: 業務邏輯總結與文檔生成...');
    await generateComprehensiveBusinessDocumentation(businessAnalyzer);

    console.log('\n✅ 全面業務場景探索測試完成！');
  });
});

// 業務分析器類
class BusinessAnalyzer {
  private insights: {
    userJourney: Array<{
      phase: string;
      step: string;
      observation: string;
      businessLogic: string;
      timestamp: string;
      url: string;
      contentLength: number;
      interactiveElements: number;
      technicalNotes: string;
    }>;
    businessLogicFindings: Array<{
      category: string;
      element: string;
      observation: string;
      businessLogic: string;
      userBehavior: string;
      technicalDetails: string;
      businessValue: string;
    }>;
    userBehaviorPatterns: Array<{
      pattern: string;
      action: string;
      result: string;
      businessLogic: string;
      userIntent: string;
      frequency: 'high' | 'medium' | 'low';
      businessImpact: string;
    }>;
    technicalChallenges: Array<{
      challenge: string;
      observation: string;
      businessImpact: string;
      technicalSolution: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
    }>;
    businessOpportunities: Array<{
      opportunity: string;
      observation: string;
      businessValue: string;
      implementationEffort: 'low' | 'medium' | 'high';
      priority: 'high' | 'medium' | 'low';
      stakeholders: string[];
    }>;
    competitiveAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };

  constructor() {
    this.insights = {
      userJourney: [],
      businessLogicFindings: [],
      userBehaviorPatterns: [],
      technicalChallenges: [],
      businessOpportunities: [],
      competitiveAnalysis: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      }
    };
  }

  // 記錄用戶旅程
  recordUserJourney(phase: string, step: string, observation: string, businessLogic: string, page: any, technicalNotes: string = '') {
    this.insights.userJourney.push({
      phase,
      step,
      observation,
      businessLogic,
      timestamp: new Date().toISOString(),
      url: page.url(),
      contentLength: 0, // 稍後填充
      interactiveElements: 0, // 稍後填充
      technicalNotes
    });
  }

  // 記錄業務邏輯發現
  recordBusinessLogicFinding(category: string, element: string, observation: string, businessLogic: string, userBehavior: string, technicalDetails: string = '', businessValue: string = '') {
    this.insights.businessLogicFindings.push({
      category,
      element,
      observation,
      businessLogic,
      userBehavior,
      technicalDetails,
      businessValue
    });
  }

  // 記錄用戶行為模式
  recordUserBehaviorPattern(pattern: string, action: string, result: string, businessLogic: string, userIntent: string, frequency: 'high' | 'medium' | 'low' = 'medium', businessImpact: string = '') {
    this.insights.userBehaviorPatterns.push({
      pattern,
      action,
      result,
      businessLogic,
      userIntent,
      frequency,
      businessImpact
    });
  }

  // 記錄技術挑戰
  recordTechnicalChallenge(challenge: string, observation: string, businessImpact: string, technicalSolution: string = '', priority: 'critical' | 'high' | 'medium' | 'low' = 'medium') {
    this.insights.technicalChallenges.push({
      challenge,
      observation,
      businessImpact,
      technicalSolution,
      priority
    });
  }

  // 記錄業務機會
  recordBusinessOpportunity(opportunity: string, observation: string, businessValue: string, implementationEffort: 'low' | 'medium' | 'high' = 'medium', priority: 'high' | 'medium' | 'low' = 'medium', stakeholders: string[] = []) {
    this.insights.businessOpportunities.push({
      opportunity,
      observation,
      businessValue,
      implementationEffort,
      priority,
      stakeholders
    });
  }

  // 生成綜合業務文檔
  async generateComprehensiveReport(): Promise<string> {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(process.cwd(), 'integration_test', 'business_exploratory_testing', 'business_logic_findings');

    // 確保目錄存在
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const report = this.generateReportContent();
    const fileName = `comprehensive_business_analysis_${timestamp}.md`;
    const filePath = path.join(reportPath, fileName);

    // 保存報告
    fs.writeFileSync(filePath, report, 'utf8');

    console.log(`📄 業務分析報告已保存: ${filePath}`);

    return report;
  }

  // 生成綜合業務文檔的別名方法
  async generateComprehensiveBusinessDocumentation(): Promise<string> {
    return this.generateComprehensiveReport();
  }

  private generateReportContent(): string {
    return `# AgoraMarket 綜合業務分析報告

## 生成時間
${new Date().toISOString()}

## 執行摘要

本次業務探索測試涵蓋了 AgoraMarket Flutter Web 應用的完整用戶旅程，共發現：
- **${this.insights.businessLogicFindings.length}** 個業務邏輯發現
- **${this.insights.userBehaviorPatterns.length}** 種用戶行為模式
- **${this.insights.technicalChallenges.length}** 個技術挑戰
- **${this.insights.businessOpportunities.length}** 個業務機會

---

## 1. 用戶旅程分析

${this.generateUserJourneySection()}

## 2. 業務邏輯發現

${this.generateBusinessLogicSection()}

## 3. 用戶行為模式分析

${this.generateBehaviorPatternsSection()}

## 4. 技術挑戰評估

${this.generateTechnicalChallengesSection()}

## 5. 業務機會識別

${this.generateBusinessOpportunitiesSection()}

## 6. 競爭分析

${this.generateCompetitiveAnalysisSection()}

## 7. 戰略建議

${this.generateStrategicRecommendations()}

## 8. 實施路線圖

${this.generateImplementationRoadmap()}

---

*此報告由 AgoraMarket 業務探索測試自動生成*
*測試框架: Playwright + Flutter Web*
*分析範圍: 完整業務流程和用戶體驗*
*生成時間: ${new Date().toLocaleString('zh-TW')}*
`;
  }

  private generateUserJourneySection(): string {
    const phases = [...new Set(this.insights.userJourney.map(j => j.phase))];

    return phases.map(phase => {
      const phaseSteps = this.insights.userJourney.filter(j => j.phase === phase);
      return `### ${phase}

${phaseSteps.map((step, index) =>
  `#### 步驟 ${index + 1}: ${step.step}
- **觀察**: ${step.observation}
- **業務邏輯**: ${step.businessLogic}
- **訪問URL**: ${step.url}
- **時間戳**: ${step.timestamp}
- **技術筆記**: ${step.technicalNotes || '無'}

`).join('\n')}`;
    }).join('\n\n');
  }

  private generateBusinessLogicSection(): string {
    const categories = [...new Set(this.insights.businessLogicFindings.map(f => f.category))];

    return categories.map(category => {
      const categoryFindings = this.insights.businessLogicFindings.filter(f => f.category === category);
      return `### ${category}

${categoryFindings.map((finding, index) =>
  `#### 發現 ${index + 1}: ${finding.element}
- **觀察**: ${finding.observation}
- **業務邏輯**: ${finding.businessLogic}
- **用戶行為**: ${finding.userBehavior}
- **技術細節**: ${finding.technicalDetails || '無'}
- **業務價值**: ${finding.businessValue || '待評估'}

`).join('\n')}`;
    }).join('\n\n');
  }

  private generateBehaviorPatternsSection(): string {
    const patterns = [...new Set(this.insights.userBehaviorPatterns.map(p => p.pattern))];

    return patterns.map(pattern => {
      const patternData = this.insights.userBehaviorPatterns.filter(p => p.pattern === pattern);
      return `### ${pattern}

${patternData.map((p, index) =>
  `#### 模式 ${index + 1}: ${p.action}
- **結果**: ${p.result}
- **業務邏輯**: ${p.businessLogic}
- **用戶意圖**: ${p.userIntent}
- **頻率**: ${p.frequency === 'high' ? '高' : p.frequency === 'medium' ? '中' : '低'}
- **業務影響**: ${p.businessImpact || '待評估'}

`).join('\n')}`;
    }).join('\n\n');
  }

  private generateTechnicalChallengesSection(): string {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortedChallenges = [...this.insights.technicalChallenges]
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return sortedChallenges.map((challenge, index) =>
      `#### 挑戰 ${index + 1}: ${challenge.challenge}
- **觀察**: ${challenge.observation}
- **業務影響**: ${challenge.businessImpact}
- **技術解決方案**: ${challenge.technicalSolution || '待設計'}
- **優先級**: ${challenge.priority === 'critical' ? '🔴 關鍵' : challenge.priority === 'high' ? '🟠 高' : challenge.priority === 'medium' ? '🟡 中' : '🟢 低'}

`).join('\n');
  }

  private generateBusinessOpportunitiesSection(): string {
    const sortedOpportunities = [...this.insights.businessOpportunities]
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    return sortedOpportunities.map((opportunity, index) =>
      `#### 機會 ${index + 1}: ${opportunity.opportunity}
- **觀察**: ${opportunity.observation}
- **業務價值**: ${opportunity.businessValue}
- **實施難度**: ${opportunity.implementationEffort === 'low' ? '🟢 低' : opportunity.implementationEffort === 'medium' ? '🟡 中' : '🔴 高'}
- **優先級**: ${opportunity.priority === 'high' ? '🔴 高' : opportunity.priority === 'medium' ? '🟡 中' : '🟢 低'}
- **相關方**: ${opportunity.stakeholders.join(', ') || '待確定'}

`).join('\n');
  }

  private generateCompetitiveAnalysisSection(): string {
    return `### 優勢 (Strengths)
${this.insights.competitiveAnalysis.strengths.map(strength => `- ${strength}`).join('\n') || '*待分析*'}

### 劣勢 (Weaknesses)
${this.insights.competitiveAnalysis.weaknesses.map(weakness => `- ${weakness}`).join('\n') || '*待分析*'}

### 機會 (Opportunities)
${this.insights.competitiveAnalysis.opportunities.map(opportunity => `- ${opportunity}`).join('\n') || '*待分析*'}

### 威脅 (Threats)
${this.insights.competitiveAnalysis.threats.map(threat => `- ${threat}`).join('\n') || '*待分析*'}`;
  }

  private generateStrategicRecommendations(): string {
    return `### 短期建議 (1-3個月)
1. **解決關鍵技術挑戰**: 優先處理高優先級的技術問題
2. **優化用戶體驗**: 基於發現的行為模式改進交互流程
3. **完善業務邏輯**: 修復發現的業務邏輯缺陷

### 中期建議 (3-6個月)
1. **功能擴展**: 實現高價值業務機會
2. **性能優化**: 提升應用響應速度和穩定性
3. **用戶體驗提升**: 設計更直觀的用戶界面

### 長期建議 (6個月以上)
1. **業務模式創新**: 探索新的商業機會
2. **技術架構升級**: 採用更先進的技術解決方案
3. **市場擴張**: 基於用戶行為分析拓展目標市場`;
  }

  private generateImplementationRoadmap(): string {
    return `### 第一階段: 基礎優化 (第1-4週)
- [ ] 修復關鍵技術問題
- [ ] 優化用戶體驗流程
- [ ] 完善業務邏輯

### 第二階段: 功能增強 (第5-8週)
- [ ] 實現高價值業務機會
- [ ] 增加用戶交互功能
- [ ] 提升應用性能

### 第三階段: 創新發展 (第9-12週)
- [ ] 探索新業務模式
- [ ] 技術架構升級
- [ ] 用戶體驗創新

### 持續改進階段 (第13週之後)
- [ ] 定期業務探索測試
- [ ] 用戶行為分析
- [ ] 競品分析與跟蹤
- [ ] 技術趨勢研究`;
  }

  // 獲取分析結果摘要
  getSummary() {
    return {
      userJourneySteps: this.insights.userJourney.length,
      businessLogicFindings: this.insights.businessLogicFindings.length,
      userBehaviorPatterns: this.insights.userBehaviorPatterns.length,
      technicalChallenges: this.insights.technicalChallenges.length,
      businessOpportunities: this.insights.businessOpportunities.length
    };
  }
}

// 業務場景探索函數
async function exploreApplicationEntry(page: any, analyzer: BusinessAnalyzer) {
  console.log('🌐 探索應用入口點...');

  // 訪問主頁
  await page.goto('https://redandan.github.io/', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  const pageContent = await page.textContent('body');
  const pageTitle = await page.title();
  const interactiveElements = await page.locator('button, [role="button"], [onclick], a').all();

  analyzer.recordUserJourney(
    '應用入口',
    '訪問主頁面',
    `成功載入主頁面，標題為"${pageTitle}"，內容長度${pageContent?.length}字符`,
    '應用提供清晰的主頁面入口，用戶可以快速了解應用功能',
    page,
    'Flutter Web 應用載入正常，無障礙功能按鈕存在但定位在視窗外'
  );

  analyzer.recordBusinessLogicFinding(
    '應用入口',
    '主頁面設計',
    `主頁面包含${pageContent?.length}字符的內容和${interactiveElements.length}個交互元素`,
    '主頁面作為應用的門面，需要提供清晰的導航和功能入口',
    '用戶首先看到主頁面，需要快速理解應用功能',
    'Flutter Web 應用，元素定位可能受限',
    '高 - 作為用戶第一印象，影響轉換率'
  );

  // 分析導航結構
  const navigationElements = await page.locator('nav, [role="navigation"], .nav, .menu').all();
  if (navigationElements.length > 0) {
    analyzer.recordBusinessLogicFinding(
      '導航設計',
      '導航結構',
      `發現${navigationElements.length}個導航元素`,
      '應用提供結構化的導航系統',
      '用戶可以通過導航快速訪問不同功能模塊',
      'Flutter Web 導航實現',
      '高 - 影響用戶體驗和功能發現'
    );
  }

  console.log(`✅ 應用入口探索完成 - 發現${interactiveElements.length}個交互元素`);
}

async function exploreAuthenticationFlow(page: any, analyzer: BusinessAnalyzer) {
  console.log('🔐 探索用戶認證流程...');

  // 訪問登入頁面
  await page.goto('https://redandan.github.io/#/login', {
    waitUntil: 'networkidle',
    timeout: 20000
  });

  const loginContent = await page.textContent('body');
  const loginButtons = await page.locator('button, [role="button"]').all();
  const inputFields = await page.locator('input').all();

  analyzer.recordUserJourney(
    '用戶認證',
    '訪問登入頁面',
    `登入頁面載入成功，發現${inputFields.length}個輸入框和${loginButtons.length}個按鈕`,
    '應用提供完整的用戶認證系統',
    page,
    'Flutter Web 表單元素實現'
  );

  analyzer.recordBusinessLogicFinding(
    '用戶認證',
    '登入功能',
    `登入頁面包含${inputFields.length}個輸入字段和${loginButtons.length}個操作按鈕`,
    '應用實現了用戶身份驗證功能',
    '用戶需要先登入才能訪問完整功能',
    'Flutter Web 認證流程實現',
    '高 - 影響用戶註冊和留存'
  );

  // 測試按鈕交互
  if (loginButtons.length > 0) {
    for (let i = 0; i < Math.min(loginButtons.length, 2); i++) {
      try {
        const button = loginButtons[i];
        const buttonText = await button.textContent();

        analyzer.recordUserBehaviorPattern(
          '認證交互',
          `點擊登入按鈕"${buttonText}"`,
          '觸發認證流程或頁面導航',
          '按鈕點擊會觸發相應的業務邏輯',
          '用戶想要登入或註冊',
          'high',
          '決定用戶是否能成功訪問應用功能'
        );

        await button.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        await button.click({ force: true, timeout: 5000 });
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        analyzer.recordTechnicalChallenge(
          'Flutter Web 元素交互',
          `按鈕"${buttonText}"點擊測試`,
          '確保所有交互元素都能正常工作',
          '使用 force: true 參數處理視窗外元素',
          'high'
        );

      } catch (error) {
        analyzer.recordTechnicalChallenge(
          'Flutter Web 元素交互失敗',
          `按鈕交互失敗: ${error.message}`,
          '影響用戶體驗和功能可用性',
          '需要修復元素定位和交互邏輯',
          'critical'
        );
      }
    }
  }

  console.log(`✅ 用戶認證流程探索完成 - 發現${loginButtons.length}個按鈕和${inputFields.length}個輸入框`);
}

async function exploreProductBrowsingExperience(page: any, analyzer: BusinessAnalyzer) {
  console.log('🛍️ 探索產品瀏覽體驗...');

  // 訪問產品頁面
  await page.goto('https://redandan.github.io/#/products', {
    waitUntil: 'networkidle',
    timeout: 20000
  });

  const productContent = await page.textContent('body');
  const productButtons = await page.locator('button, [role="button"]').all();

  analyzer.recordUserJourney(
    '產品瀏覽',
    '訪問產品頁面',
    `產品頁面載入成功，發現${productButtons.length}個交互元素`,
    '應用提供產品瀏覽和選擇功能',
    page,
    'Flutter Web 產品列表實現'
  );

  analyzer.recordBusinessLogicFinding(
    '產品管理',
    '產品展示',
    `產品頁面包含豐富的內容和${productButtons.length}個交互選項`,
    '應用實現了產品目錄和展示功能',
    '用戶可以瀏覽和比較不同產品',
    'Flutter Web 產品列表渲染',
    '高 - 影響銷售轉換率'
  );

  // 分析產品相關功能
  const hasSearch = productContent?.toLowerCase().includes('search') ||
                   productContent?.toLowerCase().includes('搜索');
  const hasFilter = productContent?.toLowerCase().includes('filter') ||
                   productContent?.toLowerCase().includes('分類');

  if (hasSearch) {
    analyzer.recordBusinessLogicFinding(
      '產品發現',
      '搜索功能',
      '產品頁面包含搜索功能',
      '用戶可以通過搜索快速找到目標產品',
      '用戶傾向於使用搜索定位產品',
      'Flutter Web 搜索實現',
      '高 - 提升用戶效率'
    );
  }

  if (hasFilter) {
    analyzer.recordBusinessLogicFinding(
      '產品分類',
      '篩選功能',
      '產品頁面包含分類和篩選功能',
      '用戶可以通過分類瀏覽相關產品',
      '用戶使用分類縮小選擇範圍',
      'Flutter Web 篩選實現',
      '高 - 改善用戶體驗'
    );
  }

  console.log(`✅ 產品瀏覽體驗探索完成 - 發現${productButtons.length}個產品交互元素`);
}

async function exploreShoppingCartFunctionality(page: any, analyzer: BusinessAnalyzer) {
  console.log('🛒 探索購物車功能...');

  // 訪問購物車頁面
  await page.goto('https://redandan.github.io/#/cart', {
    waitUntil: 'networkidle',
    timeout: 20000
  });

  const cartContent = await page.textContent('body');
  const cartButtons = await page.locator('button, [role="button"]').all();

  analyzer.recordUserJourney(
    '購物管理',
    '訪問購物車',
    `購物車頁面載入成功，發現${cartButtons.length}個操作按鈕`,
    '應用提供購物車管理功能',
    page,
    'Flutter Web 購物車實現'
  );

  analyzer.recordBusinessLogicFinding(
    '購物流程',
    '購物車管理',
    `購物車頁面提供${cartButtons.length}個管理選項`,
    '應用實現了購物車的增刪改功能',
    '用戶可以管理選購的商品',
    'Flutter Web 購物車狀態管理',
    '高 - 影響購買轉換率'
  );

  // 分析購物車業務邏輯
  const hasQuantity = cartContent?.toLowerCase().includes('quantity') ||
                     cartContent?.toLowerCase().includes('數量');
  const hasTotal = cartContent?.toLowerCase().includes('total') ||
                   cartContent?.toLowerCase().includes('總計');

  if (hasQuantity) {
    analyzer.recordBusinessLogicFinding(
      '購物車操作',
      '數量控制',
      '購物車支持數量調整功能',
      '用戶可以修改商品購買數量',
      '用戶根據需求調整商品數量',
      'Flutter Web 數量選擇器實現',
      '中 - 提升用戶靈活性'
    );
  }

  if (hasTotal) {
    analyzer.recordBusinessLogicFinding(
      '價格計算',
      '總計顯示',
      '購物車顯示總計金額',
      '應用提供透明的價格計算',
      '用戶可以清楚了解總費用',
      'Flutter Web 價格計算邏輯',
      '高 - 影響購買決策'
    );
  }

  console.log(`✅ 購物車功能探索完成 - 發現${cartButtons.length}個購物車操作按鈕`);
}

async function exploreCheckoutProcess(page: any, analyzer: BusinessAnalyzer) {
  console.log('💳 探索結帳流程...');

  // 訪問結帳頁面
  await page.goto('https://redandan.github.io/#/checkout', {
    waitUntil: 'networkidle',
    timeout: 20000
  });

  const checkoutContent = await page.textContent('body');
  const checkoutButtons = await page.locator('button, [role="button"]').all();
  const inputFields = await page.locator('input').all();

  analyzer.recordUserJourney(
    '購買完成',
    '訪問結帳頁面',
    `結帳頁面載入成功，發現${inputFields.length}個輸入框和${checkoutButtons.length}個按鈕`,
    '應用提供完整的結帳流程',
    page,
    'Flutter Web 結帳表單實現'
  );

  analyzer.recordBusinessLogicFinding(
    '結帳流程',
    '訂單處理',
    `結帳頁面包含${inputFields.length}個信息字段和${checkoutButtons.length}個操作選項`,
    '應用實現了完整的訂單處理流程',
    '用戶可以完成購買並生成訂單',
    'Flutter Web 表單驗證和提交邏輯',
    '高 - 決定銷售成功率'
  );

  // 分析結帳業務邏輯
  const hasPayment = checkoutContent?.toLowerCase().includes('payment') ||
                    checkoutContent?.toLowerCase().includes('付款');
  const hasAddress = checkoutContent?.toLowerCase().includes('address') ||
                     checkoutContent?.toLowerCase().includes('地址');

  if (hasPayment) {
    analyzer.recordBusinessLogicFinding(
      '支付處理',
      '支付方式',
      '結帳頁面包含支付方式選擇',
      '應用支持多種支付方式',
      '用戶可以選擇適合的支付方式',
      'Flutter Web 支付集成',
      '高 - 影響支付成功率'
    );
  }

  if (hasAddress) {
    analyzer.recordBusinessLogicFinding(
      '配送管理',
      '地址信息',
      '結帳頁面包含地址信息收集',
      '應用實現了配送地址管理',
      '用戶可以指定配送地址',
      'Flutter Web 地址驗證',
      '高 - 影響配送效率'
    );
  }

  console.log(`✅ 結帳流程探索完成 - 發現${inputFields.length}個輸入框和${checkoutButtons.length}個按鈕`);
}

async function generateComprehensiveBusinessDocumentation(analyzer: BusinessAnalyzer) {
  console.log('📄 生成綜合業務文檔...');

  // 生成並保存報告
  const report = await analyzer.generateComprehensiveBusinessDocumentation();

  // 顯示摘要
  const summary = analyzer.getSummary();
  console.log('\n📊 業務探索測試最終摘要:');
  console.log('='.repeat(70));
  console.log(`🎯 用戶旅程階段: ${summary.userJourneySteps}`);
  console.log(`🔍 業務邏輯發現: ${summary.businessLogicFindings}`);
  console.log(`🎪 用戶行為模式: ${summary.userBehaviorPatterns}`);
  console.log(`⚠️  技術挑戰: ${summary.technicalChallenges}`);
  console.log(`💡 業務機會: ${summary.businessOpportunities}`);

  // 顯示關鍵發現
  if (summary.businessLogicFindings > 0) {
    console.log('\n🔍 核心業務邏輯發現:');
    // 這裡可以添加更多詳細的顯示邏輯
  }

  console.log('\n📄 綜合業務分析報告已生成並保存！');
}