
import React, { useState, useEffect } from 'react';
import { Crown, Search, Plus, Edit2, Trash2, Phone, MapPin, Briefcase, Vote, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Leader {
  id: number;
  full_name: string;
  residence: string;
  phone: string;
  workplace: string;
  center_info: string;
  station_number: string;
  votes_count: number;
  created_at: string;
  updated_at: string;
}

export default function LeadersManagement() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.run({
        path: "getLeaders",
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

      const leadersList = data?.List || [];
      setLeaders(leadersList);
      setFilteredLeaders(leadersList);
      toast({
        title: "تم تحميل البيانات",
        description: `تم جلب ${leadersList.length} قائد`
      });
    } catch (error) {
      console.error('خطأ في تحميل القادة:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // تصفية القادة حسب البحث
  const filteredLeaders = leaders.filter((leader) =>
  leader.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  leader.phone.includes(searchTerm) ||
  leader.residence.toLowerCase().includes(searchTerm.toLowerCase()) ||
  leader.workplace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LeaderCard = ({ leader }: {leader: Leader;}) =>
  <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="text-purple-600" size={24} />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800">{leader.full_name}</CardTitle>
              <CardDescription>محطة رقم {leader.station_number}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <Vote size={14} className="mr-1" />
            {leader.votes_count} صوت
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {leader.phone &&
        <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} />
              <span dir="ltr" className="font-mono">{leader.phone}</span>
            </div>
        }
          
          {leader.residence &&
        <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={16} />
              <span>{leader.residence}</span>
            </div>
        }
          
          {leader.workplace &&
        <div className="flex items-center gap-3 text-gray-600">
              <Briefcase size={16} />
              <span>{leader.workplace}</span>
            </div>
        }
          
          {leader.center_info &&
        <div className="flex items-center gap-3 text-gray-600">
              <Users size={16} />
              <span>{leader.center_info}</span>
            </div>
        }
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" size="sm">
            <Edit2 size={16} className="ml-1" />
            تعديل
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 size={16} className="ml-1" />
            حذف
          </Button>
        </div>
      </CardContent>
    </Card>;


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">جارٍ تحميل بيانات القادة...</p>
            </div>
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
            إدارة القادة
          </h1>
          <p className="text-lg text-gray-600">عرض وإدارة بيانات القادة</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </div>

        {/* شريط البحث والأدوات */}
        <div className="mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="text"
                      placeholder="البحث في القادة (الاسم، الهاتف، السكن، العمل...)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 rtl-input" />

                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="ml-1" />
                    إضافة قائد جديد
                  </Button>
                  <Button variant="outline" onClick={fetchLeaders}>
                    تحديث البيانات
                  </Button>
                </div>
              </div>

              {/* إحصائيات سريعة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{leaders.length}</div>
                  <div className="text-sm text-gray-600">إجمالي القادة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredLeaders.length}</div>
                  <div className="text-sm text-gray-600">نتائج البحث</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {leaders.reduce((sum, leader) => sum + leader.votes_count, 0)}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي الأصوات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {leaders.length > 0 ? Math.round(leaders.reduce((sum, leader) => sum + leader.votes_count, 0) / leaders.length) : 0}
                  </div>
                  <div className="text-sm text-gray-600">متوسط الأصوات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة القادة */}
        {filteredLeaders.length === 0 ?
        <div className="text-center py-12">
            <Crown className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد قادة مسجلون'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'جرب تغيير كلمات البحث' : 'ابدأ بإضافة قائد جديد'}
            </p>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeaders.map((leader) =>
          <LeaderCard key={leader.id} leader={leader} />
          )}
          </div>
        }

        {/* معلومات إضافية */}
        {searchTerm && filteredLeaders.length > 0 &&
        <div className="mt-8 text-center">
            <p className="text-gray-600">
              تم العثور على <span className="font-bold text-purple-600">{filteredLeaders.length}</span> قائد
              من أصل <span className="font-bold">{leaders.length}</span>
            </p>
          </div>
        }
      </div>
    </div>);

}