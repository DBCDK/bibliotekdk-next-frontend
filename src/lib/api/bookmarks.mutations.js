import { ApiEnums } from "@/lib/api/api";

export function addBookmarks({ bookmarks }) {
  return {
    apiUrl: ApiEnums.FBI_API,
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
    apiUrl: ApiEnums.FBI_API,
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
