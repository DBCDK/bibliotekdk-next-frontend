/**
 * Sorts orders based on their status
 * @param orders
 * @returns orders
 */
const sortOrders = (orders) => {
  let sortedOrders = orders;
  if (!sortedOrders) {
    return orders;
  }

  sortedOrders.sort((a, b) => {
    if (a.pickUpExpiryDate === null && b.pickUpExpiryDate === null) {
      // If both items have null pickUpExpiryDate, sort based on holdQueuePosition
      return Number(a.holdQueuePosition) - Number(b.holdQueuePosition);
    } else if (a.pickUpExpiryDate === null) {
      // If only item a has null pickUpExpiryDate, put it after item b
      return 1;
    } else if (b.pickUpExpiryDate === null) {
      // If only item b has null pickUpExpiryDate, put it after item a
      return -1;
    } else {
      // Both items have pickUpExpiryDate set, sort based on the date
      const dateA = new Date(a.pickUpExpiryDate);
      const dateB = new Date(b.pickUpExpiryDate);
      return dateA - dateB;
    }
  });

  return sortedOrders;
};

/**
 * Sorts loans based on their due dates
 * @param loans
 * @returns loans
 */
const sortLoans = (loans) => {
  let sortedLoans = loans;
  if (!sortedLoans) {
    return loans;
  }

  sortedLoans.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });

  return sortedLoans;
};

/**
 * Aranges loanerInfo loans and orders
 * @param loanerInfo
 * @returns loanerInfo sorted
 */
export const arangeLoanerInfo = ({ loans, orders, ...data }) => {
  return {
    loans: sortLoans(loans),
    orders: sortOrders(orders),
    ...data,
  };
};
