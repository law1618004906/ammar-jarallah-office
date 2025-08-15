
import React, { useState, useEffect } from 'react';
import { Crown, Users, Vote, BarChart3, TrendingUp, MapPin, Calendar, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.run({
        path: "getDashboardStats",
        param: []
      });

      if (error) {
        toast({
          title: "خطأ في تحميل البيانات",
          description: error,
          variant: "destructive"
        });
        return;
      }

      setStats(data);
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">جارٍ تحميل الإحصائيات...</p>
            </div>
          </div>
        </div>
      </div>);

  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-lg text-gray-600">لم يتم العثور على بيانات</p>
            <Button onClick={fetchDashboardStats} className="mt-4">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-4" dir="rtl">
      <div className="container mx-auto p-6">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            لوحة التحكم والإحصائيات
          </h1>
          <p className="text-lg text-gray-600">مكتب النائب عمار جار الله</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Crown size={32} />
                <div>
                  <div className="text-sm opacity-90">إجمالي القادة</div>
                  <div className="text-3xl font-bold">{stats.totalLeaders}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users size={32} />
                <div>
                  <div className="text-sm opacity-90">إجمالي الأفراد</div>
                  <div className="text-3xl font-bold">{stats.totalPersons}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Vote size={32} />
                <div>
                  <div className="text-sm opacity-90">إجمالي الأصوات</div>
                  <div className="text-3xl font-bold">{stats.totalVotes}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <BarChart3 size={32} />
                <div>
                  <div className="text-sm opacity-90">متوسط أصوات/قائد</div>
                  <div className="text-3xl font-bold">{stats.avgVotesPerLeader}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* أفضل القادة */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <TrendingUp className="text-green-600" size={24} />
                أفضل القادة (حسب الأصوات)
              </CardTitle>
              <CardDescription>
                القادة الذين حصلوا على أعلى عدد من الأصوات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topLeaders.map((leader, index) =>
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                        <span className="text-purple-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{leader.name}</div>
                        <div className="text-sm text-gray-600">
                          {leader.personsCount} أفراد تابعين
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {leader.totalVotes} صوت
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* النشاط الأخير */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calendar className="text-blue-600" size={24} />
                النشاط الأخير
              </CardTitle>
              <CardDescription>
                آخر العمليات والتحديثات على النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) =>
                <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <BarChart3 size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">{activity.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* أدوات إضافية */}
        <div className="mt-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <MapPin className="text-purple-600" size={24} />
                أدوات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center gap-2"
                  onClick={fetchDashboardStats}>

                  <BarChart3 size={20} />
                  <span className="text-sm">تحديث الإحصائيات</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center gap-2">

                  <Users size={20} />
                  <span className="text-sm">تقرير شامل</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center gap-2">

                  <Phone size={20} />
                  <span className="text-sm">قائمة الاتصال</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center gap-2">

                  <Calendar size={20} />
                  <span className="text-sm">تقرير شهري</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}