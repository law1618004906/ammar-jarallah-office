
function getLeadersTree() {
  // بيانات تجريبية للقادة
  const leaders = [
    {
      id: 1,
      full_name: "أحمد محمد علي",
      residence: "بغداد - الكرادة",
      phone: "07701234567",
      workplace: "شركة النفط",
      center_info: "مركز الكرادة الانتخابي",
      station_number: "101",
      votes_count: 250
    },
    {
      id: 2,
      full_name: "فاطمة حسن كريم",
      residence: "بغداد - المنصور",
      phone: "07712345678",
      workplace: "وزارة التربية",
      center_info: "مركز المنصور الانتخابي",
      station_number: "102",
      votes_count: 180
    },
    {
      id: 3,
      full_name: "محمد عبد الله حسين",
      residence: "البصرة - الزبير",
      phone: "07723456789",
      workplace: "ميناء البصرة",
      center_info: "مركز الزبير الانتخابي",
      station_number: "201",
      votes_count: 320
    },
    {
      id: 4,
      full_name: "زينب علي حسن",
      residence: "النجف - الكوفة",
      phone: "07734567890",
      workplace: "جامعة الكوفة",
      center_info: "مركز الكوفة الانتخابي",
      station_number: "301",
      votes_count: 195
    },
    {
      id: 5,
      full_name: "عمار صالح محمود",
      residence: "كربلاء - العتبة",
      phone: "07745678901",
      workplace: "دائرة الأوقاف",
      center_info: "مركز العتبة الانتخابي",
      station_number: "401",
      votes_count: 280
    }
  ];

  // بيانات تجريبية للأفراد
  const persons = [
    // أفراد أحمد محمد علي
    {
      id: 1,
      leader_name: "أحمد محمد علي",
      full_name: "سارة أحمد محمد",
      residence: "بغداد - الكرادة",
      phone: "07701234568",
      workplace: "جامعة بغداد",
      center_info: "مركز الكرادة الانتخابي",
      station_number: "101",
      votes_count: 45
    },
    {
      id: 2,
      leader_name: "أحمد محمد علي",
      full_name: "يوسف أحمد علي",
      residence: "بغداد - الكرادة",
      phone: "07701234569",
      workplace: "مستشفى بغداد",
      center_info: "مركز الكرادة الانتخابي",
      station_number: "101",
      votes_count: 38
    },
    {
      id: 3,
      leader_name: "أحمد محمد علي",
      full_name: "مريم عبد الله",
      residence: "بغداد - الكرادة",
      phone: "07701234570",
      workplace: "شركة الاتصالات",
      center_info: "مركز الكرادة الانتخابي",
      station_number: "101",
      votes_count: 52
    },
    
    // أفراد فاطمة حسن كريم
    {
      id: 4,
      leader_name: "فاطمة حسن كريم",
      full_name: "علي حسن محمود",
      residence: "بغداد - المنصور",
      phone: "07712345679",
      workplace: "شركة الاتصالات",
      center_info: "مركز المنصور الانتخابي",
      station_number: "102",
      votes_count: 42
    },
    {
      id: 5,
      leader_name: "فاطمة حسن كريم",
      full_name: "نور الهدى فاطمة",
      residence: "بغداد - المنصور",
      phone: "07712345680",
      workplace: "وزارة التربية",
      center_info: "مركز المنصور الانتخابي",
      station_number: "102",
      votes_count: 39
    },
    
    // أفراد محمد عبد الله حسين
    {
      id: 6,
      leader_name: "محمد عبد الله حسين",
      full_name: "أسماء محمد عبد الله",
      residence: "البصرة - الزبير",
      phone: "07723456791",
      workplace: "شركة الموانئ",
      center_info: "مركز الزبير الانتخابي",
      station_number: "201",
      votes_count: 48
    },
    {
      id: 7,
      leader_name: "محمد عبد الله حسين",
      full_name: "حسام الدين محمد",
      residence: "البصرة - الزبير",
      phone: "07723456792",
      workplace: "ميناء البصرة",
      center_info: "مركز الزبير الانتخابي",
      station_number: "201",
      votes_count: 55
    },
    {
      id: 8,
      leader_name: "محمد عبد الله حسين",
      full_name: "رقية عبد الله",
      residence: "البصرة - الزبير",
      phone: "07723456793",
      workplace: "مديرية التربية",
      center_info: "مركز الزبير الانتخابي",
      station_number: "201",
      votes_count: 41
    },
    
    // أفراد زينب علي حسن
    {
      id: 9,
      leader_name: "زينب علي حسن",
      full_name: "حيدر علي زينب",
      residence: "النجف - الكوفة",
      phone: "07734567891",
      workplace: "جامعة الكوفة",
      center_info: "مركز الكوفة الانتخابي",
      station_number: "301",
      votes_count: 46
    },
    {
      id: 10,
      leader_name: "زينب علي حسن",
      full_name: "فاطمة علي حسن",
      residence: "النجف - الكوفة",
      phone: "07734567892",
      workplace: "مستشفى الصدر",
      center_info: "مركز الكوفة الانتخابي",
      station_number: "301",
      votes_count: 37
    },
    
    // أفراد عمار صالح محمود
    {
      id: 11,
      leader_name: "عمار صالح محمود",
      full_name: "محمد عمار صالح",
      residence: "كربلاء - العتبة",
      phone: "07745678902",
      workplace: "العتبة الحسينية",
      center_info: "مركز العتبة الانتخابي",
      station_number: "401",
      votes_count: 49
    },
    {
      id: 12,
      leader_name: "عمار صالح محمود",
      full_name: "زهراء عمار صالح",
      residence: "كربلاء - العتبة",
      phone: "07745678903",
      workplace: "دائرة الأوقاف",
      center_info: "مركز العتبة الانتخابي",
      station_number: "401",
      votes_count: 44
    },
    {
      id: 13,
      leader_name: "عمار صالح محمود",
      full_name: "علي عمار محمود",
      residence: "كربلاء - العتبة",
      phone: "07745678904",
      workplace: "مديرية السياحة",
      center_info: "مركز العتبة الانتخابي",
      station_number: "401",
      votes_count: 51
    }
  ];

  // بناء الشجرة
  const tree = leaders.map(leader => {
    const leaderPersons = persons.filter(person => person.leader_name === leader.full_name);
    const totalPersonsVotes = leaderPersons.reduce((sum, person) => sum + person.votes_count, 0);
    
    return {
      id: `leader-${leader.id}`,
      name: leader.full_name,
      type: 'leader',
      totalVotes: leader.votes_count + totalPersonsVotes,
      details: {
        phone: leader.phone,
        address: leader.residence,
        work: leader.workplace,
        votingCenter: leader.center_info,
        stationNumber: leader.station_number
      },
      children: leaderPersons.map(person => ({
        id: `person-${person.id}`,
        name: person.full_name,
        type: 'person',
        totalVotes: person.votes_count,
        details: {
          phone: person.phone,
          address: person.residence,
          work: person.workplace,
          votingCenter: person.center_info,
          stationNumber: person.station_number
        },
        children: []
      }))
    };
  });

  // حساب الإحصائيات
  const totalLeaders = leaders.length;
  const totalPersons = persons.length;
  const totalVotes = leaders.reduce((sum, leader) => sum + leader.votes_count, 0) + 
                    persons.reduce((sum, person) => sum + person.votes_count, 0);
  const avgVotesPerLeader = totalLeaders > 0 ? Math.round((totalVotes / totalLeaders)) : 0;

  const stats = {
    totalLeaders,
    totalPersons,
    totalVotes,
    avgVotesPerLeader
  };

  return { tree, stats };
}
