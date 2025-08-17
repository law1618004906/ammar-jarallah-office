// قاعدة بيانات موحدة لنظام إدارة البيانات الانتخابية
// تصميم موحد يدعم القادة والأفراد مع علاقات هرمية

// جدول المستخدمين للمصادقة (عمودين)
const createUsersTable = async () => {
  try {
    const { error } = await ezsite.api.tableCreate('election_users', {
      username: 'admin',
      password: '123456' // كلمة المرور الافتراضية
    });

    if (error && !error.includes('already exists')) {
      console.error('خطأ في إنشاء جدول المستخدمين:', error);
    }
  } catch (error) {
    console.error('خطأ في إنشاء جدول المستخدمين:', error);
  }
};

// جدول القادة (7 أعمدة)
const createLeadersTable = async () => {
  try {
    const { error } = await ezsite.api.tableCreate('election_leaders', {
      full_name: 'اسم القائد',
      phone: '07900000000',
      address: 'بغداد',
      work: 'جهة حكومية',
      voting_center: 'مركز انتخابي',
      station_number: '101',
      votes_count: 0
    });

    if (error && !error.includes('already exists')) {
      console.error('خطأ في إنشاء جدول القادة:', error);
    }
  } catch (error) {
    console.error('خطأ في إنشاء جدول القادة:', error);
  }
};

// جدول الأفراد (8 أعمدة)
const createPersonsTable = async () => {
  try {
    const { error } = await ezsite.api.tableCreate('election_persons', {
      full_name: 'اسم الفرد',
      phone: '07900000000',
      address: 'بغداد',
      work: 'جهة حكومية',
      voting_center: 'مركز انتخابي',
      station_number: '101',
      leader_name: 'اسم القائد',
      votes_count: 0
    });

    if (error && !error.includes('already exists')) {
      console.error('خطأ في إنشاء جدول الأفراد:', error);
    }
  } catch (error) {
    console.error('خطأ في إنشاء جدول الأفراد:', error);
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
  await createLeadersTable();
  await createPersonsTable();
  await createHierarchyTable();
  await createAuditTable();
  
  console.log('تم تهيئة قاعدة البيانات الموحدة بنجاح');
}

// تصدير الدوال للاستخدام في السكربتات الأخرى
module.exports = {
  initializeUnifiedDatabase,
  createUsersTable,
  createLeadersTable,
  createPersonsTable,
  createHierarchyTable,
  createAuditTable
};