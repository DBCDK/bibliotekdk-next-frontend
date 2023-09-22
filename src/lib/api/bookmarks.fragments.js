export const fetchAll = () => {
  return {
    query: `
    query userBookmarks {
      user {
        bookmarks {
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
