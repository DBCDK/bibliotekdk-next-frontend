export function addBookmarks({ bookmarks }) {
  return {
    query: `
    mutation addBookmarks($bookmarks: [BookmarksInput!]!) {
      patron {
        addBookmarks(bookmarks: $bookmarks) {
          status
          items {
            id
            materialId
            status
            selection {
              materialTypes {
                general
                specific
              }
            }
          }
        }
      }
    }
    `,
    variables: {
      bookmarks,
    },
  };
}

export function deleteBookmarks({ bookmarkIds }) {
  return {
    query: `
    mutation deleteBookmarks($bookmarkIds: [String!]!) {
      patron {
        deleteBookmarks(ids: $bookmarkIds) {
          status
          items {
            id
            status
          }
        }
      }
    }
    `,
    variables: {
      bookmarkIds,
    },
  };
}
