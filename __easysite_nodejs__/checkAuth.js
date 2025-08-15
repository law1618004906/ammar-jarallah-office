
async function checkAuth() {
  try {
    // Check for session in EasySite first
    if (window?.ezsite?.apis?.run) {
      const { data, error } = await window.ezsite.apis.run({
        path: "checkAuth",
        param: []
      });
      if (!error && data?.authenticated && data?.user) {
        return data;
      }
    }

    // Fallback: check for admin user in unified database
    const { data, error } = await ezsite.api.tablePage('election_users', {
      PageNo: 1,
      PageSize: 1,
      OrderByField: "ID",
      IsAsc: false,
      Filters: [
        {
          name: "role",
          op: "Equal",
          value: "ADMIN"
        }
      ]
    });

    if (error) {
      console.error('خطأ في التحقق من المصادقة:', error);
      return { authenticated: false };
    }

    const users = data?.List || [];
    if (users.length > 0) {
      const adminUser = users[0];
      return {
        authenticated: true,
        user: {
          id: adminUser.ID,
          username: adminUser.username,
          name: adminUser.name,
          role: adminUser.role
        }
      };
    }

    return { authenticated: false };
  } catch (error) {
    console.error('خطأ في التحقق من المصادقة:', error);
    return { authenticated: false };
  }
}