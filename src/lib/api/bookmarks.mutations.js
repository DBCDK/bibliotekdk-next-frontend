/**
 *
 * @param {bookmarks} {materialId: string, materialType: string}
 * @returns
 */

export function addBookmarks({ bookmarks }) {
  console.log("addBookmarks.bookmarks", bookmarks);
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
