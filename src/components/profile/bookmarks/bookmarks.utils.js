/**
 * Loops through the populated bookmarks and merges their data, with the
 * stripped bookmark data as it comes from the database.
 * @param {Array<Object>} bookmarks
 * @param {Array<Object>} populatedBookmarks
 * @returns Array<Object>
 */
export const mergeBookmarksWithPopulatedData = (
  bookmarks,
  populatedBookmarks
) => {
  return bookmarks?.map((bm) => {
    const bookmark = populatedBookmarks?.find((pb) => pb.key === bm.key);
    return {
      ...bookmark,
      ...bm,
    };
  });
};
