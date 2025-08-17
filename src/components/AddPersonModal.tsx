import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Crown, Phone, MapPin, Briefcase, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Person } from '@/lib/localStorageOperations';
import { fastAddPerson, fastLoadLeaders } from '@/lib/fastStorage';

interface PersonFormData {
  leader_name: string;
  full_name: string;
  person_type: 'INDIVIDUAL';
  residence: string;
  phone: string;
  workplace: string;
  center_info: string;
  station_number: string;
  votes_count: number;
}

interface Leader {
  id: number;
  full_name: string;
}

interface AddPersonModalProps {
  onPersonAdded: (newPerson: PersonFormData & { id: number; created_at: string; updated_at: string }) => void;
}

export default function AddPersonModal({ onPersonAdded }: AddPersonModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [formData, setFormData] = useState<PersonFormData>({
    leader_name: '',
    full_name: '',
    person_type: 'INDIVIDUAL',
    residence: '',
    phone: '',
    workplace: '',
    center_info: '',
    station_number: '',
    votes_count: 0
  });

  const { toast } = useToast();

  const fetchLeaders = useCallback(async () => {
    try {
      console.log('🔄 تحميل القادة...');
      
      // استخدام fastLoadLeaders للحصول على البيانات فوراً
      const fastLeaders = fastLoadLeaders();
      const leaderOptions = fastLeaders.map(leader => ({
        id: leader.id,
        full_name: leader.full_name
      }));
      
      console.log('✅ تم تحميل', leaderOptions.length, 'قائد');
      setLeaders(leaderOptions);
      
    } catch (error) {
      console.error('❌ خطأ في تحميل القادة:', error);
      // في حالة الخطأ، استخدام بيانات افتراضية
      setLeaders([
        { id: 1, full_name: "قائد افتراضي" }
      ]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchLeaders();
    }
  }, [isOpen, fetchLeaders]);

  const handleInputChange = (field: keyof PersonFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "الاسم الثلاثي مطلوب",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.leader_name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "يجب اختيار القائد المسؤول",
        variant: "destructive"
      });
      return false;
    }

    if (formData.phone && !/^07\d{9}$/.test(formData.phone)) {
      toast({
        title: "خطأ في التحقق",
        description: "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقم",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 بدء إضافة فرد جديد:', formData);

      // استخدام التخزين السريع فقط لمنع إعادة التحميل المستمر
      const newPerson = fastAddPerson({
        leader_name: formData.leader_name,
        full_name: formData.full_name,
        residence: formData.residence,
        phone: formData.phone,
        workplace: formData.workplace,
        center_info: formData.center_info,
        station_number: formData.station_number,
        votes_count: formData.votes_count
      });

      console.log('✅ تم إضافة الفرد بنجاح:', newPerson);

      toast({
        title: "تمت الإضافة بنجاح",
        description: `تم إضافة ${formData.full_name} بنجاح`
      });

      // Reset form
      setFormData({
        leader_name: '',
        full_name: '',
        person_type: 'INDIVIDUAL',
        residence: '',
        phone: '',
        workplace: '',
        center_info: '',
        station_number: '',
        votes_count: 0
      });

      setIsOpen(false);
      
      // تحديث فوري للواجهة بدون إعادة تحميل
      onPersonAdded({
        ...newPerson,
        person_type: 'INDIVIDUAL' as const
      });

      // محاولة مزامنة مع API في الخلفية (اختيارية)
      if (window?.ezsite?.apis?.run) {
        try {
          await window.ezsite.apis.run({
            path: "addPerson",
            param: [formData]
          });
          console.log('🔄 تم مزامنة البيانات مع API');
        } catch (apiError) {
          console.log('⚠️ فشل المزامنة مع API، البيانات محفوظة محلياً');
        }
      }

    } catch (error) {
      console.error('❌ خطأ في إضافة الفرد:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة الفرد",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn-formal h-12 px-6 text-lg font-semibold">
          <Plus size={20} className="ml-2" />
          إضافة فرد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="text-blue-600" size={24} />
            </div>
            إضافة فرد جديد
          </DialogTitle>
          <DialogDescription className="text-lg formal-subtitle">
            أدخل بيانات الفرد الجديد وحدد القائد المسؤول عنه
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* اختيار القائد */}
            <div className="md:col-span-2">
              <Label htmlFor="leader_name" className="text-lg font-semibold text-gray-700 mb-2 block">
                القائد المسؤول <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.leader_name} onValueChange={(value) => handleInputChange('leader_name', value)}>
                <SelectTrigger className="rtl-input h-12 text-lg border-2 border-gray-200">
                  <SelectValue placeholder="اختر القائد المسؤول" />
                </SelectTrigger>
                <SelectContent>
                  {leaders.map((leader) =>
                  <SelectItem key={leader.id} value={leader.full_name}>
                      <div className="flex items-center gap-2">
                        <Crown size={16} className="text-yellow-600" />
                        {leader.full_name}
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* الاسم الثلاثي */}
            <div className="md:col-span-2">
              <Label htmlFor="full_name" className="text-lg font-semibold text-gray-700 mb-2 block">
                الاسم الثلاثي <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="أدخل الاسم الثلاثي كاملاً"
                className="rtl-input text-lg h-12 border-2 border-gray-200 focus:border-blue-400"
                required />

            </div>

            {/* رقم الهاتف */}
            <div>
              <Label htmlFor="phone" className="text-lg font-semibold text-gray-700 mb-2 block">
                رقم الهاتف المحمول
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="07xxxxxxxxx"
                className="rtl-input text-lg h-12 border-2 border-gray-200 focus:border-blue-400" />

            </div>

            {/* عنوان السكن */}
            <div>
              <Label htmlFor="residence" className="text-lg font-semibold text-gray-700 mb-2 block">
                عنوان السكن
              </Label>
              <Input
                id="residence"
                type="text"
                value={formData.residence}
                onChange={(e) => handleInputChange('residence', e.target.value)}
                placeholder="المحافظة - المنطقة"
                className="rtl-input text-lg h-12 border-2 border-gray-200 focus:border-blue-400" />

            </div>

            {/* مكان العمل */}
            <div>
              <Label htmlFor="workplace" className="text-lg font-semibold text-gray-700 mb-2 block">
                مكان العمل أو المهنة
              </Label>
              <Input
                id="workplace"
                type="text"
                value={formData.workplace}
                onChange={(e) => handleInputChange('workplace', e.target.value)}
                placeholder="الشركة أو المؤسسة"
                className="rtl-input text-lg h-12 border-2 border-gray-200 focus:border-blue-400" />

            </div>

            {/* رقم المحطة */}
            <div>
              <Label htmlFor="station_number" className="text-lg font-semibold text-gray-700 mb-2 block">
                رقم المحطة الانتخابية
              </Label>
              <Input
                id="station_number"
                type="text"
                value={formData.station_number}
                onChange={(e) => handleInputChange('station_number', e.target.value)}
                placeholder="رقم المحطة"
                className="rtl-input text-lg h-12 border-2 border-gray-200 focus:border-blue-400" />

            </div>

            {/* معلومات المركز */}
            <div className="md:col-span-2">
              <Label htmlFor="center_info" className="text-lg font-semibold text-gray-700 mb-2 block">
                معلومات المركز الانتخابي
              </Label>
              <Input
                id="center_info"
                type="text"
                value={formData.center_info}
                onChange={(e) => handleInputChange('center_info', e.target.value)}
                placeholder="اسم وموقع المركز الانتخابي"
                className="rtl-input text-lg h-12 border-2 border-gray-200 focus:border-blue-400" />

            </div>

            {/* عدد الأصوات */}
            <div>
              <Label htmlFor="votes_count" className="text-lg font-semibold text-gray-700 mb-2 block">
                عدد الأصوات المتوقعة
              </Label>
              <Input
                id="votes_count"
                type="number"
                min="0"
                value={formData.votes_count}
                onChange={(e) => handleInputChange('votes_count', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="rtl-input text-lg h-12 border-2 border-gray-200 focus:border-blue-400" />

            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-12 px-8 text-lg font-semibold"
              disabled={isLoading}>

              إلغاء
            </Button>
            <Button
              type="submit"
              className="btn-formal h-12 px-8 text-lg font-semibold"
              disabled={isLoading}>

              {isLoading ?
              <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  جاري الحفظ...
                </> :

              <>
                  <Users size={20} className="ml-2" />
                  حفظ الفرد
                </>
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);

}