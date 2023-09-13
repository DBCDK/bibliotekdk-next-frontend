import useSWR from "swr";
const KEY_NAME = "bookmarks";
export default function useBookmarks() {
  const {
    data: bookmark,
    mutate: mutateBookmark,
    error,
  } = useSWR(KEY_NAME, (key) => JSON.parse(localStorage.getItem(key) || []));

  /**
   * Set a value in bookmark list
   */
  const setBookmark = async (value) => {
    // Find existing
    const existingIndex = bookmark?.findIndex((obj) => obj.key === value.key);
    // push if not there
    if (existingIndex === -1) {
      bookmark?.push(value);
    }
    // remove if already there
    else {
      bookmark?.splice(existingIndex, 1);
    }
    // store
    const stringified = JSON.stringify(bookmark);
    localStorage.setItem(KEY_NAME, stringified);

    // mutate
    mutateBookmark(JSON.parse(stringified));
  };

  function clearBookmarks() {
    const fisk = [];
    // store
    const stringified = JSON.stringify(fisk);
    localStorage.setItem(KEY_NAME, stringified);
    //mutate
    mutateBookmark(JSON.parse(stringified));
  }

  return {
    setBookmark,
    clearBookmarks,
    bookmark,
    isLoading: typeof bookmark === "undefined" && !error,
  };
}
