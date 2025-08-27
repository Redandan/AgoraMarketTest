/// 真實網站測試用 Widget Keys 管理類
/// 統一管理所有真實測試點，避免硬編碼和衝突
class TestKeys {
  TestKeys._();

  // ===== 網站基本功能 Keys =====
  static const String websiteTitle = 'website_title';
  static const String websiteHeader = 'website_header';
  static const String websiteFooter = 'website_footer';
  static const String mainContent = 'main_content';
  static const String navigationMenu = 'navigation_menu';

  // ===== 表單元素 Keys =====
  static const String formElement = 'form_element';
  static const String inputField = 'input_field';
  static const String submitButton = 'submit_button';
  static const String searchBox = 'search_box';

  // ===== 鏈接和導航 Keys =====
  static const String linkElement = 'link_element';
  static const String navigationLink = 'navigation_link';
  static const String menuItem = 'menu_item';

  // ===== 響應式設計 Keys =====
  static const String viewportMeta = 'viewport_meta';
  static const String responsiveContainer = 'responsive_container';
  static const String mobileLayout = 'mobile_layout';
  static const String desktopLayout = 'desktop_layout';

  // ===== 性能相關 Keys =====
  static const String loadingIndicator = 'loading_indicator';
  static const String progressBar = 'progress_bar';
  static const String cacheIndicator = 'cache_indicator';

  // ===== 安全性相關 Keys =====
  static const String securityHeader = 'security_header';
  static const String httpsIndicator = 'https_indicator';
  static const String sslCertificate = 'ssl_certificate';

  // ===== 無障礙功能 Keys =====
  static const String altText = 'alt_text';
  static const String ariaLabel = 'aria_label';
  static const String semanticElement = 'semantic_element';

  // ===== 工具方法 =====
  /// 生成帶索引的 Key (例如: link_element_0, link_element_1)
  static String withIndex(String baseKey, int index) => '${baseKey}_$index';

  /// 生成帶 ID 的 Key (例如: link_element_abc123)
  static String withId(String baseKey, String id) => '${baseKey}_$id';

  /// 驗證 Key 是否為有效的測試 Key
  static bool isValidTestKey(String key) {
    return key.isNotEmpty &&
        key.length <= 50 &&
        RegExp(r'^[a-z_][a-z0-9_]*$').hasMatch(key);
  }

  /// 獲取所有可用的測試 Keys
  static List<String> getAllKeys() {
    return [
      // 網站基本功能
      websiteTitle, websiteHeader, websiteFooter, mainContent, navigationMenu,

      // 表單元素
      formElement, inputField, submitButton, searchBox,

      // 鏈接和導航
      linkElement, navigationLink, menuItem,

      // 響應式設計
      viewportMeta, responsiveContainer, mobileLayout, desktopLayout,

      // 性能相關
      loadingIndicator, progressBar, cacheIndicator,

      // 安全性相關
      securityHeader, httpsIndicator, sslCertificate,

      // 無障礙功能
      altText, ariaLabel, semanticElement,
    ];
  }
}
