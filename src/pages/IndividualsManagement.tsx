
import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Phone, MapPin, Briefcase, Vote, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

      setPersons(data || []);
    } catch (error) {
      console.error('خطأ في تحميل الأفراد:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل بيانات الأفراد",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // الحصول على قائمة القادة الفريدة
  const uniqueLeaders = Array.from(new Set(persons.map(person => person.leader_name)));

  // تصفية الأفراد حسب البحث والقائد المختار
  const filteredPersons = persons.filter(person => {
    const matchesSearch = person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.phone.includes(searchTerm) ||
                         person.residence.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.workplace.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.leader_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLeader = !selectedLeader || person.leader_name === selectedLeader;
    
    return matchesSearch && matchesLeader;
  });

  const PersonCard = ({ person }: { person: Person }) => (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800">{person.full_name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Crown size={14} />
                {person.leader_name}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Vote size={14} className="mr-1" />
            {person.votes_count} صوت
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {person.phone && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} />
              <span dir="ltr" className="font-mono">{person.phone}</span>
            </div>
          )}
          
          {person.residence && (
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={16} />
              <span>{person.residence}</span>
            </div>
          )}
          
          {person.workplace && (
            <div className="flex items-center gap-3 text-gray-600">
              <Briefcase size={16} />
              <span>{person.workplace}</span>
            </div>
          )}
          
          {person.center_info && (
            <div className="text-sm text-gray-500">
              المركز: {person.center_info} - محطة {person.station_number}
            </div>
          )}
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
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">جارٍ تحميل بيانات الأفراد...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-4" dir="rtl">
      <div className="container mx-auto p-6">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            إدارة الأفراد
          </h1>
          <p className="text-lg text-gray-600">عرض وإدارة بيانات الأفراد التابعين للقادة</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </div>

        {/* شريط البحث والأدوات */}
        <div className="mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="text"
                        placeholder="البحث في الأفراد (الاسم، الهاتف، القائد...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 rtl-input"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus size={18} className="ml-1" />
                      إضافة فرد جديد
                    </Button>
                    <Button variant="outline" onClick={fetchPersons}>
                      تحديث البيانات
                    </Button>
                  </div>
                </div>

                {/* تصفية حسب القائد */}
                <div className="max-w-sm">
                  <Select value={selectedLeader} onValueChange={setSelectedLeader}>
                    <SelectTrigger className="rtl-input">
                      <SelectValue placeholder="تصفية حسب القائد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع القادة</SelectItem>
                      {uniqueLeaders.map((leader) => (
                        <SelectItem key={leader} value={leader}>
                          {leader}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* إحصائيات سريعة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{persons.length}</div>
                  <div className="text-sm text-gray-600">إجمالي الأفراد</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{filteredPersons.length}</div>
                  <div className="text-sm text-gray-600">نتائج البحث</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {persons.reduce((sum, person) => sum + person.votes_count, 0)}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي الأصوات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{uniqueLeaders.length}</div>
                  <div className="text-sm text-gray-600">عدد القادة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الأفراد */}
        {filteredPersons.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || selectedLeader ? 'لا توجد نتائج للبحث' : 'لا توجد أفراد مسجلون'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedLeader ? 'جرب تغيير معايير البحث' : 'ابدأ بإضافة فرد جديد'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersons.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}

        {/* معلومات إضافية */}
        {(searchTerm || selectedLeader) && filteredPersons.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              تم العثور على <span className="font-bold text-blue-600">{filteredPersons.length}</span> فرد
              من أصل <span className="font-bold">{persons.length}</span>
              {selectedLeader && (
                <>
                  {" "}للقائد <span className="font-bold text-purple-600">{selectedLeader}</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
