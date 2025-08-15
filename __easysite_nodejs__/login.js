
async function login(username, password) {
  try {
    // Check for the main admin user first
    if (username === 'فقار' && password === '123456') {
      return {
        success: true,
        user: {
          id: 'admin-root-permanent',
          username: 'فقار',
          name: 'فقار - المدير الرئيسي',
          role: 'ADMIN'
        }
      };
    }

    // Check users in unified database
    const { data, error } = await ezsite.api.tablePage('election_users', {
      PageNo: 1,
      PageSize: 1,
      OrderByField: "ID",
      IsAsc: false,
      Filters: [
        {
          name: "username",
          op: "Equal",
          value: username
        }
      ]
    });

    if (error) {
      throw new Error('خطأ في التحقق من بيانات المستخدم');
    }

    const users = data?.List || [];

    if (users.length === 0) {
      throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    // For demo purposes, accept any password for database users
    const user = users[0];

    return {
      success: true,
      user: {
        id: user.ID,
        username: user.username,
        name: user.name || user.username,
        role: user.role || 'USER'
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}