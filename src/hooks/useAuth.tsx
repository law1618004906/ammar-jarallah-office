
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const LOCAL_KEY = 'auth_user';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1) جرّب EasySite API إن وجد
      if (window?.ezsite?.apis?.run) {
        const { data, error } = await window.ezsite.apis.run({
          path: "checkAuth",
          param: []
        });
        if (!error && data?.authenticated && data?.user) {
          setUser(data.user);
          return;
        }
      }

      // 2) فولباك: جلسة محلية
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const u = JSON.parse(raw) as User;
        setUser(u);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // فولباك محلي عند الفشل
      const raw = localStorage.getItem(LOCAL_KEY);
      setUser(raw ? (JSON.parse(raw) as User) : null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 1) محاولة عبر EasySite API
      if (window?.ezsite?.apis?.run) {
        const { data, error } = await window.ezsite.apis.run({
          path: "login",
          param: [username, password]
        });
        if (!error && data?.success && data?.user) {
          setUser(data.user);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(data.user));
          toast({ title: "مرحباً بك", description: `أهلاً وسهلاً ${data.user.name || data.user.username}` });
          return true;
        }
      }

      // 2) فولباك: حساب المدير الثابت محلياً
      const fixedOk = (username === 'فقار' && password === '123456');
      if (fixedOk) {
        const fixedUser: User = { id: 'local-admin', username: 'فقار', name: 'فقار', role: 'admin' };
        setUser(fixedUser);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(fixedUser));
        toast({ title: "مرحباً بك", description: `أهلاً وسهلاً ${fixedUser.name}` });
        return true;
      }

      toast({ title: "بيانات غير صحيحة", description: "اسم المستخدم أو كلمة المرور غير صحيحة", variant: 'destructive' });
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      toast({ title: "خطأ في الاتصال", description: "تعذّر تسجيل الدخول حالياً", variant: "destructive" });
      return false;
    }
  };

  const logout = async () => {
    try {
      if (window?.ezsite?.apis?.run) {
        await window.ezsite.apis.run({ path: "logout", param: [] });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem(LOCAL_KEY);
      setUser(null);
      toast({ title: "تم تسجيل الخروج", description: "إلى اللقاء!" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>);

}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};