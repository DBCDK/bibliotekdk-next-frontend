export const fetchAll = ({ sortBy, limit, offset }) => {
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
