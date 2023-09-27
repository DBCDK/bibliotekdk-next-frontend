/**
 *
 * @param {bookmarks} {materialId: string, materialType: string}
 * @returns
 */

export function addBookmarks({ bookmarks }) {
  return {
    query: `
    mutation addBookmarks($bookmarks: [BookMarkInput!]!) {
      users {
        addBookmarks(bookmarks: $bookmarks) {
          bookmarksAdded {
            materialType
            materialId
          }
          bookmarksAlreadyExists {
            materialType
            materialId
          }
        }
      }
    }
    `,
    variables: {
      bookmarks: bookmarks,
    },
  };
}

export function deleteBookmarks({ bookmarkIds }) {
  return {
    query: `
    mutation deleteBookmarks($bookmarkIds: [Int!]!) {
      users {
        deleteBookmarks(bookmarkIds: $bookmarkIds) {
          IdsDeletedCount
        }
      }
    }
    `,
    variables: {
      bookmarkIds,
    },
  };
}
