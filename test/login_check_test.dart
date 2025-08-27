import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  group('登入功能檢查', () {
    const String baseUrl = 'https://redandan.github.io';

    test('檢查網站登入功能', () async {
      final response = await http.get(Uri.parse(baseUrl));
      expect(response.statusCode, 200);

      final body = response.body;
      print('=== 檢查登入相關功能 ===');

      // 檢查登入相關的關鍵字
      final loginTerms = [
        'login', '登入', 'sign in', 'signin',
        'log in', 'auth', 'authentication',
        'username', 'user', 'account', '帳號',
        'password', '密碼', 'pwd',
        'email', '郵箱', 'mail',
        'session', 'token', 'cookie',
        'dashboard', '個人中心', 'profile'
      ];

      print('登入相關術語檢查:');
      for (final term in loginTerms) {
        final count = body.toLowerCase().split(term.toLowerCase()).length - 1;
        if (count > 0) {
          print('✅ 找到 "$term": $count 次');

          // 顯示包含該術語的上下文
          final regex = RegExp('$term', caseSensitive: false);
          final matches = regex.allMatches(body);
          for (final match in matches.take(2)) {
            final start = match.start - 30;
            final end = match.end + 30;
            final context = body.substring(start < 0 ? 0 : start, end > body.length ? body.length : end);
            print('   上下文: ...${context.replaceAll('\n', ' ')}...');
          }
        }
      }

      // 檢查是否有登入表單
      final hasLoginForm = body.contains('<form') &&
                          (body.contains('login') || body.contains('登入') ||
                           body.contains('password') || body.contains('密碼'));

      print('\n登入表單檢查: ${hasLoginForm ? "✅" : "❌"}');

      // 檢查是否有任何API端點或JavaScript處理登入
      final hasApiCall = body.contains('fetch') || body.contains('axios') ||
                         body.contains('XMLHttpRequest') || body.contains('api');
      final hasJsLogin = body.contains('login') && body.contains('<script');

      print('API調用檢查: ${hasApiCall ? "✅" : "❌"}');
      print('JavaScript登入檢查: ${hasJsLogin ? "✅" : "❌"}');

      // 檢查是否有重定向或授權檢查
      final hasRedirect = body.contains('redirect') || body.contains('location.href');
      final hasAuthCheck = body.contains('auth') || body.contains('token') ||
                          body.contains('session') || body.contains('cookie');

      print('重定向檢查: ${hasRedirect ? "✅" : "❌"}');
      print('授權檢查: ${hasAuthCheck ? "✅" : "❌"}');

      // 如果沒有明顯的登入功能，檢查是否有隱藏的登入邏輯
      if (!hasLoginForm && !hasJsLogin) {
        print('\n=== 檢查可能的隱藏登入邏輯 ===');

        // 檢查是否有任何與用戶相關的狀態管理
        final hasStateManagement = body.contains('state') || body.contains('store') ||
                                  body.contains('context') || body.contains('provider');

        // 檢查是否有本地存儲或會話存儲
        final hasLocalStorage = body.contains('localStorage') || body.contains('sessionStorage');

        // 檢查是否有任何條件渲染（可能基於登入狀態）
        final hasConditionalRender = body.contains('if') && body.contains('login');

        print('狀態管理檢查: ${hasStateManagement ? "✅" : "❌"}');
        print('本地存儲檢查: ${hasLocalStorage ? "✅" : "❌"}');
        print('條件渲染檢查: ${hasConditionalRender ? "✅" : "❌"}');
      }
    });

    test('檢查登入安全性', () async {
      final response = await http.get(Uri.parse(baseUrl));
      expect(response.statusCode, 200);

      final body = response.body;
      print('\n=== 登入安全性檢查 ===');

      // 檢查HTTPS
      final isHttps = baseUrl.startsWith('https');
      print('HTTPS檢查: ${isHttps ? "✅" : "❌"}');

      // 檢查是否有明文密碼傳輸
      final hasInsecurePassword = body.contains('password') && !body.contains('type="password"');
      print('密碼字段安全性: ${hasInsecurePassword ? "❌" : "✅"}');

      // 檢查是否有敏感信息泄露
      final sensitiveTerms = ['password', 'token', 'secret', 'key', 'apikey'];
      bool hasSensitiveLeak = false;
      for (final term in sensitiveTerms) {
        if (body.contains(term)) {
          hasSensitiveLeak = true;
          print('⚠️  發現敏感詞: $term');
        }
      }
      print('敏感信息檢查: ${hasSensitiveLeak ? "⚠️" : "✅"}');

      // 檢查表單是否有CSRF保護
      final hasCsrfToken = body.contains('csrf') || body.contains('_token') || body.contains('token');
      print('CSRF保護檢查: ${hasCsrfToken ? "✅" : "⚠️"}');
    });

    test('檢查登入表單完整性', () async {
      final response = await http.get(Uri.parse(baseUrl));
      expect(response.statusCode, 200);

      final body = response.body;
      print('\n=== 登入表單完整性檢查 ===');

      // 檢查表單元素
      final hasForm = body.contains('<form');
      final hasEmailInput = body.contains('type="email"') || body.contains('email');
      final hasPasswordInput = body.contains('type="password"') || body.contains('password');
      final hasSubmitButton = body.contains('type="submit"') || body.contains('<button');

      print('表單存在: ${hasForm ? "✅" : "❌"}');
      print('郵箱輸入框: ${hasEmailInput ? "✅" : "❌"}');
      print('密碼輸入框: ${hasPasswordInput ? "✅" : "❌"}');
      print('提交按鈕: ${hasSubmitButton ? "✅" : "❌"}');

      // 檢查表單驗證
      final hasRequiredFields = body.contains('required') || body.contains('aria-required');
      final hasValidation = body.contains('pattern') || body.contains('minlength') || body.contains('maxlength');

      print('必填字段標記: ${hasRequiredFields ? "✅" : "⚠️"}');
      print('字段驗證: ${hasValidation ? "✅" : "⚠️"}');

      // 檢查無障礙性
      final hasLabels = body.contains('<label') || body.contains('aria-label') || body.contains('aria-labelledby');
      final hasPlaceholders = body.contains('placeholder');

      print('標籤檢查: ${hasLabels ? "✅" : "⚠️"}');
      print('占位符檢查: ${hasPlaceholders ? "✅" : "⚠️"}');
    });
  });

  test('嘗試模擬登入過程', () async {
    print('\n=== 嘗試模擬登入過程 ===');

    // 首先檢查是否有登入API端點
    final loginEndpoints = [
      'https://redandan.github.io/api/login',
      'https://redandan.github.io/login',
      'https://redandan.github.io/auth',
      'https://redandan.github.io/api/auth'
    ];

    for (final endpoint in loginEndpoints) {
      try {
        print('檢查端點: $endpoint');
        final response = await http.get(Uri.parse(endpoint));
        print('  狀態碼: ${response.statusCode}');
        if (response.statusCode == 200) {
          print('  內容長度: ${response.body.length} 字符');
          if (response.body.contains('login') || response.body.contains('auth')) {
            print('  ✅ 發現登入相關內容');
          }
        }
      } catch (e) {
        print('  ❌ 請求失敗: $e');
      }
    }

    // 檢查是否有POST登入的可能
    print('\n檢查可能的登入方法:');
    print('建議手動測試:');
    print('1. 打開瀏覽器訪問 https://redandan.github.io/');
    print('2. 查看是否有登入按鈕或連結');
    print('3. 檢查瀏覽器開發者工具的Network標籤頁');
    print('4. 查看是否有API調用或重定向');
  });
}