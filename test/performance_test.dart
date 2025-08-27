import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  group('性能測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    test('應該能夠測試頁面加載性能', () async {
      final List<int> responseTimes = [];

      // 進行多次請求測試平均性能
      for (int i = 0; i < 5; i++) {
        final stopwatch = Stopwatch()..start();
        final response = await http.get(Uri.parse(baseUrl));
        stopwatch.stop();

        expect(response.statusCode, 200);
        responseTimes.add(stopwatch.elapsedMilliseconds);
      }

      final avgResponseTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
      final minTime = responseTimes.reduce((a, b) => a < b ? a : b);
      final maxTime = responseTimes.reduce((a, b) => a > b ? a : b);

      print('✅ 頁面加載性能測試完成');
      print('   - 平均響應時間: ${avgResponseTime.toStringAsFixed(2)}ms');
      print('   - 最快響應時間: ${minTime}ms');
      print('   - 最慢響應時間: ${maxTime}ms');
      print('   - 性能評級: ${avgResponseTime < 100 ? '🚀 優秀' : avgResponseTime < 300 ? '✅ 良好' : '⚠️ 一般'}');

      expect(avgResponseTime, lessThan(1000)); // 平均1秒內
    });

    test('應該能夠測試資源大小', () async {
      final response = await http.get(Uri.parse(baseUrl));

      final contentLength = response.body.length;
      final contentSizeKB = contentLength / 1024;

      print('✅ 資源大小測試完成');
      print('   - 響應大小: ${contentSizeKB.toStringAsFixed(2)} KB');
      print('   - 字符數: $contentLength');
      print('   - 大小評級: ${contentSizeKB < 50 ? '🚀 優秀' : contentSizeKB < 200 ? '✅ 良好' : '⚠️ 一般'}');

      expect(response.statusCode, 200);
      expect(contentLength, greaterThan(0));
    });

    test('應該能夠測試緩存效果', () async {
      // 第一次請求
      final stopwatch1 = Stopwatch()..start();
      final response1 = await http.get(Uri.parse(baseUrl));
      stopwatch1.stop();

      // 第二次請求（應該從緩存加載）
      final stopwatch2 = Stopwatch()..start();
      final response2 = await http.get(Uri.parse(baseUrl));
      stopwatch2.stop();

      final firstTime = stopwatch1.elapsedMilliseconds;
      final secondTime = stopwatch2.elapsedMilliseconds;
      final cacheImprovement = ((firstTime - secondTime) / firstTime * 100);

      print('✅ 緩存效果測試完成');
      print('   - 首次加載: ${firstTime}ms');
      print('   - 二次加載: ${secondTime}ms');
      print('   - 緩存改善: ${cacheImprovement.toStringAsFixed(1)}%');

      expect(response1.statusCode, 200);
      expect(response2.statusCode, 200);
    });

    test('應該能夠測試並發請求性能', () async {
      final stopwatch = Stopwatch()..start();

      // 同時發送多個請求
      final responses = await Future.wait([
        http.get(Uri.parse(baseUrl)),
        http.get(Uri.parse('$baseUrl?test=1')),
        http.get(Uri.parse('$baseUrl?test=2')),
      ]);

      stopwatch.stop();

      final totalTime = stopwatch.elapsedMilliseconds;
      final avgTime = totalTime / responses.length;

      print('✅ 並發請求性能測試完成');
      print('   - 總耗時: ${totalTime}ms');
      print('   - 平均耗時: ${avgTime.toStringAsFixed(2)}ms');
      print('   - 請求數量: ${responses.length}');

      // 驗證所有請求都成功
      for (final response in responses) {
        expect(response.statusCode, 200);
      }
    });
  });
}