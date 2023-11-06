//if space between input add AND between
export function converStateToCql({inputFields}) {
  console.log('in converStateToCql',inputFields)
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return ""; // Return an empty string for an empty or invalid input.
  }

  console.log("inputFields", inputFields);
  console.log('inputFields.length',inputFields.length)
  const cqlQuery = inputFields.map((item) => {
    console.log('inputFields.item',item)
    const { value="", prefixLogicalOperator, searchIndex } = item;
    const cqlValue = value.split(' ').join(' AND ');

    //first element does not have a logicalOperator(AND , OR, NOT)
    const logicalOperator = prefixLogicalOperator || "";

    return `${logicalOperator} ${searchIndex}="${cqlValue}"`;
  });
  console.log('cqlQuery',cqlQuery)

  return cqlQuery.join(" ");
}


// export function stateToQueryString(state) {
//   //const queryParams = new URLSearchParams();
  
//   queryParams.set('fieldSearch', JSON.stringify(state.fieldSearch));
//   queryParams.set('dropDowns', JSON.stringify(state.dropDowns));
//   return queryParams.toString();
// }