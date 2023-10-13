export const fetchAll = ({sortBy}) => {
  return {
    query: `
    query userBookmarks($sortBy: BookMarkOrderBy) {
      user {
        bookmarks(orderBy:$sortBy) {
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
    variables: {
      sortBy
    },
  };
};
