// سكربت لإدارة البيانات يدوياً من السكربتات
// يدعم الإضافة والتعديل والحذف للقادة والأفراد

const unifiedDatabaseManager = {
  // إضافة قائد يدوياً
  async addLeaderManual(leaderData) {
    try {
      const { data, error } = await ezsite.api.tableCreate('election_people', {
        full_name: leaderData.full_name || '',
        person_type: 'LEADER',
        residence: leaderData.residence || '',
        phone: leaderData.phone || '',
        workplace: leaderData.workplace || '',
        center_info: leaderData.center_info || '',
        station_number: leaderData.station_number || '',
        votes_count: leaderData.votes_count || 0,
        leader_id: null,
        leader_name: '',
        created_by: 'manual_script',
        status: 'ACTIVE'
      });

      if (error) {
        throw new Error(`خطأ في إضافة القائد: ${error}`);
      }

      // تسجيل العملية
      await ezsite.api.tableCreate('election_audit', {
        operation: 'CREATE',
        table_name: 'election_people',
        record_id: data?.ID || 0,
        user_id: 'manual_script',
        old_values: null,
        new_values: JSON.stringify({
          action: 'manual_add_leader',
          leader_name: leaderData.full_name
        }),
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1'
      });

      console.log(`✅ تم إضافة القائد ${leaderData.full_name} بنجاح`);
      return data;
    } catch (error) {
      console.error('❌ خطأ في إضافة القائد:', error);
      throw error;
    }
  },

  // إضافة فرد يدوياً
  async addPersonManual(personData) {
    try {
      // الحصول على معرّف القائد
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

        if (!leaderError && leaderData?.List && leaderData.List.length > 0) {
          leaderId = leaderData.List[0].ID;
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
        created_by: 'manual_script',
        status: 'ACTIVE'
      });

      if (error) {
        throw new Error(`خطأ في إضافة الفرد: ${error}`);
      }

      // إنشاء علاقة هرمية إذا وجد قائد
      if (leaderId) {
        await ezsite.api.tableCreate('election_hierarchy', {
          leader_id: leaderId,
          person_id: data?.ID || 0,
          relationship_type: 'DIRECT',
          level: 1,
          created_at: new Date().toISOString()
        });
      }

      // تسجيل العملية
      await ezsite.api.tableCreate('election_audit', {
        operation: 'CREATE',
        table_name: 'election_people',
        record_id: data?.ID || 0,
        user_id: 'manual_script',
        old_values: null,
        new_values: JSON.stringify({
          action: 'manual_add_person',
          person_name: personData.full_name,
          leader_name: personData.leader_name
        }),
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1'
      });

      console.log(`✅ تم إضافة الفرد ${personData.full_name} بنجاح`);
      return data;
    } catch (error) {
      console.error('❌ خطأ في إضافة الفرد:', error);
      throw error;
    }
  },

  // تعديل بيانات شخص يدوياً
  async updatePersonManual(personId, updateData) {
    try {
      // الحصول على البيانات الحالية
      const { data: currentData, error: fetchError } = await ezsite.api.tablePage('election_people', {
        PageNo: 1,
        PageSize: 1,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
          {
            name: "ID",
            op: "Equal",
            value: personId
          }
        ]
      });

      if (fetchError) {
        throw new Error(`خطأ في جلب بيانات الشخص: ${fetchError}`);
      }

      const currentPerson = currentData?.List?.[0];
      if (!currentPerson) {
        throw new Error('الشخص غير موجود');
      }

      // تحديث البيانات
      const { data, error } = await ezsite.api.tableUpdate('election_people', personId, {
        full_name: updateData.full_name || currentPerson.full_name,
        person_type: updateData.person_type || currentPerson.person_type,
        residence: updateData.residence || currentPerson.residence,
        phone: updateData.phone || currentPerson.phone,
        workplace: updateData.workplace || currentPerson.workplace,
        center_info: updateData.center_info || currentPerson.center_info,
        station_number: updateData.station_number || currentPerson.station_number,
        votes_count: updateData.votes_count || currentPerson.votes_count,
        leader_name: updateData.leader_name || currentPerson.leader_name,
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw new Error(`خطأ في تعديل بيانات الشخص: ${error}`);
      }

      // تسجيل العملية
      await ezsite.api.tableCreate('election_audit', {
        operation: 'UPDATE',
        table_name: 'election_people',
        record_id: personId,
        user_id: 'manual_script',
        old_values: JSON.stringify({
          action: 'manual_update_person',
          old_data: currentPerson
        }),
        new_values: JSON.stringify({
          action: 'manual_update_person',
          new_data: updateData
        }),
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1'
      });

      console.log(`✅ تم تعديل بيانات الشخص بنجاح`);
      return data;
    } catch (error) {
      console.error('❌ خطأ في تعديل بيانات الشخص:', error);
      throw error;
    }
  },

  // حذف شخص يدوياً
  async deletePersonManual(personId) {
    try {
      // الحصول على بيانات الشخص قبل الحذف
      const { data: personData, error: fetchError } = await ezsite.api.tablePage('election_people', {
        PageNo: 1,
        PageSize: 1,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
          {
            name: "ID",
            op: "Equal",
            value: personId
          }
        ]
      });

      if (fetchError) {
        throw new Error(`خطأ في جلب بيانات الشخص: ${fetchError}`);
      }

      const personToDelete = personData?.List?.[0];
      if (!personToDelete) {
        throw new Error('الشخص غير موجود');
      }

      // حذف العلاقات الهرمية
      const { data: hierarchyData, error: hierarchyError } = await ezsite.api.tablePage('election_hierarchy', {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
          {
            name: "person_id",
            op: "Equal",
            value: personId
          }
        ]
      });

      if (!hierarchyError && hierarchyData?.List) {
        for (const record of hierarchyData.List) {
          await ezsite.api.tableDelete('election_hierarchy', record.ID);
        }
      }

      // حذف الشخص
      const { data, error } = await ezsite.api.tableDelete('election_people', personId);

      if (error) {
        throw new Error(`خطأ في حذف الشخص: ${error}`);
      }

      // تسجيل العملية
      await ezsite.api.tableCreate('election_audit', {
        operation: 'DELETE',
        table_name: 'election_people',
        record_id: personId,
        user_id: 'manual_script',
        old_values: JSON.stringify({
          action: 'manual_delete_person',
          deleted_person: personToDelete
        }),
        new_values: null,
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1'
      });

      console.log(`✅ تم حذف الشخص ${personToDelete.full_name} بنجاح`);
      return data;
    } catch (error) {
      console.error('❌ خطأ في حذف الشخص:', error);
      throw error;
    }
  },

  // جلب إحصائيات سريعة
  async getQuickStats() {
    try {
      const { data: leadersData, error: leadersError } = await ezsite.api.tablePage('election_people', {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
          {
            name: "person_type",
            op: "Equal",
            value: "LEADER"
          }
        ]
      });

      const { data: personsData, error: personsError } = await ezsite.api.tablePage('election_people', {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
          {
            name: "person_type",
            op: "Equal",
            value: "INDIVIDUAL"
          }
        ]
      });

      if (leadersError || personsError) {
        throw new Error('خطأ في جلب الإحصائيات');
      }

      const leaders = leadersData?.List || [];
      const persons = personsData?.List || [];

      const totalVotes = leaders.reduce((sum, leader) => sum + (leader.votes_count || 0), 0) +
                        persons.reduce((sum, person) => sum + (person.votes_count || 0), 0);

      return {
        totalLeaders: leaders.length,
        totalPersons: persons.length,
        totalVotes: totalVotes,
        avgVotesPerLeader: leaders.length > 0 ? Math.round(totalVotes / leaders.length) : 0
      };
    } catch (error) {
      console.error('❌ خطأ في جلب الإحصائيات:', error);
      throw error;
    }
  }
};

