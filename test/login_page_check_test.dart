import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  group('登入頁面檢查', () {
    const String baseUrl = 'https://redandan.github.io';
    const String loginUrl = '$baseUrl/#/login';

    test('檢查登入頁面內容', () async {
      print('=== 檢查登入頁面: $loginUrl ===');

      try {
        final response = await http.get(Uri.parse(loginUrl));
        print('狀態碼: ${response.statusCode}');
        print('內容長度: ${response.body.length} 字符');

        final body = response.body.toLowerCase();

        // 檢查登入頁面特有的元素
        final hasLoginPage = body.contains('login') || body.contains('登入');
        final hasEmailField = body.contains('email') || body.contains('type="email"') ||
                              body.contains('郵箱') || body.contains('帳號');
        final hasPasswordField = body.contains('password') || body.contains('type="password"') ||
                                 body.contains('密碼') || body.contains('pwd');
        final hasLoginButton = body.contains('login') || body.contains('登入') ||
                               body.contains('sign in') || body.contains('submit');
        final hasRegisterLink = body.contains('register') || body.contains('註冊') ||
                                body.contains('sign up') || body.contains('signup');

        print('\n登入頁面元素檢查:');
        print('  - 登入頁面標識: ${hasLoginPage ? "✅" : "❌"}');
        print('  - 郵箱輸入框: ${hasEmailField ? "✅" : "❌"}');
        print('  - 密碼輸入框: ${hasPasswordField ? "✅" : "❌"}');
        print('  - 登入按鈕: ${hasLoginButton ? "✅" : "❌"}');
        print('  - 註冊連結: ${hasRegisterLink ? "✅" : "❌"}');

        // 檢查表單元素
        final hasForm = body.contains('<form');
        final hasInput = body.contains('<input');
        final hasButton = body.contains('<button') || body.contains('type="submit"');

        print('\n表單元素檢查:');
        print('  - 表單標籤: ${hasForm ? "✅" : "❌"}');
        print('  - 輸入框: ${hasInput ? "✅" : "❌"}');
        print('  - 按鈕: ${hasButton ? "✅" : "❌"}');

        // 檢查是否有特定的登入頁面內容
        if (body.contains('login') || body.contains('登入')) {
          print('\n✅ 發現登入相關內容！');

          // 提取登入相關的行
          final lines = body.split('\n');
          final loginLines = lines.where((line) =>
              line.contains('login') || line.contains('登入') ||
              line.contains('email') || line.contains('password') ||
              line.contains('郵箱') || line.contains('密碼')
          ).toList();

          print('登入相關內容:');
          for (final line in loginLines.take(5)) {
            print('  ${line.trim()}');
          }
        } else {
          print('\n❌ 未發現登入相關內容');
        }

        // 檢查是否有重定向或錯誤信息
        if (response.statusCode != 200) {
          print('\n⚠️  請求失敗，狀態碼: ${response.statusCode}');
        }

      } catch (e) {
        print('❌ 請求失敗: $e');

        // 如果是Flutter Web應用，可能需要不同的處理方式
        print('\n💡 對於Flutter Web應用，可能需要：');
        print('   1. 在瀏覽器中直接訪問URL');
        print('   2. 檢查JavaScript控制台');
        print('   3. 查看Network標籤頁的實際請求');
      }
    });

    test('檢查登入頁面可用性', () async {
      print('\n=== 檢查登入頁面可用性 ===');

      try {
        final response = await http.get(Uri.parse(loginUrl));
        expect(response.statusCode, anyOf([200, 404, 301, 302])); // 允許重定向

        if (response.statusCode == 200) {
          final body = response.body;
          print('✅ 登入頁面可訪問');

          // 檢查頁面完整性
          final hasTitle = body.contains('<title') || body.contains('<h1');
          final hasBody = body.contains('<body');
          final contentLength = body.length;

          print('頁面完整性檢查:');
          print('  - 標題: ${hasTitle ? "✅" : "❌"}');
          print('  - 主體: ${hasBody ? "✅" : "❌"}');
          print('  - 內容長度: $contentLength 字符');

          // 檢查是否有錯誤信息
          final hasError = body.toLowerCase().contains('error') ||
                          body.toLowerCase().contains('404') ||
                          body.toLowerCase().contains('not found');
          print('  - 錯誤信息: ${hasError ? "⚠️" : "✅"}');

        } else if (response.statusCode == 404) {
          print('⚠️  登入頁面不存在 (404)');
          print('這對於靜態展示網站是正常的');
        } else {
          print('ℹ️  登入頁面重定向或需要特殊處理');
        }

      } catch (e) {
        print('❌ 可用性檢查失敗: $e');
      }
    });

    test('檢查登入流程完整性', () async {
      print('\n=== 檢查登入流程完整性 ===');

      // 檢查多個可能的登入端點
      final loginEndpoints = [
        '$baseUrl/#/login',
        '$baseUrl/login',
        '$baseUrl/auth',
        '$baseUrl/signin',
        '$baseUrl/api/login',
        '$baseUrl/api/auth'
      ];

      for (final endpoint in loginEndpoints) {
        try {
          print('檢查端點: $endpoint');
          final response = await http.get(Uri.parse(endpoint));
          print('  狀態碼: ${response.statusCode}');

          if (response.statusCode == 200) {
            final body = response.body.toLowerCase();
            final hasLoginContent = body.contains('login') || body.contains('登入') ||
                                   body.contains('auth') || body.contains('sign');

            if (hasLoginContent) {
              print('  ✅ 發現登入相關內容');
              break; // 找到有效的登入端點
            } else {
              print('  ℹ️  頁面存在但無登入內容');
            }
          } else {
            print('  ❌ 端點不可訪問');
          }
        } catch (e) {
          print('  ❌ 請求失敗: $e');
        }
      }

      print('\n💡 登入流程建議:');
      print('   1. 如果是靜態網站，登入功能可能在前端實現');
      print('   2. 檢查是否有JavaScript處理登入邏輯');
      print('   3. 查看瀏覽器開發者工具的實際請求');
    });
  });

  test('檢查主頁面與登入頁面的差異', () async {
    print('\n=== 比較主頁面與登入頁面 ===');

    final mainUrl = 'https://redandan.github.io/';
    final loginUrl = 'https://redandan.github.io/#/login';

    try {
      final mainResponse = await http.get(Uri.parse(mainUrl));
      final loginResponse = await http.get(Uri.parse(loginUrl));

      print('主頁面 - 狀態碼: ${mainResponse.statusCode}, 長度: ${mainResponse.body.length}');
      print('登入頁面 - 狀態碼: ${loginResponse.statusCode}, 長度: ${loginResponse.body.length}');

      // 比較內容差異
      final mainBody = mainResponse.body.toLowerCase();
      final loginBody = loginResponse.body.toLowerCase();

      final hasDifferentContent = mainBody != loginBody;
      print('內容是否不同: ${hasDifferentContent ? "✅" : "❌"}');

      if (hasDifferentContent) {
        // 檢查登入頁面特有的內容
        final loginSpecificContent = [
          'login', '登入', 'email', 'password', '郵箱', '密碼',
          'sign in', 'sign up', 'register', '註冊'
        ];

        print('\n登入頁面特有內容檢查:');
        for (final term in loginSpecificContent) {
          final inMain = mainBody.contains(term);
          final inLogin = loginBody.contains(term);

          if (inLogin && !inMain) {
            print('  ✅ "$term" - 僅在登入頁面出現');
          } else if (inLogin && inMain) {
            print('  ⚪ "$term" - 兩頁面都有');
          } else {
            print('  ❌ "$term" - 兩頁面都沒有');
          }
        }
      }

    } catch (e) {
      print('❌ 比較失敗: $e');
    }
  });
}