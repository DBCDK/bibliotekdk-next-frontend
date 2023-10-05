export const fetchAll = ({ sortBy, limit, offset }) => {
  return {
    query: `
    query userBookmarks($sortBy: BookMarkOrderBy, $limit:PaginationLimit, $offset: Int) {
      user {
        bookmarks(orderBy:$sortBy, limit:$limit, offset: $offset) {
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
      sortBy,
      limit,
      offset,
    },
  };
};
