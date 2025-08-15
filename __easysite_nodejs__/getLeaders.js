
async function getLeaders() {
  const { data, error } = await ezsite.api.tablePage(34596, {
    PageNo: 1,
    PageSize: 1000,
    OrderByField: "id",
    IsAsc: false,
    Filters: []
  });

  if (error) {
    throw new Error(`خطأ في جلب بيانات القادة: ${error}`);
  }

  return data;
}
