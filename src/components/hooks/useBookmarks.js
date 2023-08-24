import useSWR from "swr";
const KEY_NAME = "bookmarks";
export default function useBookmarks() {
  const {
    data: bookmark,
    mutate: mutateBookmark,
    error,
  } = useSWR(KEY_NAME, (key) => JSON.parse(localStorage.getItem(key) || "[]"));

  /**
   * Set a value in bookmark list
   */
  const setBookmark = async (value) => {
    // Find existing
    const existing = bookmark.find((obj) => obj.key === value.key);
    // push if not there
    if (!existing) {
      bookmark.push(value);
    }
    // store
    const stringified = JSON.stringify(bookmark);
    localStorage.setItem(KEY_NAME, stringified);

    // mutate
    mutateBookmark(JSON.parse(stringified));
  };

  // function clearBookmarks() {
  //   // clear bookmarks
  //   bookmark.length = 0;
  //   // store
  //   const stringified = JSON.stringify(bookmark);
  //   localStorage.setItem(KEY_NAME, stringified);
  //   //mutate
  //   mutateBookmark(stringified);
  // }

  return {
    setBookmark,
    bookmark,
    isLoading: typeof bookmark === "undefined" && !error,
  };
}
