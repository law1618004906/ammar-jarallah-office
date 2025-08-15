
async function addPerson(personData) {
  const { data, error } = await ezsite.api.tableCreate(34597, {
    leader_name: personData.leader_name || '',
    full_name: personData.full_name || '',
    residence: personData.residence || '',
    phone: personData.phone || '',
    workplace: personData.workplace || '',
    center_info: personData.center_info || '',
    station_number: personData.station_number || '',
    votes_count: personData.votes_count || 0
  });

  if (error) {
    throw new Error(`خطأ في إضافة الفرد: ${error}`);
  }

  return data;
}