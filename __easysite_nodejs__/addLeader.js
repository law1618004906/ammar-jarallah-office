const dbManager = require('./unified-database-manager');

module.exports = async function addLeader(leaderData) {
  try {
    console.log('➕ إضافة قائد جديد:', leaderData);
    
    // التحقق من صحة البيانات
    if (!leaderData.full_name || !leaderData.phone) {
      return {
        data: null,
        error: 'الاسم الكامل ورقم الهاتف مطلوبان'
      };
    }
    
    // إضافة القائد باستخدام مدير قاعدة البيانات الموحدة
    const result = await dbManager.addLeader(leaderData);
    
    console.log('✅ تم إضافة القائد بنجاح:', result);
    
    // Log the operation to audit table
    await ezsite.api.tableCreate('election_audit', {
      operation: 'CREATE',
      table_name: 'election_people',
      record_id: result?.ID || 0,
      user_id: 'admin',
      old_values: null,
      new_values: JSON.stringify({
        action: 'create_leader',
        leader_name: leaderData.full_name
      }),
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    return data;
  } catch (error) {
    console.error('Add leader error:', error);
    throw error;
  }
}