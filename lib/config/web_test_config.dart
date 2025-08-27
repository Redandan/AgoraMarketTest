/// Web 平台測試配置
class WebTestConfig {
  // Web 測試環境配置
  static const String baseUrl = 'https://redandan.github.io';
  static const String loginUrl = 'https://redandan.github.io/login';
  static const String homeUrl = 'https://redandan.github.io';

  // Web 測試用戶數據
  static const Map<String, String> testUser = {
    'email': 'autotest@agoramarket.com',
    'password': 'AutoTest123!',
    'name': '自動測試用戶',
  };

  // Web 測試超時設定
  static const Duration pageLoadTimeout = Duration(seconds: 20);
  static const Duration elementWaitTimeout = Duration(seconds: 10);
  static const Duration animationTimeout = Duration(seconds: 5);

  // Web 測試視窗設定
  static const Map<String, int> viewportSizes = {
    'desktop': 1920,
    'tablet': 1024,
    'mobile': 375,
  };

  // Web 測試瀏覽器設定
  static const List<String> supportedBrowsers = [
    'chrome',
    'firefox',
    'edge',
  ];

  // Web 測試截圖設定
  static const String screenshotPath = 'test_results/screenshots/web';
  static const bool enableScreenshots = true;
  static const List<String> screenshotFormats = ['png', 'jpg'];

  // Web 測試報告設定
  static const String reportPath = 'test_results/reports/web';
  static const String logPath = 'test_results/logs/web';

  // Web 測試環境判斷
  static bool get isCI => const bool.fromEnvironment('CI', defaultValue: false);

  static bool get isHeadless =>
      const bool.fromEnvironment('HEADLESS', defaultValue: false);

  static bool get isWeb => true;

  // Web 測試特定配置
  static const Map<String, String> webSelectors = {
    'loginForm': 'form[data-testid="login-form"]',
    'emailField': 'input[type="email"]',
    'passwordField': 'input[type="password"]',
    'loginButton': 'button[type="submit"]',
    'errorMessage': '.error-message',
    'successMessage': '.success-message',
  };

  // Web 測試等待策略
  static const Map<String, Duration> waitStrategies = {
    'pageLoad': Duration(seconds: 20),
    'elementVisible': Duration(seconds: 10),
    'elementClickable': Duration(seconds: 5),
    'animationComplete': Duration(seconds: 3),
    'networkIdle': Duration(seconds: 15),
  };
}
