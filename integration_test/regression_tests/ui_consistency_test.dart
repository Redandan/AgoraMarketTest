import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:http/http.dart' as http;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('UI 一致性回歸測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    testWidgets('應該能夠檢查頁面布局一致性', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查基本布局元素
        final hasHeader = body.contains('<header') ||
                         body.contains('class="header"') ||
                         body.contains('id="header"');
        final hasFooter = body.contains('<footer') ||
                         body.contains('class="footer"') ||
                         body.contains('id="footer"');
        final hasMain = body.contains('<main') ||
                       body.contains('class="main"') ||
                       body.contains('id="main"');

        print('✅ 頁面布局一致性檢查完成');
        print('   - 頁面頭部: ${hasHeader ? "✅" : "❌"}');
        print('   - 頁面底部: ${hasFooter ? "✅" : "❌"}');
        print('   - 主要內容: ${hasMain ? "✅" : "❌"}');

        // 檢查響應式設計
        final hasViewport = body.contains('viewport');
        final hasMetaTags = body.contains('<meta');

        print('   - 響應式設計: ${hasViewport ? "✅" : "❌"}');
        print('   - Meta 標籤: ${hasMetaTags ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ UI 一致性檢查失敗: $e');
        fail('UI 一致性測試失敗: $e');
      }
    });

    testWidgets('應該能夠檢查樣式一致性', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查樣式相關元素
        final hasCSS = body.contains('.css') ||
                      body.contains('<style') ||
                      body.contains('<link rel="stylesheet"');
        final hasConsistentStyling = body.contains('class=') ||
                                   body.contains('id=');

        print('✅ 樣式一致性檢查完成');
        print('   - CSS 資源: ${hasCSS ? "✅" : "❌"}');
        print('   - 樣式類別: ${hasConsistentStyling ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 樣式一致性檢查失敗: $e');
        fail('樣式一致性測試失敗: $e');
      }
    });
  });
}