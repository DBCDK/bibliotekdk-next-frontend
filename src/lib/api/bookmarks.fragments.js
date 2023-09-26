export const fetchAll = ({ sortBy }) => {
  return {
    query: `
    query userBookmarks {
      user {
         bookmarks(orderBy:${sortBy}) {
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
