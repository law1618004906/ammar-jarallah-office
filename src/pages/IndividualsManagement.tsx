
import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Phone, MapPin, Briefcase, Vote, Crown, Building, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import AddPersonModal from '@/components/AddPersonModal';
import EditPersonModal from '@/components/EditPersonModal';
import AddSampleDataButton from '@/components/AddSampleDataButton';

interface Person {
  id: number;
  leader_name: string;
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

export default function IndividualsManagement() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeader, setSelectedLeader] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      setLoading(true);

      const { data, error } = await window.ezsite.apis.run({
        path: "getPersons",
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

      const personsList = data?.List || [];
      setPersons(personsList);
      toast({
        title: "تم تحميل البيانات",
        description: `تم جلب ${personsList.length} فرد`
      });
    } catch (error) {
      console.error('خطأ في تحميل الأفراد:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // الحصول على قائمة القادة الفريدة
  const uniqueLeaders = Array.from(new Set(persons.map((person) => person.leader_name)));

  // تصفية الأفراد حسب البحث والقائد المختار
  const filteredPersons = persons.filter((person) => {
    const matchesSearch = person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.phone.includes(searchTerm) ||
    person.residence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.workplace.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.leader_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLeader = !selectedLeader || person.leader_name === selectedLeader;

    return matchesSearch && matchesLeader;
  });

  const handleDeletePerson = async (personId: number, personName: string) => {
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: "deletePerson",
        param: [personId]
      });

      if (error) {
        toast({
          title: "خطأ في حذف الفرد",
          description: error,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف الفرد ${personName} بنجاح`
      });

      fetchPersons();
    } catch (error) {
      console.error('خطأ في حذف الفرد:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الفرد",
        variant: "destructive"
      });
    }
  };

  const PersonCard = ({ person }: {person: Person;}) =>
  <Card className="formal-card interactive-hover formal-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="text-blue-600" size={28} />
            </div>
            <div>
              <CardTitle className="text-2xl formal-title">{person.full_name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-lg formal-subtitle">
                <Crown size={16} />
                {person.leader_name}
              </CardDescription>
            </div>
          </div>
          <Badge className="formal-badge text-lg px-4 py-2">
            <Vote size={16} className="mr-2" />
            {person.votes_count} صوت
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {person.phone &&
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Phone size={18} className="text-green-600" />
            <span dir="ltr" className="font-mono text-gray-700">{person.phone}</span>
          </div>
      }
        
        {person.residence &&
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <MapPin size={18} className="text-blue-600" />
            <span className="text-gray-700">{person.residence}</span>
          </div>
      }
        
        {person.workplace &&
      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Briefcase size={18} className="text-purple-600" />
            <span className="text-gray-700">{person.workplace}</span>
          </div>
      }
        
        {person.center_info &&
      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 text-sm font-medium mb-1">
              <Building size={16} />
              المركز الانتخابي
            </div>
            <div className="text-gray-700">
              {person.center_info} - محطة {person.station_number}
            </div>
          </div>
      }

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <EditPersonModal person={person} onPersonUpdated={fetchPersons} />
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
                  هل أنت متأكد من أنك تريد حذف الفرد <span className="font-bold">{person.full_name}</span>؟
                  <br />
                  لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeletePerson(person.id, person.full_name)} className="bg-red-600 hover:bg-red-700">
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
              <p className="text-xl formal-subtitle">جارٍ تحميل بيانات الأفراد...</p>
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
            <Users className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold formal-title mb-4">
            إدارة الأفراد
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="formal-badge text-lg px-4 py-2">
              <Shield size={18} className="ml-2" />
              عرض وإدارة بيانات الأفراد التابعين للقادة
            </Badge>
          </div>
          <div className="formal-divider"></div>
        </div>

        {/* شريط البحث والأدوات */}
        <div className="mb-8">
          <Card className="formal-card formal-shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                      <Input
                        type="text"
                        placeholder="البحث في الأفراد (الاسم، الهاتف، القائد...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-12 rtl-input text-lg h-14 formal-shadow border-2 border-gray-200 focus:border-blue-400" />

                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <AddPersonModal onPersonAdded={fetchPersons} />
                    <Button
                      variant="outline"
                      onClick={fetchPersons}
                      className="h-12 px-6 text-lg font-semibold formal-shadow border-2 border-blue-200 hover:border-blue-400">

                      تحديث البيانات
                    </Button>
                    <AddSampleDataButton onDataAdded={fetchPersons} />
                  </div>
                </div>

                {/* تصفية حسب القائد */}
                <div className="max-w-sm">
                  <Select value={selectedLeader} onValueChange={setSelectedLeader}>
                    <SelectTrigger className="rtl-input h-12 text-lg formal-shadow border-2 border-gray-200">
                      <SelectValue placeholder="تصفية حسب القائد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع القادة</SelectItem>
                      {uniqueLeaders.map((leader) =>
                      <SelectItem key={leader} value={leader}>
                          {leader}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* إحصائيات سريعة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{persons.length}</div>
                  <div className="text-sm formal-subtitle font-medium">إجمالي الأفراد</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">{filteredPersons.length}</div>
                  <div className="text-sm formal-subtitle font-medium">نتائج البحث</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">
                    {persons.reduce((sum, person) => sum + person.votes_count, 0)}
                  </div>
                  <div className="text-sm formal-subtitle font-medium">إجمالي الأصوات</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">{uniqueLeaders.length}</div>
                  <div className="text-sm formal-subtitle font-medium">عدد القادة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الأفراد */}
        {filteredPersons.length === 0 ?
        <div className="text-center py-16">
            <Users className="mx-auto text-gray-400 mb-6" size={80} />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              {searchTerm || selectedLeader ? 'لا توجد نتائج للبحث' : 'لا توجد أفراد مسجلون'}
            </h3>
            <p className="formal-subtitle text-lg">
              {searchTerm || selectedLeader ? 'جرب تغيير معايير البحث' : 'ابدأ بإضافة فرد جديد'}
            </p>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPersons.map((person) =>
          <PersonCard key={person.id} person={person} />
          )}
          </div>
        }

        {/* معلومات إضافية */}
        {(searchTerm || selectedLeader) && filteredPersons.length > 0 &&
        <div className="mt-12 text-center">
            <div className="formal-card rounded-xl p-6">
              <p className="formal-subtitle text-lg">
                تم العثور على <span className="font-bold text-blue-600 text-xl">{filteredPersons.length}</span> فرد
                من أصل <span className="font-bold text-xl">{persons.length}</span>
                {selectedLeader &&
              <>
                    {" "}للقائد <span className="font-bold text-purple-600 text-xl">{selectedLeader}</span>
                  </>
              }
              </p>
            </div>
          </div>
        }
      </div>
    </div>);

}