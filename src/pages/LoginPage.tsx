
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    setLoading(true);
    try {
      const ok = await login(username, password);
      if (ok) {
        const dest = (location.state as any)?.from?.pathname || '/leaders-tree';
        navigate(dest, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  // بيانات تسجيل الدخول التجريبية
  const testAccounts = [
  { username: 'فقار', password: '123456', role: 'مدير عام' },
  { username: 'admin', password: 'admin123', role: 'مشرف' }];


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Crown className="text-purple-600" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
            <CardDescription>نظام إدارة البيانات الانتخابية</CardDescription>
            <div className="text-sm text-gray-600">مكتب النائب عمار جار الله</div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="flex items-center gap-2 mb-2">
                  <User size={18} />
                  اسم المستخدم
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rtl-input"
                  placeholder="أدخل اسم المستخدم"
                  required />

              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                  <Lock size={18} />
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rtl-input pr-10"
                    placeholder="أدخل كلمة المرور"
                    required />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3"
                disabled={loading || !username.trim() || !password.trim()}>

                {loading ?
                <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    جارٍ التحقق...
                  </div> :

                'تسجيل الدخول'
                }
              </Button>
            </form>

            {/* حسابات تجريبية للاختبار */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3 text-center">حسابات تجريبية:</h4>
              <div className="space-y-2">
                {testAccounts.map((account, index) =>
                <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                    <div>
                      <span className="font-medium">{account.username}</span>
                      <span className="text-gray-500 mr-2">({account.role})</span>
                    </div>
                    <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUsername(account.username);
                      setPassword(account.password);
                    }}>

                      استخدام
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>للدخول السريع استخدم: فقار / 123456</p>
        </div>
      </div>
    </div>);

}