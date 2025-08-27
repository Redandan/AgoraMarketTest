import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../config/test_config.dart';

/// 頁面物件基礎類
abstract class BasePage {
  final WidgetTester tester;

  BasePage(this.tester);

  /// 等待頁面載入完成
  Future<void> waitForPageLoad() async {
    await tester.pumpAndSettle();
  }

  /// 截圖 (模擬實現)
  Future<void> takeScreenshot(String name) async {
    if (TestConfig.enableScreenshots) {
      // 在標準 Flutter 測試中，我們可以記錄截圖名稱
      print('📸 截圖: $name');
    }
  }

  /// 等待元素出現
  Future<void> waitForElement(String key, {Duration? timeout}) async {
    final finder = find.byKey(Key(key));
    await tester.pumpAndSettle();

    // 驗證元素存在
    expect(finder, findsOneWidget);
  }

  /// 點擊元素
  Future<void> tapElement(String key) async {
    final finder = find.byKey(Key(key));
    await tester.tap(finder);
    await tester.pumpAndSettle();
  }

  /// 輸入文字
  Future<void> enterText(String key, String text) async {
    final finder = find.byKey(Key(key));
    await tester.enterText(finder, text);
    await tester.pumpAndSettle();
  }

  /// 驗證元素存在
  Future<bool> isElementPresent(String key) async {
    try {
      final finder = find.byKey(Key(key));
      return tester.any(finder);
    } catch (e) {
      return false;
    }
  }

  /// 驗證元素可見
  Future<bool> isElementVisible(String key) async {
    try {
      final finder = find.byKey(Key(key));
      return tester.any(finder);
    } catch (e) {
      return false;
    }
  }

  /// 等待元素消失
  Future<void> waitForElementToDisappear(String key) async {
    final finder = find.byKey(Key(key));
    await tester.pumpAndSettle();

    // 驗證元素不存在
    expect(finder, findsNothing);
  }
}
