//if space between input add AND between

export function convertStateToCql({ inputFields } = {}) {
  console.log("inputFields");
  console.log(JSON.stringify(inputFields));
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return ""; // Return an empty string for an empty or invalid input.
  }

  const cqlQuery = inputFields.map((item) => {
    const { value, searchIndex, prefixLogicalOperator } = item;
    if (!value) {
      return "";
    }

    const cqlValue = value.trim().split(" ").join(` AND ${searchIndex} = `);
    console.log("cqlValue", cqlValue);
    let fieldCql = `${searchIndex} = ${cqlValue}`;
    console.log("fieldCql", fieldCql);
    if (prefixLogicalOperator) {
      return `${prefixLogicalOperator} ${cqlValue}`;
    }
    return fieldCql;
  });

  return cqlQuery.join(" AND ");
}

// export function converStateToCql({ inputFields }) {
//   if (!Array.isArray(inputFields) || inputFields.length === 0) {
//     return ""; // Return an empty string for an empty or invalid input.
//   }

//   const cqlQuery = inputFields.map((item) => {
//     const { value, prefixLogicalOperator, searchIndex } = item;
//     if (!value) {
//       return;
//     }
//     const cqlValue = value.split(" ").join(" AND ");

//     //first element does not have a logicalOperator(AND , OR, NOT)
//     const logicalOperator = prefixLogicalOperator || "";

//     return `${logicalOperator} ${searchIndex}=${cqlValue}`;
//   });

//   return cqlQuery.join(" ");
// }
