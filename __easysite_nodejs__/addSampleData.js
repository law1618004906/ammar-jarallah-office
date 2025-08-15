
async function addSampleData() {
  try {
    // Sample leaders data
    const sampleLeaders = [
    {
      full_name: 'أحمد محمد علي',
      residence: 'بغداد - الكرادة',
      phone: '07701234567',
      workplace: 'شركة النفط',
      center_info: 'مركز الكرادة الانتخابي',
      station_number: '101',
      votes_count: 250
    },
    {
      full_name: 'فاطمة حسن كريم',
      residence: 'بغداد - المنصور',
      phone: '07712345678',
      workplace: 'وزارة التربية',
      center_info: 'مركز المنصور الانتخابي',
      station_number: '102',
      votes_count: 180
    },
    {
      full_name: 'محمد عبد الله حسين',
      residence: 'البصرة - الزبير',
      phone: '07723456789',
      workplace: 'ميناء البصرة',
      center_info: 'مركز الزبير الانتخابي',
      station_number: '201',
      votes_count: 320
    },
    {
      full_name: 'زينب صالح أحمد',
      residence: 'الموصل - الجامعة',
      phone: '07734567890',
      workplace: 'جامعة الموصل',
      center_info: 'مركز الجامعة الانتخابي',
      station_number: '301',
      votes_count: 195
    },
    {
      full_name: 'عمار جاسم محمد',
      residence: 'النجف - المدينة',
      phone: '07745678901',
      workplace: 'دائرة الصحة',
      center_info: 'مركز النجف الانتخابي',
      station_number: '401',
      votes_count: 275
    }];


    // Sample persons data
    const samplePersons = [
    {
      leader_name: 'أحمد محمد علي',
      full_name: 'سارة أحمد محمد',
      residence: 'بغداد - الكرادة',
      phone: '07701234568',
      workplace: 'جامعة بغداد',
      center_info: 'مركز الكرادة الانتخابي',
      station_number: '101',
      votes_count: 45
    },
    {
      leader_name: 'أحمد محمد علي',
      full_name: 'حسام علي أحمد',
      residence: 'بغداد - الكرادة',
      phone: '07701234569',
      workplace: 'شركة الكهرباء',
      center_info: 'مركز الكرادة الانتخابي',
      station_number: '101',
      votes_count: 38
    },
    {
      leader_name: 'فاطمة حسن كريم',
      full_name: 'علي حسن محمود',
      residence: 'بغداد - المنصور',
      phone: '07712345679',
      workplace: 'شركة الاتصالات',
      center_info: 'مركز المنصور الانتخابي',
      station_number: '102',
      votes_count: 28
    },
    {
      leader_name: 'فاطمة حسن كريم',
      full_name: 'نور فاطمة حسن',
      residence: 'بغداد - المنصور',
      phone: '07712345680',
      workplace: 'مستشفى اليرموك',
      center_info: 'مركز المنصور الانتخابي',
      station_number: '102',
      votes_count: 42
    },
    {
      leader_name: 'محمد عبد الله حسين',
      full_name: 'أسماء محمد عبد الله',
      residence: 'البصرة - الزبير',
      phone: '07723456790',
      workplace: 'شركة البتروكيماويات',
      center_info: 'مركز الزبير الانتخابي',
      station_number: '201',
      votes_count: 55
    },
    {
      leader_name: 'زينب صالح أحمد',
      full_name: 'يوسف زينب صالح',
      residence: 'الموصل - الجامعة',
      phone: '07734567891',
      workplace: 'شركة الإعمار',
      center_info: 'مركز الجامعة الانتخابي',
      station_number: '301',
      votes_count: 33
    },
    {
      leader_name: 'عمار جاسم محمد',
      full_name: 'ليلى عمار جاسم',
      residence: 'النجف - المدينة',
      phone: '07745678902',
      workplace: 'دائرة التربية',
      center_info: 'مركز النجف الانتخابي',
      station_number: '401',
      votes_count: 48
    }];


    // Add leaders
    for (const leader of sampleLeaders) {
      const { error } = await ezsite.api.tableCreate(34596, leader);
      if (error) {
        console.error('Error adding leader:', error);
      }
    }

    // Add persons
    for (const person of samplePersons) {
      const { error } = await ezsite.api.tableCreate(34597, person);
      if (error) {
        console.error('Error adding person:', error);
      }
    }

    return {
      success: true,
      message: `تم إضافة ${sampleLeaders.length} قائد و ${samplePersons.length} فرد بنجاح`
    };

  } catch (error) {
    throw new Error(`خطأ في إضافة البيانات التجريبية: ${error.message}`);
  }
}