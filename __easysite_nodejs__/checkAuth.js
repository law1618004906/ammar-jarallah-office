
async function checkAuth() {
  // For demo purposes, always return authenticated as main admin
  return {
    authenticated: true,
    user: {
      id: 'admin-root-permanent',
      username: 'فقار',
      name: 'فقار - المدير الرئيسي',
      role: 'ADMIN'
    }
  };
}