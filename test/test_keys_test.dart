import 'package:flutter_test/flutter_test.dart';
import 'package:agora_market_autotest/core/constants/test_keys.dart';
import 'package:agora_market_autotest/utils/test_keys_validator.dart';

void main() {
  group('TestKeys 測試', () {
    test('應該有有效的測試 Keys', () {
      final allKeys = TestKeys.getAllKeys();
      expect(allKeys, isNotEmpty);
      expect(allKeys.length, greaterThan(20));
    });

    test('所有 Keys 應該有效', () {
      final allKeys = TestKeys.getAllKeys();
      for (final key in allKeys) {
        expect(TestKeys.isValidTestKey(key), isTrue, reason: 'Key: $key');
      }
    });

    test('沒有重複的 Keys', () {
      final allKeys = TestKeys.getAllKeys();
      final uniqueKeys = allKeys.toSet();
      expect(allKeys.length, equals(uniqueKeys.length));
    });

    test('動態 Key 生成應該工作', () {
      final indexedKey = TestKeys.withIndex(TestKeys.productItem, 0);
      expect(indexedKey, equals('product_item_0'));

      final idKey = TestKeys.withId(TestKeys.productItem, 'abc123');
      expect(idKey, equals('product_item_abc123'));

      final userIdKey = TestKeys.withUserId(TestKeys.cartIcon, 'user456');
      expect(userIdKey, equals('cart_icon_user456'));
    });
  });

  group('TestKeysValidator 測試', () {
    test('應該生成有效的驗證報告', () {
      final report = TestKeysValidator.generateKeysReport();
      expect(report, isNotEmpty);
      expect(report, contains('測試 Keys 驗證報告'));
      expect(report, contains('總 Keys 數量'));
    });

    test('應該生成有效的語義標籤報告', () {
      final report = TestKeysValidator.generateSemanticsReport();
      expect(report, isNotEmpty);
      expect(report, contains('語義標籤報告'));
      expect(report, contains('總標籤數量'));
    });

    test('應該找到所有重複的 Keys', () {
      final duplicates = TestKeysValidator.findDuplicateKeys();
      expect(duplicates, isEmpty);
    });

    test('應該驗證所有 Keys 的有效性', () {
      final validationResults = TestKeysValidator.validateAllTestKeys();
      final allValid = validationResults.values.every((isValid) => isValid);
      expect(allValid, isTrue);
    });
  });
}
