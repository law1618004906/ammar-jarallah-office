async function getDashboardStats() {
  try {
    // Get leaders count and data from unified database
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

    if (leadersError) {
      throw new Error(`خطأ في جلب بيانات القادة: ${leadersError}`);
    }

    // Get persons count and data from unified database
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

    if (personsError) {
      throw new Error(`خطأ في جلب بيانات الأفراد: ${personsError}`);
    }

    const leaders = leadersData?.List || [];
    const persons = personsData?.List || [];

    const totalLeaders = leaders.length;
    const totalPersons = persons.length;

    // Calculate total votes
    const leadersVotes = leaders.reduce((sum, leader) => sum + (leader.votes_count || 0), 0);
    const personsVotes = persons.reduce((sum, person) => sum + (person.votes_count || 0), 0);
    const totalVotes = leadersVotes + personsVotes;

    const avgVotesPerLeader = totalLeaders > 0 ? Math.round(totalVotes / totalLeaders) : 0;

    // Get top leaders (with their persons' votes included)
    const topLeaders = [];
    for (const leader of leaders.slice(0, 5)) {
      const leaderPersons = persons.filter((p) => 
        p.leader_id === leader.ID || p.leader_name === leader.full_name
      );
      const leaderPersonsVotes = leaderPersons.reduce((sum, p) => sum + (p.votes_count || 0), 0);
      const leaderTotalVotes = (leader.votes_count || 0) + leaderPersonsVotes;

      topLeaders.push({
        name: leader.full_name || 'غير محدد',
        totalVotes: leaderTotalVotes,
        personsCount: leaderPersons.length
      });
    }

    // Sort by total votes descending
    topLeaders.sort((a, b) => b.totalVotes - a.totalVotes);

    // Recent activity simulation
    const recentActivity = [
      {
        type: 'info',
        message: 'تم تحديث بيانات النظام بنجاح',
        timestamp: 'منذ 5 دقائق'
      },
      {
        type: 'success',
        message: 'تم إضافة قائد جديد للنظام',
        timestamp: 'منذ ساعة واحدة'
      },
      {
        type: 'info',
        message: 'تم تحديث معلومات الأفراد',
        timestamp: 'منذ ساعتين'
      }
    ];

    return {
      totalLeaders,
      totalPersons,
      totalVotes,
      avgVotesPerLeader,
      topLeaders: topLeaders.slice(0, 5),
      recentActivity
    };

  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw new Error(`خطأ في إحصائيات لوحة التحكم: ${error.message}`);
  }
}