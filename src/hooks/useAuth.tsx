
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: "checkAuth",
        param: []
      });

      if (error || !data?.user) {
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: "login",
        param: [username, password]
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error,
          variant: "destructive"
        });
        return false;
      }

      if (data?.user) {
        setUser(data.user);
        toast({
          title: "مرحباً بك",
          description: `أهلاً وسهلاً ${data.user.name || data.user.username}`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await window.ezsite.apis.run({
        path: "logout",
        param: []
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      toast({
        title: "تم تسجيل الخروج",
        description: "إلى اللقاء!",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
