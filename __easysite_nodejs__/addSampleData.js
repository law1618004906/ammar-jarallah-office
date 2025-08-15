
async function addSampleData() {
  try {
    // Sample leaders data
    const sampleLeaders = [
      {
        full_name: 'احمد محمد علي',
        person_type: 'LEADER',
        residence: 'بغداد - الكرادة',
        phone: '07901234567',
        workplace: 'وزارة التربية',
        center_info: 'مدرسة الرافدين الابتدائية',
        station_number: '101',
        votes_count: 150,
        leader_id: null,
        leader_name: '',
        created_by: 'admin',
        status: 'ACTIVE'
      },
      {
        full_name: 'فاطمة حسن جعفر',
        person_type: 'LEADER',
        residence: 'بغداد - الجادرية',
        phone: '07801234567',
        workplace: 'جامعة بغداد',
        center_info: 'كلية الهندسة',
        station_number: '102',
        votes_count: 200,
        leader_id: null,
        leader_name: '',
        created_by: 'admin',
        status: 'ACTIVE'
      },
      {
        full_name: 'محمد كريم صالح',
        person_type: 'LEADER',
        residence: 'البصرة - شط العرب',
        phone: '07701234567',
        workplace: 'شركة نفط البصرة',
        center_info: 'مدرسة الخليج المتوسطة',
        station_number: '201',
        votes_count: 180,
        leader_id: null,
        leader_name: '',
        created_by: 'admin',
        status: 'ACTIVE'
      }
    ];

    // Sample persons data
    const samplePersons = [
      {
        full_name: 'سارة احمد محمد',
        person_type: 'INDIVIDUAL',
        residence: 'بغداد - الكرادة',
        phone: '07901234568',
        workplace: 'مستشفى بغداد',
        center_info: 'مدرسة الرافدين الابتدائية',
        station_number: '101',
        votes_count: 5,
        leader_name: 'احمد محمد علي',
        created_by: 'admin',
        status: 'ACTIVE'
      },
      {
        full_name: 'عمر عبدالله حسن',
        person_type: 'INDIVIDUAL',
        residence: 'بغداد - الكرادة الشرقية',
        phone: '07901234569',
        workplace: 'بنك بغداد',
        center_info: 'مدرسة الرافدين الابتدائية',
        station_number: '101',
        votes_count: 3,
        leader_name: 'احمد محمد علي',
        created_by: 'admin',
        status: 'ACTIVE'
      },
      {
        full_name: 'زينب محمود علي',
        person_type: 'INDIVIDUAL',
        residence: 'بغداد - الجادرية',
        phone: '07801234568',
        workplace: 'كلية الطب',
        center_info: 'كلية الهندسة',
        station_number: '102',
        votes_count: 7,
        leader_name: 'فاطمة حسن جعفر',
        created_by: 'admin',
        status: 'ACTIVE'
      },
      {
        full_name: 'يوسف حسين عبدالله',
        person_type: 'INDIVIDUAL',
        residence: 'البصرة - شط العرب',
        phone: '07701234568',
        workplace: 'مصفى البصرة',
        center_info: 'مدرسة الخليج المتوسطة',
        station_number: '201',
        votes_count: 4,
        leader_name: 'محمد كريم صالح',
        created_by: 'admin',
        status: 'ACTIVE'
      }
    ];

    // Add leaders
    for (const leader of sampleLeaders) {
      const { error } = await ezsite.api.tableCreate('election_people', leader);
      if (error) {
        console.error(`خطأ في إضافة القائد ${leader.full_name}:`, error);
      }
    }

    // Add persons
    for (const person of samplePersons) {
      const { error } = await ezsite.api.tableCreate('election_people', person);
      if (error) {
        console.error(`خطأ في إضافة الفرد ${person.full_name}:`, error);
      }
    }

    // Log the operation to audit table
    await ezsite.api.tableCreate('election_audit', {
      operation: 'CREATE',
      table_name: 'election_people',
      record_id: 0,
      user_id: 'admin',
      old_values: null,
      new_values: JSON.stringify({
        action: 'add_sample_data',
        leaders_added: sampleLeaders.length,
        persons_added: samplePersons.length
      }),
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    return {
      success: true,
      message: 'تم إضافة البيانات التجريبية بنجاح',
      leadersAdded: sampleLeaders.length,
      personsAdded: samplePersons.length
    };

  } catch (error) {
    console.error('Add sample data error:', error);
    throw new Error(`خطأ في إضافة البيانات التجريبية: ${error.message}`);
  }
}
