
async function getPersons() {
  const { data, error } = await ezsite.api.tablePage(34597, {
    PageNo: 1,
    PageSize: 1000,
    OrderByField: "id",
    IsAsc: false,
    Filters: []
  });

  if (error) {
    throw new Error(`خطأ في جلب بيانات الأفراد: ${error}`);
  }

  return data;
}
