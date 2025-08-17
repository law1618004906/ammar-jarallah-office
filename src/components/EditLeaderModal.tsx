import React, { useState, useEffect } from 'react';
import { Crown, Edit2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fastUpdateLeader } from '@/lib/fastStorage';

interface LeaderFormData {
  id: number;
  full_name: string;
  person_type: 'LEADER';
  residence: string;
  phone: string;
  workplace: string;
  center_info: string;
  station_number: string;
  votes_count: number;
}

interface EditLeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  leader: {
    id: number;
    full_name: string;
    residence: string;
    phone: string;
    workplace: string;
    center_info: string;
    station_number: string;
    votes_count: number;
  };
  onLeaderUpdated: (leader: LeaderFormData) => void;
}

export default function EditLeaderModal({ isOpen, onClose, leader, onLeaderUpdated }: EditLeaderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LeaderFormData>({
    id: leader.id,
    full_name: leader.full_name,
    person_type: 'LEADER',
    residence: leader.residence,
    phone: leader.phone,
    workplace: leader.workplace,
    center_info: leader.center_info,
    station_number: leader.station_number,
    votes_count: leader.votes_count
  });

  const { toast } = useToast();

  const handleInputChange = (field: keyof LeaderFormData, value: string | number) => {
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
      console.log('🚀 بدء تعديل القائد:', formData);

      // استخدام التخزين السريع فقط لمنع إعادة التحميل المستمر
      const updatedLeader = fastUpdateLeader(formData.id, {
        full_name: formData.full_name,
        residence: formData.residence,
        phone: formData.phone,
        workplace: formData.workplace,
        center_info: formData.center_info,
        station_number: formData.station_number,
        votes_count: formData.votes_count
      });

      if (updatedLeader) {
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل بيانات القائد بنجاح"
        });

        onClose();
        onLeaderUpdated(formData);
      } else {
        throw new Error('فشل في تحديث البيانات');
      }
    } catch (error) {
      console.error('خطأ في تعديل القائد:', error);
      toast({
        title: "خطأ في التعديل",
        description: "حدث خطأ أثناء تعديل بيانات القائد",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="formal-shadow border-blue-200 hover:border-blue-400 hover:bg-blue-50">
          <Edit2 size={16} className="ml-2" />
          تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Edit2 className="text-yellow-600" size={24} />
            </div>
            تعديل بيانات القائد
          </DialogTitle>
          <DialogDescription className="text-lg formal-subtitle">
            عدل بيانات القائد في النموذج أدناه
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onClick={onClose}
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
                  <Edit2 size={20} className="ml-2" />
                  حفظ التعديلات
                </>
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}