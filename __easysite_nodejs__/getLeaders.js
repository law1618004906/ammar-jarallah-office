
async function getLeaders() {
  try {
    const { data, error } = await ezsite.api.tablePage('election_people', {
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

    if (error) {
      throw new Error(`خطأ في جلب بيانات القادة: ${error}`);
    }

    // Transform data to match expected format
    const leaders = data?.List || [];
    const transformedLeaders = leaders.map(leader => ({
      id: leader.ID,
      full_name: leader.full_name,
      residence: leader.residence,
      phone: leader.phone,
      workplace: leader.workplace,
      center_info: leader.center_info,
      station_number: leader.station_number,
      votes_count: leader.votes_count || 0,
      created_at: leader.created_at,
      updated_at: leader.updated_at
    }));

    return { List: transformedLeaders };
  } catch (error) {
    console.error('Get leaders error:', error);
    throw error;
  }
}