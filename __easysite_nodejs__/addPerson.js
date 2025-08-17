// إضافة فرد جديد إلى قاعدة البيانات الموحدة
const dbManager = require('./unified-database-manager');

module.exports = async function addPerson(personData) {
  try {
    console.log('➕ إضافة فرد جديد:', personData);
    
    // التحقق من صحة البيانات
    if (!personData.full_name || !personData.phone) {
      return {
        data: null,
        error: 'الاسم الكامل ورقم الهاتف مطلوبان'
      };
    }
    
    // First, get the leader's ID from the leader name
    let leaderId = null;
    if (personData.leader_name) {
      const { data: leaderData, error: leaderError } = await ezsite.api.tablePage('election_people', {
        PageNo: 1,
        PageSize: 1,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
          {
            name: "full_name",
            op: "Equal",
            value: personData.leader_name
          },
          {
            name: "person_type",
            op: "Equal",
            value: "LEADER"
          }
        ]
      });

      if (leaderError) {
        console.error('خطأ في العثور على القائد:', leaderError);
      } else {
        const leaders = leaderData?.List || [];
        if (leaders.length > 0) {
          leaderId = leaders[0].ID;
        }
      }
    }

    const { data, error } = await ezsite.api.tableCreate('election_people', {
      full_name: personData.full_name || '',
      person_type: 'INDIVIDUAL',
      residence: personData.residence || '',
      phone: personData.phone || '',
      workplace: personData.workplace || '',
      center_info: personData.center_info || '',
      station_number: personData.station_number || '',
      votes_count: personData.votes_count || 0,
      leader_id: leaderId,
      leader_name: personData.leader_name || '',
      created_by: 'admin',
      status: 'ACTIVE'
    });

    if (error) {
      throw new Error(`خطأ في إضافة الفرد: ${error}`);
    }

    // Create hierarchy relationship if leader exists
    if (leaderId) {
      await ezsite.api.tableCreate('election_hierarchy', {
        leader_id: leaderId,
        person_id: data?.ID || 0,
        relationship_type: 'DIRECT',
        level: 1,
        created_at: new Date().toISOString()
      });
    }

    // Log the operation to audit table
    await ezsite.api.tableCreate('election_audit', {
      operation: 'CREATE',
      table_name: 'election_people',
      record_id: data?.ID || 0,
      user_id: 'admin',
      old_values: null,
      new_values: JSON.stringify({
        action: 'create_person',
        person_name: personData.full_name,
        leader_name: personData.leader_name
      }),
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    return data;
  } catch (error) {
    console.error('Add person error:', error);
    throw error;
  }
}