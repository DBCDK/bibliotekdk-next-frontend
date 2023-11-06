//if space between input add AND between
export function converStateToCql(inputFields) {
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return ""; // Return an empty string for an empty or invalid input.
  }

  console.log("inputFields", inputFields);
  const cqlQuery = inputFields.map((item) => {
    const { value, prefixLogicalOperator, searchIndex } = item;
    const cqlValue = `"${value}"`;

    //first element does not have a logicalOperator(AND , OR, NOT)
    const logicalOperator = prefixLogicalOperator || "";

    return `${logicalOperator} ${searchIndex}=${cqlValue}`;
  });

  return cqlQuery.join(" ");
}
