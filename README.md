# 🌐 AgoraMarket 自動化測試項目

## 🎯 **項目概述**

AgoraMarket 是一個基於 Flutter 的跨平台電商應用，本項目提供完整的自動化測試解決方案，支持 Web、移動端和桌面端測試。

## 🚀 **快速開始**

### **環境要求**

- Flutter SDK 3.0.0+
- Dart SDK 3.0.0+
- Windows 10+ (PowerShell 腳本支持)

### **安裝依賴**

```bash
flutter pub get
```

### **運行測試**

```bash
# 運行所有測試
flutter test

# 運行 Web 登入測試
flutter test test/web_login_test.dart

# 運行單元測試
flutter test test/unit_test.dart

# 驗證測試 Keys
dart run scripts/validate_keys.dart
```

## 📁 **項目結構**

```
AgoraMarketTest/
├── lib/                           # 核心代碼
│   ├── config/                    # 測試配置
│   │   ├── test_config.dart      # 通用測試配置
│   │   └── web_test_config.dart  # Web 平台配置
│   ├── core/constants/           # 測試常量
│   │   ├── test_keys.dart        # 測試 Keys 管理
│   │   └── semantic_labels.dart  # 語義標籤
│   ├── page_objects/             # 頁面物件
│   │   ├── base_page.dart        # 基礎頁面類
│   │   ├── auth_page.dart        # 認證頁面
│   │   ├── product_page.dart     # 產品頁面
│   │   ├── cart_page.dart        # 購物車頁面
│   │   └── web_auth_page.dart    # Web 認證頁面
│   └── utils/                    # 工具類
│       └── test_keys_validator.dart # Keys 驗證工具
├── test/                          # 單元測試
│   ├── unit_test.dart            # 基礎單元測試
│   └── web_login_test.dart       # Web 登入測試
├── integration_test/              # 集成測試
│   └── smoke_tests/              # 冒煙測試
│       ├── basic_navigation_test.dart # 基礎導航測試
│       └── web_login_test.dart   # Web 登入集成測試
├── scripts/                       # 執行腳本
│   ├── run_tests.ps1             # 基礎測試執行
│   ├── run_all_tests.ps1         # 完整測試套件
│   ├── run_web_tests.ps1         # Web 測試執行
│   ├── run_web_widget_tests.ps1  # Web Widget 測試
│   └── validate_keys.dart        # Keys 驗證腳本
├── docs/                          # 文檔
│   └── WEB_TESTING_GUIDE.md      # Web 測試指南
├── test_results/                  # 測試結果
│   ├── screenshots/               # 測試截圖
│   ├── reports/                   # 測試報告
│   └── logs/                      # 測試日誌
└── README.md                      # 項目說明
```

## 🌐 **Web 平台測試**

### **Web 測試特色**

- **響應式設計測試**：支持桌面端、平板端、移動端佈局測試
- **Widget 測試**：使用 `testWidgets` 進行 UI 組件測試
- **跨瀏覽器支持**：Chrome、Firefox、Edge 兼容性測試
- **無障礙測試**：語義標籤和可訪問性驗證

### **Web 測試執行**

```bash
# 執行 Web Widget 測試
.\scripts\run_web_widget_tests.ps1

# 執行完整 Web 測試套件
.\scripts\run_web_tests.ps1
```

### **Web 測試案例**

1. **登入功能測試**
   - 頁面載入驗證
   - 表單輸入測試
   - 按鈕點擊測試
   - 錯誤處理測試

2. **響應式設計測試**
   - 桌面端佈局 (1920px)
   - 平板端佈局 (1024px)
   - 移動端佈局 (375px)

3. **無障礙功能測試**
   - 語義標籤驗證
   - 輸入框標籤檢查
   - 鍵盤導航支持

## 🔑 **TestKeys 系統**

### **核心特性**

- **統一管理**：所有測試 Keys 集中管理
- **動態生成**：支持索引、ID、用戶ID 等動態 Key
- **驗證機制**：自動檢查 Key 有效性和唯一性
- **語義標籤**：支持中文語義標籤管理

### **使用示例**

```dart
// 基礎 Key 使用
expect(find.byKey(Key(TestKeys.emailInput)), findsOneWidget);

// 動態 Key 生成
final productKey = TestKeys.productItem.withIndex(1);
final userKey = TestKeys.userProfile.withUserId('user123');
```

### **Key 驗證**

```bash
# 驗證所有測試 Keys
dart run scripts/validate_keys.dart
```

## 📊 **測試報告**

### **報告類型**

- **HTML 報告**：美觀的網頁格式報告
- **控制台輸出**：詳細的測試執行信息
- **截圖記錄**：自動保存測試截圖
- **日誌文件**：完整的測試執行日誌

### **報告內容**

- 測試執行摘要
- 成功率統計
- 執行時間分析
- 失敗測試詳情
- 環境信息記錄

## 🚨 **常見問題**

### **Flutter Web 集成測試限制**

**問題**：`Web devices are not supported for integration tests yet`

**解決方案**：
- 使用 `testWidgets` 創建模擬的 Web 頁面
- 通過 `tester.pumpWidget()` 測試 UI 組件
- 使用單元測試驗證業務邏輯

### **測試執行問題**

```bash
# 檢查 Flutter 環境
flutter doctor

# 檢查 Web 支持
flutter devices

# 運行測試
flutter test --verbose
```

## 🔄 **下一步計劃**

### **短期目標**

1. ✅ **完成 Web 登入測試** - 已實現
2. 🔄 **擴展產品測試** - 創建產品列表和詳情測試
3. 🔄 **添加購物車測試** - 測試購物車功能

### **中期目標**

1. 🔄 **響應式測試** - 測試不同設備的顯示效果
2. 🔄 **無障礙測試** - 驗證語義標籤和可訪問性
3. 🔄 **性能測試** - 測試頁面載入和響應時間

### **長期目標**

1. 🔄 **端到端測試** - 完整的用戶流程測試
2. 🔄 **跨瀏覽器測試** - Chrome、Firefox、Edge 兼容性
3. 🔄 **自動化部署** - CI/CD 集成

## 📞 **技術支援**

### **測試執行**

- 檢查 `TestKeys` 是否正確定義
- 驗證頁面物件的導入路徑
- 確認測試配置的 URL 設置

### **環境配置**

- 確保 Flutter SDK 版本正確
- 檢查 Web 平台支持
- 驗證 PowerShell 執行權限

---

**最後更新時間**: 2025年8月
**版本**: 1.0.0
**適用平台**: Flutter Web, Mobile, Desktop
**測試框架**: flutter_test, testWidgets
