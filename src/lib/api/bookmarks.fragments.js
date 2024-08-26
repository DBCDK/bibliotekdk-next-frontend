export const fetchAll = ({ sortBy }) => {
  return {
    query: `
    query userBookmarks($sortBy: BookMarkOrderByEnum) {
      user {
        bookmarks(orderBy:$sortBy) {
          hitcount
          result {
            bookmarkId
            materialType
            materialId
            createdAt
            workId
          }
        }
      }
    }
    `,
    variables: {
      sortBy: sortBy?.toUpperCase(),
    },
  };
};
