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
