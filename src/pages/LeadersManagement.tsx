
import React, { useState, useEffect } from 'react';
import { Crown, Search, Plus, Edit2, Trash2, Phone, MapPin, Briefcase, Vote, Users, Building, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import AddLeaderModal from '@/components/AddLeaderModal';
import EditLeaderModal from '@/components/EditLeaderModal';
import AddSampleDataButton from '@/components/AddSampleDataButton';
import { getLeadersFromStorage, deleteLeaderFromStorage, initializeDefaultData } from '@/lib/localStorageOperations';

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
      
      // Check if EasySite API is available
      if (window?.ezsite?.apis?.run) {
        const { data, error } = await window.ezsite.apis.run({
          path: "getLeaders",
          param: []
        });

        if (!error && data) {
          setLeaders(data || []);
          return;
        }
      }

      // Fallback: Use localStorage data for production
      console.log('Using localStorage data for leaders');
      initializeDefaultData(); // Initialize default data if needed
      const storedLeaders = getLeadersFromStorage();
      setLeaders(storedLeaders);
      
    } catch (error) {
      console.error('خطأ في تحميل القادة:', error);
      // Even on error, use localStorage
      initializeDefaultData();
      const storedLeaders = getLeadersFromStorage();
      setLeaders(storedLeaders);
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

  const handleDeleteLeader = async (leaderId: number, leaderName: string) => {
    try {
      // Try EasySite API first
      if (window?.ezsite?.apis?.run) {
        const { data, error } = await window.ezsite.apis.run({
          path: "deleteLeader",
          param: [leaderId]
        });

        if (!error) {
          toast({
            title: "تم الحذف بنجاح",
            description: `تم حذف القائد ${leaderName} بنجاح`
          });
          fetchLeaders();
          return;
        }
      }

      // Fallback: Use localStorage
      const success = deleteLeaderFromStorage(leaderId);
      if (success) {
        toast({
          title: "تم الحذف بنجاح",
          description: `تم حذف القائد ${leaderName} بنجاح`
        });
        fetchLeaders();
      } else {
        toast({
          title: "خطأ في الحذف",
          description: "لم يتم العثور على القائد المحدد",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('خطأ في حذف القائد:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف القائد",
        variant: "destructive"
      });
    }
  };

  const LeaderCard = ({ leader }: {leader: Leader;}) =>
  <Card className="formal-card interactive-hover formal-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Crown className="text-yellow-600" size={28} />
            </div>
            <div>
              <CardTitle className="text-2xl formal-title">{leader.full_name}</CardTitle>
              <CardDescription className="text-lg formal-subtitle">
                محطة رقم {leader.station_number}
              </CardDescription>
            </div>
          </div>
          <Badge className="formal-badge text-lg px-4 py-2">
            <Vote size={16} className="mr-2" />
            {leader.votes_count} صوت
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {leader.phone &&
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Phone size={18} className="text-green-600" />
            <span dir="ltr" className="font-mono text-gray-700">{leader.phone}</span>
          </div>
      }
        
        {leader.residence &&
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <MapPin size={18} className="text-blue-600" />
            <span className="text-gray-700">{leader.residence}</span>
          </div>
      }
        
        {leader.workplace &&
      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Briefcase size={18} className="text-purple-600" />
            <span className="text-gray-700">{leader.workplace}</span>
          </div>
      }
        
        {leader.center_info &&
      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <Building size={18} className="text-orange-600" />
            <span className="text-gray-700">{leader.center_info}</span>
          </div>
      }

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <EditLeaderModal leader={leader} onLeaderUpdated={fetchLeaders} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-400 hover:bg-red-50">
                <Trash2 size={16} className="ml-2" />
                حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من أنك تريد حذف القائد <span className="font-bold">{leader.full_name}</span>؟
                  <br />
                  لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteLeader(leader.id, leader.full_name)} className="bg-red-600 hover:bg-red-700">
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>;


  if (loading) {
    return (
      <div className="formal-bg min-h-screen p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-xl formal-subtitle">جارٍ تحميل بيانات القادة...</p>
            </div>
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
            <Crown className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold formal-title mb-4">
            إدارة القادة
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="formal-badge text-lg px-4 py-2">
              <Shield size={18} className="ml-2" />
              عرض وإدارة بيانات القادة
            </Badge>
          </div>
          <div className="formal-divider"></div>
        </div>

        {/* شريط البحث والأدوات */}
        <div className="mb-8">
          <Card className="formal-card formal-shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                    <Input
                      type="text"
                      placeholder="البحث في القادة (الاسم، الهاتف، السكن، العمل...)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-12 rtl-input text-lg h-14 formal-shadow border-2 border-gray-200 focus:border-blue-400" />

                  </div>
                </div>
                
                <div className="flex gap-3">
                  <AddLeaderModal onLeaderAdded={fetchLeaders} />
                  <Button
                    variant="outline"
                    onClick={fetchLeaders}
                    className="h-12 px-6 text-lg font-semibold formal-shadow border-2 border-blue-200 hover:border-blue-400">

                    تحديث البيانات
                  </Button>
                  <AddSampleDataButton onDataAdded={fetchLeaders} />
                </div>
              </div>

              {/* إحصائيات سريعة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{leaders.length}</div>
                  <div className="text-sm formal-subtitle font-medium">إجمالي القادة</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{filteredLeaders.length}</div>
                  <div className="text-sm formal-subtitle font-medium">نتائج البحث</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">
                    {leaders.reduce((sum, leader) => sum + leader.votes_count, 0)}
                  </div>
                  <div className="text-sm formal-subtitle font-medium">إجمالي الأصوات</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">
                    {leaders.length > 0 ? Math.round(leaders.reduce((sum, leader) => sum + leader.votes_count, 0) / leaders.length) : 0}
                  </div>
                  <div className="text-sm formal-subtitle font-medium">متوسط الأصوات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة القادة */}
        {filteredLeaders.length === 0 ?
        <div className="text-center py-16">
            <Crown className="mx-auto text-gray-400 mb-6" size={80} />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد قادة مسجلون'}
            </h3>
            <p className="formal-subtitle text-lg">
              {searchTerm ? 'جرب تغيير كلمات البحث' : 'ابدأ بإضافة قائد جديد'}
            </p>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLeaders.map((leader) =>
          <LeaderCard key={leader.id} leader={leader} />
          )}
          </div>
        }

        {/* معلومات إضافية */}
        {searchTerm && filteredLeaders.length > 0 &&
        <div className="mt-12 text-center">
            <div className="formal-card rounded-xl p-6">
              <p className="formal-subtitle text-lg">
                تم العثور على <span className="font-bold text-blue-600 text-xl">{filteredLeaders.length}</span> قائد
                من أصل <span className="font-bold text-xl">{leaders.length}</span>
              </p>
            </div>
          </div>
        }
      </div>
    </div>);

}