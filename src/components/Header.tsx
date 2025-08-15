
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown, Home, TreePine, BarChart3, Users, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
{ icon: Home, label: 'الرئيسية', path: '/' },
{ icon: TreePine, label: 'العرض الشجري', path: '/leaders-tree' },
{ icon: BarChart3, label: 'لوحة التحكم', path: '/dashboard' },
{ icon: Crown, label: 'القادة', path: '/leaders' },
{ icon: Users, label: 'الأفراد', path: '/individuals' }];


export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* الشعار والعنوان */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-purple-800 text-lg">نظام إدارة البيانات الانتخابية</h1>
              <p className="text-xs text-purple-600">مكتب النائب عمار جار الله</p>
            </div>
          </div>

          {/* التنقل الرئيسي */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 ${
                  isActive ?
                  "bg-purple-600 hover:bg-purple-700 text-white" :
                  "text-gray-600 hover:text-purple-600 hover:bg-purple-50"}`
                  }>

                  <Icon size={16} />
                  {item.label}
                </Button>);

            })}
          </nav>

          {/* أزرار العمل */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="flex items-center gap-2">

              <LogIn size={16} />
              <span className="hidden sm:inline">تسجيل الدخول</span>
            </Button>
          </div>
        </div>

        {/* التنقل المتحرك (للهواتف) */}
        <div className="md:hidden pb-3">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                  isActive ?
                  "bg-purple-600 hover:bg-purple-700 text-white" :
                  "text-gray-600 hover:text-purple-600"}`
                  }>

                  <Icon size={14} />
                  <span className="text-xs">{item.label}</span>
                </Button>);

            })}
          </div>
        </div>
      </div>
    </header>);

}