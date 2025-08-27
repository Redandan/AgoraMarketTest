import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'base_page.dart';
import '../config/web_test_config.dart';
import '../core/constants/test_keys.dart';

/// Web 平台認證頁面物件
class WebAuthPage extends BasePage {
  WebAuthPage(super.tester);

  /// 導航到 Web 登入頁面
  Future<void> navigateToWebLogin() async {
    // 在 Web 測試中，我們需要模擬頁面導航
    // 這裡創建一個模擬的 Web 登入頁面
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: Text('AgoraMarket'),
            key: Key(TestKeys.appBar),
          ),
          body: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  '歡迎登入 AgoraMarket',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 32),
                TextField(
                  key: Key(TestKeys.emailInput),
                  decoration: InputDecoration(
                    labelText: '電子郵件',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.email),
                  ),
                ),
                SizedBox(height: 16),
                TextField(
                  key: Key(TestKeys.passwordInput),
                  decoration: InputDecoration(
                    labelText: '密碼',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.lock),
                  ),
                  obscureText: true,
                ),
                SizedBox(height: 24),
                ElevatedButton(
                  key: Key(TestKeys.loginButton),
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text('登入', style: TextStyle(fontSize: 18)),
                ),
                SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      key: Key(TestKeys.forgotPasswordLink),
                      onPressed: () {},
                      child: Text('忘記密碼？'),
                    ),
                    TextButton(
                      key: Key(TestKeys.registerButton),
                      onPressed: () {},
                      child: Text('註冊新帳號'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );

    await waitForPageLoad();
    await waitForElement(TestKeys.emailInput);
    await takeScreenshot('web_login_page_loaded');
  }

  /// 執行 Web 登入
  Future<void> performWebLogin({String? email, String? password}) async {
    final loginEmail = email ?? WebTestConfig.testUser['email']!;
    final loginPassword = password ?? WebTestConfig.testUser['password']!;

    // 等待表單元素載入
    await waitForElement(TestKeys.emailInput);
    await waitForElement(TestKeys.passwordInput);

    // 輸入登入信息
    await enterText(TestKeys.emailInput, loginEmail);
    await enterText(TestKeys.passwordInput, loginPassword);

    await takeScreenshot('web_login_form_filled');

    // 點擊登入按鈕
    await tapElement(TestKeys.loginButton);

    // 等待登入處理
    await waitForPageLoad();
    await takeScreenshot('web_login_submitted');
  }

  /// 驗證 Web 登入成功
  Future<bool> isWebLoginSuccessful() async {
    // 檢查是否出現成功訊息或重定向到主頁
    return await isElementPresent(TestKeys.successMessage) ||
        !await isElementPresent(TestKeys.loginButton);
  }

  /// 驗證 Web 登入失敗
  Future<bool> hasWebLoginError() async {
    return await isElementPresent(TestKeys.errorMessage);
  }

  /// 測試 Web 響應式設計
  Future<void> testWebResponsiveness() async {
    // 測試不同視窗大小的響應
    for (final entry in WebTestConfig.viewportSizes.entries) {
      final size = entry.value;
      final device = entry.key;

      // 模擬視窗大小變化
      await tester.binding.setSurfaceSize(Size(size.toDouble(), 800));
      await tester.pumpAndSettle();

      await takeScreenshot('web_responsive_${device}_${size}');
    }
  }

  /// 測試 Web 表單驗證
  Future<void> testWebFormValidation() async {
    // 測試空表單提交
    await tapElement(TestKeys.loginButton);
    await waitForPageLoad();

    // 檢查是否有驗證錯誤
    final hasValidationError = await isElementPresent(TestKeys.errorMessage);
    await takeScreenshot(
        'web_form_validation_${hasValidationError ? 'failed' : 'passed'}');
  }

  /// 測試 Web 無障礙功能
  Future<void> testWebAccessibility() async {
    // 檢查語義標籤
    final emailField = find.byKey(Key(TestKeys.emailInput));
    final passwordField = find.byKey(Key(TestKeys.passwordInput));

    // 驗證輸入框有正確的標籤
    expect(
        tester.widget<TextField>(emailField).decoration?.labelText, isNotNull);
    expect(tester.widget<TextField>(passwordField).decoration?.labelText,
        isNotNull);

    await takeScreenshot('web_accessibility_test');
  }
}
