
import React, { useState, useEffect, useCallback } from 'react';
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
import { getPersonsFromStorage, deletePersonFromStorage, initializeDefaultData, Person } from '@/lib/localStorageOperations';
import { fastLoadPersons, fastDeletePerson } from '@/lib/fastStorage';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import EnhancedSearch from '@/components/EnhancedSearch';
import RefreshButton from '@/components/RefreshButton';

export default function IndividualsManagement() {
  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [displayedPersons, setDisplayedPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { refreshData } = useDataRefresh();

  const loadPersonsCallback = useCallback(() => {
    try {
      setLoading(true);
      console.log('🔄 بدء تحميل الأفراد...');
      const timer = performance.now();
      
      // استخدام التحميل السريع (synchronous)
      const persons = fastLoadPersons();
      console.log('📊 البيانات المحملة:', persons);
      
      const loadTime = performance.now() - timer;
      console.log(`⚡ تم تحميل ${persons.length} فرد في ${Math.round(loadTime)}ms`);
      
      setAllPersons(persons);
      setDisplayedPersons(persons);
      
    } catch (error) {
      console.error('❌ خطأ في تحميل الأفراد:', error);
      // إضافة بيانات تجريبية في حالة الخطأ
      const fallbackData = [
        {
          id: 1,
          leader_name: "قائد تجريبي",
          full_name: "فرد تجريبي",
          residence: "مكان الإقامة",
          phone: "123456789",
          workplace: "مكان العمل",
          center_info: "مركز انتخابي",
          station_number: "1",
          votes_count: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setAllPersons(fallbackData);
      setDisplayedPersons(fallbackData);
      
      toast({
        title: "تم تحميل بيانات تجريبية",
        description: "تم تحميل بيانات تجريبية لاختبار الصفحة",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    console.log('🚀 IndividualsManagement useEffect triggered');
    loadPersonsCallback();
  }, [loadPersonsCallback]);

  const loadPersons = loadPersonsCallback;

  const handleDelete = async (personId: number, personName: string) => {
    try {
      const timer = performance.now();
      
      // استخدام الحذف السريع (synchronous)
      const success = fastDeletePerson(personId);
      
      if (success) {
        const deleteTime = performance.now() - timer;
        console.log(`⚡ تم حذف الفرد في ${Math.round(deleteTime)}ms`);
        
        // تحديث فوري للواجهة
        const updatedPersons = allPersons.filter(person => person.id !== personId);
        setAllPersons(updatedPersons);
        setDisplayedPersons(updatedPersons);
        
        toast({
          title: "تم الحذف بنجاح",
          description: `تم حذف الفرد ${personName} بنجاح`
        });
      } else {
        toast({
          title: "خطأ في الحذف",
          description: "لم يتم العثور على الفرد المحدد",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('خطأ في حذف الفرد:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الفرد",
        variant: "destructive"
      });
    }
  };

  const handlePersonAdded = (newPerson: Person) => {
    const updatedPersons = [...allPersons, newPerson];
    setAllPersons(updatedPersons);
    setDisplayedPersons(updatedPersons);
  };

  const handlePersonUpdated = (updatedPersonData: Partial<Person> & { id: number }) => {
    const existingPerson = allPersons.find(p => p.id === updatedPersonData.id);
    const updatedPerson: Person = {
      id: updatedPersonData.id,
      leader_name: updatedPersonData.leader_name || existingPerson?.leader_name || '',
      full_name: updatedPersonData.full_name || existingPerson?.full_name || '',
      residence: updatedPersonData.residence || existingPerson?.residence || '',
      phone: updatedPersonData.phone || existingPerson?.phone || '',
      workplace: updatedPersonData.workplace || existingPerson?.workplace || '',
      center_info: updatedPersonData.center_info || existingPerson?.center_info || '',
      station_number: updatedPersonData.station_number || existingPerson?.station_number || '',
      votes_count: updatedPersonData.votes_count || existingPerson?.votes_count || 0,
      created_at: existingPerson?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updatedPersons = allPersons.map(person => 
      person.id === updatedPerson.id ? updatedPerson : person
    );
    setAllPersons(updatedPersons);
    setDisplayedPersons(updatedPersons);
  };

  const handleSearchResults = (results: Person[]) => {
    setDisplayedPersons(results);
  };

  const getPersonStats = () => {
    const uniqueLeaders = Array.from(new Set(allPersons.map(p => p.leader_name)));
    return {
      totalPersons: allPersons.length,
      displayedPersons: displayedPersons.length,
      totalVotes: allPersons.reduce((sum, person) => sum + person.votes_count, 0),
      uniqueLeaders: uniqueLeaders.length
    };
  };

  const stats = getPersonStats();

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

        <div className="flex items-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <EditPersonModal person={person} onPersonUpdated={handlePersonUpdated} />
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
                <AlertDialogAction onClick={() => handleDelete(person.id, person.full_name)} className="bg-red-600 hover:bg-red-700">
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
                  <div className="flex-1">
                    <EnhancedSearch 
                      data={allPersons}
                      type="persons"
                      onResults={handleSearchResults}
                      placeholder="البحث في الأفراد (الاسم، الهاتف، القائد...)"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <AddPersonModal onPersonAdded={handlePersonAdded} />
                    <RefreshButton 
                      onDataRefreshed={() => loadPersons()}
                    />
                    <AddSampleDataButton onDataAdded={() => loadPersons()} />
                  </div>
                </div>

                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalPersons}</div>
                    <div className="text-sm formal-subtitle font-medium">إجمالي الأفراد</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600">{stats.displayedPersons}</div>
                    <div className="text-sm formal-subtitle font-medium">نتائج البحث</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600">{stats.totalVotes}</div>
                    <div className="text-sm formal-subtitle font-medium">إجمالي الأصوات</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600">{stats.uniqueLeaders}</div>
                    <div className="text-sm formal-subtitle font-medium">عدد القادة</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الأفراد */}
        {displayedPersons.length === 0 ?
        <div className="text-center py-16">
            <Users className="mx-auto text-gray-400 mb-6" size={80} />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              {allPersons.length === 0 ? 'لا توجد أفراد مسجلون' : 'لا توجد نتائج للبحث'}
            </h3>
            <p className="formal-subtitle text-lg">
              {allPersons.length === 0 ? 'ابدأ بإضافة فرد جديد' : 'جرب تغيير معايير البحث'}
            </p>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPersons.map((person) =>
          <PersonCard key={person.id} person={person} />
          )}
          </div>
        }

        {/* معلومات إضافية */}
        {displayedPersons.length > 0 && displayedPersons.length !== allPersons.length &&
        <div className="mt-12 text-center">
            <div className="formal-card rounded-xl p-6">
              <p className="formal-subtitle text-lg">
                تم العثور على <span className="font-bold text-blue-600 text-xl">{displayedPersons.length}</span> فرد
                من أصل <span className="font-bold text-xl">{allPersons.length}</span>
              </p>
            </div>
          </div>
        }
      </div>
    </div>);

}