import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Vote, BarChart3, ArrowRight, LogIn, Shield, Award, FileText, Building, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="formal-bg" dir="rtl">
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="max-w-6xl w-full">
          
          {/* القسم الرئيسي */}
          <div className="formal-card rounded-2xl p-12 mb-8 text-center animate-fade-in-up">
            {/* الشعار الرسمي */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-28 h-28 official-logo rounded-full mb-6">
                <Shield size={56} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold formal-title mb-6 leading-tight">
                نظام إدارة البيانات الانتخابية
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge className="formal-badge text-lg px-6 py-3">
                  <Building size={20} className="ml-2" />
                  مكتب النائب عمار جار الله
                </Badge>
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-900 font-bold text-sm px-4 py-2">
                  <Award size={18} className="ml-1" />
                  نظام رسمي معتمد
                </Badge>
              </div>
              <p className="text-xl formal-subtitle max-w-3xl mx-auto leading-relaxed">
                منصة إدارة شاملة للبيانات الانتخابية مع عرض هرمي تفاعلي متطور وأنظمة حماية متقدمة
              </p>
            </div>

            <div className="formal-divider"></div>

            {/* الميزات الرئيسية */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="stats-card p-10 text-center interactive-hover">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-6">
                  <Crown className="text-blue-600" size={36} />
                </div>
                <h3 className="text-2xl font-bold formal-title mb-4">
                  إدارة القادة
                </h3>
                <p className="formal-subtitle leading-relaxed text-lg">
                  نظام شامل لإدارة ومتابعة بيانات القادة مع إحصائيات تفصيلية وتقارير دقيقة ومتابعة مستمرة
                </p>
              </div>
              
              <div className="stats-card p-10 text-center interactive-hover">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6">
                  <Users className="text-green-600" size={36} />
                </div>
                <h3 className="text-2xl font-bold formal-title mb-4">
                  متابعة الأفراد
                </h3>
                <p className="formal-subtitle leading-relaxed text-lg">
                  عرض تفاعلي للأفراد المرتبطين بكل قائد في شجرة هرمية منظمة ومفصلة مع تتبع دقيق
                </p>
              </div>
              
              <div className="stats-card p-10 text-center interactive-hover">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-6">
                  <BarChart3 className="text-purple-600" size={36} />
                </div>
                <h3 className="text-2xl font-bold formal-title mb-4">
                  تحليلات متقدمة
                </h3>
                <p className="formal-subtitle leading-relaxed text-lg">
                  لوحة تحكم شاملة مع إحصائيات دقيقة وتحليلات متطورة للبيانات الانتخابية والمؤشرات
                </p>
              </div>
            </div>

            {/* الأزرار الرئيسية */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Button
                  size="lg"
                  className="btn-formal h-20 text-xl font-bold px-10 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => navigate('/leaders-tree')}>

                  <TreePine className="ml-3" size={28} />
                  العرض الشجري التفاعلي
                  <span className="block text-sm mt-1 opacity-90">استعراض الهيكل التنظيمي</span>
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-20 text-xl font-bold px-10 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => navigate('/dashboard')}>

                  <BarChart3 className="ml-3" size={28} />
                  لوحة التحكم الإحصائية
                  <span className="block text-sm mt-1 opacity-90">التحليلات والمؤشرات</span>
                </Button>
              </div>
              
              {!user && (
                <div className="max-w-md mx-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full formal-shadow-lg h-16 text-lg font-semibold px-12 py-4 rounded-xl border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    onClick={() => navigate('/login')}>

                    <LogIn className="ml-3" size={24} />
                    تسجيل الدخول
                    <ArrowRight className="mr-3" size={24} />
                  </Button>
                </div>
              )}
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
                <p className="formal-subtitle text-lg flex items-center justify-center">
                  <Shield className="inline ml-3 text-blue-600" size={24} />
                  {user ? 
                    'مرحباً بك في نظام إدارة البيانات الانتخابية' : 
                    'نظام آمن ومعتمد للوصول إلى جميع الميزات المتقدمة والتحكم الكامل'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* الروابط السريعة */}
          <div className="formal-card rounded-xl p-10">
            <h3 className="text-3xl font-bold formal-title text-center mb-10">
              <FileText className="inline ml-3" size={32} />
              الوصول السريع للأقسام
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Button
                variant="ghost"
                className="formal-shadow-lg h-32 flex flex-col items-center gap-4 p-8 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200"
                onClick={() => navigate('/leaders')}>

                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Crown size={32} className="text-blue-600" />
                </div>
                <span className="font-bold text-gray-700 text-lg">إدارة القادة</span>
              </Button>
              
              <Button
                variant="ghost"
                className="formal-shadow-lg h-32 flex flex-col items-center gap-4 p-8 rounded-xl hover:bg-green-50 transition-all duration-300 border border-transparent hover:border-green-200"
                onClick={() => navigate('/individuals')}>

                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Users size={32} className="text-green-600" />
                </div>
                <span className="font-bold text-gray-700 text-lg">إدارة الأفراد</span>
              </Button>
              
              <Button
                variant="ghost"
                className="formal-shadow-lg h-32 flex flex-col items-center gap-4 p-8 rounded-xl hover:bg-purple-50 transition-all duration-300 border border-transparent hover:border-purple-200"
                onClick={() => navigate('/dashboard')}>

                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 size={32} className="text-purple-600" />
                </div>
                <span className="font-bold text-gray-700 text-lg">الإحصائيات</span>
              </Button>
              
              <Button
                variant="ghost"
                className="formal-shadow-lg h-32 flex flex-col items-center gap-4 p-8 rounded-xl hover:bg-orange-50 transition-all duration-300 border border-transparent hover:border-orange-200"
                onClick={() => navigate('/leaders-tree')}>

                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <TreePine size={32} className="text-orange-600" />
                </div>
                <span className="font-bold text-gray-700 text-lg">العرض الشجري</span>
              </Button>
            </div>
          </div>

          {/* معلومات النظام */}
          <div className="mt-10 text-center">
            <div className="formal-card rounded-xl p-8">
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm formal-subtitle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Vote size={20} className="text-blue-600" />
                  </div>
                  <span className="font-semibold">تتبع دقيق للأصوات</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield size={20} className="text-green-600" />
                  </div>
                  <span className="font-semibold">حماية أمنية متقدمة</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Crown size={20} className="text-purple-600" />
                  </div>
                  <span className="font-semibold">عرض هرمي منظم</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 size={20} className="text-orange-600" />
                  </div>
                  <span className="font-semibold">تحليلات شاملة</span>
                </div>
              </div>
              
              {/* معلومات إضافية */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Building size={16} />
                  <span>© 2024 نظام إدارة البيانات الانتخابية - مكتب النائب عمار جار الله</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}