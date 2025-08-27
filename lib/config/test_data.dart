/// 測試數據管理
class TestData {
  // 測試用戶
  static const Map<String, String> validUser = {
    'email': 'test@agoramarket.com',
    'password': 'Test123456',
    'name': '測試用戶'
  };

  static const Map<String, String> invalidUser = {
    'email': 'invalid@test.com',
    'password': 'wrongpassword',
  };

  // 測試商品
  static const Map<String, dynamic> testProduct = {
    'id': 'test_product_001',
    'name': '測試商品',
    'price': 99.99,
    'description': '這是測試用商品'
  };

  // 搜尋關鍵字
  static const List<String> searchKeywords = ['電子產品', '手機', '筆記本電腦', '耳機'];
}
