
async function logout() {
  try {
    // Log logout action to audit table
    const { error } = await ezsite.api.tableCreate('election_audit', {
      operation: 'LOGOUT',
      table_name: 'election_users',
      record_id: 0,
      user_id: 'system',
      old_values: null,
      new_values: '{"action": "user_logout"}',
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    if (error) {
      console.error('خطأ في تسجيل عملية الخروج:', error);
    }

    return { success: true, message: 'تم تسجيل الخروج بنجاح' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: true, message: 'تم تسجيل الخروج بنجاح' };
  }
}