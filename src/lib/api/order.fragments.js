import { ApiEnums } from "@/lib/api/api";

/**
 * Fetches previous orders made through bibliotek.dk
 */
export function orderHistory({ offset, limit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query orderPolicy ($offset: Int!, $limit: PaginationLimit! ) { 
        user {
          bibliotekDkOrders(offset: $offset, limit: $limit, ) {
            result {
              orderId
              title
              author
              pidOfPrimaryObject
              creationDate
            }
            hitcount
          }
        }
      
    }`,
    variables: { offset, limit },
    slowThreshold: 3000,
  };
}
