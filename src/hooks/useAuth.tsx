
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
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: {children: ReactNode;}) {
  // Initialize user state immediately from localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw && raw !== 'null' && raw !== 'undefined') {
        const parsed = JSON.parse(raw) as User;
        if (parsed && parsed.id && parsed.username) {
          console.log('Initial user loaded from localStorage:', parsed);
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to parse initial user data:', error);
    }
    return null;
  });
  const [loading, setLoading] = useState(false); // Start with false since we loaded from localStorage
  const { toast } = useToast();
  const LOCAL_KEY = 'auth_user';

  useEffect(() => {
    checkAuth();
  }, []);

  // Force re-check auth when component mounts or when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed, rechecking auth...');
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuth = async () => {
    console.log('=== checkAuth called ===');
    // Don't set loading to true if we already have a user from initial state
    if (!user) {
      setLoading(true);
    }
    
    try {
      // 1) جرّب EasySite API إن وجد
      if (window?.ezsite?.apis?.run) {
        console.log('Trying EasySite API...');
        const { data, error } = await window.ezsite.apis.run({
          path: "checkAuth",
          param: []
        });
        if (!error && data?.authenticated && data?.user) {
          console.log('EasySite auth success:', data.user);
          setUser(data.user);
          setLoading(false);
          return;
        }
        console.log('EasySite API failed or no user');
      }

      // 2) فولباك: جلسة محلية - only if we don't already have user
      if (!user) {
        const raw = localStorage.getItem(LOCAL_KEY);
        console.log('Local storage raw data:', raw);
        
        if (raw && raw !== 'null' && raw !== 'undefined') {
          try {
            const u = JSON.parse(raw) as User;
            console.log('Parsed user from localStorage:', u);
            if (u && u.id && u.username) {
              console.log('Valid user found, setting user state');
              setUser(u);
            } else {
              console.log('Invalid user data, clearing');
              localStorage.removeItem(LOCAL_KEY);
              setUser(null);
            }
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
            localStorage.removeItem(LOCAL_KEY);
            setUser(null);
          }
        } else {
          console.log('No valid user data in localStorage');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (!user) {
        setUser(null);
      }
    } finally {
      console.log('=== checkAuth finished ===');
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('=== Login attempt ===', { username });
    try {
      // 1) محاولة عبر EasySite API
      if (window?.ezsite?.apis?.run) {
        const { data, error } = await window.ezsite.apis.run({
          path: "login",
          param: [username, password]
        });
        if (!error && data?.success && data?.user) {
          console.log('EasySite login success:', data.user);
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
        console.log('Fixed user login success:', fixedUser);
        setUser(fixedUser);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(fixedUser));
        console.log('User set in state and localStorage');
        toast({ title: "مرحباً بك", description: `أهلاً وسهلاً ${fixedUser.name}` });
        
        // Force a re-render by triggering checkAuth
        setTimeout(() => {
          console.log('Forcing auth recheck after login');
          checkAuth();
        }, 100);
        
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

  const refreshAuth = () => {
    console.log('Manual auth refresh triggered');
    checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshAuth }}>
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