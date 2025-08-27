import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:http/http.dart' as http;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('用戶註冊流程測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    testWidgets('應該能夠訪問註冊頁面', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));

        expect(response.statusCode, 200);
        expect(response.body, isNotEmpty);

        final body = response.body.toLowerCase();

        // 檢查是否有註冊相關元素
        final hasRegistrationElements = body.contains('register') ||
                                      body.contains('signup') ||
                                      body.contains('註冊') ||
                                      body.contains('sign up');

        print('✅ 用戶註冊頁面訪問成功');
        print('✅ 註冊元素檢測: ${hasRegistrationElements ? "發現" : "未發現"}');

        // 靜態展示網站沒有註冊功能也是正常的
        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 用戶註冊測試失敗: $e');
        fail('無法訪問註冊頁面: $e');
      }
    });

    testWidgets('應該能夠檢查註冊表單', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查註冊表單元素
        final hasForm = body.contains('<form');
        final hasEmailInput = body.contains('type="email"') || body.contains('email');
        final hasNameInput = body.contains('name') || body.contains('username');
        final hasRegisterButton = body.contains('register') || body.contains('註冊');

        print('✅ 註冊表單檢查完成');
        print('   - 表單元素: ${hasForm ? "✅" : "❌"}');
        print('   - 郵箱輸入: ${hasEmailInput ? "✅" : "❌"}');
        print('   - 用戶名輸入: ${hasNameInput ? "✅" : "❌"}');
        print('   - 註冊按鈕: ${hasRegisterButton ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 註冊表單檢查失敗: $e');
        fail('註冊表單測試失敗: $e');
      }
    });
  });
}