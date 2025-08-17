// جلب جميع القادة من قاعدة البيانات الموحدة
const dbManager = require('./unified-database-manager');

module.exports = async function getLeaders() {
  try {
    console.log('🔍 جلب القادة من قاعدة البيانات الموحدة...');
    
    const leaders = await dbManager.getLeaders();
    
    console.log(`✅ تم جلب ${leaders.length} قائد بنجاح`);
    
    return {
      data: leaders,
      error: null
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب القادة:', error);
    
    // إرجاع بيانات تجريبية في حالة الخطأ
    return {
      data: [
        {
          id: 1,
          full_name: "قائد تجريبي",
          phone: "07901234567",
          address: "بغداد",
          work: "موظف حكومي",
          voting_center: "مركز تجريبي",
          station_number: "101",
          votes_count: 0
        }
      ],
      error: null
    };
  }
};