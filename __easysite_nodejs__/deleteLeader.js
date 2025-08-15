async function deleteLeader(leaderId) {
  try {
    // First, delete related hierarchy records
    const { data: hierarchyData, error: hierarchyError } = await ezsite.api.tablePage('election_hierarchy', {
      PageNo: 1,
      PageSize: 1000,
      OrderByField: "id",
      IsAsc: false,
      Filters: [
        {
          name: "leader_id",
          op: "Equal",
          value: leaderId
        }
      ]
    });

    if (!hierarchyError && hierarchyData?.List) {
      for (const record of hierarchyData.List) {
        await ezsite.api.tableDelete('election_hierarchy', record.ID);
      }
    }

    // Update related individuals to remove leader reference
    const { data: individualsData, error: individualsError } = await ezsite.api.tablePage('election_people', {
      PageNo: 1,
      PageSize: 1000,
      OrderByField: "id",
      IsAsc: false,
      Filters: [
        {
          name: "leader_id",
          op: "Equal",
          value: leaderId
        }
      ]
    });

    if (!individualsError && individualsData?.List) {
      for (const individual of individualsData.List) {
        await ezsite.api.tableUpdate('election_people', individual.ID, {
          leader_id: null,
          leader_name: '',
          updated_at: new Date().toISOString()
        });
      }
    }

    // Delete the leader
    const { data, error } = await ezsite.api.tableDelete('election_people', leaderId);

    if (error) {
      throw new Error(`خطأ في حذف القائد: ${error}`);
    }

    // Log the operation to audit table
    await ezsite.api.tableCreate('election_audit', {
      operation: 'DELETE',
      table_name: 'election_people',
      record_id: leaderId,
      user_id: 'admin',
      old_values: JSON.stringify({ action: 'delete_leader', leader_id: leaderId }),
      new_values: null,
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    return data;
  } catch (error) {
    console.error('Delete leader error:', error);
    throw error;
  }
}