import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  group('基礎單元測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    test('應該能夠訪問網站', () async {
      final response = await http.get(Uri.parse(baseUrl));

      expect(response.statusCode, 200);
      expect(response.body, isNotEmpty);
      expect(response.body.length, greaterThan(0));

      print('✅ 網站訪問測試通過');
      print('   - 狀態碼: ${response.statusCode}');
      print('   - 響應大小: ${response.body.length} 字符');
    });

    test('應該能夠檢查網站內容類型', () async {
      final response = await http.get(Uri.parse(baseUrl));

      expect(response.statusCode, 200);
      expect(response.headers['content-type'], contains('text/html'));

      print('✅ 內容類型檢查通過');
      print('   - Content-Type: ${response.headers['content-type']}');
    });

    test('應該能夠檢查網站標題', () async {
      final response = await http.get(Uri.parse(baseUrl));
      final body = response.body;

      // 檢查是否有標題標籤
      expect(body, contains('<title>'));
      expect(body, contains('</title>'));

      // 提取標題內容
      final titleMatch = RegExp(r'<title[^>]*>([^<]+)</title>', caseSensitive: false)
          .firstMatch(body);

      if (titleMatch != null) {
        final title = titleMatch.group(1)?.trim();
        expect(title, isNotEmpty);
        print('✅ 網站標題檢查通過');
        print('   - 標題: $title');
      } else {
        print('⚠️ 未找到網站標題');
      }
    });

    test('應該能夠檢查網站基本結構', () async {
      final response = await http.get(Uri.parse(baseUrl));
      final body = response.body.toLowerCase();

      // 檢查基本 HTML 結構
      expect(body, contains('<html'));
      expect(body, contains('<head'));
      expect(body, contains('<body'));

      print('✅ 網站結構檢查通過');
      print('   - HTML 標籤: ✅');
      print('   - HEAD 標籤: ✅');
      print('   - BODY 標籤: ✅');
    });

    test('應該能夠檢查網站資源', () async {
      final response = await http.get(Uri.parse(baseUrl));
      final body = response.body.toLowerCase();

      // 檢查是否有基本的資源引用
      final hasCSS = body.contains('.css') || body.contains('<style');
      final hasJS = body.contains('.js') || body.contains('<script');
      final hasImages = body.contains('.png') ||
                       body.contains('.jpg') ||
                       body.contains('.svg') ||
                       body.contains('<img');

      print('✅ 網站資源檢查完成');
      print('   - CSS 資源: ${hasCSS ? "✅" : "❌"}');
      print('   - JavaScript 資源: ${hasJS ? "✅" : "❌"}');
      print('   - 圖片資源: ${hasImages ? "✅" : "❌"}');

      // 現代網站至少應該有 JavaScript
      expect(hasJS, isTrue, reason: '現代網站應該包含 JavaScript');
    });
  });
}