import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  group('AgoraMarket 真實業務功能測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    group('用戶認證測試', () {
      test('應該能夠檢測登入表單', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查登入相關元素
        final hasLoginForm = body.contains('login') ||
            body.contains('signin') ||
            body.contains('登入');
        final hasEmailInput = body.contains('email') ||
            body.contains('username') ||
            body.contains('郵箱') ||
            body.contains('用戶名');
        final hasPasswordInput =
            body.contains('password') || body.contains('密碼');
        final hasSubmitButton = body.contains('submit') ||
            body.contains('登入') ||
            body.contains('login');

        print('✅ 登入表單: ${hasLoginForm ? "存在" : "缺失"}');
        print('✅ 郵箱/用戶名輸入: ${hasEmailInput ? "存在" : "缺失"}');
        print('✅ 密碼輸入: ${hasPasswordInput ? "存在" : "缺失"}');
        print('✅ 提交按鈕: ${hasSubmitButton ? "存在" : "缺失"}');

        // 如果網站有登入功能，應該有這些元素
        if (hasLoginForm) {
          expect(hasEmailInput, isTrue);
          expect(hasPasswordInput, isTrue);
          expect(hasSubmitButton, isTrue);
        }
      });

      test('應該能夠檢測註冊表單', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查註冊相關元素
        final hasRegisterForm = body.contains('register') ||
            body.contains('signup') ||
            body.contains('註冊');
        final hasRegisterLink = body.contains('register') ||
            body.contains('signup') ||
            body.contains('註冊');

        print('✅ 註冊表單: ${hasRegisterForm ? "存在" : "缺失"}');
        print('✅ 註冊鏈接: ${hasRegisterLink ? "存在" : "缺失"}');

        // 檢查註冊功能
        if (hasRegisterLink) {
          print('✅ 檢測到註冊功能');
        } else {
          print('⚠️ 未檢測到註冊功能，可能是簡單的展示網站');
        }
      });
    });

    group('產品管理測試', () {
      test('應該能夠檢測產品列表', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查產品相關元素
        final hasProductList = body.contains('product') ||
            body.contains('商品') ||
            body.contains('item');
        final hasProductGrid = body.contains('grid') ||
            body.contains('list') ||
            body.contains('card');
        final hasProductImage = body.contains('img') ||
            body.contains('image') ||
            body.contains('圖片');

        print('✅ 產品列表: ${hasProductList ? "存在" : "缺失"}');
        print('✅ 產品網格: ${hasProductGrid ? "存在" : "缺失"}');
        print('✅ 產品圖片: ${hasProductImage ? "存在" : "缺失"}');

        // 檢查產品展示功能
        if (hasProductList || hasProductGrid) {
          print('✅ 檢測到產品展示功能');
        } else {
          print('⚠️ 未檢測到產品展示，可能是簡單的展示網站');
        }
      });

      test('應該能夠檢測產品搜索', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查搜索相關元素
        final hasSearchBox = body.contains('search') ||
            body.contains('搜索') ||
            body.contains('查詢');
        final hasSearchInput = body.contains('input') &&
            (body.contains('search') || body.contains('搜索'));
        final hasSearchButton = body.contains('button') &&
            (body.contains('search') || body.contains('搜索'));

        print('✅ 搜索框: ${hasSearchBox ? "存在" : "缺失"}');
        print('✅ 搜索輸入: ${hasSearchInput ? "存在" : "缺失"}');
        print('✅ 搜索按鈕: ${hasSearchButton ? "存在" : "缺失"}');

        // 檢查搜索功能
        if (hasSearchBox || hasSearchInput) {
          print('✅ 檢測到搜索功能');
        } else {
          print('⚠️ 未檢測到搜索功能，可能是簡單的展示網站');
        }
      });

      test('應該能夠檢測產品分類', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查分類相關元素
        final hasCategories = body.contains('category') ||
            body.contains('分類') ||
            body.contains('類別');
        final hasFilter = body.contains('filter') ||
            body.contains('篩選') ||
            body.contains('過濾');
        final hasSort = body.contains('sort') || body.contains('排序');

        print('✅ 產品分類: ${hasCategories ? "存在" : "缺失"}');
        print('✅ 產品篩選: ${hasFilter ? "存在" : "缺失"}');
        print('✅ 產品排序: ${hasSort ? "存在" : "缺失"}');

        // 檢查分類功能
        if (hasCategories || hasFilter) {
          print('✅ 檢測到分類功能');
        } else {
          print('⚠️ 未檢測到分類功能，可能是簡單的展示網站');
        }
      });
    });

    group('購物車測試', () {
      test('應該能夠檢測購物車功能', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查購物車相關元素
        final hasCart = body.contains('cart') ||
            body.contains('購物車') ||
            body.contains('shopping');
        final hasAddToCart = body.contains('add to cart') ||
            body.contains('加入購物車') ||
            body.contains('addtocart');
        final hasCartIcon = body.contains('cart') ||
            body.contains('購物車') ||
            body.contains('shopping-cart');

        print('✅ 購物車功能: ${hasCart ? "存在" : "缺失"}');
        print('✅ 加入購物車: ${hasAddToCart ? "存在" : "缺失"}');
        print('✅ 購物車圖標: ${hasCartIcon ? "存在" : "缺失"}');

        // 檢查購物車功能
        if (hasCart || hasCartIcon) {
          print('✅ 檢測到購物車功能');
        } else {
          print('⚠️ 未檢測到購物車功能，可能是簡單的展示網站');
        }
      });

      test('應該能夠檢測購物車狀態', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查購物車狀態顯示
        final hasCartCount = body.contains('cart') &&
            (body.contains('count') ||
                body.contains('數量') ||
                body.contains('0'));
        final hasCartTotal = body.contains('total') ||
            body.contains('總計') ||
            body.contains('sum');
        final hasCheckout = body.contains('checkout') ||
            body.contains('結帳') ||
            body.contains('結賬');

        print('✅ 購物車數量: ${hasCartCount ? "存在" : "缺失"}');
        print('✅ 購物車總計: ${hasCartTotal ? "存在" : "缺失"}');
        print('✅ 結帳功能: ${hasCheckout ? "存在" : "缺失"}');

        // 檢查結帳功能
        if (hasCheckout) {
          print('✅ 檢測到結帳功能');
        } else {
          print('⚠️ 未檢測到結帳功能，可能是簡單的展示網站');
        }
      });
    });

    group('用戶體驗測試', () {
      test('應該能夠檢測響應式設計', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查響應式設計元素
        final hasViewport = body.contains('viewport');
        final hasMediaQueries = body.contains('@media');
        final hasMobileOptimized = body.contains('mobile') ||
            body.contains('responsive') ||
            body.contains('適配');

        print('✅ Viewport 設置: ${hasViewport ? "存在" : "缺失"}');
        print('✅ 媒體查詢: ${hasMediaQueries ? "存在" : "缺失"}');
        print('✅ 移動端優化: ${hasMobileOptimized ? "存在" : "缺失"}');

        // 現代網站應該有響應式設計
        expect(hasViewport, isTrue);
      });

      test('應該能夠檢測無障礙功能', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查無障礙相關元素
        final hasAltText = body.contains('alt=');
        final hasAriaLabels =
            body.contains('aria-label') || body.contains('aria-labelledby');
        final hasSemanticHTML = body.contains('<nav') ||
            body.contains('<main') ||
            body.contains('<section');

        print('✅ 圖片替代文字: ${hasAltText ? "存在" : "缺失"}');
        print('✅ ARIA 標籤: ${hasAriaLabels ? "存在" : "缺失"}');
        print('✅ 語義化 HTML: ${hasSemanticHTML ? "存在" : "缺失"}');

        // 檢查無障礙功能
        if (hasAltText || hasAriaLabels) {
          print('✅ 檢測到無障礙功能');
        } else {
          print('⚠️ 未檢測到無障礙功能，建議改進');
        }
      });

      test('應該能夠檢測加載狀態', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查加載相關元素
        final hasLoading = body.contains('loading') ||
            body.contains('加載') ||
            body.contains('spinner');
        final hasSkeleton = body.contains('skeleton') || body.contains('骨架屏');
        final hasProgress = body.contains('progress') || body.contains('進度');

        print('✅ 加載狀態: ${hasLoading ? "存在" : "缺失"}');
        print('✅ 骨架屏: ${hasSkeleton ? "存在" : "缺失"}');
        print('✅ 進度指示: ${hasProgress ? "存在" : "缺失"}');

        // 現代網站應該有加載狀態處理
        expect(hasLoading || hasSkeleton, isTrue);
      });
    });

    group('性能優化測試', () {
      test('應該能夠檢測資源優化', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查資源優化元素
        final hasLazyLoading =
            body.contains('lazy') || body.contains('loading="lazy"');
        final hasImageOptimization = body.contains('webp') ||
            body.contains('avif') ||
            body.contains('optimize');
        final hasMinification =
            body.contains('.min.') || body.contains('minified');

        print('✅ 懶加載: ${hasLazyLoading ? "存在" : "缺失"}');
        print('✅ 圖片優化: ${hasImageOptimization ? "存在" : "缺失"}');
        print('✅ 代碼壓縮: ${hasMinification ? "存在" : "缺失"}');

        // 現代網站應該有基本的性能優化
        expect(hasLazyLoading || hasImageOptimization, isTrue);
      });

      test('應該能夠檢測 CDN 使用', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final headers = response.headers;

        // 檢查 CDN 相關頭部
        final hasCDN = headers.containsKey('x-cdn') ||
            headers.containsKey('cf-ray') ||
            headers.containsKey('x-fastly') ||
            headers.containsKey('x-amz-cf-id');

        print('✅ CDN 使用: ${hasCDN ? "存在" : "缺失"}');

        if (hasCDN) {
          final cdnHeaders = headers.entries
              .where((e) =>
                  e.key.toLowerCase().contains('cdn') ||
                  e.key.toLowerCase().contains('cf') ||
                  e.key.toLowerCase().contains('fastly') ||
                  e.key.toLowerCase().contains('amz'))
              .map((e) => '${e.key}: ${e.value}')
              .join(', ');
          print('✅ CDN 頭部: $cdnHeaders');
        }

        // 生產環境網站應該使用 CDN
        expect(hasCDN, isTrue);
      });
    });

    group('SEO 優化測試', () {
      test('應該能夠檢測 SEO 元素', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查 SEO 相關元素
        final hasMetaDescription = body.contains('meta name="description"');
        final hasMetaKeywords = body.contains('meta name="keywords"');
        final hasOpenGraph =
            body.contains('og:') || body.contains('property="og:');
        final hasStructuredData =
            body.contains('schema.org') || body.contains('application/ld+json');

        print('✅ Meta Description: ${hasMetaDescription ? "存在" : "缺失"}');
        print('✅ Meta Keywords: ${hasMetaKeywords ? "存在" : "缺失"}');
        print('✅ Open Graph: ${hasOpenGraph ? "存在" : "缺失"}');
        print('✅ 結構化數據: ${hasStructuredData ? "存在" : "缺失"}');

        // 現代網站應該有基本的 SEO 優化
        expect(hasMetaDescription || hasOpenGraph, isTrue);
      });

      test('應該能夠檢測網站地圖', () async {
        final response = await http.get(Uri.parse(baseUrl));
        final body = response.body.toLowerCase();

        // 檢查網站地圖相關元素
        final hasSitemap = body.contains('sitemap') || body.contains('網站地圖');
        final hasRobots =
            body.contains('robots.txt') || body.contains('robots');

        print('✅ 網站地圖: ${hasSitemap ? "存在" : "缺失"}');
        print('✅ Robots 文件: ${hasRobots ? "存在" : "缺失"}');

        // 電商網站應該有網站地圖
        expect(hasSitemap, isTrue);
      });
    });
  });
}
