import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'base_page.dart';
import '../config/test_config.dart';
import '../core/constants/test_keys.dart';

/// 認證頁面物件
class AuthPage extends BasePage {
  AuthPage(super.tester);

  // 使用 TestKeys 而不是硬編碼字符串
  // 這樣可以確保與主項目的 Keys 完全一致

  /// 導航到登入頁面 (模擬實現)
  Future<void> navigateToLogin() async {
    // 在標準 Flutter 測試中，我們創建登入頁面
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  key: Key(TestKeys.emailInput),
                  decoration: InputDecoration(labelText: '電子郵件'),
                ),
                SizedBox(height: 16),
                TextField(
                  key: Key(TestKeys.passwordInput),
                  decoration: InputDecoration(labelText: '密碼'),
                  obscureText: true,
                ),
                SizedBox(height: 16),
                ElevatedButton(
                  key: Key(TestKeys.loginButton),
                  onPressed: () {},
                  child: Text('登入'),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    await waitForPageLoad();
    await waitForElement(TestKeys.emailInput);
    await takeScreenshot('login_page_loaded');
  }

  /// 執行登入
  Future<void> login({String? email, String? password}) async {
    final loginEmail = email ?? TestConfig.testUser['email']!;
    final loginPassword = password ?? TestConfig.testUser['password']!;

    await waitForElement(TestKeys.emailInput);
    await enterText(TestKeys.emailInput, loginEmail);
    await enterText(TestKeys.passwordInput, loginPassword);
    await takeScreenshot('login_form_filled');

    await tapElement(TestKeys.loginButton);

    // 等待登入完成（載入指示器消失）
    if (await isElementPresent(TestKeys.loadingIndicator)) {
      await waitForElementToDisappear(TestKeys.loadingIndicator);
    }

    await waitForPageLoad();
    await takeScreenshot('login_completed');
  }

  /// 驗證登入成功
  Future<bool> isLoginSuccessful() async {
    // 檢查是否重定向到主頁面或出現產品列表
    return await isElementPresent(TestKeys.productList) ||
        await isElementPresent(TestKeys.userDashboard) ||
        !await isElementPresent(TestKeys.loginButton);
  }

  /// 驗證登入失敗
  Future<bool> hasLoginError() async {
    return await isElementPresent(TestKeys.errorMessage);
  }

  /// 點擊註冊按鈕
  Future<void> clickRegister() async {
    await tapElement(TestKeys.registerButton);
    await waitForPageLoad();
  }

  /// 點擊忘記密碼
  Future<void> clickForgotPassword() async {
    await tapElement(TestKeys.forgotPasswordLink);
    await waitForPageLoad();
  }

  /// 執行登出
  Future<void> logout() async {
    if (await isElementPresent(TestKeys.profileMenu)) {
      await tapElement(TestKeys.profileMenu);
      await tapElement(TestKeys.logoutButton);
      await waitForPageLoad();
    }
  }
}
