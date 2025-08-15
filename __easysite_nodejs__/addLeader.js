
async function addLeader(leaderData) {
  const { data, error } = await ezsite.api.tableCreate(34596, {
    full_name: leaderData.full_name || '',
    residence: leaderData.residence || '',
    phone: leaderData.phone || '',
    workplace: leaderData.workplace || '',
    center_info: leaderData.center_info || '',
    station_number: leaderData.station_number || '',
    votes_count: leaderData.votes_count || 0
  });

  if (error) {
    throw new Error(`خطأ في إضافة القائد: ${error}`);
  }

  return data;
}