export const fetchAll = ({ orderBy }) => {
  return {
    query: `
    query userBookmarks {
      user {
         bookmarks(orderBy:${orderBy}) {
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
