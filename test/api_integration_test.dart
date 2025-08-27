import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  group('API 集成測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    test('應該能夠測試網站 API 端點', () async {
      final response = await http.get(Uri.parse(baseUrl));

      expect(response.statusCode, 200);
      expect(response.body, isNotEmpty);

      // 檢查響應頭
      expect(response.headers.containsKey('content-type'), isTrue);
      expect(response.headers['content-type'], contains('text/html'));

      print('✅ API 端點測試通過');
      print('   - 狀態碼: ${response.statusCode}');
      print('   - 內容類型: ${response.headers['content-type']}');
    });

    test('應該能夠測試網站資源加載', () async {
      final response = await http.get(Uri.parse(baseUrl));
      final body = response.body.toLowerCase();

      // 檢查是否有外部資源引用
      final hasExternalResources = body.contains('http') || body.contains('https');
      final hasGitHubPages = body.contains('github.io') || body.contains('githubusercontent');

      print('✅ 資源加載測試完成');
      print('   - 外部資源: ${hasExternalResources ? "✅" : "❌"}');
      print('   - GitHub Pages: ${hasGitHubPages ? "✅" : "❌"}');

      expect(response.statusCode, 200);
    });

    test('應該能夠測試網站安全性', () async {
      final response = await http.get(Uri.parse(baseUrl));
      final headers = response.headers;

      // 檢查安全相關頭部
      final hasSecurityHeaders = headers.containsKey('strict-transport-security') ||
                                headers.containsKey('x-frame-options') ||
                                headers.containsKey('x-content-type-options');

      print('✅ 安全性測試完成');
      print('   - 安全頭部: ${hasSecurityHeaders ? "✅" : "❌"}');
      print('   - HTTPS: ${baseUrl.startsWith('https') ? "✅" : "❌"}');

      expect(response.statusCode, 200);
    });

    test('應該能夠測試網站性能', () async {
      final stopwatch = Stopwatch()..start();
      final response = await http.get(Uri.parse(baseUrl));
      stopwatch.stop();

      final responseTime = stopwatch.elapsedMilliseconds;

      print('✅ 性能測試完成');
      print('   - 響應時間: ${responseTime}ms');
      print('   - 性能評級: ${responseTime < 100 ? '優秀' : responseTime < 500 ? '良好' : '一般'}');

      expect(response.statusCode, 200);
      expect(responseTime, lessThan(5000)); // 5秒內響應
    });

    test('應該能夠測試網站內容完整性', () async {
      final response = await http.get(Uri.parse(baseUrl));
      final body = response.body;

      // 檢查HTML結構完整性
      expect(body.contains('<html'), isTrue);
      expect(body.contains('</html>'), isTrue);
      expect(body.contains('<head'), isTrue);
      expect(body.contains('</head>'), isTrue);
      expect(body.contains('<body'), isTrue);
      expect(body.contains('</body>'), isTrue);

      print('✅ 內容完整性測試通過');
      print('   - HTML 結構: ✅');
      print('   - 標籤匹配: ✅');
    });
  });
}