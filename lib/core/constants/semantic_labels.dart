/// 無障礙測試用 Semantic Labels 管理類
/// 提供中文語義標籤，支持無障礙測試和語義化測試
class SemanticLabels {
  SemanticLabels._();

  // ===== 認證相關標籤 =====
  static const String emailInputLabel = '電子郵件或用戶名輸入框';
  static const String passwordInputLabel = '密碼輸入框';
  static const String loginButtonLabel = '登入按鈕';
  static const String registerButtonLabel = '註冊按鈕';
  static const String forgotPasswordLabel = '忘記密碼連結';
  static const String loginPageLabel = '登入頁面';

  // ===== 產品相關標籤 =====
  static const String productListLabel = '產品列表';
  static const String productItemLabel = '產品項目';
  static const String productSearchLabel = '產品搜尋框';
  static const String productFilterLabel = '產品篩選器';
  static const String productSortLabel = '產品排序器';
  static const String addToCartLabel = '加入購物車按鈕';
  static const String buyNowLabel = '立即購買按鈕';
  static const String productImageLabel = '產品圖片';
  static const String productPriceLabel = '產品價格';
  static const String productTitleLabel = '產品標題';

  // ===== 購物車相關標籤 =====
  static const String cartPageLabel = '購物車頁面';
  static const String cartIconLabel = '購物車圖標';
  static const String cartListLabel = '購物車商品列表';
  static const String cartItemLabel = '購物車商品項目';
  static const String cartQuantityLabel = '商品數量';
  static const String cartRemoveLabel = '移除商品按鈕';
  static const String checkoutLabel = '結帳按鈕';
  static const String cartTotalLabel = '購物車總計';

  // ===== 用戶相關標籤 =====
  static const String userProfileLabel = '用戶個人資料';
  static const String profileMenuLabel = '個人資料選單';
  static const String logoutLabel = '登出按鈕';
  static const String userDashboardLabel = '用戶儀表板';
  static const String orderHistoryLabel = '訂單歷史';
  static const String favoriteListLabel = '收藏清單';

  // ===== 通用 UI 標籤 =====
  static const String appBarLabel = '應用程式標題列';
  static const String bottomNavLabel = '底部導航列';
  static const String drawerLabel = '側邊選單';
  static const String modalDialogLabel = '彈出對話框';
  static const String snackBarLabel = '訊息提示列';
  static const String tabBarLabel = '分頁標籤列';

  // ===== 工具方法 =====
  /// 生成帶索引的標籤 (例如: 產品項目 1, 產品項目 2)
  static String withIndex(String baseLabel, int index) => '$baseLabel $index';

  /// 生成帶 ID 的標籤 (例如: 產品項目 ABC123)
  static String withId(String baseLabel, String id) => '$baseLabel $id';

  /// 獲取所有可用的語義標籤
  static List<String> getAllLabels() {
    return [
      // 認證相關
      emailInputLabel, passwordInputLabel, loginButtonLabel,
      registerButtonLabel,
      forgotPasswordLabel, loginPageLabel,

      // 產品相關
      productListLabel, productItemLabel, productSearchLabel,
      productFilterLabel,
      productSortLabel, addToCartLabel, buyNowLabel, productImageLabel,
      productPriceLabel, productTitleLabel,

      // 購物車相關
      cartPageLabel, cartIconLabel, cartListLabel, cartItemLabel,
      cartQuantityLabel, cartRemoveLabel, checkoutLabel, cartTotalLabel,

      // 用戶相關
      userProfileLabel, profileMenuLabel, logoutLabel, userDashboardLabel,
      orderHistoryLabel, favoriteListLabel,

      // 通用 UI
      appBarLabel, bottomNavLabel, drawerLabel, modalDialogLabel,
      snackBarLabel, tabBarLabel,
    ];
  }
}
