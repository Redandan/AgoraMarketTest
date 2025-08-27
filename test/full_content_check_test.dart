import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  test('檢查網站完整內容', () async {
    final response = await http.get(Uri.parse('https://redandan.github.io/'));
    expect(response.statusCode, 200);

    final body = response.body;
    print('=== 網站完整內容檢查 ===');
    print('狀態碼: ${response.statusCode}');
    print('內容類型: ${response.headers['content-type']}');
    print('內容長度: ${body.length} 字符');

    // 分行顯示內容，方便查看
    final lines = body.split('\n');
    print('\n=== 網站內容預覽（前50行）===');
    for (var i = 0; i < lines.length && i < 50; i++) {
      if (lines[i].trim().isNotEmpty) {
        print('${(i + 1).toString().padLeft(3)}: ${lines[i].trim()}');
      }
    }

    // 檢查是否有特定的結帳相關內容
    print('\n=== 檢查可能的結帳功能 ===');

    // 檢查是否有任何包含"結帳"、"支付"等的行
    final checkoutLines = lines.where((line) =>
        line.toLowerCase().contains('結帳') ||
        line.toLowerCase().contains('結賬') ||
        line.toLowerCase().contains('checkout') ||
        line.toLowerCase().contains('pay') ||
        line.toLowerCase().contains('支付') ||
        line.toLowerCase().contains('purchase') ||
        line.toLowerCase().contains('購買') ||
        line.toLowerCase().contains('cart') ||
        line.toLowerCase().contains('購物車') ||
        line.toLowerCase().contains('order') ||
        line.toLowerCase().contains('訂單')
    ).toList();

    if (checkoutLines.isNotEmpty) {
      print('找到可能的結帳相關內容:');
      for (final line in checkoutLines) {
        print('  ${line.trim()}');
      }
    } else {
      print('未找到任何結帳相關內容');
    }

    // 檢查網站標題和描述
    final titleMatch = RegExp(r'<title[^>]*>([^<]+)</title>', caseSensitive: false).firstMatch(body);
    if (titleMatch != null) {
      print('\n網站標題: ${titleMatch.group(1)}');
    }

    // 檢查是否有任何表單或交互元素
    final hasAnyForm = body.contains('<form') || body.contains('<input') || body.contains('<button');
    print('包含交互元素: ${hasAnyForm ? "是" : "否"}');

    // 檢查網站類型
    if (body.contains('GitHub Pages')) {
      print('網站類型: GitHub Pages 靜態網站');
    } else if (body.contains('WordPress') || body.contains('wp-')) {
      print('網站類型: WordPress 網站');
    } else if (body.contains('Shopify')) {
      print('網站類型: Shopify 電子商務網站');
    } else {
      print('網站類型: 其他靜態網站');
    }
  });
}