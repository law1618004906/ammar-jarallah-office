async function updateLeader(leaderData) {
  try {
    const { data, error } = await ezsite.api.tableUpdate('election_people', leaderData.id, {
      full_name: leaderData.full_name || '',
      person_type: 'LEADER',
      residence: leaderData.residence || '',
      phone: leaderData.phone || '',
      workplace: leaderData.workplace || '',
      center_info: leaderData.center_info || '',
      station_number: leaderData.station_number || '',
      votes_count: leaderData.votes_count || 0,
      updated_at: new Date().toISOString()
    });

    if (error) {
      throw new Error(`خطأ في تعديل بيانات القائد: ${error}`);
    }

    // Log the operation to audit table
    await ezsite.api.tableCreate('election_audit', {
      operation: 'UPDATE',
      table_name: 'election_people',
      record_id: leaderData.id,
      user_id: 'admin',
      old_values: JSON.stringify({ action: 'update_leader' }),
      new_values: JSON.stringify({
        leader_name: leaderData.full_name,
        votes_count: leaderData.votes_count
      }),
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    return data;
  } catch (error) {
    console.error('Update leader error:', error);
    throw error;
  }
}