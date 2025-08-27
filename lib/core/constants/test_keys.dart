/// 測試用 Widget Keys 管理類
/// 統一管理所有測試點，避免硬編碼和衝突
class TestKeys {
  TestKeys._();

  // ===== 認證相關 Keys =====
  static const String loginPage = 'login_page';
  static const String emailInput = 'email_input';
  static const String passwordInput = 'password_input';
  static const String loginButton = 'login_button';
  static const String registerButton = 'register_button';
  static const String forgotPasswordLink = 'forgot_password_link';
  static const String loadingIndicator = 'loading_indicator';
  static const String errorMessage = 'error_message';
  static const String successMessage = 'success_message';

  // ===== 產品相關 Keys =====
  static const String productList = 'product_list';
  static const String productItem = 'product_item';
  static const String productDetailPage = 'product_detail_page';
  static const String productSearchBar = 'product_search_bar';
  static const String productFilter = 'product_filter';
  static const String productSort = 'product_sort';
  static const String addToCartButton = 'add_to_cart_button';
  static const String buyNowButton = 'buy_now_button';
  static const String productImage = 'product_image';
  static const String productPrice = 'product_price';
  static const String productTitle = 'product_title';

  // ===== 購物車相關 Keys =====
  static const String cartPage = 'cart_page';
  static const String cartIcon = 'cart_icon';
  static const String cartList = 'cart_list';
  static const String cartItem = 'cart_item';
  static const String cartQuantity = 'cart_quantity';
  static const String cartRemoveButton = 'cart_remove_button';
  static const String checkoutButton = 'checkout_button';
  static const String cartTotal = 'cart_total';

  // ===== 用戶相關 Keys =====
  static const String userProfile = 'user_profile';
  static const String profileMenu = 'profile_menu';
  static const String logoutButton = 'logout_button';
  static const String userDashboard = 'user_dashboard';
  static const String orderHistory = 'order_history';
  static const String favoriteList = 'favorite_list';

  // ===== 通用 UI Keys =====
  static const String appBar = 'app_bar';
  static const String bottomNavigation = 'bottom_navigation';
  static const String drawer = 'drawer';
  static const String modalDialog = 'modal_dialog';
  static const String snackBar = 'snack_bar';
  static const String tabBar = 'tab_bar';

  // ===== 工具方法 =====
  /// 生成帶索引的 Key (例如: product_item_0, product_item_1)
  static String withIndex(String baseKey, int index) => '${baseKey}_$index';

  /// 生成帶 ID 的 Key (例如: product_item_abc123)
  static String withId(String baseKey, String id) => '${baseKey}_$id';

  /// 生成帶用戶 ID 的 Key (例如: cart_icon_user456)
  static String withUserId(String baseKey, String userId) =>
      '${baseKey}_$userId';

  /// 驗證 Key 是否為有效的測試 Key
  static bool isValidTestKey(String key) {
    return key.isNotEmpty &&
        key.length <= 50 &&
        RegExp(r'^[a-z_][a-z0-9_]*$').hasMatch(key);
  }

  /// 獲取所有可用的測試 Keys
  static List<String> getAllKeys() {
    return [
      // 認證相關
      loginPage, emailInput, passwordInput, loginButton, registerButton,
      forgotPasswordLink, loadingIndicator, errorMessage, successMessage,

      // 產品相關
      productList, productItem, productDetailPage, productSearchBar,
      productFilter, productSort, addToCartButton, buyNowButton,
      productImage, productPrice, productTitle,

      // 購物車相關
      cartPage, cartIcon, cartList, cartItem, cartQuantity,
      cartRemoveButton, checkoutButton, cartTotal,

      // 用戶相關
      userProfile, profileMenu, logoutButton, userDashboard,
      orderHistory, favoriteList,

      // 通用 UI
      appBar, bottomNavigation, drawer, modalDialog, snackBar, tabBar,
    ];
  }
}
