//if space between input add AND between
export function converStateToCql({ inputFields }) {
  console.log("in converStateToCql", inputFields);
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return ""; // Return an empty string for an empty or invalid input.
  }

  const cqlQuery = inputFields.map((item) => {
    const { value, prefixLogicalOperator, searchIndex } = item;
    if (!value) {
      return;
    }
    const cqlValue = value.split(" ").join(" AND ");

    //first element does not have a logicalOperator(AND , OR, NOT)
    const logicalOperator = prefixLogicalOperator || "";

    return `${logicalOperator} ${searchIndex}=${cqlValue}`;
  });
  console.log("cqlQuery", cqlQuery);

  return cqlQuery.join(" ");
}
