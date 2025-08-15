// قاعدة بيانات موحدة لنظام إدارة البيانات الانتخابية
// تصميم موحد يدعم القادة والأفراد مع علاقات هرمية

// جدول المستخدمين للمصادقة
const createUsersTable = async () => {
  try {
    const { error } = await ezsite.api.tableCreate('election_users', {
      username: 'admin',
      email: 'admin@election.gov.iq',
      name: 'مدير النظام',
      role: 'ADMIN',
      password_hash: 'hashed_password_here'
    });

    if (error && !error.includes('already exists')) {
      console.error('خطأ في إنشاء جدول المستخدمين:', error);
    }
  } catch (error) {
    console.error('خطأ في إنشاء جدول المستخدمين:', error);
  }
};

// جدول الأشخاص الموحد (يدعم القادة والأفراد)
const createUnifiedPeopleTable = async () => {
  try {
    const { error } = await ezsite.api.tableCreate('election_people', {
      full_name: 'اسم تجريبي',
      person_type: 'LEADER', // LEADER, INDIVIDUAL
      phone: '07900000000',
      residence: 'بغداد',
      workplace: 'جهة حكومية',
      center_info: 'مركز انتخابي',
      station_number: '101',
      votes_count: 0,
      leader_id: null, // للأفراد فقط، يشير إلى القائد
      created_by: 'admin',
      status: 'ACTIVE'
    });

    if (error && !error.includes('already exists')) {
      console.error('خطأ في إنشاء جدول الأشخاص الموحد:', error);
    }
  } catch (error) {
    console.error('خطأ في إنشاء جدول الأشخاص الموحد:', error);
  }
};

// جدول العلاقات الهرمية (للعلاقات المعقدة)
const createHierarchyTable = async () => {
  try {
    const { error } = await ezsite.api.tableCreate('election_hierarchy', {
      leader_id: 1,
      person_id: 2,
      relationship_type: 'DIRECT', // DIRECT, INDIRECT
      level: 1,
      created_at: new Date().toISOString()
    });

    if (error && !error.includes('already exists')) {
      console.error('خطأ في إنشاء جدول العلاقات الهرمية:', error);
    }
  } catch (error) {
    console.error('خطأ في إنشاء جدول العلاقات الهرمية:', error);
  }
};

// جدول سجل العمليات
const createAuditTable = async () => {
  try {
    const { error } = await ezsite.api.tableCreate('election_audit', {
      operation: 'CREATE',
      table_name: 'election_people',
      record_id: 1,
      user_id: 'admin',
      old_values: null,
      new_values: '{"full_name": "اسم تجريبي"}',
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    if (error && !error.includes('already exists')) {
      console.error('خطأ في إنشاء جدول سجل العمليات:', error);
    }
  } catch (error) {
    console.error('خطأ في إنشاء جدول سجل العمليات:', error);
  }
};

// دالة لتهيئة قاعدة البيانات الموحدة
async function initializeUnifiedDatabase() {
  console.log('بدء تهيئة قاعدة البيانات الموحدة...');
  
  await createUsersTable();
  await createUnifiedPeopleTable();
  await createHierarchyTable();
  await createAuditTable();
  
  console.log('تم تهيئة قاعدة البيانات الموحدة بنجاح');
}

// تصدير الدوال للاستخدام في السكربتات الأخرى
module.exports = {
  initializeUnifiedDatabase,
  createUsersTable,
  createUnifiedPeopleTable,
  createHierarchyTable,
  createAuditTable
};