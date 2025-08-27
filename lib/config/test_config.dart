/// 測試配置管理
class TestConfig {
  // 測試環境配置
  static const String baseUrl = 'https://redandan.github.io';
  static const String apiBaseUrl = 'https://api.agoramarket.com';

  // 測試用戶數據
  static const Map<String, String> testUser = {
    'email': 'autotest@agoramarket.com',
    'password': 'AutoTest123!',
    'name': '自動測試用戶',
  };

  // 超時設定
  static const Duration defaultTimeout = Duration(seconds: 30);
  static const Duration pageLoadTimeout = Duration(seconds: 15);
  static const Duration elementWaitTimeout = Duration(seconds: 10);

  // 截圖設定
  static const String screenshotPath = 'test_results/screenshots';
  static const bool enableScreenshots = true;

  // 測試報告設定
  static const String reportPath = 'test_results/reports';
  static const String logPath = 'test_results/logs';

  // 環境判斷
  static bool get isCI => const bool.fromEnvironment('CI', defaultValue: false);

  static bool get isHeadless =>
      const bool.fromEnvironment('HEADLESS', defaultValue: false);
}
