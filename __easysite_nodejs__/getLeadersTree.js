
async function getLeadersTree() {
  try {
    // Get all leaders from the unified database
    const { data: leadersResult, error: leadersError } = await ezsite.api.tablePage('election_people', {
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

    if (leadersError) {
      throw new Error(`خطأ في جلب بيانات القادة: ${leadersError}`);
    }

    // Get all individuals from the unified database
    const { data: personsResult, error: personsError } = await ezsite.api.tablePage('election_people', {
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

    if (personsError) {
      throw new Error(`خطأ في جلب بيانات الأفراد: ${personsError}`);
    }

    const leaders = leadersResult?.List || [];
    const allPersons = personsResult?.List || [];

    // Calculate overall statistics
    const totalLeaders = leaders.length;
    const totalPersons = allPersons.length;
    
    const leadersVotes = leaders.reduce((sum, leader) => sum + (leader.votes_count || 0), 0);
    const personsVotes = allPersons.reduce((sum, person) => sum + (person.votes_count || 0), 0);
    const totalVotes = leadersVotes + personsVotes;
    
    const avgVotesPerLeader = totalLeaders > 0 ? Math.round(totalVotes / totalLeaders) : 0;

    // Build the tree structure
    const tree = [];

    for (const leader of leaders) {
      // Get persons for this leader using both leader_id and leader_name for compatibility
      const leaderPersons = allPersons.filter((person) => 
        person.leader_id === leader.ID || person.leader_name === leader.full_name
      );
      
      const personsVotes = leaderPersons.reduce((sum, person) => sum + (person.votes_count || 0), 0);
      const totalVotes = (leader.votes_count || 0) + personsVotes;

      const treeNode = {
        id: `leader-${leader.ID}`,
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
          personsCount: leaderPersons.length
        },
        children: leaderPersons.map((person) => ({
          id: `person-${person.ID}`,
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

    return {
      tree,
      stats: {
        totalLeaders,
        totalPersons,
        totalVotes,
        avgVotesPerLeader
      }
    };
  } catch (error) {
    console.error('Get leaders tree error:', error);
    throw error;
  }
}