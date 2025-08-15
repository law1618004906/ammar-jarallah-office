
async function getLeadersTree() {
  // Get all leaders from the database
  const { data: leadersResult, error: leadersError } = await ezsite.api.tablePage(34596, {
    PageNo: 1,
    PageSize: 1000,
    OrderByField: "id",
    IsAsc: false,
    Filters: []
  });

  if (leadersError) {
    throw new Error(`خطأ في جلب بيانات القادة: ${leadersError}`);
  }

  const leaders = leadersResult?.List || [];

  // Build the tree structure
  const tree = [];
  
  for (const leader of leaders) {
    // Get persons for this leader
    const { data: personsResult, error: personsError } = await ezsite.api.tablePage(34597, {
      PageNo: 1,
      PageSize: 1000,
      OrderByField: "id",
      IsAsc: false,
      Filters: [
        {
          name: "leader_name",
          op: "Equal",
          value: leader.full_name
        }
      ]
    });

    if (personsError) {
      throw new Error(`خطأ في جلب بيانات الأفراد للقائد ${leader.full_name}: ${personsError}`);
    }

    const persons = personsResult?.List || [];
    const personsVotes = persons.reduce((sum, person) => sum + (person.votes_count || 0), 0);
    const totalVotes = (leader.votes_count || 0) + personsVotes;

    const treeNode = {
      id: `leader-${leader.id}`,
      name: leader.full_name || 'غير محدد',
      type: 'leader',
      totalVotes: totalVotes,
      details: {
        phone: leader.phone || '',
        address: leader.residence || '',
        work: leader.workplace || '',
        votingCenter: leader.center_info || '',
        stationNumber: leader.station_number || '',
        directVotes: leader.votes_count || 0,
        personsCount: persons.length
      },
      children: persons.map(person => ({
        id: `person-${person.id}`,
        name: person.full_name || 'غير محدد',
        type: 'person',
        totalVotes: person.votes_count || 0,
        details: {
          phone: person.phone || '',
          address: person.residence || '',
          work: person.workplace || '',
          votingCenter: person.center_info || '',
          stationNumber: person.station_number || ''
        },
        children: []
      }))
    };

    tree.push(treeNode);
  }

  return { tree };
}
