import '../lib/utils/test_keys_validator.dart';

void main() {
  print('=== 測試 Keys 驗證報告 ===');
  print(TestKeysValidator.generateKeysReport());

  print('\n=== 語義標籤報告 ===');
  print(TestKeysValidator.generateSemanticsReport());
}
