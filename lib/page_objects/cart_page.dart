import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'base_page.dart';
import '../core/constants/test_keys.dart';

/// 購物車頁面物件
class CartPage extends BasePage {
  CartPage(super.tester);

  /// 導航到購物車 (模擬實現)
  Future<void> navigateToCart() async {
    // 創建購物車頁面
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          appBar: AppBar(title: Text('購物車')),
          body: Column(
            children: [
              Text('購物車頁面', key: Key(TestKeys.cartPage)),
              Expanded(
                child: ListView(
                  key: Key(TestKeys.cartList),
                  children: [
                    ListTile(
                      key: Key(TestKeys.cartItem),
                      title: Text('商品1'),
                      subtitle: Text('數量: 1'),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                key: Key(TestKeys.checkoutButton),
                onPressed: () {},
                child: Text('結帳'),
              ),
            ],
          ),
        ),
      ),
    );

    await waitForElement(TestKeys.cartPage);
    await takeScreenshot('cart_page_opened');
  }

  /// 檢查購物車是否有商品
  Future<bool> hasItems() async {
    await waitForElement(TestKeys.cartPage);
    return await isElementPresent(TestKeys.cartList);
  }

  /// 進行結帳
  Future<void> proceedToCheckout() async {
    await waitForElement(TestKeys.checkoutButton);
    await tapElement(TestKeys.checkoutButton);
    await waitForPageLoad();
    await takeScreenshot('checkout_initiated');
  }

  /// 清空購物車
  Future<void> clearCart() async {
    if (await isElementPresent('clear_cart_button')) {
      await tapElement('clear_cart_button');
      await waitForPageLoad();
      await takeScreenshot('cart_cleared');
    }
  }

  /// 驗證購物車為空
  Future<bool> isEmpty() async {
    return !await hasItems();
  }
}
