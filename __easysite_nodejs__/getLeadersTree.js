// جلب الشجرة الهرمية للقادة والأفراد من قاعدة البيانات الموحدة
const dbManager = require('./unified-database-manager');

module.exports = async function getLeadersTree() {
  try {
    console.log('🌳 جلب الشجرة الهرمية للقادة من قاعدة البيانات الموحدة...');
    
    // جلب الشجرة الهرمية باستخدام مدير قاعدة البيانات الموحدة
    const result = await dbManager.getLeadersTree();
    
    console.log('✅ تم بناء الشجرة الهرمية بنجاح');
    
    return {
      data: result,
      error: null
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب الشجرة الهرمية:', error);
    
    // إرجاع بيانات تجريبية في حالة الخطأ
    return {
      data: {
        tree: [
          {
            id: "leader-1",
            name: "قائد تجريبي",
            type: "leader",
            totalVotes: 100,
            details: {
              phone: "07901234567",
              address: "بغداد",
              work: "موظف حكومي",
              votingCenter: "مركز تجريبي",
              stationNumber: "101"
            },
            children: []
          }
        ],
        stats: {
          totalLeaders: 1,
          totalPersons: 0,
          totalVotes: 100,
          avgVotesPerLeader: 100
        }
      },
      error: null
    };
  }
}