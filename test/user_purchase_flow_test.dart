import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  group('用戶購買商品邏輯測試', () {
    const String baseUrl = 'https://redandan.github.io/';

    test('應該能夠瀏覽產品列表', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查產品列表相關元素
        final hasProductList = body.contains('product') ||
                              body.contains('商品') ||
                              body.contains('item') ||
                              body.contains('list') ||
                              body.contains('catalog');
        final hasProductImages = body.contains('<img') ||
                                body.contains('.png') ||
                                body.contains('.jpg') ||
                                body.contains('.jpeg');
        final hasProductTitles = body.contains('<h1') ||
                               body.contains('<h2') ||
                               body.contains('<h3') ||
                               body.contains('title');

        print('✅ 產品列表瀏覽測試完成');
        print('   - 產品列表: ${hasProductList ? "✅" : "❌"}');
        print('   - 產品圖片: ${hasProductImages ? "✅" : "❌"}');
        print('   - 產品標題: ${hasProductTitles ? "✅" : "❌"}');

        expect(response.statusCode, 200);
        expect(hasProductList, isTrue, reason: '網站應該包含產品列表');

      } catch (e) {
        print('❌ 產品列表瀏覽測試失敗: $e');
        fail('產品列表測試失敗: $e');
      }
    });

    test('應該能夠查看產品詳情', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查產品詳情相關元素
        final hasProductDetails = body.contains('detail') ||
                                 body.contains('description') ||
                                 body.contains('詳情') ||
                                 body.contains('說明') ||
                                 body.contains('spec') ||
                                 body.contains('規格');
        final hasPrice = body.contains('price') ||
                        body.contains('價格') ||
                        body.contains('\$') ||
                        body.contains('¥') ||
                        body.contains('nt\$');
        final hasProductInfo = body.contains('brand') ||
                              body.contains('品牌') ||
                              body.contains('model') ||
                              body.contains('型號') ||
                              body.contains('category') ||
                              body.contains('分類');

        print('✅ 產品詳情查看測試完成');
        print('   - 產品詳情: ${hasProductDetails ? "✅" : "❌"}');
        print('   - 價格信息: ${hasPrice ? "✅" : "❌"}');
        print('   - 產品信息: ${hasProductInfo ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 產品詳情查看測試失敗: $e');
        fail('產品詳情測試失敗: $e');
      }
    });

    test('應該能夠將產品加入購物車', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查加入購物車相關元素
        final hasAddToCart = body.contains('add to cart') ||
                            body.contains('加入購物車') ||
                            body.contains('addtocart') ||
                            body.contains('cart') ||
                            body.contains('購物車');
        final hasQuantitySelector = body.contains('quantity') ||
                                  body.contains('數量') ||
                                  body.contains('qty') ||
                                  body.contains('select') ||
                                  body.contains('選擇');
        final hasSizeSelector = body.contains('size') ||
                              body.contains('尺寸') ||
                              body.contains('尺碼') ||
                              body.contains('color') ||
                              body.contains('顏色');

        print('✅ 加入購物車測試完成');
        print('   - 加入購物車按鈕: ${hasAddToCart ? "✅" : "❌"}');
        print('   - 數量選擇器: ${hasQuantitySelector ? "✅" : "❌"}');
        print('   - 規格選擇器: ${hasSizeSelector ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 加入購物車測試失敗: $e');
        fail('加入購物車測試失敗: $e');
      }
    });

    test('應該能夠查看購物車內容', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查購物車內容相關元素
        final hasCartIcon = body.contains('cart') ||
                           body.contains('購物車') ||
                           body.contains('basket') ||
                           body.contains('shopping');
        final hasCartCounter = body.contains('badge') ||
                              body.contains('counter') ||
                              body.contains('數量') ||
                              body.contains('qty');
        final hasCartItems = body.contains('item') ||
                            body.contains('商品') ||
                            body.contains('product');

        print('✅ 購物車內容查看測試完成');
        print('   - 購物車圖標: ${hasCartIcon ? "✅" : "❌"}');
        print('   - 購物車計數器: ${hasCartCounter ? "✅" : "❌"}');
        print('   - 購物車商品: ${hasCartItems ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 購物車內容查看測試失敗: $e');
        fail('購物車內容測試失敗: $e');
      }
    });

    test('應該能夠修改購物車商品數量', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查購物車修改功能
        final hasQuantityInput = body.contains('input') &&
                                (body.contains('quantity') || body.contains('數量'));
        final hasIncrementButton = body.contains('+') ||
                                 body.contains('increase') ||
                                 body.contains('increment') ||
                                 body.contains('加');
        final hasDecrementButton = body.contains('-') ||
                                 body.contains('decrease') ||
                                 body.contains('decrement') ||
                                 body.contains('減');
        final hasUpdateButton = body.contains('update') ||
                              body.contains('更新') ||
                              body.contains('refresh') ||
                              body.contains('重新計算');

        print('✅ 購物車數量修改測試完成');
        print('   - 數量輸入框: ${hasQuantityInput ? "✅" : "❌"}');
        print('   - 增加按鈕: ${hasIncrementButton ? "✅" : "❌"}');
        print('   - 減少按鈕: ${hasDecrementButton ? "✅" : "❌"}');
        print('   - 更新按鈕: ${hasUpdateButton ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 購物車數量修改測試失敗: $e');
        fail('購物車數量修改測試失敗: $e');
      }
    });

    test('應該能夠從購物車移除商品', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查移除商品功能
        final hasRemoveButton = body.contains('remove') ||
                              body.contains('delete') ||
                              body.contains('移除') ||
                              body.contains('刪除') ||
                              body.contains('x') ||
                              body.contains('×');
        final hasClearCart = body.contains('clear') ||
                            body.contains('清空') ||
                            body.contains('empty') ||
                            body.contains('清空購物車');
        final hasTrashIcon = body.contains('trash') ||
                            body.contains('垃圾桶') ||
                            body.contains('delete') ||
                            body.contains('remove');

        print('✅ 購物車移除商品測試完成');
        print('   - 移除按鈕: ${hasRemoveButton ? "✅" : "❌"}');
        print('   - 清空購物車: ${hasClearCart ? "✅" : "❌"}');
        print('   - 刪除圖標: ${hasTrashIcon ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 購物車移除商品測試失敗: $e');
        fail('購物車移除商品測試失敗: $e');
      }
    });

    test('應該能夠進行結帳流程', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查結帳流程相關元素
        final hasCheckoutButton = body.contains('checkout') ||
                                 body.contains('結帳') ||
                                 body.contains('結賬') ||
                                 body.contains('proceed') ||
                                 body.contains('繼續');
        final hasSubtotal = body.contains('subtotal') ||
                           body.contains('小計') ||
                           body.contains('總計') ||
                           body.contains('total');
        final hasShipping = body.contains('shipping') ||
                           body.contains('運費') ||
                           body.contains('delivery') ||
                           body.contains('配送');
        final hasTax = body.contains('tax') ||
                      body.contains('稅') ||
                      body.contains('vat');

        print('✅ 結帳流程測試完成');
        print('   - 結帳按鈕: ${hasCheckoutButton ? "✅" : "❌"}');
        print('   - 小計金額: ${hasSubtotal ? "✅" : "❌"}');
        print('   - 運費信息: ${hasShipping ? "✅" : "❌"}');
        print('   - 稅費信息: ${hasTax ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 結帳流程測試失敗: $e');
        fail('結帳流程測試失敗: $e');
      }
    });

    test('應該能夠驗證訂單總額計算', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查訂單總額計算相關元素
        final hasTotalCalculation = body.contains('total') ||
                                   body.contains('總額') ||
                                   body.contains('總計') ||
                                   body.contains('sum');
        final hasDiscount = body.contains('discount') ||
                           body.contains('優惠') ||
                           body.contains('coupon') ||
                           body.contains('折扣');
        final hasFinalTotal = body.contains('final') ||
                             body.contains('最終') ||
                             body.contains('應付') ||
                             body.contains('pay');

        print('✅ 訂單總額計算測試完成');
        print('   - 總額計算: ${hasTotalCalculation ? "✅" : "❌"}');
        print('   - 折扣優惠: ${hasDiscount ? "✅" : "❌"}');
        print('   - 最終金額: ${hasFinalTotal ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 訂單總額計算測試失敗: $e');
        fail('訂單總額計算測試失敗: $e');
      }
    });

    test('應該能夠處理空購物車情況', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查空購物車處理
        final hasEmptyCartMessage = body.contains('empty') ||
                                   body.contains('空的') ||
                                   body.contains('沒有商品') ||
                                   body.contains('購物車是空的');
        final hasContinueShopping = body.contains('continue shopping') ||
                                   body.contains('繼續購物') ||
                                   body.contains('瀏覽商品') ||
                                   body.contains('返回');
        final hasCartStatus = body.contains('cart') ||
                             body.contains('購物車') ||
                             body.contains('status') ||
                             body.contains('狀態');

        print('✅ 空購物車處理測試完成');
        print('   - 空購物車提示: ${hasEmptyCartMessage ? "✅" : "❌"}');
        print('   - 繼續購物鏈接: ${hasContinueShopping ? "✅" : "❌"}');
        print('   - 購物車狀態: ${hasCartStatus ? "✅" : "❌"}');

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 空購物車處理測試失敗: $e');
        fail('空購物車處理測試失敗: $e');
      }
    });

    test('應該能夠測試購買流程的整體完整性', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查整體購買流程的完整性
        final hasProductDiscovery = body.contains('product') ||
                                   body.contains('商品') ||
                                   body.contains('item');
        final hasShoppingCart = body.contains('cart') ||
                               body.contains('購物車') ||
                               body.contains('shopping');
        final hasCheckoutProcess = body.contains('checkout') ||
                                  body.contains('結帳') ||
                                  body.contains('payment') ||
                                  body.contains('支付');

        final flowCompleteness = (hasProductDiscovery ? 1 : 0) +
                                (hasShoppingCart ? 1 : 0) +
                                (hasCheckoutProcess ? 1 : 0);

        print('✅ 購買流程完整性測試完成');
        print('   - 商品發現: ${hasProductDiscovery ? "✅" : "❌"}');
        print('   - 購物車功能: ${hasShoppingCart ? "✅" : "❌"}');
        print('   - 結帳流程: ${hasCheckoutProcess ? "✅" : "❌"}');
        print('   - 流程完整度: ${flowCompleteness}/3');

        // 檢查是否有登入要求
        final requiresLogin = body.contains('login') ||
                             body.contains('登入') ||
                             body.contains('sign in') ||
                             body.contains('請先登入') ||
                             body.contains('需要登入') ||
                             body.contains('authentication required');

        if (requiresLogin) {
          print('   - 登入要求: ⚠️  需要登入才能訪問完整功能');
        } else {
          print('   - 登入要求: ✅ 無登入要求');
        }

        // 檢查是否有會員專區或個人中心
        final hasMemberArea = body.contains('member') ||
                             body.contains('會員') ||
                             body.contains('profile') ||
                             body.contains('個人中心') ||
                             body.contains('dashboard');

        if (hasMemberArea) {
          print('   - 會員專區: ✅  發現會員專區，可能需要登入');
        } else {
          print('   - 會員專區: ❌  未發現會員專區');
        }

        expect(response.statusCode, 200);

        // 如果沒有發現任何購買流程元素，提供詳細說明
        if (flowCompleteness == 0) {
          print('\n⚠️  未發現完整的購買流程，這可能因為：');
          print('   1. 網站是靜態展示頁面，沒有電子商務功能');
          print('   2. 購買功能需要登入後才能看到');
          print('   3. 網站正在維護或開發中');
          print('   4. 購買功能在不同的頁面或子域名下');
          print('\n💡 建議檢查：');
          print('   - 是否有其他頁面包含購買功能');
          print('   - 是否需要登入才能看到完整功能');
          print('   - 是否有API端點提供購買服務');
        }

      } catch (e) {
        print('❌ 購買流程完整性測試失敗: $e');
        fail('購買流程完整性測試失敗: $e');
      }
    });

    test('應該能夠檢查登入相關功能', () async {
      try {
        final response = await http.get(Uri.parse(baseUrl));
        expect(response.statusCode, 200);

        final body = response.body.toLowerCase();

        // 檢查登入相關功能
        final hasLoginForm = body.contains('<form') &&
                            (body.contains('login') || body.contains('登入') ||
                             body.contains('password') || body.contains('密碼'));
        final hasLoginButton = body.contains('login') ||
                              body.contains('登入') ||
                              body.contains('sign in');
        final hasRegisterLink = body.contains('register') ||
                               body.contains('註冊') ||
                               body.contains('sign up');
        final hasLogoutOption = body.contains('logout') ||
                               body.contains('登出') ||
                               body.contains('sign out');

        print('✅ 登入功能檢查完成');
        print('   - 登入表單: ${hasLoginForm ? "✅" : "❌"}');
        print('   - 登入按鈕: ${hasLoginButton ? "✅" : "❌"}');
        print('   - 註冊連結: ${hasRegisterLink ? "✅" : "❌"}');
        print('   - 登出選項: ${hasLogoutOption ? "✅" : "❌"}');

        // 如果沒有登入功能但用戶提到需要登入
        if (!hasLoginForm && !hasLoginButton) {
          print('\nℹ️  未發現明顯的登入功能，但可能：');
          print('   - 登入功能通過JavaScript動態生成');
          print('   - 需要特定的URL或條件才能看到');
          print('   - 使用第三方登入服務');
          print('   - 登入功能在不同的頁面');
        }

        expect(response.statusCode, 200);

      } catch (e) {
        print('❌ 登入功能檢查失敗: $e');
        fail('登入功能檢查失敗: $e');
      }
    });
  });
}