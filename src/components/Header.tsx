
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown, Home, TreePine, BarChart3, Users, User, LogIn, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, logout, refreshAuth, loading } = useAuth();
  
  // Debug logging
  console.log('Header render - user:', user, 'loading:', loading);
  console.log('localStorage auth_user:', localStorage.getItem('auth_user'));

  return (
    <header className="formal-header sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* الشعار الرسمي والعنوان */}
          <div className="flex items-center gap-4">
            <div className="official-logo">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                نظام إدارة البيانات الانتخابية
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-blue-200 font-medium">
                  مكتب النائب عمار جار الله
                </p>
                <Badge className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-2 py-1">
                  رسمي
                </Badge>
              </div>
            </div>
          </div>

          {/* التنقل الرئيسي */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all duration-300 ${
                  isActive ?
                  'bg-white text-blue-700 hover:bg-gray-100 shadow-lg' :
                  'text-blue-100 hover:text-white hover:bg-blue-700/30 backdrop-blur-sm'}`
                  }>

                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Button>);

            })}
          </nav>

          {/* أزرار العمل */}
          <div className="flex items-center gap-3">
            {(() => {
              // Force check localStorage directly in render
              const rawUser = localStorage.getItem('auth_user');
              let currentUser = user;
              
              if (!currentUser && rawUser && rawUser !== 'null') {
                try {
                  const parsed = JSON.parse(rawUser);
                  if (parsed && parsed.id && parsed.username) {
                    currentUser = parsed;
                  }
                } catch (e) {
                  console.error('Parse error:', e);
                }
              }
              
              if (loading) {
                return <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>;
              } else if (currentUser) {
                return (
                  <>
                    <span className="text-white/90 hidden sm:inline">مرحبا، {currentUser.name || currentUser.username}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-blue-700 transition-all duration-300 font-semibold">
                      <User size={18} />
                      تسجيل الخروج
                    </Button>
                  </>
                );
              } else {
                return (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshAuth}
                      className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm border-yellow-400/30 text-yellow-200 hover:bg-yellow-400 hover:text-yellow-900 transition-all duration-300 font-semibold">
                      تحديث
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-blue-700 transition-all duration-300 font-semibold">
                      <LogIn size={18} />
                      <span className="hidden sm:inline">تسجيل الدخول</span>
                    </Button>
                  </>
                );
              }
            })()}
          </div>
        </div>

        {/* التنقل المتحرك (للأجهزة الصغيرة) */}
        <div className="lg:hidden pb-4">
          <div className="flex gap-1 overflow-x-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive ?
                  'bg-white text-blue-700 hover:bg-gray-100 shadow-lg' :
                  'text-blue-100 hover:text-white hover:bg-blue-700/30'}`
                  }>

                  <Icon size={16} />
                  <span>{item.label}</span>
                </Button>);

            })}
          </div>
        </div>
      </div>
    </header>);

}