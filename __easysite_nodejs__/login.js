// نظام تسجيل الدخول الموحد
const dbManager = require('./unified-database-manager');

module.exports = async function login(credentials) {
  try {
    const { username, password } = credentials;
    
    console.log('🔐 محاولة تسجيل دخول للمستخدم:', username);
    
    // التحقق من صحة البيانات
    if (!username || !password) {
      return {
        data: null,
        error: 'اسم المستخدم وكلمة المرور مطلوبان'
      };
    }
    
    // استخدام مدير قاعدة البيانات الموحدة للمصادقة
    const authResult = await dbManager.authenticateUser(username, password);
    
    if (authResult.success) {
      console.log('✅ تم تسجيل الدخول بنجاح:', authResult.user.username);
      
      return {
        data: {
          user: authResult.user,
          token: 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        },
        error: null
      };
    } else {
      console.log('❌ فشل في تسجيل الدخول:', authResult.error);
      
      return {
        data: null,
        error: authResult.error
      };
    }
    
  } catch (error) {
    console.error('💥 خطأ عام في تسجيل الدخول:', error);
    
    return {
      data: null,
      error: 'حدث خطأ في النظام'
    };
    console.error('Login error:', error);
    throw error;
  }
}