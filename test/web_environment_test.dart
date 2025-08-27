import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  group('Web 環境測試', () {
    test('應該能夠訪問 AgoraMarket 測試環境', () async {
      try {
        final response =
            await http.get(Uri.parse('https://redandan.github.io/'));
        print('✅ HTTP 狀態碼: ${response.statusCode}');
        print('✅ 響應內容長度: ${response.body.length}');
        print('✅ 響應頭: ${response.headers}');

        expect(response.statusCode, 200);
        expect(response.body, isNotEmpty);

        // 檢查是否包含 AgoraMarket 相關內容
        final body = response.body.toLowerCase();
        expect(body.contains('agora') || body.contains('market'), isTrue);
      } catch (e) {
        print('❌ 訪問失敗: $e');
        fail('無法訪問 AgoraMarket 測試環境: $e');
      }
    });

    test('應該能夠解析網站內容', () async {
      try {
        final response =
            await http.get(Uri.parse('https://redandan.github.io/'));
        final body = response.body;

        // 檢查基本的 HTML 結構
        expect(body.contains('<html'), isTrue);
        expect(body.contains('<head'), isTrue);
        expect(body.contains('<body'), isTrue);

        print('✅ HTML 結構驗證通過');

        // 檢查是否有 JavaScript 代碼
        expect(body.contains('<script'), isTrue);

        print('✅ JavaScript 代碼檢測到');
      } catch (e) {
        print('❌ 內容解析失敗: $e');
        fail('無法解析網站內容: $e');
      }
    });
  });
}
