import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  test('檢查網站路由結構', () async {
    final baseUrl = 'https://redandan.github.io';
    print('=== 檢查網站路由結構 ===');

    // 測試不同的路由
    final routes = [
      '/',
      '/#/login',
      '/#/checkout',
      '/#/cart',
      '/#/products',
      '/#/profile',
      '/#/dashboard',
      '/login',
      '/checkout',
      '/cart',
      '/products'
    ];

    for (final route in routes) {
      final fullUrl = '$baseUrl$route';
      try {
        print('\n檢查路由: $fullUrl');
        final response = await http.get(Uri.parse(fullUrl));

        print('  狀態碼: ${response.statusCode}');
        print('  內容長度: ${response.body.length}');

        final body = response.body.toLowerCase();

        // 檢查是否有路由特定的內容
        final routeSpecificContent = getRouteSpecificContent(route, body);
        if (routeSpecificContent.isNotEmpty) {
          print('  ✅ 發現特定內容: $routeSpecificContent');
        } else {
          print('  ⚪ 無特定內容差異');
        }

        // 檢查是否有登入相關內容
        if (route.contains('login') || route.contains('auth')) {
          final hasLoginContent = body.contains('login') || body.contains('登入') ||
                                 body.contains('email') || body.contains('password');
          print('  🔐 登入內容: ${hasLoginContent ? "✅" : "❌"}');
        }

        // 檢查是否有結帳相關內容
        if (route.contains('checkout') || route.contains('cart')) {
          final hasCheckoutContent = body.contains('checkout') || body.contains('結帳') ||
                                    body.contains('cart') || body.contains('購物車');
          print('  🛒 結帳內容: ${hasCheckoutContent ? "✅" : "❌"}');
        }

      } catch (e) {
        print('  ❌ 請求失敗: $e');
      }
    }
  });

  test('檢查網站的實際功能頁面', () async {
    print('\n=== 檢查可能的實際功能頁面 ===');

    // 檢查是否有其他域名或子域名
    final possibleUrls = [
      'https://redandan.github.io/',
      'https://agoramarket.redandan.github.io/',
      'https://market.redandan.github.io/',
      'https://shop.redandan.github.io/',
      'https://ecommerce.redandan.github.io/'
    ];

    for (final url in possibleUrls) {
      try {
        print('\n檢查URL: $url');
        final response = await http.get(Uri.parse(url));

        if (response.statusCode == 200) {
          final body = response.body.toLowerCase();
          print('  ✅ 可訪問，長度: ${response.body.length}');

          // 檢查是否有電子商務功能
          final hasEcommerceFeatures = checkEcommerceFeatures(body);
          if (hasEcommerceFeatures.isNotEmpty) {
            print('  🛍️  發現電子商務功能: $hasEcommerceFeatures');
          }
        } else {
          print('  ❌ 不可訪問，狀態碼: ${response.statusCode}');
        }

      } catch (e) {
        print('  ❌ 連接失敗: $e');
      }
    }
  });
}

String getRouteSpecificContent(String route, String body) {
  final contentIndicators = <String>[];

  if (route.contains('login') && (body.contains('login') || body.contains('登入'))) {
    contentIndicators.add('登入功能');
  }

  if (route.contains('checkout') && (body.contains('checkout') || body.contains('結帳'))) {
    contentIndicators.add('結帳功能');
  }

  if (route.contains('cart') && (body.contains('cart') || body.contains('購物車'))) {
    contentIndicators.add('購物車功能');
  }

  if (route.contains('products') && (body.contains('product') || body.contains('商品'))) {
    contentIndicators.add('產品展示');
  }

  return contentIndicators.join(', ');
}

String checkEcommerceFeatures(String body) {
  final features = <String>[];

  if (body.contains('checkout') || body.contains('結帳')) {
    features.add('結帳功能');
  }

  if (body.contains('cart') || body.contains('購物車')) {
    features.add('購物車');
  }

  if (body.contains('login') || body.contains('登入')) {
    features.add('登入系統');
  }

  if (body.contains('product') || body.contains('商品')) {
    features.add('產品展示');
  }

  if (body.contains('price') || body.contains('價格')) {
    features.add('價格顯示');
  }

  if (body.contains('<form')) {
    features.add('表單功能');
  }

  return features.join(', ');
}