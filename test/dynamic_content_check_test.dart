import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  test('檢查網站動態內容和JavaScript功能', () async {
    final response = await http.get(Uri.parse('https://redandan.github.io/'));
    expect(response.statusCode, 200);

    final body = response.body;
    print('=== 檢查動態內容和JavaScript功能 ===');

    // 檢查JavaScript相關內容
    final hasJavaScript = body.contains('<script') || body.contains('javascript:');
    final hasJsFrameworks = body.contains('react') || body.contains('vue') ||
                           body.contains('angular') || body.contains('flutter');
    final hasAsyncContent = body.contains('async') || body.contains('await') ||
                           body.contains('promise') || body.contains('fetch');

    print('JavaScript檢查: ${hasJavaScript ? "✅" : "❌"}');
    print('JS框架檢查: ${hasJsFrameworks ? "✅" : "❌"}');
    print('異步內容檢查: ${hasAsyncContent ? "✅" : "❌"}');

    // 檢查是否有條件渲染或動態內容
    final hasConditionalContent = body.contains('if') && body.contains('display') ||
                                 body.contains('hidden') || body.contains('show') ||
                                 body.contains('toggle');
    final hasDynamicClasses = body.contains('class=') && (body.contains('active') ||
                             body.contains('visible') || body.contains('hidden'));

    print('條件渲染檢查: ${hasConditionalContent ? "✅" : "❌"}');
    print('動態類檢查: ${hasDynamicClasses ? "✅" : "❌"}');

    // 檢查是否有任何登入或認證相關的JavaScript
    final jsContent = RegExp(r'<script[^>]*>(.*?)</script>', dotAll: true)
                     .allMatches(body)
                     .map((match) => match.group(1) ?? '')
                     .join(' ');

    final hasJsLogin = jsContent.contains('login') || jsContent.contains('auth') ||
                      jsContent.contains('token') || jsContent.contains('session');
    final hasJsApi = jsContent.contains('fetch') || jsContent.contains('XMLHttpRequest') ||
                    jsContent.contains('axios') || jsContent.contains('api');

    print('JS登入檢查: ${hasJsLogin ? "✅" : "❌"}');
    print('JS API檢查: ${hasJsApi ? "✅" : "❌"}');

    // 檢查外部腳本引用
    final scriptTags = RegExp(r'<script[^>]*src="([^"]+)"').allMatches(body);
    print('\n外部腳本引用:');
    for (final match in scriptTags) {
      final src = match.group(1);
      print('  ${src}');
      if (src != null && src.contains('version_check.js')) {
        print('  ✅ 發現版本檢查腳本，這可能包含動態邏輯');
      }
    }

    // 檢查是否有任何隱藏內容或延遲加載
    final hasHiddenContent = body.contains('style="display:none"') ||
                            body.contains('class="hidden"') ||
                            body.contains('visibility: hidden');
    final hasLazyLoad = body.contains('lazy') || body.contains('loading="lazy"');

    print('隱藏內容檢查: ${hasHiddenContent ? "✅" : "❌"}');
    print('延遲加載檢查: ${hasLazyLoad ? "✅" : "❌"}');

    // 總結
    print('\n=== 總結 ===');
    if (hasJavaScript && (hasJsLogin || hasJsApi || hasConditionalContent)) {
      print('⚠️  網站可能包含動態內容，需要JavaScript執行');
      print('💡 建議手動在瀏覽器中測試，可能有登入功能在JavaScript執行後顯示');
    } else {
      print('ℹ️  網站似乎是靜態內容，沒有明顯的動態登入功能');
    }

    print('\n🔍 手動測試建議:');
    print('1. 在瀏覽器中打開 https://redandan.github.io/');
    print('2. 打開開發者工具 (F12)');
    print('3. 查看 Console 是否有任何錯誤或日誌');
    print('4. 查看 Network 標籤頁，看是否有API調用');
    print('5. 檢查頁面源碼是否有動態生成的內容');
    print('6. 嘗試刷新頁面或等待一段時間');
  });
}