import 'dart:async';
import 'package:playwright/playwright.dart' as pw;

/// Flutter Web 應用專用測試工具
class FlutterWebTester {
  final pw.Page _page;
  final pw.BrowserContext _context;

  FlutterWebTester(this._page, this._context);

  /// 檢查是否為 Flutter Web 應用
  Future<bool> isFlutterWebApp() async {
    try {
      final flutterViewCount = await _page.locator('flutter-view').count();
      final fltElementsCount = await _page.locator('[class*="flt-"], [id*="flt-"]').count();
      final flutterScriptsCount = await _page.locator('script[src*="main.dart.js"]').count();

      return flutterViewCount > 0 && (fltElementsCount > 0 || flutterScriptsCount > 0);
    } catch (e) {
      return false;
    }
  }

  /// 查找 Flutter 按鈕元素
  Future<List<FlutterButton>> findFlutterButtons() async {
    final buttons = <FlutterButton>[];

    // 查找所有可能的 Flutter 按鈕元素
    final buttonSelectors = [
      'flt-semantics-placeholder[role="button"]',
      '[role="button"]',
      'button',
      '[aria-label]',
      '[onclick]',
      '[onmousedown]'
    ];

    for (final selector in buttonSelectors) {
      final elements = _page.locator(selector);
      final count = await elements.count();

      for (int i = 0; i < count; i++) {
        final element = elements.nth(i);
        final button = await _createFlutterButton(element, selector, i);
        if (button != null) {
          buttons.add(button);
        }
      }
    }

    return buttons;
  }

  /// 創建 Flutter 按鈕對象
  Future<FlutterButton?> _createFlutterButton(pw.Locator element, String selector, int index) async {
    try {
      final tagName = await element.evaluate('el => el.tagName') as String? ?? '';
      final role = await element.getAttribute('role') ?? '';
      final ariaLabel = await element.getAttribute('aria-label') ?? '';
      final textContent = await element.textContent() ?? '';
      final className = await element.getAttribute('class') ?? '';
      final boundingBox = await element.boundingBox();

      return FlutterButton(
        element: element,
        selector: selector,
        index: index,
        tagName: tagName,
        role: role,
        ariaLabel: ariaLabel,
        textContent: textContent,
        className: className,
        boundingBox: boundingBox,
        isVisible: boundingBox != null,
        isOffScreen: boundingBox != null && (boundingBox.x < 0 || boundingBox.y < 0),
      );
    } catch (e) {
      return null;
    }
  }

  /// 點擊 Flutter 按鈕（多種方法）
  Future<bool> clickFlutterButton(FlutterButton button) async {
    final methods = [
      () => _clickWithJavaScript(button),
      () => _clickWithFocusAndSpace(button),
      () => _clickWithDispatchEvent(button),
      () => _clickWithStandardMethod(button),
    ];

    for (final method in methods) {
      try {
        final success = await method();
        if (success) {
          return true;
        }
      } catch (e) {
        continue;
      }
    }

    return false;
  }

  /// 使用 JavaScript 點擊
  Future<bool> _clickWithJavaScript(FlutterButton button) async {
    try {
      await _page.evaluate('''(selector, index) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > index) {
          elements[index].click();
          return true;
        }
        return false;
      }''', arg: [button.selector, button.index]);

      await _page.waitForTimeout(2000);
      return true;
    } catch (e) {
      return false;
    }
  }

  /// 使用聚焦和空格鍵
  Future<bool> _clickWithFocusAndSpace(FlutterButton button) async {
    try {
      await button.element.focus();
      await _page.keyboard.press(' ');
      await _page.waitForTimeout(2000);
      return true;
    } catch (e) {
      return false;
    }
  }

  /// 使用事件分發
  Future<bool> _clickWithDispatchEvent(FlutterButton button) async {
    try {
      await _page.dispatchEvent(button.selector, 'click');
      await _page.waitForTimeout(2000);
      return true;
    } catch (e) {
      return false;
    }
  }

  /// 使用標準方法
  Future<bool> _clickWithStandardMethod(FlutterButton button) async {
    try {
      await button.element.click(timeout: Duration(seconds: 5));
      return true;
    } catch (e) {
      return false;
    }
  }

