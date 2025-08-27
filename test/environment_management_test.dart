import 'package:flutter_test/flutter_test.dart';
import '../lib/config/test_environment.dart';
import '../lib/utils/environment_manager.dart';

void main() {
  group('測試環境管理系統', () {
    setUp(() {
      // 重置為默認環境
      TestEnvironment.resetToDefault();
    });

    test('環境切換功能', () {
      print('\n=== 測試環境切換功能 ===');

      // 測試切換到不同環境
      final environments = TestEnvironment.getAvailableEnvironments();

      for (final env in environments) {
        TestEnvironment.setEnvironment(env);
        final config = TestEnvironment.getCurrentConfig();

        expect(TestEnvironment.currentEnvironment, env);
        expect(config.name, isNotEmpty);
        expect(config.baseUrl, isNotEmpty);
        expect(config.apiBaseUrl, isNotEmpty);

        print('✅ 環境 $env 切換成功');
        print('   名稱: ${config.name}');
        print('   URL: ${config.baseUrl}');
        print('   API: ${config.apiBaseUrl}');
      }
    });

    test('環境配置驗證', () {
      print('\n=== 測試環境配置驗證 ===');

      final environments = TestEnvironment.getAvailableEnvironments();

      for (final env in environments) {
        final isValid = TestEnvironment.validateEnvironment(env);
        expect(isValid, true, reason: '環境 $env 應該是有效的');

        final config = TestEnvironment.getEnvironmentConfig(env);
        expect(config.baseUrl, isNotEmpty);
        expect(config.apiBaseUrl, isNotEmpty);
        expect(config.defaultTimeout.inSeconds, greaterThan(0));
        expect(config.retryAttempts, greaterThanOrEqualTo(0));

        print('✅ 環境 $env 配置驗證通過');
      }
    });

    test('環境特定測試數據', () {
      print('\n=== 測試環境特定數據 ===');

      final environments = TestEnvironment.getAvailableEnvironments();

      for (final env in environments) {
        TestEnvironment.setEnvironment(env);
        final testData = TestEnvironment.getEnvironmentTestData();

        expect(testData['baseUrl'], isNotEmpty);
        expect(testData['apiBaseUrl'], isNotEmpty);
        expect(testData['testUser'], isNotNull);
        expect(testData['timeouts'], isNotNull);
        expect(testData['retryAttempts'], isNotNull);

        final testUser = testData['testUser'] as Map<String, dynamic>;
        expect(testUser['email'], contains('@agoramarket.com'));
        expect(testUser['password'], isNotEmpty);
        expect(testUser['name'], isNotEmpty);

        print('✅ 環境 $env 測試數據生成成功');
        print('   測試用戶: ${testUser['email']}');
        print('   重試次數: ${testData['retryAttempts']}');
      }
    });

    test('環境狀態摘要', () {
      print('\n=== 測試環境狀態摘要 ===');

      final summary = TestEnvironment.getEnvironmentSummary();

      expect(summary['currentEnvironment'], isNotEmpty);
      expect(summary['environmentName'], isNotEmpty);
      expect(summary['baseUrl'], isNotEmpty);
      expect(summary['apiBaseUrl'], isNotEmpty);
      expect(summary['availableEnvironments'], isNotEmpty);

      print('✅ 環境狀態摘要生成成功');
      print('   當前環境: ${summary['currentEnvironment']}');
      print('   環境名稱: ${summary['environmentName']}');
      print('   可用環境數量: ${summary['availableEnvironments'].length}');
    });

    test('環境配置持久化', () {
      print('\n=== 測試環境配置持久化 ===');

      // 測試配置保存和加載
      final originalEnv = TestEnvironment.currentEnvironment;
      TestEnvironment.setEnvironment(TestEnvironment.STAGING);

      // 驗證環境已改變
      expect(TestEnvironment.currentEnvironment, TestEnvironment.STAGING);

      // 切換回原環境
      TestEnvironment.setEnvironment(originalEnv);
      expect(TestEnvironment.currentEnvironment, originalEnv);

      print('✅ 環境配置持久化測試通過');
    });

    test('無效環境處理', () {
      print('\n=== 測試無效環境處理 ===');

      // 測試無效環境
      expect(() => TestEnvironment.setEnvironment('invalid_env'), throwsArgumentError);
      expect(TestEnvironment.validateEnvironment('invalid_env'), false);
      expect(TestEnvironment.isEnvironmentAvailable('invalid_env'), false);

      print('✅ 無效環境處理正確');
    });

    test('環境管理器集成', () {
      print('\n=== 測試環境管理器集成 ===');

      // 初始化環境管理器
      EnvironmentManager.initialize();

      // 測試環境切換
      EnvironmentManager.switchEnvironment(TestEnvironment.STAGING);
      expect(TestEnvironment.currentEnvironment, TestEnvironment.STAGING);

      // 測試環境驗證
      final isValid = EnvironmentManager.validateCurrentEnvironment();
      expect(isValid, true);

      // 測試環境信息顯示
      EnvironmentManager.printCurrentEnvironment();

      // 測試環境列表
      EnvironmentManager.listEnvironments();

      print('✅ 環境管理器集成測試通過');
    });

    test('環境特定配置獲取', () {
      print('\n=== 測試環境特定配置 ===');

      final environments = [TestEnvironment.DEVELOPMENT, TestEnvironment.STAGING, TestEnvironment.PRODUCTION];

      for (final env in environments) {
        TestEnvironment.setEnvironment(env);
        final config = EnvironmentManager.getEnvironmentSpecificConfig();

        expect(config['baseUrl'], isNotEmpty);
        expect(config['apiBaseUrl'], isNotEmpty);
        expect(config['testUser'], isNotNull);
        expect(config['timeouts'], isNotNull);

        final timeouts = config['timeouts'] as Map<String, dynamic>;
        expect(timeouts['pageLoad'], greaterThan(0));
        expect(timeouts['elementWait'], greaterThan(0));

        print('✅ 環境 $env 特定配置獲取成功');
      }
    });

    test('環境性能配置', () {
      print('\n=== 測試環境性能配置 ===');

      // 測試不同環境的性能配置差異
      final devConfig = TestEnvironment.getEnvironmentConfig(TestEnvironment.DEVELOPMENT);
      final prodConfig = TestEnvironment.getEnvironmentConfig(TestEnvironment.PRODUCTION);
      final stagingConfig = TestEnvironment.getEnvironmentConfig(TestEnvironment.STAGING);

      // 開發環境應該有較短的超時時間
      expect(devConfig.defaultTimeout.inSeconds, lessThan(prodConfig.defaultTimeout.inSeconds));

      // 生產環境應該有較少的調試功能
      expect(devConfig.enableDebugLogging, true);
      expect(prodConfig.enableDebugLogging, false);

      // 預發環境應該有最多的重試次數
      expect(stagingConfig.retryAttempts, greaterThanOrEqualTo(devConfig.retryAttempts));
      expect(stagingConfig.retryAttempts, greaterThanOrEqualTo(prodConfig.retryAttempts));

      print('✅ 環境性能配置測試通過');
      print('   開發環境超時: ${devConfig.defaultTimeout.inSeconds}s');
      print('   生產環境超時: ${prodConfig.defaultTimeout.inSeconds}s');
      print('   預發環境重試: ${stagingConfig.retryAttempts}次');
    });
  });
}