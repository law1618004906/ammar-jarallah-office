# نظام قاعدة البيانات الموحدة

## نظرة عامة
تم توحيد قاعدة البيانات في نظام واحد متكامل يدعم إدارة القادة والأفراد مع علاقات هرمية متطورة.

## الجداول الموحدة

### 1. election_users (جدول المستخدمين)
- **الغرض**: تخزين معلومات المستخدمين للمصادقة
- **الحقول**:
  - `username`: اسم المستخدم
  - `email`: البريد الإلكتروني
  - `name`: الاسم الكامل
  - `role`: الدور (ADMIN, USER)
  - `password_hash`: كلمة المرور المشفرة

### 2. election_people (جدول الأشخاص الموحد)
- **الغرض**: تخزين بيانات القادة والأفراد في جدول واحد
- **الحقول**:
  - `full_name`: الاسم الكامل
  - `person_type`: نوع الشخص (LEADER, INDIVIDUAL)
  - `phone`: رقم الهاتف
  - `residence`: عنوان السكن
  - `workplace`: مكان العمل
  - `center_info`: معلومات المركز الانتخابي
  - `station_number`: رقم المحطة الانتخابية
  - `votes_count`: عدد الأصوات
  - `leader_id`: معرّف القائد (للأفراد فقط)
  - `leader_name`: اسم القائد (للأفراد فقط)
  - `created_by`: منشئ السجل
  - `status`: الحالة (ACTIVE, INACTIVE)

### 3. election_hierarchy (جدول العلاقات الهرمية)
- **الغرض**: تخزين العلاقات بين القادة والأفراد
- **الحقول**:
  - `leader_id`: معرّف القائد
  - `person_id`: معرّف الفرد
  - `relationship_type`: نوع العلاقة (DIRECT, INDIRECT)
  - `level`: المستوى الهرمي
  - `created_at`: تاريخ الإنشاء

### 4. election_audit (جدول سجل العمليات)
- **الغرض**: تسجيل جميع العمليات على النظام
- **الحقول**:
  - `operation`: نوع العملية (CREATE, UPDATE, DELETE)
  - `table_name`: اسم الجدول
  - `record_id`: معرّف السجل
  - `user_id`: معرّف المستخدم
  - `old_values`: القيم القديمة
  - `new_values`: القيم الجديدة
  - `timestamp`: التوقيت
  - `ip_address`: عنوان IP

## المميزات

### 1. نظام موحد
- جدول واحد للقادة والأفراد
- سهولة في البحث والتصفية
- دعم العلاقات المعقدة

### 2. دعم كامل للعمليات
- إضافة قادة وأفراد
- تعديل البيانات
- حذف السجلات
- البحث المتقدم

### 3. نظام علاقات هرمي
- علاقة مباشرة بين القائد والفرد
- دعم مستويات متعددة
- سهولة في بناء الشجرة الهرمية

### 4. نظام تدقيق وتتبع
- تسجيل جميع العمليات
- تتبع التغييرات
- دعم استعادة البيانات

## الاستخدام

### التهيئة الأولي
```javascript
// تشغيل سكربت التهيئة
const { initializeUnifiedDatabase } = require('./initialize-unified-database.js');
await initializeUnifiedDatabase();
```

### إضافة قائد
```javascript
const { addLeader } = require('./addLeader.js');
const result = await addLeader({
  full_name: 'احمد محمد',
  person_type: 'LEADER',
  residence: 'بغداد',
  phone: '07901234567',
  workplace: 'وزارة التربية',
  center_info: 'مدرسة الرافدين',
  station_number: '101',
  votes_count: 150
});
```

### إضافة فرد
```javascript
const { addPerson } = require('./addPerson.js');
const result = await addPerson({
  full_name: 'محمد علي',
  person_type: 'INDIVIDUAL',
  leader_name: 'احمد محمد',
  residence: 'بغداد',
  phone: '07901234568',
  workplace: 'شركة خاصة',
  center_info: 'مدرسة الرافدين',
  station_number: '101',
  votes_count: 5
});
```

### جلب القادة
```javascript
const { getLeaders } = require('./getLeaders.js');
const leaders = await getLeaders();
```

### جلب الأفراد
```javascript
const { getPersons } = require('./getPersons.js');
const persons = await getPersons();
```

### العرض الشجري
```javascript
const { getLeadersTree } = require('./getLeadersTree.js');
const tree = await getLeadersTree();
```

## التحسينات

### 1. الأداء
- جداول محسنة للبحث
- فهارس مناسبة
- استعلامات فعالة

### 2. الأمان
- تسجيل العمليات
- التحقق من الصلاحيات
- حماية البيانات

### 3. المرونة
- دعم أنواع مختلفة من العلاقات
- سهولة في التوسع
- توافق مع الأنظمة الأخرى

## الصيانة

### النسخ الاحتياطي
يتم نسخ البيانات بانتظام مع إمكانية الاستعادة من سجل العمليات.

### التحديثات
يمكن تحديث بنية الجداول دون فقدان البيانات الحالية.

### المراقبة
يتم مراقبة أداء النظام وتسجيل أي مشاكل.

## الخلاصة

نظام قاعدة البيانات الموحدة يوفر حلاً متكاملاً لإدارة البيانات الانتخابية مع دعم كامل للعمليات الأساسية والعلاقات المعقدة. النظام مصمم ليكون مرناً وآمناً وسهل الاستخدام.