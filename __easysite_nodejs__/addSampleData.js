
async function addSampleData() {
  try {
    // Sample leaders data
    const sampleLeaders = [
      {
        full_name: 'احمد محمد علي',
        residence: 'بغداد - الكرادة',
        phone: '07901234567',
        workplace: 'وزارة التربية',
        center_info: 'مدرسة الرافدين الابتدائية',
        station_number: '101',
        votes_count: 150
      },
      {
        full_name: 'فاطمة حسن جعفر',
        residence: 'بغداد - الجادرية',
        phone: '07801234567',
        workplace: 'جامعة بغداد',
        center_info: 'كلية الهندسة',
        station_number: '102',
        votes_count: 200
      },
      {
        full_name: 'محمد كريم صالح',
        residence: 'البصرة - شط العرب',
        phone: '07701234567',
        workplace: 'شركة نفط البصرة',
        center_info: 'مدرسة الخليج المتوسطة',
        station_number: '201',
        votes_count: 180
      }
    ];

    // Sample persons data
    const samplePersons = [
      {
        leader_name: 'احمد محمد علي',
        full_name: 'سارة احمد محمد',
        residence: 'بغداد - الكرادة',
        phone: '07901234568',
        workplace: 'مستشفى بغداد',
        center_info: 'مدرسة الرافدين الابتدائية',
        station_number: '101',
        votes_count: 5
      },
      {
        leader_name: 'احمد محمد علي',
        full_name: 'عمر عبدالله حسن',
        residence: 'بغداد - الكرادة الشرقية',
        phone: '07901234569',
        workplace: 'بنك بغداد',
        center_info: 'مدرسة الرافدين الابتدائية',
        station_number: '101',
        votes_count: 3
      },
      {
        leader_name: 'فاطمة حسن جعفر',
        full_name: 'زينب محمود علي',
        residence: 'بغداد - الجادرية',
        phone: '07801234568',
        workplace: 'كلية الطب',
        center_info: 'كلية الهندسة',
        station_number: '102',
        votes_count: 7
      },
      {
        leader_name: 'محمد كريم صالح',
        full_name: 'يوسف حسين عبدالله',
        residence: 'البصرة - شط العرب',
        phone: '07701234568',
        workplace: 'مصفى البصرة',
        center_info: 'مدرسة الخليج المتوسطة',
        station_number: '201',
        votes_count: 4
      }
    ];

    // Add leaders
    for (const leader of sampleLeaders) {
      const { error } = await ezsite.api.tableCreate(34596, leader);
      if (error) {
        console.error(`خطأ في إضافة القائد ${leader.full_name}:`, error);
      }
    }

    // Add persons
    for (const person of samplePersons) {
      const { error } = await ezsite.api.tableCreate(34597, person);
      if (error) {
        console.error(`خطأ في إضافة الفرد ${person.full_name}:`, error);
      }
    }

    return {
      success: true,
      message: 'تم إضافة البيانات التجريبية بنجاح',
      leadersAdded: sampleLeaders.length,
      personsAdded: samplePersons.length
    };

  } catch (error) {
    throw new Error(`خطأ في إضافة البيانات التجريبية: ${error.message}`);
  }
}
