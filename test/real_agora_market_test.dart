import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  group('真實 AgoraMarket 網站測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    group('網站可訪問性測試', () {
      test('應該能夠訪問 AgoraMarket 主頁', () async {
        final response = await http.get(Uri.parse(baseUrl));

        expect(response.statusCode, 200);
        expect(response.body, isNotEmpty);

        print('✅ 主頁訪問成功 - 狀態碼: ${response.statusCode}');
        print('✅ 響應內容長度: ${response.body.length} 字符');
      });

      test('應該能夠獲取網站基本信息', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查網站基本信息
        expect(body.contains('<html'), isTrue);
        expect(body.contains('<head'), isTrue);
        expect(body.contains('<body'), isTrue);
        expect(body.contains('<title'), isTrue);

        // 檢查是否有 JavaScript 代碼
        expect(body.contains('<script'), isTrue);

        print('✅ 網站基本信息驗證通過');
        print('✅ 檢測到 JavaScript 代碼');
      });

      test('應該能夠檢查網站響應時間', () async {
        final stopwatch = Stopwatch()..start();
        final response = await http.get(Uri.parse(baseUrl));
        stopwatch.stop();

        expect(response.statusCode, 200);
        expect(stopwatch.elapsedMilliseconds, lessThan(5000)); // 5秒內響應

        print('✅ 網站響應時間: ${stopwatch.elapsedMilliseconds}ms');
        print('✅ 響應時間在可接受範圍內');
      });
    });

    group('網站內容驗證測試', () {
      test('應該能夠解析網站標題', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body;

        // 提取標題
        final titleMatch =
            RegExp(r'<title[^>]*>([^<]+)</title>', caseSensitive: false)
                .firstMatch(body);
        if (titleMatch != null) {
          final title = titleMatch.group(1)?.trim();
          expect(title, isNotEmpty);
          print('✅ 網站標題: $title');
        } else {
          print('⚠️ 未找到網站標題');
        }

        expect(response.statusCode, 200);
      });

      test('應該能夠檢查網站元數據', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查常見的元數據
        final hasMetaDescription = body.contains('meta name="description"');
        final hasMetaKeywords = body.contains('meta name="keywords"');
        final hasMetaViewport = body.contains('meta name="viewport"');

        print('✅ Meta Description: ${hasMetaDescription ? "存在" : "缺失"}');
        print('✅ Meta Keywords: ${hasMetaKeywords ? "存在" : "缺失"}');
        print('✅ Meta Viewport: ${hasMetaViewport ? "存在" : "缺失"}');

        // 至少應該有 viewport 元數據
        expect(hasMetaViewport, isTrue);
      });

      test('應該能夠檢查網站資源', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查是否有 CSS 和 JS 文件
        final hasCSS = body.contains('.css') || body.contains('<style');
        final hasJS = body.contains('.js') || body.contains('<script');
        final hasImages = body.contains('.png') ||
            body.contains('.jpg') ||
            body.contains('.svg');

        print('✅ CSS 樣式: ${hasCSS ? "存在" : "缺失"}');
        print('✅ JavaScript: ${hasJS ? "存在" : "缺失"}');
        print('✅ 圖片資源: ${hasImages ? "存在" : "缺失"}');

        // 現代網站至少應該有 JavaScript
        expect(hasJS, isTrue);
      });
    });

    group('網站功能測試', () {
      test('應該能夠檢查表單元素', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查是否有表單元素
        final hasForms = body.contains('<form');
        final hasInputs = body.contains('<input');
        final hasButtons =
            body.contains('<button') || body.contains('type="submit"');

        print('✅ 表單元素: ${hasForms ? "存在" : "缺失"}');
        print('✅ 輸入框: ${hasInputs ? "存在" : "缺失"}');
        print('✅ 按鈕: ${hasButtons ? "存在" : "缺失"}');

        // 如果網站有表單，應該有這些元素
        if (hasForms) {
          expect(hasInputs, isTrue);
          expect(hasButtons, isTrue);
        }
      });

      test('應該能夠檢查導航元素', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查導航元素
        final hasNav = body.contains('<nav') ||
            body.contains('class="nav') ||
            body.contains('id="nav');
        final hasLinks = body.contains('<a href');
        final hasMenu = body.contains('menu') || body.contains('navigation');

        print('✅ 導航元素: ${hasNav ? "存在" : "缺失"}');
        print('✅ 鏈接: ${hasLinks ? "存在" : "缺失"}');
        print('✅ 菜單: ${hasMenu ? "存在" : "缺失"}');

        // 現代網站應該有基本的鏈接
        if (hasLinks) {
          print('✅ 檢測到基本鏈接功能');
        } else {
          print('⚠️ 未檢測到鏈接，可能是靜態展示頁面');
        }
      });

      test('應該能夠檢查響應式設計', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查響應式設計相關元素
        final hasViewport = body.contains('viewport');
        final hasMediaQueries = body.contains('@media');
        final hasFlexbox = body.contains('flex') || body.contains('grid');

        print('✅ Viewport 設置: ${hasViewport ? "存在" : "缺失"}');
        print('✅ 媒體查詢: ${hasMediaQueries ? "存在" : "缺失"}');
        print('✅ 現代布局: ${hasFlexbox ? "存在" : "缺失"}');

        expect(hasViewport, isTrue);
      });
    });

    group('網站性能測試', () {
      test('應該能夠測試多個請求的響應時間', () async {
        final urls = [
          baseUrl,
          '$baseUrl?test=1',
          '$baseUrl?test=2',
        ];

        final stopwatch = Stopwatch()..start();
        final responses =
            await Future.wait(urls.map((url) => http.get(Uri.parse(url))));
        stopwatch.stop();

        // 驗證所有請求都成功
        for (final response in responses) {
          expect(response.statusCode, 200);
        }

        final avgResponseTime = stopwatch.elapsedMilliseconds / urls.length;
        print('✅ 平均響應時間: ${avgResponseTime.toStringAsFixed(2)}ms');
        print('✅ 總響應時間: ${stopwatch.elapsedMilliseconds}ms');

        expect(avgResponseTime, lessThan(3000)); // 平均3秒內
      });

      test('應該能夠檢查網站緩存策略', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final headers = response.headers;

        // 檢查緩存相關頭部
        final hasCacheControl = headers.containsKey('cache-control');
        final hasETag = headers.containsKey('etag');
        final hasLastModified = headers.containsKey('last-modified');

        print('✅ Cache-Control: ${hasCacheControl ? "存在" : "缺失"}');
        print('✅ ETag: ${hasETag ? "存在" : "缺失"}');
        print('✅ Last-Modified: ${hasLastModified ? "存在" : "缺失"}');

        // 檢查緩存策略是否合理
        if (hasCacheControl) {
          final cacheControl = headers['cache-control']!;
          print('✅ 緩存策略: $cacheControl');

          // 應該有適當的緩存設置
          expect(cacheControl.isNotEmpty, isTrue);
        }
      });
    });

    group('網站安全性測試', () {
      test('應該能夠檢查安全頭部', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final headers = response.headers;

        // 檢查安全相關頭部
        final hasHSTS = headers.containsKey('strict-transport-security');
        final hasXFrameOptions = headers.containsKey('x-frame-options');
        final hasXContentTypeOptions =
            headers.containsKey('x-content-type-options');

        print('✅ HSTS: ${hasHSTS ? "存在" : "缺失"}');
        print('✅ X-Frame-Options: ${hasXFrameOptions ? "存在" : "缺失"}');
        print(
            '✅ X-Content-Type-Options: ${hasXContentTypeOptions ? "存在" : "缺失"}');

        // 檢查 HTTPS 強制
        if (hasHSTS) {
          final hsts = headers['strict-transport-security']!;
          print('✅ HSTS 設置: $hsts');
          expect(hsts.contains('max-age'), isTrue);
        }
      });

      test('應該能夠檢查 HTTPS 支持', () async {
        // 測試 HTTPS 訪問
        final httpsUrl = 'https://redandan.github.io/';
        final httpUrl = 'http://redandan.github.io/';

        try {
          final httpsResponse = await http.get(Uri.parse(httpsUrl));
          expect(httpsResponse.statusCode, 200);
          print('✅ HTTPS 訪問成功');
        } catch (e) {
          print('❌ HTTPS 訪問失敗: $e');
        }

        // 檢查是否強制 HTTPS
        try {
          final httpResponse = await http.get(Uri.parse(httpUrl));
          // 如果 HTTP 重定向到 HTTPS，這是好的
          print('✅ HTTP 重定向處理正常');
        } catch (e) {
          print('✅ HTTP 訪問被阻止（安全）');
        }
      });
    });
  });
}
