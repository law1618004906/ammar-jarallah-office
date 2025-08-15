
async function getPersons() {
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
          value: "INDIVIDUAL"
        }
      ]
    });

    if (error) {
      throw new Error(`خطأ في جلب بيانات الأفراد: ${error}`);
    }

    // Transform data to match expected format
    const persons = data?.List || [];
    const transformedPersons = persons.map(person => ({
      id: person.ID,
      leader_name: person.leader_name || 'غير محدد',
      full_name: person.full_name,
      residence: person.residence,
      phone: person.phone,
      workplace: person.workplace,
      center_info: person.center_info,
      station_number: person.station_number,
      votes_count: person.votes_count || 0,
      created_at: person.created_at,
      updated_at: person.updated_at
    }));

    return { List: transformedPersons };
  } catch (error) {
    console.error('Get persons error:', error);
    throw error;
  }
}