  /// 檢查按鈕點擊後是否顯示了新元素
  Future<ButtonClickResult> checkButtonClickResult(FlutterButton button) async {
    final beforeInputs = await _page.locator('input:not([type="hidden"])').count();
    final beforeButtons = await _page.locator('button').count();
    final beforeForms = await _page.locator('form').count();

    final clickSuccess = await clickFlutterButton(button);

    if (!clickSuccess) {
      return ButtonClickResult(
        success: false,
        error: 'Failed to click button',
        newInputs: 0,
        newButtons: 0,
        newForms: 0,
        revealedLoginForm: false,
      );
    }

    await _page.waitForTimeout(3000);

    final afterInputs = await _page.locator('input:not([type="hidden"])').count();
    final afterButtons = await _page.locator('button').count();
    final afterForms = await _page.locator('form').count();

    final newInputs = afterInputs - beforeInputs;
    final newButtons = afterButtons - beforeButtons;
    final newForms = afterForms - beforeForms;

    // 檢查是否顯示了登入表單
    final hasLoginKeywords = await _page.locator('text=/login|signin|auth|username|password/i').count() > 0;
    final revealedLoginForm = newInputs > 0 || hasLoginKeywords;

    return ButtonClickResult(
      success: true,
      newInputs: newInputs,
      newButtons: newButtons,
      newForms: newForms,
      revealedLoginForm: revealedLoginForm,
    );
  }

  /// 測試登入功能
  Future<LoginTestResult> testLoginFunctionality() async {
    final buttons = await findFlutterButtons();

    for (final button in buttons) {
      final result = await checkButtonClickResult(button);

      if (result.revealedLoginForm) {
        // 嘗試填寫登入表單
        final loginSuccess = await _attemptLogin();

        return LoginTestResult(
          canTestLogin: true,
          buttonFound: button,
          clickResult: result,
          loginSuccess: loginSuccess,
        );
      }
    }

    return LoginTestResult(
      canTestLogin: false,
      buttonFound: null,
      clickResult: null,
      loginSuccess: false,
    );
  }

  /// 嘗試登入
  Future<bool> _attemptLogin() async {
    try {
      // 查找輸入框
      const inputSelectors = [
        'input[type="text"]',
        'input[type="email"]',
        'input:not([type])',
        'input[placeholder*="email" i]',
        'input[placeholder*="username" i]',
        'input[placeholder*="user" i]',
      ];

      const passwordSelectors = [
        'input[type="password"]',
        'input[placeholder*="password" i]',
        'input[placeholder*="密碼" i]',
      ];

      pw.Locator? usernameInput;
      pw.Locator? passwordInput;

      // 查找用戶名輸入框
      for (final selector in inputSelectors) {
        final inputs = _page.locator(selector);
        if (await inputs.count() > 0) {
          usernameInput = inputs.first();
          break;
        }
      }

      // 查找密碼輸入框
      for (final selector in passwordSelectors) {
        final inputs = _page.locator(selector);
        if (await inputs.count() > 0) {
          passwordInput = inputs.first();
          break;
        }
      }

      if (usernameInput != null && passwordInput != null) {
        await usernameInput.fill('testuser@agoramarket.com');
        await passwordInput.fill('TestPass123!');

        // 查找提交按鈕
        const submitSelectors = [
          'button[type="submit"]',
          'button:has-text("Login")',
          'button:has-text("Sign In")',
          'button:has-text("登入")',
          'input[type="submit"]',
        ];

        for (final selector in submitSelectors) {
          final submitButton = _page.locator(selector).first();
          if (await submitButton.count() > 0) {
            await submitButton.click();
            await _page.waitForTimeout(3000);
            return true;
          }
        }
      }

      return false;
    } catch (e) {
      return false;
    }
  }
}

/// Flutter 按鈕對象
class FlutterButton {
  final pw.Locator element;
  final String selector;
  final int index;
  final String tagName;
  final String role;
  final String ariaLabel;
  final String textContent;
  final String className;
  final pw.BoundingBox? boundingBox;
  final bool isVisible;
  final bool isOffScreen;

  FlutterButton({
    required this.element,
    required this.selector,
    required this.index,
    required this.tagName,
    required this.role,
    required this.ariaLabel,
    required this.textContent,
    required this.className,
    required this.boundingBox,
    required this.isVisible,
    required this.isOffScreen,
  });

  @override
  String toString() {
    return 'FlutterButton(tag: $tagName, role: $role, ariaLabel: $ariaLabel, visible: $isVisible, offScreen: $isOffScreen)';
  }
}

/// 按鈕點擊結果
class ButtonClickResult {
  final bool success;
  final String? error;
  final int newInputs;
  final int newButtons;
  final int newForms;
  final bool revealedLoginForm;

  ButtonClickResult({
    required this.success,
    this.error,
    required this.newInputs,
    required this.newButtons,
    required this.newForms,
    required this.revealedLoginForm,
  });
}

/// 登入測試結果
class LoginTestResult {
  final bool canTestLogin;
  final FlutterButton? buttonFound;
  final ButtonClickResult? clickResult;
  final bool loginSuccess;

  LoginTestResult({
    required this.canTestLogin,
    this.buttonFound,
    this.clickResult,
    required this.loginSuccess,
  });
}