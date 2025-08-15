import { Button } from '@/components/ui/button';
import { Crown, Users, Vote, BarChart3, ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50" dir="rtl">
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* العنوان الرئيسي */}
            <div className="mb-8">
              <div className="mb-6">
                <Crown className="mx-auto text-purple-600 mb-4" size={64} />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                نظام إدارة البيانات الانتخابية
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                مكتب النائب عمار جار الله
              </p>
              <p className="text-lg text-gray-500">
                عرض شجري تفاعلي للقادة والأفراد مع إحصائيات شاملة
              </p>
            </div>

            {/* الميزات */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <Crown className="mx-auto text-purple-600 mb-3" size={32} />
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  إدارة القادة
                </h3>
                <p className="text-purple-600">
                  عرض وإدارة بيانات القادة مع تفاصيل شاملة
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Users className="mx-auto text-blue-600 mb-3" size={32} />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  الأفراد المرتبطون
                </h3>
                <p className="text-blue-600">
                  عرض الأفراد التابعين لكل قائد في شجرة تفاعلية
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <BarChart3 className="mx-auto text-green-600 mb-3" size={32} />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  إحصائيات متقدمة
                </h3>
                <p className="text-green-600">
                  تتبع الأصوات والبيانات مع تحليلات شاملة
                </p>
              </div>
            </div>

            {/* الأزرار */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-4 text-lg font-semibold"
                  onClick={() => navigate('/leaders-tree')}
                >
                  <Crown className="ml-2" size={20} />
                  العرض الشجري
                </Button>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-4 text-lg font-semibold"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart3 className="ml-2" size={20} />
                  لوحة التحكم
                </Button>
              </div>
              <Button 
                variant="outline"
                size="lg" 
                className="px-8 py-3 text-lg font-semibold w-full md:w-auto"
                onClick={() => navigate('/login')}
              >
                <LogIn className="ml-2" size={20} />
                تسجيل الدخول
                <ArrowRight className="mr-2" size={20} />
              </Button>
              <p className="text-sm text-gray-500">
                يمكنك تجربة النظام مباشرة أو تسجيل الدخول للوصول إلى جميع الميزات
              </p>

              {/* روابط سريعة */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">روابط سريعة</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => navigate('/leaders')}
                  >
                    <Crown size={24} className="text-purple-600" />
                    <span className="text-sm">إدارة القادة</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => navigate('/individuals')}
                  >
                    <Users size={24} className="text-blue-600" />
                    <span className="text-sm">إدارة الأفراد</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => navigate('/dashboard')}
                  >
                    <BarChart3 size={24} className="text-green-600" />
                    <span className="text-sm">الإحصائيات</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => navigate('/leaders-tree')}
                  >
                    <Vote size={24} className="text-orange-600" />
                    <span className="text-sm">العرض الشجري</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Vote size={16} />
                  <span>تتبع الأصوات</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>إدارة شاملة</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown size={16} />
                  <span>عرض هرمي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}