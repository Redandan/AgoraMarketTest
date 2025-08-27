import '../config/test_environment.dart';
import 'dart:io';
import 'dart:convert';

/// 測試環境管理器
class EnvironmentManager {
  static const String _configFile = 'test_environment_config.json';

  /// 初始化環境管理器
  static void initialize() {
    TestEnvironment.initializeFromEnvironment();
    _loadEnvironmentConfig();
    print('🌍 環境管理器已初始化');
    _printEnvironmentInfo();
  }

  /// 切換環境
  static void switchEnvironment(String environment) {
    if (TestEnvironment.validateEnvironment(environment)) {
      TestEnvironment.setEnvironment(environment);
      _saveEnvironmentConfig();
      _printEnvironmentInfo();
    } else {
      print('❌ 無效的環境: $environment');
      print('📋 可用環境: ${TestEnvironment.getAvailableEnvironments().join(', ')}');
    }
  }

  /// 獲取當前環境信息
  static void printCurrentEnvironment() {
    _printEnvironmentInfo();
  }

  /// 列出所有可用環境
  static void listEnvironments() {
    print('📋 可用測試環境:');
    for (final env in TestEnvironment.getAvailableEnvironments()) {
      final config = TestEnvironment.getEnvironmentConfig(env);
      final current = TestEnvironment.currentEnvironment == env;
      print('${current ? '▶️' : '  '} $env - ${config.name}');
      print('    URL: ${config.baseUrl}');
      print('    API: ${config.apiBaseUrl}');
      print('    超時: ${config.defaultTimeout.inSeconds}s');
      print('    重試: ${config.retryAttempts}次');
      print('');
    }
  }

  /// 驗證當前環境
  static bool validateCurrentEnvironment() {
    final currentEnv = TestEnvironment.currentEnvironment;
    final isValid = TestEnvironment.validateEnvironment(currentEnv);

    if (isValid) {
      print('✅ 當前環境 $currentEnv 驗證通過');
    } else {
      print('❌ 當前環境 $currentEnv 驗證失敗');
    }

    return isValid;
  }

  /// 測試環境連通性
  static Future<void> testEnvironmentConnectivity() async {
    final config = TestEnvironment.getCurrentConfig();
    print('🔍 測試環境連通性: ${config.name}');

    try {
      final result = await Process.run('curl', ['-I', config.baseUrl]);
      if (result.exitCode == 0) {
        print('✅ 網站連通性正常');
      } else {
        print('❌ 網站連通性異常');
      }
    } catch (e) {
      print('⚠️  無法測試連通性: $e');
    }

    try {
      final result = await Process.run('curl', ['-I', config.apiBaseUrl]);
      if (result.exitCode == 0) {
        print('✅ API連通性正常');
      } else {
        print('❌ API連通性異常');
      }
    } catch (e) {
      print('⚠️  無法測試API連通性: $e');
    }
  }

  /// 獲取環境特定的配置
  static Map<String, dynamic> getEnvironmentSpecificConfig() {
    return TestEnvironment.getEnvironmentTestData();
  }

  /// 導出環境配置
  static void exportEnvironmentConfig(String filePath) {
    final config = TestEnvironment.getEnvironmentSummary();
    final file = File(filePath);
    file.writeAsStringSync(jsonEncode(config));
    print('📄 環境配置已導出到: $filePath');
  }

  /// 導入環境配置
  static void importEnvironmentConfig(String filePath) {
    try {
      final file = File(filePath);
      if (!file.existsSync()) {
        print('❌ 配置文件不存在: $filePath');
        return;
      }

      final content = file.readAsStringSync();
      final config = jsonDecode(content) as Map<String, dynamic>;

      if (config.containsKey('currentEnvironment')) {
        final env = config['currentEnvironment'] as String;
        if (TestEnvironment.isEnvironmentAvailable(env)) {
          TestEnvironment.setEnvironment(env);
          print('✅ 環境配置已導入: $env');
        } else {
          print('❌ 無效的環境配置: $env');
        }
      }
    } catch (e) {
      print('❌ 導入環境配置失敗: $e');
    }
  }

  /// 重置環境配置
  static void resetEnvironment() {
    TestEnvironment.resetToDefault();
    _saveEnvironmentConfig();
    print('🔄 環境已重置為默認配置');
  }

  /// 保存環境配置到文件
  static void _saveEnvironmentConfig() {
    try {
      final config = TestEnvironment.getEnvironmentSummary();
      final file = File(_configFile);
      file.writeAsStringSync(jsonEncode(config));
    } catch (e) {
      print('⚠️  保存環境配置失敗: $e');
    }
  }

  /// 從文件加載環境配置
  static void _loadEnvironmentConfig() {
    try {
      final file = File(_configFile);
      if (!file.existsSync()) {
        return;
      }

      final content = file.readAsStringSync();
      final config = jsonDecode(content) as Map<String, dynamic>;

      if (config.containsKey('currentEnvironment')) {
        final env = config['currentEnvironment'] as String;
        if (TestEnvironment.isEnvironmentAvailable(env)) {
          TestEnvironment.setEnvironment(env);
        }
      }
    } catch (e) {
      print('⚠️  加載環境配置失敗: $e');
    }
  }

  /// 打印環境信息
  static void _printEnvironmentInfo() {
    final summary = TestEnvironment.getEnvironmentSummary();
    print('');
    print('🌍 當前測試環境信息:');
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    print('環境名稱: ${summary['environmentName']}');
    print('環境類型: ${summary['currentEnvironment']}');
    print('網站URL: ${summary['baseUrl']}');
    print('API URL: ${summary['apiBaseUrl']}');
    print('調試模式: ${summary['debugMode'] ? '開啟' : '關閉'}');
    print('截圖功能: ${summary['screenshots'] ? '開啟' : '關閉'}');
    print('視頻錄製: ${summary['videoRecording'] ? '開啟' : '關閉'}');
    print('默認超時: ${summary['defaultTimeout']}秒');
    print('重試次數: ${summary['retryAttempts']}次');
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    print('');
  }
}