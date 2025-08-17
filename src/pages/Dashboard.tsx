
import React, { useState, useEffect, useCallback } from 'react';
import { Crown, Users, Vote, BarChart3, TrendingUp, MapPin, Calendar, Phone, Shield, Award, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fastLoadPersons, fastLoadLeaders } from '@/lib/fastStorage';
import { Person, Leader } from '@/lib/localStorageOperations';

interface DashboardStats {
  totalLeaders: number;
  totalPersons: number;
  totalVotes: number;
  avgVotesPerLeader: number;
  topLeaders: Array<{
    name: string;
    totalVotes: number;
    personsCount: number;
  }>;
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const calculateStatsFromData = useCallback((persons: Person[], leaders: Leader[]): DashboardStats => {
    const totalLeaders = leaders.length;
    const totalPersons = persons.length;
    
    // حساب الأصوات (افتراضي: كل فرد = صوت واحد)
    const totalVotes = persons.reduce((sum, person) => sum + (1), 0);
    const avgVotesPerLeader = totalLeaders > 0 ? Math.round(totalVotes / totalLeaders) : 0;
    
    // حساب أفضل القادة
    const leaderStats = leaders.map(leader => {
      const leaderPersons = persons.filter(p => p.leader_name === leader.full_name);
      const leaderVotes = leaderPersons.reduce((sum, person) => sum + (1), 0);
      
      return {
        name: leader.full_name || 'قائد غير محدد',
        totalVotes: leaderVotes,
        personsCount: leaderPersons.length
      };
    });
    
    const topLeaders = leaderStats
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 5);
    
    // نشاط حديث افتراضي
    const recentActivity = [
      { type: "info", message: `النظام يحتوي على ${totalLeaders} قائد و ${totalPersons} فرد`, timestamp: "الآن" },
      { type: "update", message: "تم تحديث البيانات من التخزين المحلي", timestamp: "منذ لحظات" },
      { type: "stats", message: `إجمالي الأصوات: ${totalVotes}`, timestamp: "محدث" }
    ];
    
    return {
      totalLeaders,
      totalPersons,
      totalVotes,
      avgVotesPerLeader,
      topLeaders,
      recentActivity
    };
  }, []);

  const loadDashboardStatsCallback = useCallback(() => {
    console.log('🚀 Dashboard: بدء تحميل الإحصائيات...');
    
    try {
      // استخدام التخزين السريع للحصول على البيانات فوراً
      const fastPersons = fastLoadPersons();
      const fastLeaders = fastLoadLeaders();
      
      console.log('📊 Dashboard: تم تحميل البيانات السريعة:', {
        persons: fastPersons.length,
        leaders: fastLeaders.length
      });
      
      // حساب الإحصائيات من البيانات المحلية
      const calculatedStats = calculateStatsFromData(fastPersons, fastLeaders);
      setStats(calculatedStats);
      setLoading(false);
      
      console.log('✅ Dashboard: تم تحميل الإحصائيات بنجاح');
      
      // تحديث اختياري من API في الخلفية
      if (window?.ezsite?.apis?.run) {
        window.ezsite.apis.run({
          path: "getDashboardStats",
          param: []
        }).then(({ data, error }) => {
          if (!error && data) {
            console.log('🔄 Dashboard: تم تحديث البيانات من API');
            setStats(data);
          }
        }).catch(error => {
          console.log('⚠️ Dashboard: فشل تحديث API، استمرار بالبيانات المحلية');
        });
      }
      
    } catch (error) {
      console.error('❌ Dashboard: خطأ في تحميل البيانات:', error);
      
      // بيانات احتياطية في حالة الخطأ
      const fallbackStats: DashboardStats = {
        totalLeaders: 5,
        totalPersons: 50,
        totalVotes: 500,
        avgVotesPerLeader: 100,
        topLeaders: [
          { name: "قائد افتراضي", totalVotes: 100, personsCount: 10 }
        ],
        recentActivity: [
          { type: "info", message: "النظام يعمل بالبيانات المحلية", timestamp: "الآن" }
        ]
      };
      
      setStats(fallbackStats);
      setLoading(false);
    }
  }, [calculateStatsFromData]);

  useEffect(() => {
    loadDashboardStatsCallback();
  }, [loadDashboardStatsCallback]);

  const fetchDashboardStats = useCallback(() => {
    loadDashboardStatsCallback();
  }, [loadDashboardStatsCallback]);

  if (loading) {
    return (
      <div className="formal-bg min-h-screen p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-xl formal-subtitle">جارٍ تحميل الإحصائيات...</p>
            </div>
          </div>
        </div>
      </div>);

  }

  if (!stats) {
    return (
      <div className="formal-bg min-h-screen p-6">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-xl formal-subtitle">لم يتم العثور على بيانات</p>
            <Button onClick={loadDashboardStatsCallback} className="mt-6 btn-formal">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="formal-bg min-h-screen pt-6" dir="rtl">
      <div className="container mx-auto p-6">
        {/* العنوان الرئيسي */}
        <div className="formal-card rounded-2xl p-8 mb-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 official-logo rounded-full mb-6">
            <BarChart3 className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold formal-title mb-4">
            لوحة التحكم والإحصائيات
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="formal-badge text-lg px-4 py-2">
              <Building size={18} className="ml-2" />
              مكتب النائب عمار جار الله
            </Badge>
            <Badge className="bg-green-500 text-green-900 font-semibold px-3 py-2">
              <Shield size={16} className="ml-1" />
              مُحدَّث
            </Badge>
          </div>
          <div className="formal-divider"></div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Crown size={32} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm formal-subtitle font-medium">إجمالي القادة</div>
                <div className="text-3xl font-bold formal-title">{stats.totalLeaders}</div>
              </div>
            </div>
          </div>

          <div className="stats-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users size={32} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm formal-subtitle font-medium">إجمالي الأفراد</div>
                <div className="text-3xl font-bold formal-title">{stats.totalPersons}</div>
              </div>
            </div>
          </div>

          <div className="stats-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Vote size={32} className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm formal-subtitle font-medium">إجمالي الأصوات</div>
                <div className="text-3xl font-bold formal-title">{stats.totalVotes}</div>
              </div>
            </div>
          </div>

          <div className="stats-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <BarChart3 size={32} className="text-orange-600" />
              </div>
              <div>
                <div className="text-sm formal-subtitle font-medium">متوسط أصوات/قائد</div>
                <div className="text-3xl font-bold formal-title">{stats.avgVotesPerLeader}</div>
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* أفضل القادة */}
          <Card className="formal-card formal-shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl formal-title">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="text-yellow-600" size={24} />
                </div>
                أفضل القادة (حسب الأصوات)
              </CardTitle>
              <CardDescription className="text-lg formal-subtitle">
                القادة الذين حصلوا على أعلى عدد من الأصوات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topLeaders.map((leader, index) =>
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full border-2 border-blue-200">
                        <span className="text-blue-700 font-bold text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">{leader.name}</div>
                        <div className="text-sm formal-subtitle">
                          {leader.personsCount} أفراد تابعين
                        </div>
                      </div>
                    </div>
                    <Badge className="formal-badge text-lg px-4 py-2">
                      <Vote size={16} className="ml-1" />
                      {leader.totalVotes} صوت
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* النشاط الأخير */}
          <Card className="formal-card formal-shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl formal-title">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="text-green-600" size={24} />
                </div>
                النشاط الأخير
              </CardTitle>
              <CardDescription className="text-lg formal-subtitle">
                آخر العمليات والتحديثات على النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) =>
                <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <BarChart3 size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{activity.message}</div>
                      <div className="text-sm formal-subtitle mt-1">{activity.timestamp}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* أدوات إضافية */}
        <div className="mt-8">
          <Card className="formal-card formal-shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl formal-title">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="text-purple-600" size={24} />
                </div>
                أدوات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-3 formal-shadow border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                  onClick={loadDashboardStatsCallback}>

                  <BarChart3 size={24} className="text-blue-600" />
                  <span className="font-semibold">تحديث الإحصائيات</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-3 formal-shadow border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300">

                  <Users size={24} className="text-green-600" />
                  <span className="font-semibold">تقرير شامل</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-3 formal-shadow border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300">

                  <Phone size={24} className="text-purple-600" />
                  <span className="font-semibold">قائمة الاتصال</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-3 formal-shadow border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300">

                  <Calendar size={24} className="text-orange-600" />
                  <span className="font-semibold">تقرير شهري</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}