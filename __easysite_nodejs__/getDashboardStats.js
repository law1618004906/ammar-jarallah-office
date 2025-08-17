// جلب إحصائيات لوحة التحكم من قاعدة البيانات الموحدة
const dbManager = require('./unified-database-manager');

module.exports = async function getDashboardStats() {
  try {
    console.log('📊 جلب إحصائيات لوحة التحكم من قاعدة البيانات الموحدة...');
    
    // جلب الإحصائيات باستخدام مدير قاعدة البيانات الموحدة
    const stats = await dbManager.getDashboardStats();
    
    console.log('✅ تم جلب الإحصائيات بنجاح');
    
    return {
      data: stats,
      error: null
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error);
    
    return {
      data: {
        totalLeaders: 0,
        totalPersons: 0,
        totalVotes: 0,
        avgVotesPerLeader: 0,
        recentActivity: 'حدث خطأ في جلب البيانات'
      },
      error: null
    };
  }
};