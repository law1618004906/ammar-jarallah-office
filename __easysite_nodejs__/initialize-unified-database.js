// سكربت لتهيئة قاعدة البيانات الموحدة
// يمكن تشغيل هذا السكربت لإنشاء الجداول الأولية

const initializeUnifiedDatabase = async () => {
  console.log('بدء تهيئة قاعدة البيانات الموحدة لنظام إدارة البيانات الانتخابية...');
  
  try {
    // إنشاء جدول المستخدمين
    console.log('إنشاء جدول المستخدمين...');
    const { error: usersError } = await ezsite.api.tableCreate('election_users', {
      username: 'admin',
      email: 'admin@election.gov.iq',
      name: 'مدير النظام',
      role: 'ADMIN',
      password_hash: 'hashed_password_here'
    });

    if (usersError && !usersError.includes('already exists')) {
      console.error('خطأ في إنشاء جدول المستخدمين:', usersError);
    } else {
      console.log('تم إنشاء جدول المستخدمين بنجاح');
    }

    // إنشاء جدول الأشخاص الموحد
    console.log('إنشاء جدول الأشخاص الموحد...');
    const { error: peopleError } = await ezsite.api.tableCreate('election_people', {
      full_name: 'اسم تجريبي',
      person_type: 'LEADER',
      phone: '07900000000',
      residence: 'بغداد',
      workplace: 'جهة حكومية',
      center_info: 'مركز انتخابي',
      station_number: '101',
      votes_count: 0,
      leader_id: null,
      leader_name: '',
      created_by: 'admin',
      status: 'ACTIVE'
    });

    if (peopleError && !peopleError.includes('already exists')) {
      console.error('خطأ في إنشاء جدول الأشخاص الموحد:', peopleError);
    } else {
      console.log('تم إنشاء جدول الأشخاص الموحد بنجاح');
    }

    // إنشاء جدول العلاقات الهرمية
    console.log('إنشاء جدول العلاقات الهرمية...');
    const { error: hierarchyError } = await ezsite.api.tableCreate('election_hierarchy', {
      leader_id: 1,
      person_id: 2,
      relationship_type: 'DIRECT',
      level: 1,
      created_at: new Date().toISOString()
    });

    if (hierarchyError && !hierarchyError.includes('already exists')) {
      console.error('خطأ في إنشاء جدول العلاقات الهرمية:', hierarchyError);
    } else {
      console.log('تم إنشاء جدول العلاقات الهرمية بنجاح');
    }

    // إنشاء جدول سجل العمليات
    console.log('إنشاء جدول سجل العمليات...');
    const { error: auditError } = await ezsite.api.tableCreate('election_audit', {
      operation: 'CREATE',
      table_name: 'election_people',
      record_id: 1,
      user_id: 'admin',
      old_values: null,
      new_values: '{"action": "initialize_database"}',
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    if (auditError && !auditError.includes('already exists')) {
      console.error('خطأ في إنشاء جدول سجل العمليات:', auditError);
    } else {
      console.log('تم إنشاء جدول سجل العمليات بنجاح');
    }

    console.log('✅ تم تهيئة قاعدة البيانات الموحدة بنجاح');
    console.log('الجداول التي تم إنشاؤها:');
    console.log('- election_users: جدول المستخدمين للمصادقة');
    console.log('- election_people: جدول الأشخاص الموحد (القادة والأفراد)');
    console.log('- election_hierarchy: جدول العلاقات الهرمية');
    console.log('- election_audit: جدول سجل العمليات');
    
    return {
      success: true,
      message: 'تم تهيئة قاعدة البيانات الموحدة بنجاح',
      tables: ['election_users', 'election_people', 'election_hierarchy', 'election_audit']
    };
    
  } catch (error) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات الموحدة:', error);
    return {
      success: false,
      message: `خطأ في تهيئة قاعدة البيانات الموحدة: ${error.message}`
    };
  }
};

// تصدير الدالة للاستخدام
module.exports = { initializeUnifiedDatabase };