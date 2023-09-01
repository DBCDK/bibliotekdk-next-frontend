import useSWR from "swr";
import * as workFragments from "@/lib/api/work.fragments";
import { useData } from "@/lib/api/api";

const KEY_NAME = "bookmarks";

export default function useBookmarks() {
  let {
    data: bookmarks,
    mutate: mutateBookmark,
    error,
  } = useSWR(KEY_NAME, (key) => JSON.parse(localStorage.getItem(key)) || []);

  /**
   * Set a value in bookmark list
   */
  const setBookmark = (value) => {
    // Find existing
    const existingIndex = bookmarks?.findIndex((obj) => obj.key === value.key);
    // push if not there
    if (existingIndex === -1) {
      bookmarks?.push(value);
    }
    // remove if already there
    else {
      bookmarks?.splice(existingIndex, 1);
    }

    // store
    const stringified = JSON.stringify(bookmarks);
    localStorage.setItem(KEY_NAME, stringified);

    // mutate
    mutateBookmark(bookmarks);
  };

  function clearBookmarks() {
    const fisk = [];
    // store
    const stringified = JSON.stringify(fisk);
    localStorage.setItem(KEY_NAME, stringified);
    //mutate
    mutateBookmark(fisk);
  }

  return {
    setBookmark,
    clearBookmarks,
    bookmarks: bookmarks,
    isLoading: typeof bookmarks === "undefined" && !error,
  };
}

export const populateBookmarks = (bookmarks) => {
  const pids = bookmarks?.map((mark) => mark.id);
  console.log(pids);
  const { data } = useData(workFragments.pidsToWorks({ pids: pids }));
  return { data };
};
