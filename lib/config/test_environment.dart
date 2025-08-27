/// 測試環境管理系統
class TestEnvironment {
  // 環境類型枚舉
  static const String DEVELOPMENT = 'development';
  static const String STAGING = 'staging';
  static const String PRODUCTION = 'production';
  static const String LOCAL = 'local';

  // 當前環境
  static String _currentEnvironment = DEVELOPMENT;

  // 環境配置映射
  static final Map<String, EnvironmentConfig> _environments = {
    DEVELOPMENT: EnvironmentConfig(
      name: 'Development',
      baseUrl: 'https://redandan.github.io',
      apiBaseUrl: 'https://api-dev.agoramarket.com',
      enableDebugLogging: true,
      enableScreenshots: true,
      defaultTimeout: Duration(seconds: 30),
      retryAttempts: 2,
      enableVideoRecording: false,
    ),
    STAGING: EnvironmentConfig(
      name: 'Staging',
      baseUrl: 'https://staging-redandan.github.io',
      apiBaseUrl: 'https://api-staging.agoramarket.com',
      enableDebugLogging: true,
      enableScreenshots: true,
      defaultTimeout: Duration(seconds: 45),
      retryAttempts: 3,
      enableVideoRecording: true,
    ),
    PRODUCTION: EnvironmentConfig(
      name: 'Production',
      baseUrl: 'https://redandan.github.io',
      apiBaseUrl: 'https://api.agoramarket.com',
      enableDebugLogging: false,
      enableScreenshots: false,
      defaultTimeout: Duration(seconds: 60),
      retryAttempts: 1,
      enableVideoRecording: false,
    ),
    LOCAL: EnvironmentConfig(
      name: 'Local',
      baseUrl: 'http://localhost:3000',
      apiBaseUrl: 'http://localhost:3001/api',
      enableDebugLogging: true,
      enableScreenshots: true,
      defaultTimeout: Duration(seconds: 15),
      retryAttempts: 1,
      enableVideoRecording: false,
    ),
  };

  /// 獲取當前環境
  static String get currentEnvironment => _currentEnvironment;

  /// 設置當前環境
  static void setEnvironment(String environment) {
    if (_environments.containsKey(environment)) {
      _currentEnvironment = environment;
      print('🔄 測試環境已切換到: ${getCurrentConfig().name}');
    } else {
      throw ArgumentError('未知的測試環境: $environment');
    }
  }

  /// 獲取當前環境配置
  static EnvironmentConfig getCurrentConfig() {
    return _environments[_currentEnvironment]!;
  }

  /// 獲取指定環境配置
  static EnvironmentConfig getEnvironmentConfig(String environment) {
    return _environments[environment] ?? _environments[DEVELOPMENT]!;
  }

  /// 獲取所有可用環境
  static List<String> getAvailableEnvironments() {
    return _environments.keys.toList();
  }

  /// 檢查環境是否可用
  static bool isEnvironmentAvailable(String environment) {
    return _environments.containsKey(environment);
  }

  /// 從環境變數初始化
  static void initializeFromEnvironment() {
    final envVar = const String.fromEnvironment('TEST_ENV', defaultValue: '');
    if (envVar.isNotEmpty && isEnvironmentAvailable(envVar)) {
      setEnvironment(envVar);
    }
  }

  /// 獲取環境特定的測試數據
  static Map<String, dynamic> getEnvironmentTestData() {
    final config = getCurrentConfig();
    return {
      'baseUrl': config.baseUrl,
      'apiBaseUrl': config.apiBaseUrl,
      'testUser': {
        'email': 'test-${_currentEnvironment}@agoramarket.com',
        'password': 'TestPass${_currentEnvironment}123!',
        'name': 'Test User ${_currentEnvironment}',
      },
      'timeouts': {
        'pageLoad': config.defaultTimeout.inSeconds,
        'elementWait': (config.defaultTimeout.inSeconds ~/ 2),
        'animation': 5,
      },
      'retryAttempts': config.retryAttempts,
    };
  }

  /// 驗證環境配置
  static bool validateEnvironment(String environment) {
    if (!isEnvironmentAvailable(environment)) {
      return false;
    }

    final config = getEnvironmentConfig(environment);
    // 這裡可以添加更複雜的驗證邏輯
    return config.baseUrl.isNotEmpty && config.apiBaseUrl.isNotEmpty;
  }

  /// 獲取環境狀態摘要
  static Map<String, dynamic> getEnvironmentSummary() {
    final current = getCurrentConfig();
    return {
      'currentEnvironment': _currentEnvironment,
      'environmentName': current.name,
      'baseUrl': current.baseUrl,
      'apiBaseUrl': current.apiBaseUrl,
      'debugMode': current.enableDebugLogging,
      'screenshots': current.enableScreenshots,
      'videoRecording': current.enableVideoRecording,
      'defaultTimeout': current.defaultTimeout.inSeconds,
      'retryAttempts': current.retryAttempts,
      'availableEnvironments': getAvailableEnvironments(),
    };
  }

  /// 重置為默認環境
  static void resetToDefault() {
    _currentEnvironment = DEVELOPMENT;
    print('🔄 已重置到默認環境: ${getCurrentConfig().name}');
  }
}

/// 環境配置類
class EnvironmentConfig {
  final String name;
  final String baseUrl;
  final String apiBaseUrl;
  final bool enableDebugLogging;
  final bool enableScreenshots;
  final Duration defaultTimeout;
  final int retryAttempts;
  final bool enableVideoRecording;

  const EnvironmentConfig({
    required this.name,
    required this.baseUrl,
    required this.apiBaseUrl,
    required this.enableDebugLogging,
    required this.enableScreenshots,
    required this.defaultTimeout,
    required this.retryAttempts,
    required this.enableVideoRecording,
  });

  /// 轉換為Map格式
  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'baseUrl': baseUrl,
      'apiBaseUrl': apiBaseUrl,
      'enableDebugLogging': enableDebugLogging,
      'enableScreenshots': enableScreenshots,
      'defaultTimeoutSeconds': defaultTimeout.inSeconds,
      'retryAttempts': retryAttempts,
      'enableVideoRecording': enableVideoRecording,
    };
  }

  /// 從Map創建配置
  factory EnvironmentConfig.fromMap(Map<String, dynamic> map) {
    return EnvironmentConfig(
      name: map['name'] ?? 'Unknown',
      baseUrl: map['baseUrl'] ?? '',
      apiBaseUrl: map['apiBaseUrl'] ?? '',
      enableDebugLogging: map['enableDebugLogging'] ?? false,
      enableScreenshots: map['enableScreenshots'] ?? false,
      defaultTimeout: Duration(seconds: map['defaultTimeoutSeconds'] ?? 30),
      retryAttempts: map['retryAttempts'] ?? 1,
      enableVideoRecording: map['enableVideoRecording'] ?? false,
    );
  }
}