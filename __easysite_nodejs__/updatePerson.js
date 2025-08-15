async function updatePerson(personData) {
  try {
    // Get leader ID if leader_name is provided
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

    const { data, error } = await ezsite.api.tableUpdate('election_people', personData.id, {
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
      updated_at: new Date().toISOString()
    });

    if (error) {
      throw new Error(`خطأ في تعديل بيانات الفرد: ${error}`);
    }

    // Update hierarchy relationship if leader changed
    if (leaderId) {
      // Delete existing hierarchy records for this person
      const { data: existingHierarchy, error: hierarchyError } = await ezsite.api.tablePage('election_hierarchy', {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
          {
            name: "person_id",
            op: "Equal",
            value: personData.id
          }
        ]
      });

      if (!hierarchyError && existingHierarchy?.List) {
        for (const record of existingHierarchy.List) {
          await ezsite.api.tableDelete('election_hierarchy', record.ID);
        }
      }

      // Create new hierarchy relationship
      await ezsite.api.tableCreate('election_hierarchy', {
        leader_id: leaderId,
        person_id: personData.id,
        relationship_type: 'DIRECT',
        level: 1,
        created_at: new Date().toISOString()
      });
    }

    // Log the operation to audit table
    await ezsite.api.tableCreate('election_audit', {
      operation: 'UPDATE',
      table_name: 'election_people',
      record_id: personData.id,
      user_id: 'admin',
      old_values: JSON.stringify({ action: 'update_person' }),
      new_values: JSON.stringify({
        person_name: personData.full_name,
        leader_name: personData.leader_name,
        votes_count: personData.votes_count
      }),
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    return data;
  } catch (error) {
    console.error('Update person error:', error);
    throw error;
  }
}