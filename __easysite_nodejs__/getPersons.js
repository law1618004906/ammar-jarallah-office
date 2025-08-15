
function getPersons() {
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
      votes_count: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 38,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 52,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 42,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 39,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 48,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 55,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 41,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 46,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 37,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 49,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 44,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      votes_count: 51,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return persons;
}
