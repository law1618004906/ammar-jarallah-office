
function getDashboardStats() {
  // بيانات تجريبية للقادة
  const leaders = [
    { id: 1, full_name: "أحمد محمد علي", votes_count: 250 },
    { id: 2, full_name: "فاطمة حسن كريم", votes_count: 180 },
    { id: 3, full_name: "محمد عبد الله حسين", votes_count: 320 },
    { id: 4, full_name: "زينب علي حسن", votes_count: 195 },
    { id: 5, full_name: "عمار صالح محمود", votes_count: 280 }
  ];

  // بيانات تجريبية للأفراد
  const persons = [
    { id: 1, leader_name: "أحمد محمد علي", votes_count: 45 },
    { id: 2, leader_name: "أحمد محمد علي", votes_count: 38 },
    { id: 3, leader_name: "أحمد محمد علي", votes_count: 52 },
    { id: 4, leader_name: "فاطمة حسن كريم", votes_count: 42 },
    { id: 5, leader_name: "فاطمة حسن كريم", votes_count: 39 },
    { id: 6, leader_name: "محمد عبد الله حسين", votes_count: 48 },
    { id: 7, leader_name: "محمد عبد الله حسين", votes_count: 55 },
    { id: 8, leader_name: "محمد عبد الله حسين", votes_count: 41 },
    { id: 9, leader_name: "زينب علي حسن", votes_count: 46 },
    { id: 10, leader_name: "زينب علي حسن", votes_count: 37 },
    { id: 11, leader_name: "عمار صالح محمود", votes_count: 49 },
    { id: 12, leader_name: "عمار صالح محمود", votes_count: 44 },
    { id: 13, leader_name: "عمار صالح محمود", votes_count: 51 }
  ];

  // حساب الإحصائيات
  const totalLeaders = leaders.length;
  const totalPersons = persons.length;
  const leaderVotes = leaders.reduce((sum, leader) => sum + leader.votes_count, 0);
  const personVotes = persons.reduce((sum, person) => sum + person.votes_count, 0);
  const totalVotes = leaderVotes + personVotes;
  const avgVotesPerLeader = Math.round(totalVotes / totalLeaders);

  // حساب أفضل القادة
  const topLeaders = leaders.map(leader => {
    const leaderPersons = persons.filter(person => person.leader_name === leader.full_name);
    const personsVotes = leaderPersons.reduce((sum, person) => sum + person.votes_count, 0);
    return {
      name: leader.full_name,
      totalVotes: leader.votes_count + personsVotes,
      personsCount: leaderPersons.length
    };
  })
  .sort((a, b) => b.totalVotes - a.totalVotes)
  .slice(0, 5);

  // النشاط الأخير (بيانات تجريبية)
  const recentActivity = [
    {
      type: "add",
      message: "تم إضافة قائد جديد: أحمد محمد علي",
      timestamp: "منذ ساعتين"
    },
    {
      type: "update",
      message: "تم تحديث بيانات 3 أفراد",
      timestamp: "منذ 4 ساعات"
    },
    {
      type: "stats",
      message: "تم إنشاء تقرير إحصائي جديد",
      timestamp: "أمس"
    },
    {
      type: "system",
      message: "تم تحديث النظام بنجاح",
      timestamp: "منذ يومين"
    },
    {
      type: "backup",
      message: "تم إنشاء نسخة احتياطية من البيانات",
      timestamp: "منذ 3 أيام"
    }
  ];

  return {
    totalLeaders,
    totalPersons,
    totalVotes,
    avgVotesPerLeader,
    topLeaders,
    recentActivity
  };
}
