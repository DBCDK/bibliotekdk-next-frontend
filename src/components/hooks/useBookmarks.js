import useSWR from "swr";
import * as workFragments from "@/lib/api/work.fragments";
import { useData, useMutate } from "@/lib/api/api";
import { useEffect, useState, useMemo } from "react";
import * as bookmarkMutations from "@/lib/api/bookmarks.mutations";
import * as bookmarkFragments from "@/lib/api/bookmarks.fragments";
import { useSession } from "next-auth/react";

const KEY_NAME = "bookmarks";

export const BookmarkSyncProvider = () => {
  const { syncCookieBookmarks } = useBookmarks();
  const { data: session } = useSession();

  useEffect(() => {
    const sync = async () => {
      await syncCookieBookmarks();
    };

    const isAuthenticated = !!session?.user?.uniqueId;
    if (isAuthenticated) {
      sync();
    }
  }, [session]);

  return <></>;
};

const useBookmarksCore = ({ isMock = false, session }) => {
  const isAuthenticated = isMock ? false : !!session?.user?.uniqueId;
  const [sortBy, setSortBy] = useState("createdAt");

  let {
    data: localBookmarks,
    mutate: mutateLocalBookmarks,
    error,
  } = useSWR(KEY_NAME, (key) => JSON.parse(localStorage.getItem(key)) || []);
  const {
    data: globalBookmarksUserObject,
    isLoading: isLoadingGlobalBookmarks,
    error: globalBookmarksError,
    mutate: mutateGlobalBookmarks,
  } = useData(isAuthenticated && bookmarkFragments.fetchAll({ sortBy }));
  const bookmarkMutation = useMutate();
  const globalBookmarks =
    globalBookmarksUserObject?.user?.bookmarks?.result?.map((bookmark) => ({
      ...bookmark,
      key: bookmark.materialId + bookmark.materialType,
    }));

  const syncCookieBookmarks = async () => {
    if (!isAuthenticated) return; // Not authenticated
    const cookies = await JSON.parse(localStorage.getItem(KEY_NAME));
    if (!cookies || !Array.isArray(cookies) || cookies.length === 0) return; // Nothing to sync

    try {
      await bookmarkMutation.post(
        bookmarkMutations.addBookmarks({
          bookmarks: cookies.map((bookmark) => ({
            materialId: bookmark.materialId,
            materialType: bookmark.materialType,
            title: bookmark.title,
          })),
        })
      );

      await mutateGlobalBookmarks();

      clearLocalBookmarks();
    } catch (e) {
      console.error("Error syncing local bookmarks", e);
    }
  };

  /**
   * Set a value in bookmark list
   */
  const setBookmark = async (value) => {
    if (isAuthenticated) {
      /**
       * API solution
       */

      // Find existing
      const existingIndex = globalBookmarks?.findIndex(
        (bookmark) => bookmark.key === value.key
      );

      if (existingIndex === -1) {
        // Doesn't exist - Add
        await bookmarkMutation.post(
          bookmarkMutations.addBookmarks({
            bookmarks: [
              {
                materialId: value.materialId,
                materialType: value.materialType,
                title: value.title        
              },
            ],
          })
        );
      } else {
        // Exists - Delete
        const idToDelete = globalBookmarks[existingIndex].bookmarkId;
        await bookmarkMutation.post(
          bookmarkMutations.deleteBookmarks({
            bookmarkIds: [idToDelete],
          })
        );
      }

      await mutateGlobalBookmarks();
    } else {
      /**
       * Cookie solution
       */

      // Find existing
      const existingIndex = localBookmarks?.findIndex(
        (obj) => obj.key === value.key
      );
      if (existingIndex === -1) {
        // push if not there
        localBookmarks?.push(value);
      } else {
        // remove if already there
        localBookmarks?.splice(existingIndex, 1);
      }

      // store
      const stringified = JSON.stringify(localBookmarks);
      localStorage.setItem(KEY_NAME, stringified);

      // mutate
      mutateLocalBookmarks(localBookmarks);
    }
  };

  function clearLocalBookmarks() {
    const empty = [];
    // store
    const stringified = JSON.stringify(empty);
    localStorage.setItem(KEY_NAME, stringified);
    //mutate
    mutateLocalBookmarks(empty);
  }

  const deleteBookmarks = async (bookmarksToDelete) => {
    if (isAuthenticated) {
      const ids = bookmarksToDelete.map((i) => i.bookmarkId);
      await bookmarkMutation.post(
        bookmarkMutations.deleteBookmarks({
          bookmarkIds: ids,
        })
      );
      mutateGlobalBookmarks();
    } else {
      const keysToDelete = bookmarksToDelete.map((i) => i.key);
      const updated = localBookmarks.filter(
        (item) => !keysToDelete.includes(item.key)
      );
      const stringified = JSON.stringify(updated);
      localStorage.setItem(KEY_NAME, stringified);
      mutateLocalBookmarks(updated);
    }
  };

  return {
    setBookmark,
    deleteBookmarks,
    clearLocalBookmarks,
    bookmarks: isAuthenticated ? globalBookmarks : localBookmarks,
    isLoading:
      (typeof localBookmarks === "undefined" && !error) ||
      (isLoadingGlobalBookmarks && !globalBookmarksError),
    syncCookieBookmarks,
    setSortBy,
  };
};

const useBookmarkImpl = () => {
  const { data: session } = useSession();
  return useBookmarksCore({ session });
};

const useBookmarkMock = () => {
  return useBookmarksCore({ isMock: true });
};

const useBookmarks = process.env.STORYBOOK_ACTIVE
  ? useBookmarkMock
  : useBookmarkImpl;
export default useBookmarks;

export const usePopulateBookmarks = (bookmarks) => {
  /**
   * Used to populate bookmark data, to show more info about the materials
   */
  const workIds = bookmarks?.filter((bookmark) =>
    bookmark.materialId.includes("work-of:")
  );
  const workPids = bookmarks?.filter(
    (bookmark) => !bookmark.materialId.includes("work-of:")
  );
  const { data: workByIdsData } = useData(
    workFragments.idsToWorks({ ids: workIds?.map((work) => work.materialId) })
  );
  const { data: workByPidsData } = useData(
    workFragments.pidsToWorks({
      pids: workPids?.map((work) => work.materialId),
    })
  );

  // Reorganize order and add bookmark data
  const data = useMemo(() => {
    if (!bookmarks) return [];

    const transformedWorkByPids = workByPidsData?.works?.map((work) => ({
      ...work,
      workId: work?.workId?.replace("work-of:", ""),
    }));
    const merged = [].concat(workByIdsData?.works, transformedWorkByPids);

    return bookmarks
      .map((bookmark) => {
        const workData = merged.find(
          (item) => item?.workId === bookmark.materialId
        );
        if (!workData) {
          return null;
        }

        // Merge data
        return {
          ...workData,
          ...bookmark,
        };
      })
      .filter((item) => item); // filter nulls
  }, [bookmarks, workByPidsData, workByIdsData]);

  return { data };
};
