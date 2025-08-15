// مثال على كيفية استخدام مدير قاعدة البيانات اليدوي
// يمكن تشغيل هذا السكربت لإضافة وتعديل وحذف البيانات يدوياً

const { manualOperations } = require('./manual-database-manager.js');

// مثال: إضافة قائد جديد
const addNewLeader = async () => {
  try {
    console.log('🔄 جاري إضافة قائد جديد...');
    const result = await manualOperations.addLeader(
      'علي حسن محمد',
      'بغداد - الكرادة',
      '07901234567',
      'وزارة الصحة',
      'مستشفى الرافدين',
      '102',
      120
    );
    console.log('✅ تم إضافة القائد بنجاح:', result);
  } catch (error) {
    console.error('❌ خطأ في إضافة القائد:', error.message);
  }
};

// مثال: إضافة فرد جديد
const addNewPerson = async () => {
  try {
    console.log('🔄 جاري إضافة فرد جديد...');
    const result = await manualOperations.addPerson(
      'فاطمة علي حسن',
      'علي حسن محمد',
      'بغداد - الكرادة',
      '07901234568',
      'مدرسة الرافدين',
      'مستشفى الرافدين',
      '102',
      8
    );
    console.log('✅ تم إضافة الفرد بنجاح:', result);
  } catch (error) {
    console.error('❌ خطأ في إضافة الفرد:', error.message);
  }
};

// مثال: تعديل بيانات شخص
const updatePersonData = async () => {
  try {
    console.log('🔄 جاري تعديل بيانات شخص...');
    // ملاحظة: يجب استبدال person_id بالمعرّف الفعلي
    const result = await manualOperations.updatePerson(1, {
      votes_count: 150,
      workplace: 'وزارة التعليم',
      residence: 'بغداد - الجادرية'
    });
    console.log('✅ تم تعديل بيانات الشخص بنجاح:', result);
  } catch (error) {
    console.error('❌ خطأ في تعديل بيانات الشخص:', error.message);
  }
};

// مثال: حذف شخص
const deletePersonRecord = async () => {
  try {
    console.log('🔄 جاري حذف شخص...');
    // ملاحظة: يجب استبدال person_id بالمعرّف الفعلي
    const result = await manualOperations.deletePerson(2);
    console.log('✅ تم حذف الشخص بنجاح:', result);
  } catch (error) {
    console.error('❌ خطأ في حذف الشخص:', error.message);
  }
};

// مثال: عرض الإحصائيات
const showCurrentStats = async () => {
  try {
    console.log('🔄 جاري جلب الإحصائيات...');
    const stats = await manualOperations.showStats();
    return stats;
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error.message);
  }
};

// دالة رئيسية لتشغيل الأمثلة
const runExamples = async () => {
  console.log('🚀 بدء تشغيل أمثلة إدارة قاعدة البيانات اليدوية...\n');
  
  // عرض الإحصائيات الحالية
  console.log('1. عرض الإحصائيات الحالية:');
  await showCurrentStats();
  console.log('');
  
  // إضافة قائد
  console.log('2. إضافة قائد جديد:');
  await addNewLeader();
  console.log('');
  
  // إضافة فرد
  console.log('3. إضافة فرد جديد:');
  await addNewPerson();
  console.log('');
  
  // عرض الإحصائيات بعد الإضافة
  console.log('4. الإحصائيات بعد الإضافة:');
  await showCurrentStats();
  console.log('');
  
  // تعديل بيانات شخص (ملاحظة: قد تحتاج إلى تعديل person_id)
  // console.log('5. تعديل بيانات شخص:');
  // await updatePersonData();
  // console.log('');
  
  // حذف شخص (ملاحظة: قد تحتاج إلى تعديل person_id)
  // console.log('6. حذف شخص:');
  // await deletePersonRecord();
  // console.log('');
  
  console.log('✅ اكتملت الأمثلة بنجاح!');
};

// تشغيل الأمثلة
if (require.main === module) {
  runExamples().catch(console.error);
}

// تصدير الدوال للاستخدام في وحدات أخرى
module.exports = {
  addNewLeader,
  addNewPerson,
  updatePersonData,
  deletePersonRecord,
  showCurrentStats,
  runExamples
};