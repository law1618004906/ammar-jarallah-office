
function getLeaders() {
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
      votes_count: 250,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      full_name: "فاطمة حسن كريم",
      residence: "بغداد - المنصور",
      phone: "07712345678",
      workplace: "وزارة التربية",
      center_info: "مركز المنصور الانتخابي",
      station_number: "102",
      votes_count: 180,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      full_name: "محمد عبد الله حسين",
      residence: "البصرة - الزبير",
      phone: "07723456789",
      workplace: "ميناء البصرة",
      center_info: "مركز الزبير الانتخابي",
      station_number: "201",
      votes_count: 320,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      full_name: "زينب علي حسن",
      residence: "النجف - الكوفة",
      phone: "07734567890",
      workplace: "جامعة الكوفة",
      center_info: "مركز الكوفة الانتخابي",
      station_number: "301",
      votes_count: 195,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      full_name: "عمار صالح محمود",
      residence: "كربلاء - العتبة",
      phone: "07745678901",
      workplace: "دائرة الأوقاف",
      center_info: "مركز العتبة الانتخابي",
      station_number: "401",
      votes_count: 280,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return leaders;
}
