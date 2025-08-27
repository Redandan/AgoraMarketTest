import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  test('檢查網站實際內容中的結帳相關元素', () async {
    final response = await http.get(Uri.parse('https://redandan.github.io/'));
    expect(response.statusCode, 200);

    final body = response.body;
    print('網站內容長度: ${body.length} 字符');

    // 檢查各種可能的結帳相關術語
    final checkoutTerms = [
      'checkout', '結帳', '結賬', 'check out',
      'pay', '支付', 'payment',
      'purchase', '購買', 'buy', '立即購買',
      'cart', '購物車', 'shopping cart',
      'order', '訂單', 'submit order',
      'proceed', '繼續', '下一步',
      'confirm', '確認', '確認訂單',
      'total', '總額', '總計',
      'price', '價格', '金額',
      'button', '按鈕', 'btn',
      'form', '表單',
      'input', '輸入',
      'submit', '提交'
    ];

    print('\n=== 結帳相關術語檢查 ===');
    for (final term in checkoutTerms) {
      final count = body.toLowerCase().split(term.toLowerCase()).length - 1;
      if (count > 0) {
        print('✅ 找到 "$term": $count 次');

        // 顯示包含該術語的上下文
        final regex = RegExp('$term', caseSensitive: false);
        final matches = regex.allMatches(body);
        for (final match in matches.take(2)) {
          final start = match.start - 50;
          final end = match.end + 50;
          final context = body.substring(start < 0 ? 0 : start, end > body.length ? body.length : end);
          print('   上下文: ...${context.replaceAll('\n', ' ')}...');
        }
      }
    }

    // 檢查HTML表單和按鈕
    print('\n=== HTML元素檢查 ===');
    final hasForm = body.contains('<form');
    final hasButton = body.contains('<button') || body.contains('type="submit"');
    final hasInput = body.contains('<input');

    print('表單元素: ${hasForm ? "✅" : "❌"}');
    print('按鈕元素: ${hasButton ? "✅" : "❌"}');
    print('輸入元素: ${hasInput ? "✅" : "❌"}');

    // 顯示所有按鈕和鏈接
    print('\n=== 按鈕和鏈接檢查 ===');
    final buttonRegex = RegExp(r'<button[^>]*>([^<]*)</button>', caseSensitive: false);
    final buttonMatches = buttonRegex.allMatches(body);
    for (final match in buttonMatches) {
      print('按鈕: ${match.group(1)}');
    }

    final linkRegex = RegExp(r'<a[^>]*>([^<]*)</a>', caseSensitive: false);
    final linkMatches = linkRegex.allMatches(body);
    for (final match in linkMatches.take(10)) {
      print('鏈接: ${match.group(1)}');
    }
  });
}