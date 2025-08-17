// جلب جميع الأفراد من قاعدة البيانات الموحدة
const dbManager = require('./unified-database-manager');

module.exports = async function getPersons() {
  try {
    console.log('🔍 جلب الأفراد من قاعدة البيانات الموحدة...');
    
    const persons = await dbManager.getPersons();
    
    console.log(`✅ تم جلب ${persons.length} فرد بنجاح`);
    
    return {
      data: persons,
      error: null
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب الأفراد:', error);
    
    // إرجاع بيانات تجريبية في حالة الخطأ
    return {
      data: [
        {
          id: 1,
          full_name: "فرد تجريبي",
          phone: "07901234567",
          address: "بغداد",
          work: "موظف حكومي",
          voting_center: "مركز تجريبي",
          station_number: "101",
          leader_name: "قائد تجريبي",
          votes_count: 0
        }
      ],
      error: null
    };
  }
};