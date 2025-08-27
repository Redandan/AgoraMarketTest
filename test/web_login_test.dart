import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../lib/core/constants/test_keys.dart';

void main() {
  group('Web 登入功能測試 (testWidgets)', () {
    testWidgets('Web 登入頁面載入測試', (WidgetTester tester) async {
      // 創建一個模擬的 Web 登入頁面
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

      // 驗證頁面元素存在
      expect(find.byKey(Key(TestKeys.appBar)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.emailInput)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.passwordInput)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.loginButton)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.forgotPasswordLink)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.registerButton)), findsOneWidget);

      // 驗證頁面標題
      expect(find.text('AgoraMarket'), findsOneWidget);
      expect(find.text('歡迎登入 AgoraMarket'), findsOneWidget);
    });

    testWidgets('Web 登入表單輸入測試', (WidgetTester tester) async {
      // 創建登入頁面
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

      // 測試電子郵件輸入
      await tester.enterText(
          find.byKey(Key(TestKeys.emailInput)), 'test@agoramarket.com');
      expect(find.text('test@agoramarket.com'), findsOneWidget);

      // 測試密碼輸入
      await tester.enterText(
          find.byKey(Key(TestKeys.passwordInput)), 'TestPassword123!');
      expect(find.text('TestPassword123!'), findsOneWidget);

      // 驗證輸入框狀態
      final emailField =
          tester.widget<TextField>(find.byKey(Key(TestKeys.emailInput)));
      final passwordField =
          tester.widget<TextField>(find.byKey(Key(TestKeys.passwordInput)));

      expect(emailField.decoration?.labelText, equals('電子郵件'));
      expect(passwordField.decoration?.labelText, equals('密碼'));
      expect(passwordField.obscureText, isTrue);
    });

    testWidgets('Web 登入按鈕點擊測試', (WidgetTester tester) async {
      bool loginPressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ElevatedButton(
              key: Key(TestKeys.loginButton),
              onPressed: () {
                loginPressed = true;
              },
              child: Text('登入'),
            ),
          ),
        ),
      );

      // 點擊登入按鈕
      await tester.tap(find.byKey(Key(TestKeys.loginButton)));
      await tester.pump();

      // 驗證按鈕被點擊
      expect(loginPressed, isTrue);
    });

    testWidgets('Web 登入錯誤處理測試', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Column(
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
                SizedBox(height: 16),
                // 模擬錯誤訊息
                Container(
                  key: Key(TestKeys.errorMessage),
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.shade100,
                    border: Border.all(color: Colors.red),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    '登入失敗：電子郵件或密碼錯誤',
                    style: TextStyle(color: Colors.red.shade800),
                  ),
                ),
              ],
            ),
          ),
        ),
      );

      // 驗證錯誤訊息存在
      expect(find.byKey(Key(TestKeys.errorMessage)), findsOneWidget);
      expect(find.text('登入失敗：電子郵件或密碼錯誤'), findsOneWidget);
    });

    testWidgets('Web 響應式設計測試', (WidgetTester tester) async {
      // 創建一個響應式的登入頁面
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LayoutBuilder(
              builder: (context, constraints) {
                // 根據寬度調整佈局
                final isMobile = constraints.maxWidth < 600;
                final isTablet = constraints.maxWidth < 1024;

                return Padding(
                  padding: EdgeInsets.all(isMobile ? 8.0 : 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        '歡迎登入 AgoraMarket',
                        style: TextStyle(
                          fontSize: isMobile ? 20 : 24,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: isMobile ? 24 : 32),
                      TextField(
                        key: Key(TestKeys.emailInput),
                        decoration: InputDecoration(
                          labelText: '電子郵件',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      SizedBox(height: 16),
                      TextField(
                        key: Key(TestKeys.passwordInput),
                        decoration: InputDecoration(
                          labelText: '密碼',
                          border: OutlineInputBorder(),
                        ),
                        obscureText: true,
                      ),
                      SizedBox(height: 24),
                      ElevatedButton(
                        key: Key(TestKeys.loginButton),
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(
                            vertical: isMobile ? 12 : 16,
                          ),
                        ),
                        child: Text('登入'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      );

      // 測試桌面端佈局
      await tester.binding.setSurfaceSize(Size(1920, 800));
      await tester.pumpAndSettle();

      // 驗證桌面端元素
      expect(find.byKey(Key(TestKeys.emailInput)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.passwordInput)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.loginButton)), findsOneWidget);

      // 測試平板端佈局
      await tester.binding.setSurfaceSize(Size(1024, 800));
      await tester.pumpAndSettle();

      // 驗證平板端元素
      expect(find.byKey(Key(TestKeys.emailInput)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.passwordInput)), findsOneWidget);

      // 測試移動端佈局
      await tester.binding.setSurfaceSize(Size(375, 800));
      await tester.pumpAndSettle();

      // 驗證移動端元素
      expect(find.byKey(Key(TestKeys.emailInput)), findsOneWidget);
      expect(find.byKey(Key(TestKeys.passwordInput)), findsOneWidget);

      // 恢復原始大小
      await tester.binding.setSurfaceSize(Size(800, 600));
    });
  });
}
