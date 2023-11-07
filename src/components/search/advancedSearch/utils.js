export function convertStateToCql({ inputFields } = {}) {
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return "";
  }

  const cqlQuery = inputFields.map((item) => {
    const { value, searchIndex, prefixLogicalOperator } = item;
    if (!value) {
      return "";
    }

    const cqlValue = value.trim().split(" ").join(` AND ${searchIndex} = `);
    let fieldCql = `${searchIndex} = ${cqlValue}`;
    if (prefixLogicalOperator) {
      return `${prefixLogicalOperator} ${cqlValue}`;
    }
    return fieldCql;
  });

  return cqlQuery.join(" AND ");
}
