
function logout() {
  // في التطبيق الحقيقي، نحذف JWT token من الكوكيز
  // ونعيد رسالة نجاح
  return {
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  };
}