// دوال مساعدة للاستخدام السهل
const manualOperations = {
  // إضافة قائد جديد
  addLeader: async (name, residence, phone, workplace, center, station, votes) => {
    return await unifiedDatabaseManager.addLeaderManual({
      full_name: name,
      residence,
      phone,
      workplace,
      center_info: center,
      station_number: station,
      votes_count: votes
    });
  },

  // إضافة فرد جديد
  addPerson: async (name, leaderName, residence, phone, workplace, center, station, votes) => {
    return await unifiedDatabaseManager.addPersonManual({
      full_name: name,
      leader_name: leaderName,
      residence,
      phone,
      workplace,
      center_info: center,
      station_number: station,
      votes_count: votes
    });
  },

  // تعديل بيانات شخص
  updatePerson: async (personId, updates) => {
    return await unifiedDatabaseManager.updatePersonManual(personId, updates);
  },

  // حذف شخص
  deletePerson: async (personId) => {
    return await unifiedDatabaseManager.deletePersonManual(personId);
  },

  // عرض الإحصائيات
  showStats: async () => {
    const stats = await unifiedDatabaseManager.getQuickStats();
    console.log('📊 الإحصائيات الحالية:');
    console.log(`- إجمالي القادة: ${stats.totalLeaders}`);
    console.log(`- إجمالي الأفراد: ${stats.totalPersons}`);
    console.log(`- إجمالي الأصوات: ${stats.totalVotes}`);
    console.log(`- متوسط الأصوات لكل قائد: ${stats.avgVotesPerLeader}`);
    return stats;
  }
};

// تصدير الدوال للاستخدام في السكربتات الأخرى
module.exports = {
  unifiedDatabaseManager,
  manualOperations
};