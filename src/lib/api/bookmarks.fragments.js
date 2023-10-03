export const fetchAll = ({ sortBy, limit, offset }) => {
  console.log('fetchAll.limit, fetchAll.offset',limit, offset)
  return {
    query: `
    query userBookmarks {
      user {
         bookmarks(orderBy:${sortBy}, limit:${limit}, offset:${offset} ) {
        hitcount
          result {
            bookmarkId
            materialType
            materialId
            createdAt
          }
        }
      }
    }
    `,
  };
};
