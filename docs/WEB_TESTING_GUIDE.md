# 🌐 AgoraMarket Web 平台測試指南

## 🎯 **概述**

本指南專門針對 AgoraMarket 的 Flutter Web 平台測試，涵蓋從基礎的登入測試到完整的 Web 功能測試。

## 🚀 **快速開始**

### **1. 環境準備**

確保你的 Flutter 環境支持 Web 開發：

```bash
# 檢查 Flutter Web 支持
flutter devices

# 應該看到類似輸出：
# Chrome (web) • chrome • web-javascript • Google Chrome
# Edge (web)   • edge   • web-javascript • Microsoft Edge
```

### **2. 運行 Web 測試**

```bash
# 運行單元測試
flutter test

# 運行 Web 登入測試（模擬）
flutter test integration_test/smoke_tests/web_login_test.dart

# 運行完整的 Web 測試套件
.\scripts\run_web_tests.ps1
```

## 📁 **Web 測試架構**

### **測試文件結構**

```
integration_test/
├── smoke_tests/
│   ├── web_login_test.dart      # Web 登入測試
│   └── basic_navigation_test.dart # 基礎導航測試
├── user_flows/                  # 用戶流程測試
├── business_scenarios/          # 業務場景測試
└── regression_tests/            # 回歸測試

lib/
├── config/
│   └── web_test_config.dart     # Web 測試配置
├── page_objects/
│   └── web_auth_page.dart       # Web 認證頁面物件
└── core/constants/
    ├── test_keys.dart           # 測試 Keys
    └── semantic_labels.dart     # 語義標籤
```

### **Web 專用配置**

`lib/config/web_test_config.dart` 包含：

- **URL 配置**：測試目標網站
- **視窗大小**：響應式測試支持
- **瀏覽器支持**：Chrome、Firefox、Edge
- **等待策略**：Web 特定的超時設定

## 🧪 **Web 測試案例**

### **1. 登入功能測試**

```dart
testWidgets('Web 登入頁面載入測試', (WidgetTester tester) async {
  // 創建模擬的 Web 登入頁面
  await tester.pumpWidget(/* 登入頁面 Widget */);
  
  // 驗證頁面元素
  expect(find.byKey(Key(TestKeys.emailInput)), findsOneWidget);
  expect(find.byKey(Key(TestKeys.passwordInput)), findsOneWidget);
  expect(find.byKey(Key(TestKeys.loginButton)), findsOneWidget);
});
```

### **2. 響應式設計測試**

```dart
testWidgets('Web 響應式設計測試', (WidgetTester tester) async {
  // 測試不同視窗大小
  for (final entry in WebTestConfig.viewportSizes.entries) {
    final size = entry.value;
    final device = entry.key;
    
    await tester.binding.setSurfaceSize(Size(size.toDouble(), 800));
    await tester.pumpAndSettle();
    
    await takeScreenshot('web_responsive_${device}_${size}');
  }
});
```

### **3. 表單驗證測試**

```dart
testWidgets('Web 表單驗證測試', (WidgetTester tester) async {
  // 測試空表單提交
  await tapElement(TestKeys.loginButton);
  
  // 檢查驗證錯誤
  final hasValidationError = await isElementPresent(TestKeys.errorMessage);
  expect(hasValidationError, isTrue);
});
```

## 🔧 **Web 測試配置**

### **視窗大小配置**

```dart
static const Map<String, int> viewportSizes = {
  'desktop': 1920,  // 桌面端
  'tablet': 1024,   // 平板端
  'mobile': 375,    // 移動端
};
```

### **等待策略配置**

```dart
static const Map<String, Duration> waitStrategies = {
  'pageLoad': Duration(seconds: 20),      // 頁面載入
  'elementVisible': Duration(seconds: 10), // 元素可見
  'elementClickable': Duration(seconds: 5), // 元素可點擊
  'animationComplete': Duration(seconds: 3), // 動畫完成
  'networkIdle': Duration(seconds: 15),   // 網路空閒
};
```

## 📊 **測試結果**

### **測試報告目錄**

```
test_results/
├── screenshots/
│   └── web/                    # Web 測試截圖
├── reports/
│   └── web/                    # Web 測試報告
└── logs/
    └── web/                    # Web 測試日誌
```

### **截圖命名規則**

- `web_login_page_loaded.png` - 登入頁面載入
- `web_login_form_filled.png` - 表單填寫完成
- `web_responsive_desktop_1920.png` - 桌面端響應式測試
- `web_form_validation_failed.png` - 表單驗證失敗

## 🚨 **常見問題與解決方案**

### **1. Flutter Web 集成測試限制**

**問題**：`Web devices are not supported for integration tests yet`

**解決方案**：
- 使用 `testWidgets` 創建模擬的 Web 頁面
- 通過 `tester.pumpWidget()` 測試 UI 組件
- 使用單元測試驗證業務邏輯

### **2. 響應式測試**

**問題**：如何測試不同視窗大小？

**解決方案**：
```dart
await tester.binding.setSurfaceSize(Size(width, height));
await tester.pumpAndSettle();
```

### **3. 異步操作處理**

**問題**：Web 頁面載入時間不確定

**解決方案**：
```dart
await tester.pumpAndSettle();
await waitForElement(TestKeys.emailInput);
```

## 🔄 **下一步計劃**

### **短期目標（本週）**

1. ✅ **完成登入測試** - 已實現
2. 🔄 **擴展產品測試** - 創建產品列表和詳情測試
3. 🔄 **添加購物車測試** - 測試購物車功能

### **中期目標（下週）**

1. 🔄 **響應式測試** - 測試不同設備的顯示效果
2. 🔄 **無障礙測試** - 驗證語義標籤和可訪問性
3. 🔄 **性能測試** - 測試頁面載入和響應時間

### **長期目標（下個月）**

1. 🔄 **端到端測試** - 完整的用戶流程測試
2. 🔄 **跨瀏覽器測試** - Chrome、Firefox、Edge 兼容性
3. 🔄 **自動化部署** - CI/CD 集成

## 📞 **技術支援**

### **測試執行問題**

```bash
# 檢查 Flutter 環境
flutter doctor

# 檢查 Web 支持
flutter devices

# 運行測試
flutter test --verbose
```

### **代碼問題**

- 檢查 `TestKeys` 是否正確定義
- 驗證頁面物件的導入路徑
- 確認測試配置的 URL 設置

---

**最後更新時間**: 2025年8月
**版本**: 1.0.0
**適用平台**: Flutter Web
