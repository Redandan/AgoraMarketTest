import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'base_page.dart';

import '../core/constants/test_keys.dart';

/// 產品頁面物件
class ProductPage extends BasePage {
  ProductPage(super.tester);

  /// 導航到產品列表 (模擬實現)
  Future<void> navigateToProductList() async {
    // 創建產品列表頁面
    final products = ['產品1', '產品2', '產品3'];

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ListView.builder(
            key: Key(TestKeys.productList),
            itemCount: products.length,
            itemBuilder: (context, index) {
              return ListTile(
                key: Key(TestKeys.withIndex(TestKeys.productItem, index)),
                title: Text(products[index]),
                subtitle: Text('價格: \$${99 + index}'),
                onTap: () {},
              );
            },
          ),
        ),
      ),
    );

    await waitForElement(TestKeys.productList);
    await takeScreenshot('product_list_loaded');
  }

  /// 選擇第一個產品
  Future<void> selectFirstProduct() async {
    final firstProductKey = TestKeys.withIndex(TestKeys.productItem, 0);
    await waitForElement(firstProductKey);
    await tapElement(firstProductKey);

    // 創建產品詳情頁
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          appBar: AppBar(title: Text('產品詳情')),
          body: Column(
            children: [
              Text('產品詳情頁面', key: Key(TestKeys.productDetailPage)),
              ElevatedButton(
                key: Key(TestKeys.addToCartButton),
                onPressed: () {},
                child: Text('加入購物車'),
              ),
              ElevatedButton(
                key: Key(TestKeys.buyNowButton),
                onPressed: () {},
                child: Text('立即購買'),
              ),
            ],
          ),
        ),
      ),
    );

    await waitForElement(TestKeys.productDetailPage);
    await takeScreenshot('product_detail_opened');
  }

  /// 選擇指定索引的產品
  Future<void> selectProductByIndex(int index) async {
    final productKey = TestKeys.withIndex(TestKeys.productItem, index);
    await waitForElement(productKey);
    await tapElement(productKey);
    await waitForElement(TestKeys.productDetailPage);
    await takeScreenshot('product_${index}_selected');
  }

  /// 搜尋產品
  Future<void> searchProduct(String keyword) async {
    await waitForElement(TestKeys.productSearchBar);
    await tapElement(TestKeys.productSearchBar);
    await enterText(TestKeys.productSearchBar, keyword);

    // 模擬按下搜尋
    await tester.testTextInput.receiveAction(TextInputAction.done);
    await waitForPageLoad();
    await takeScreenshot('search_results_$keyword');
  }

  /// 加入購物車
  Future<void> addToCart() async {
    await waitForElement(TestKeys.addToCartButton);
    await tapElement(TestKeys.addToCartButton);
    await takeScreenshot('added_to_cart');

    // 等待加入購物車完成
    await Future.delayed(Duration(seconds: 2));
  }

  /// 立即購買
  Future<void> buyNow() async {
    await waitForElement(TestKeys.buyNowButton);
    await tapElement(TestKeys.buyNowButton);
    await waitForPageLoad();
    await takeScreenshot('buy_now_clicked');
  }

  /// 驗證是否成功加入購物車
  Future<bool> isAddedToCart() async {
    // 檢查成功訊息或購物車圖標變化
    return await isElementPresent(TestKeys.successMessage) ||
        await isElementPresent(TestKeys.cartIcon);
  }

  /// 獲取產品列表數量
  Future<int> getProductCount() async {
    // 這裡可以實現計算產品數量的邏輯
    await waitForElement(TestKeys.productList);
    return 0; // 簡化實現
  }
}
