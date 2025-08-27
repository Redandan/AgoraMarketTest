import '../core/constants/test_keys.dart';
import '../core/constants/semantic_labels.dart';

/// 測試 Keys 和 Semantics 驗證工具
class TestKeysValidator {
  /// 驗證所有測試 Keys 的有效性
  static Map<String, bool> validateAllTestKeys() {
    final results = <String, bool>{};
    final allKeys = TestKeys.getAllKeys();

    for (final key in allKeys) {
      results[key] = TestKeys.isValidTestKey(key);
    }

    return results;
  }

  /// 檢查測試 Keys 是否有重複
  static List<String> findDuplicateKeys() {
    final allKeys = TestKeys.getAllKeys();
    final duplicates = <String>[];
    final seen = <String>{};

    for (final key in allKeys) {
      if (seen.contains(key)) {
        duplicates.add(key);
      } else {
        seen.add(key);
      }
    }

    return duplicates;
  }

  /// 生成測試 Keys 使用報告
  static String generateKeysReport() {
    final allKeys = TestKeys.getAllKeys();
    final validKeys = validateAllTestKeys();
    final duplicates = findDuplicateKeys();

    final report = StringBuffer();
    report.writeln('=== 測試 Keys 驗證報告 ===');
    report.writeln('總 Keys 數量: ${allKeys.length}');
    report.writeln('有效 Keys 數量: ${validKeys.values.where((v) => v).length}');
    report.writeln('無效 Keys 數量: ${validKeys.values.where((v) => !v).length}');

    if (duplicates.isNotEmpty) {
      report.writeln('重複 Keys: ${duplicates.join(', ')}');
    }

    report.writeln('\n=== 所有測試 Keys ===');
    for (final key in allKeys) {
      final isValid = validKeys[key] ?? false;
      final status = isValid ? '✅' : '❌';
      report.writeln('$status $key');
    }

    return report.toString();
  }

  /// 生成語義標籤報告
  static String generateSemanticsReport() {
    final allLabels = SemanticLabels.getAllLabels();

    final report = StringBuffer();
    report.writeln('=== 語義標籤報告 ===');
    report.writeln('總標籤數量: ${allLabels.length}');

    report.writeln('\n=== 所有語義標籤 ===');
    for (final label in allLabels) {
      report.writeln('🏷️ $label');
    }

    return report.toString();
  }
}
