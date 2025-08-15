
function login(username, password) {
  // التحقق من الآدمن الرئيسي
  if (username === 'فقار' && password === '123456') {
    return {
      user: {
        id: 'admin-root-permanent',
        username: 'فقار',
        name: 'فقار (مدير عام)',
        role: 'ADMIN'
      },
      token: 'mock-jwt-token-' + Date.now()
    };
  }

  // المستخدمين التجريبيون الآخرون
  const testUsers = [
    {
      id: 'user-admin-1',
      username: 'admin',
      password: 'admin123',
      name: 'مدير النظام',
      role: 'ADMIN'
    },
    {
      id: 'user-supervisor-1',
      username: 'supervisor',
      password: 'super123',
      name: 'مشرف البيانات',
      role: 'SUPERVISOR'
    }
  ];

  const user = testUsers.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('بيانات الاعتماد غير صحيحة');
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    },
    token: 'mock-jwt-token-' + Date.now()
  };
}
