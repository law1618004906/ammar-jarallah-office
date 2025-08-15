
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, Users, BarChart3, Home, LogOut, Menu, X, TreePine, User } from 'lucide-react';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: Home,
    label: 'الصفحة الرئيسية',
    path: '/',
    description: 'العودة للصفحة الرئيسية'
  },
  {
    icon: TreePine,
    label: 'العرض الشجري',
    path: '/leaders-tree',
    description: 'عرض القادة والأفراد في شجرة تفاعلية'
  },
  {
    icon: Crown,
    label: 'إدارة القادة',
    path: '/leaders',
    description: 'عرض وإدارة بيانات القادة'
  },
  {
    icon: Users,
    label: 'إدارة الأفراد',
    path: '/individuals',
    description: 'عرض وإدارة بيانات الأفراد'
  },
  {
    icon: BarChart3,
    label: 'لوحة التحكم',
    path: '/dashboard',
    description: 'الإحصائيات والتحليلات'
  }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-purple-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Crown className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-purple-800">نظام إدارة البيانات</h2>
            <p className="text-sm text-purple-600">الانتخابية</p>
          </div>
        </div>
        
        {/* معلومات المستخدم */}
        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
          <User className="text-purple-600" size={18} />
          <div>
            <div className="font-medium text-purple-800">{user.name}</div>
            <div className="text-xs text-purple-600">{user.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <Icon size={20} />
                <div className="text-right">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs opacity-70">{item.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-purple-200">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        >
          <LogOut className="ml-2" size={18} />
          تسجيل الخروج
        </Button>
        
        <div className="mt-3 text-center text-xs text-gray-500">
          مكتب النائب عمار جار الله
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 lg:hidden bg-white shadow-lg"
      >
        <Menu size={18} />
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-l lg:border-gray-200 lg:shadow-lg">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">القائمة الجانبية</h3>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
              >
                <X size={18} />
              </Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
