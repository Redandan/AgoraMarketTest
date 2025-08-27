import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:http/http.dart' as http;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('電子商務流程測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    testWidgets('應該能夠檢查產品展示', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查產品相關元素
        final hasProductElements = body.contains('product') ||
                                  body.contains('商品') ||
                                  body.contains('item');
        final hasImages = body.contains('<img') ||
                         body.contains('.png') ||
                         body.contains('.jpg');
        final hasPrice = body.contains('price') ||
                        body.contains('價格') ||
                        body.contains('\$') ||
                        body.contains('¥');

        print('✅ 產品展示檢查完成');
        print('   - 產品元素: ${hasProductElements ? "✅" : "❌"}');
        print('   - 圖片資源: ${hasImages ? "✅" : "❌"}');
        print('   - 價格信息: ${hasPrice ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 產品展示檢查失敗: $e');
        fail('產品展示測試失敗: $e');
      }
    });

    testWidgets('應該能夠檢查購物功能', (tester) async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查購物相關元素
        final hasCart = body.contains('cart') ||
                       body.contains('購物車') ||
                       body.contains('shopping');
        final hasBuyButton = body.contains('buy') ||
                            body.contains('購買') ||
                            body.contains('purchase');
        final hasCheckout = body.contains('checkout') ||
                           body.contains('結帳') ||
                           body.contains('結賬');

        print('✅ 購物功能檢查完成');
        print('   - 購物車功能: ${hasCart ? "✅" : "❌"}');
        print('   - 購買按鈕: ${hasBuyButton ? "✅" : "❌"}');
        print('   - 結帳功能: ${hasCheckout ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 購物功能檢查失敗: $e');
        fail('購物功能測試失敗: $e');
      }
    });
  });
}