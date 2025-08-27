import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  group('增強版登入功能測試', () {
    const String baseUrl = 'https://redandan.github.io';
    const String testEmail = 'autotest@agoramarket.com';
    const String testPassword = 'AutoTest123!';

    test('登入功能完整性測試', () async {
      print('=== 登入功能完整性測試 ===');

      final response = await http.get(Uri.parse(baseUrl));
      expect(response.statusCode, 200);

      final body = response.body;
      final bodyLower = body.toLowerCase();

      // 評分系統
      int score = 0;
      final List<String> feedback = [];

      // 檢查登入表單存在性 (20分)
      final hasLoginForm = bodyLower.contains('<form') &&
                          (bodyLower.contains('login') || bodyLower.contains('登入'));
      if (hasLoginForm) {
        score += 20;
        feedback.add('✅ 登入表單存在 (+20分)');
      } else {
        feedback.add('❌ 缺少登入表單 (-0分)');
      }

      // 檢查郵箱輸入框 (15分)
      final hasEmailInput = bodyLower.contains('type="email"') ||
                           (bodyLower.contains('email') && bodyLower.contains('<input'));
      if (hasEmailInput) {
        score += 15;
        feedback.add('✅ 郵箱輸入框存在 (+15分)');
      } else {
        feedback.add('❌ 缺少郵箱輸入框 (-0分)');
      }

      // 檢查密碼輸入框 (15分)
      final hasPasswordInput = bodyLower.contains('type="password"');
      if (hasPasswordInput) {
        score += 15;
        feedback.add('✅ 密碼輸入框存在 (+15分)');
      } else {
        feedback.add('❌ 缺少密碼輸入框 (-0分)');
      }

      // 檢查提交按鈕 (10分)
      final hasSubmitButton = bodyLower.contains('type="submit"') ||
                             (bodyLower.contains('<button') && bodyLower.contains('login'));
      if (hasSubmitButton) {
        score += 10;
        feedback.add('✅ 提交按鈕存在 (+10分)');
      } else {
        feedback.add('❌ 缺少提交按鈕 (-0分)');
      }

      // 檢查JavaScript處理 (10分)
      final hasJsHandling = bodyLower.contains('onsubmit') ||
                           bodyLower.contains('addEventListener') ||
                           bodyLower.contains('fetch') ||
                           bodyLower.contains('XMLHttpRequest');
      if (hasJsHandling) {
        score += 10;
        feedback.add('✅ JavaScript處理邏輯存在 (+10分)');
      } else {
        feedback.add('⚠️  未發現JavaScript處理邏輯 (+0分)');
      }

      // 檢查安全性 (15分)
      final hasHttps = baseUrl.startsWith('https');
      final hasCsrfProtection = bodyLower.contains('csrf') || bodyLower.contains('_token');
      final hasValidation = bodyLower.contains('required') || bodyLower.contains('pattern');

      int securityScore = 0;
      if (hasHttps) securityScore += 5;
      if (hasCsrfProtection) securityScore += 5;
      if (hasValidation) securityScore += 5;

      score += securityScore;
      feedback.add('🔒 安全性評分: $securityScore/15分');

      // 檢查用戶體驗 (15分)
      final hasLabels = bodyLower.contains('<label') || bodyLower.contains('aria-label');
      final hasPlaceholders = bodyLower.contains('placeholder');
      final hasLoadingState = bodyLower.contains('loading') || bodyLower.contains('spinner');

      int uxScore = 0;
      if (hasLabels) uxScore += 5;
      if (hasPlaceholders) uxScore += 5;
      if (hasLoadingState) uxScore += 5;

      score += uxScore;
      feedback.add('🎨 用戶體驗評分: $uxScore/15分');

      // 輸出結果
      print('總分: $score/100');
      print('評級: ${getGrade(score)}');
      print('\n詳細評分:');
      feedback.forEach(print);

      // 根據分數給出建議
      print('\n💡 改進建議:');
      if (score < 40) {
        print('   - 建議實現基本的登入表單');
        print('   - 添加郵箱和密碼輸入框');
        print('   - 實現表單提交處理');
      } else if (score < 70) {
        print('   - 增強安全性（HTTPS、CSRF保護）');
        print('   - 改善用戶體驗（標籤、驗證）');
        print('   - 添加JavaScript處理邏輯');
      } else {
        print('   - 考慮添加高級功能（記住我、忘記密碼等）');
        print('   - 實現更完善的錯誤處理');
        print('   - 添加無障礙性支持');
      }
    });

    test('登入流程模擬測試', () async {
      print('\n=== 登入流程模擬測試 ===');

      // 模擬登入請求（如果有API端點）
      final loginEndpoints = [
        '$baseUrl/api/login',
        '$baseUrl/api/auth',
        '$baseUrl/login',
        '$baseUrl/auth'
      ];

      for (final endpoint in loginEndpoints) {
        try {
          print('測試端點: $endpoint');

          // 嘗試POST請求模擬登入
          final loginData = {
            'email': testEmail,
            'password': testPassword,
            'username': testEmail,
            'user': testEmail
          };

          for (final data in loginData.entries) {
            final response = await http.post(
              Uri.parse(endpoint),
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode({data.key: data.value, 'password': testPassword})
            );

            print('  POST ${data.key}: ${response.statusCode}');

            if (response.statusCode == 200 || response.statusCode == 201) {
              final responseBody = response.body;
              if (responseBody.contains('success') ||
                  responseBody.contains('token') ||
                  responseBody.contains('session')) {
                print('  ✅ 可能的成功登入響應');
                break;
              }
            }
          }
        } catch (e) {
          print('  ❌ 請求失敗: $e');
        }
      }

      print('\n💡 對於靜態網站，登入可能通過以下方式實現:');
      print('   1. 前端JavaScript處理');
      print('   2. 第三方認證服務');
      print('   3. 服務端會話管理');
      print('   4. JWT或其他token機制');
    });

    test('登入錯誤處理測試', () async {
      print('\n=== 登入錯誤處理測試 ===');

      final response = await http.get(Uri.parse(baseUrl));
      expect(response.statusCode, 200);

      final body = response.body;
      final bodyLower = body.toLowerCase();

      // 檢查錯誤處理
      final hasErrorHandling = bodyLower.contains('error') &&
                              (bodyLower.contains('message') || bodyLower.contains('alert'));
      final hasValidation = bodyLower.contains('invalid') || bodyLower.contains('required');
      final hasNetworkError = bodyLower.contains('network') || bodyLower.contains('connection');

      print('錯誤處理檢查:');
      print('  - 一般錯誤處理: ${hasErrorHandling ? "✅" : "❌"}');
      print('  - 驗證錯誤處理: ${hasValidation ? "✅" : "❌"}');
      print('  - 網路錯誤處理: ${hasNetworkError ? "✅" : "❌"}');

      // 檢查錯誤消息的用戶友好性
      if (hasErrorHandling) {
        print('✅ 發現錯誤處理邏輯');
      } else {
        print('⚠️  建議添加錯誤處理機制');
      }
    });
  });
}

String getGrade(int score) {
  if (score >= 90) return '優秀 (A)';
  if (score >= 80) return '良好 (B)';
  if (score >= 70) return '中等 (C)';
  if (score >= 60) return '及格 (D)';
  return '不及格 (F)';
}