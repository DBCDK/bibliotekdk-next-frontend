//if space between input add AND between
export function convertObjectToCql(queryObject) {
  if (!Array.isArray(queryObject) || queryObject.length === 0) {
    return ""; // Return an empty string for an empty or invalid input.
  }

  const operatorMapping = {
    AND: "and",
    OR: "or",
    NOT: "not",
  };

  const cqlQuery = queryObject.map((item) => {
    const { value, prefixLogicalOperator, searchIndex } = item;
    const cqlValue = `"${value}"`;

    if (prefixLogicalOperator === "NOT") {
      return `not ${searchIndex}=${cqlValue}`;
    }

    if (prefixLogicalOperator) {
      const operator = operatorMapping[prefixLogicalOperator] || "and";
      return `  ${operator} ${searchIndex}=${cqlValue}`;
    }

    return `${searchIndex}=${cqlValue}`;
  });

  return cqlQuery.join(" ");
}
