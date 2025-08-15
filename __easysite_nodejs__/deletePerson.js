async function deletePerson(personId) {
  try {
    // First, delete related hierarchy records
    const { data: hierarchyData, error: hierarchyError } = await ezsite.api.tablePage('election_hierarchy', {
      PageNo: 1,
      PageSize: 1000,
      OrderByField: "id",
      IsAsc: false,
      Filters: [
        {
          name: "person_id",
          op: "Equal",
          value: personId
        }
      ]
    });

    if (!hierarchyError && hierarchyData?.List) {
      for (const record of hierarchyData.List) {
        await ezsite.api.tableDelete('election_hierarchy', record.ID);
      }
    }

    // Delete the person
    const { data, error } = await ezsite.api.tableDelete('election_people', personId);

    if (error) {
      throw new Error(`خطأ في حذف الفرد: ${error}`);
    }

    // Log the operation to audit table
    await ezsite.api.tableCreate('election_audit', {
      operation: 'DELETE',
      table_name: 'election_people',
      record_id: personId,
      user_id: 'admin',
      old_values: JSON.stringify({ action: 'delete_person', person_id: personId }),
      new_values: null,
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1'
    });

    return data;
  } catch (error) {
    console.error('Delete person error:', error);
    throw error;
  }
}