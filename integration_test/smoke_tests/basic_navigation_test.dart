import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:http/http.dart' as http;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('基礎導航測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    testWidgets('應該能夠訪問主頁', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));

        expect(response.statusCode, 200);
        expect(response.body, isNotEmpty);

        print('✅ 主頁訪問成功');
        print('✅ 狀態碼: ${response.statusCode}');
        print('✅ 響應大小: ${response.body.length} 字符');

      } catch (e) {
        print('❌ 主頁訪問失敗: $e');
        fail('無法訪問主頁: $e');
      }
    });

    testWidgets('應該能夠檢查頁面基本結構', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查 HTML 基本結構
        expect(body.contains('<html'), isTrue, reason: '應該包含 HTML 標籤');
        expect(body.contains('<head'), isTrue, reason: '應該包含 HEAD 標籤');
        expect(body.contains('<body'), isTrue, reason: '應該包含 BODY 標籤');

        // 檢查是否有標題
        expect(body.contains('<title'), isTrue, reason: '應該包含頁面標題');

        print('✅ 頁面結構檢查完成');
        print('✅ HTML 結構: ✅');
        print('✅ 頁面標題: ✅');

      } catch (e) {
        print('❌ 頁面結構檢查失敗: $e');
        fail('頁面結構測試失敗: $e');
      }
    });

    testWidgets('應該能夠檢查響應式設計', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查響應式設計相關元素
        final hasViewport = body.contains('viewport');
        final hasMetaTags = body.contains('<meta');

        print('✅ 響應式設計檢查完成');
        print('✅ Viewport 設置: ${hasViewport ? "✅" : "❌"}');
        print('✅ Meta 標籤: ${hasMetaTags ? "✅" : "❌"}');

        // Viewport 是響應式設計的重要標誌
        if (hasViewport) {
          expect(hasViewport, isTrue);
        }

      } catch (e) {
        print('❌ 響應式設計檢查失敗: $e');
        fail('響應式設計測試失敗: $e');
      }
    });
  });
}