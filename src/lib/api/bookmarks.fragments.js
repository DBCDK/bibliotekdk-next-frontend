export const fetchAll = ({ sortBy }) => {
  console.log("fetchAll.sortBy", sortBy);
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
