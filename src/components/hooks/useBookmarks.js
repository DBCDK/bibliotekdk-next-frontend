import useSWR from "swr";
import * as workFragments from "@/lib/api/work.fragments";
import { useData, useMutate } from "@/lib/api/api";
import { useEffect, useState, useMemo } from "react";
import * as bookmarkMutations from "@/lib/api/bookmarks.mutations";
import * as bookmarkFragments from "@/lib/api/bookmarks.fragments";
import { useSession } from "next-auth/react";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";

const KEY_NAME = "bookmarks";
const ITEMS_PER_PAGE = 20;

export const BookmarkSyncProvider = () => {
  const { syncCookieBookmarks } = useBookmarks();
  const { data: session } = useSession();

  useEffect(() => {
    const sync = async () => {
      await syncCookieBookmarks();
    };

    const hasCulrUniqueId = !!session?.user?.uniqueId;
    if (hasCulrUniqueId) {
      sync();
    }
  }, [session]);

  return <></>;
};

const useBookmarksCore = ({ isMock = false, session }) => {
  const hasCulrUniqueId = isMock ? false : !!session?.user?.uniqueId;
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  let {
    data: localBookmarks,
    mutate: mutateLocalBookmarks,
    error,
  } = useSWR(KEY_NAME, (key) => JSON.parse(getLocalStorageItem(key) || "[]"));
  const {
    data: globalBookmarksUserObject,
    isLoading: isLoadingGlobalBookmarks,
    error: globalBookmarksError,
    mutate: mutateGlobalBookmarks,
  } = useData(
    hasCulrUniqueId &&
      bookmarkFragments.fetchAll({
        sortBy,
      })
  );
  const bookmarkMutation = useMutate();
  const globalBookmarks = useMemo(
    () =>
      globalBookmarksUserObject?.user?.bookmarks?.result?.map((bookmark) => ({
        ...bookmark,
        key: bookmark.materialId + bookmark.materialType,
      })),
    [globalBookmarksUserObject]
  );

  let hitcount;

  if (hasCulrUniqueId) {
    hitcount = globalBookmarksUserObject?.user?.bookmarks?.hitcount || 0;
  } else {
    hitcount = localBookmarks?.length || 0;
  }

  const totalPages = Math.ceil(hitcount / ITEMS_PER_PAGE);

  const syncCookieBookmarks = async () => {
    if (!hasCulrUniqueId) return; // Not authenticated
    const cookies = await JSON.parse(getLocalStorageItem(KEY_NAME) || "[]");
    if (!cookies || !Array.isArray(cookies) || cookies.length === 0) return; // Nothing to sync

    try {
      await bookmarkMutation.post(
        bookmarkMutations.addBookmarks({
          bookmarks: createdAtSort(cookies, "desc").map((bookmark) => ({
            materialId: bookmark.materialId,
            materialType: bookmark.materialType,
            title: bookmark.title,
            workId: bookmark.workId,
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
    if (hasCulrUniqueId) {
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
                title: value.title,
                workId: value.workId,
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
        localBookmarks?.push({ ...value, createdAt: new Date() });
      } else {
        // remove if already there
        localBookmarks?.splice(existingIndex, 1);
      }

      // store
      const stringified = JSON.stringify(localBookmarks);
      setLocalStorageItem(KEY_NAME, stringified);

      // mutate
      mutateLocalBookmarks(localBookmarks);
    }
  };

  function clearLocalBookmarks() {
    const empty = [];
    // store
    const stringified = JSON.stringify(empty);
    setLocalStorageItem(KEY_NAME, stringified);
    //mutate
    mutateLocalBookmarks(empty);
  }

  const deleteBookmarks = async (bookmarksToDelete) => {
    if (hasCulrUniqueId) {
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
      setLocalStorageItem(KEY_NAME, stringified);
      mutateLocalBookmarks(updated);
    }
  };

  /**
   * sorts bookmarkList by createdAt
   * @param {Object[]} bookmarkList list of bookmarks
   * @param {string} sortDirection can be either asc or desc
   * @returns {Object[]} bookmarkList
   */
  const createdAtSort = (bookmarkList = [], sortDirection = "asc") => {
    return bookmarkList.sort((a, b) => {
      if (new Date(a.createdAt) < new Date(b.createdAt)) {
        return sortDirection === "asc" ? 1 : -1;
      }
      if (new Date(a.createdAt) > new Date(b.createdAt)) {
        return sortDirection === "asc" ? -1 : 1;
      }
      return 0;
    });
  };

  /**
   * sorts bookmarkList by title
   * @param {Object[]} bookmarkList list of bookmarks
   * @param {string} sortDirection can be either asc or desc
   * @returns {Object[]} bookmarkList
   */
  const titleSort = (bookmarkList = [], sortDirection = "asc") => {
    return bookmarkList.sort((a, b) => {
      if (a.title < b.title) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a.title > b.title) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  /**
   * Returns localbookmarks sorted by users preference
   */
  function sortBookmarks(bookmarksToSort) {
    return sortBy === "createdAt"
      ? createdAtSort(bookmarksToSort)
      : titleSort(bookmarksToSort);
  }
  /**
   * Returns a of localbookmarks that corresponds to the current page of local bookmarks.
   */
  function currenPageBookmark(bookmarkToPaginate) {
    const startIdx = isMobile ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = isMobile
      ? startIdx + ITEMS_PER_PAGE * currentPage
      : startIdx + ITEMS_PER_PAGE;
    const currentPageBookmarks = bookmarkToPaginate.slice(startIdx, endIdx);
    return currentPageBookmarks;
  }

  // sort local bookmarks
  const sortedLocalBookmarks = useMemo(() => {
    return sortBookmarks(localBookmarks);
  }, [localBookmarks, sortBy]);

  // sort global bookmarks
  const sortedGlobalBookmarks = useMemo(() => {
    return sortBookmarks(globalBookmarks);
  }, [globalBookmarks, sortBy]);

  return {
    setBookmark,
    deleteBookmarks,
    clearLocalBookmarks,
    bookmarks: hasCulrUniqueId ? globalBookmarks : localBookmarks,
    paginatedBookmarks: hasCulrUniqueId
      ? currenPageBookmark(sortedGlobalBookmarks)
      : currenPageBookmark(sortedLocalBookmarks),
    isLoading:
      (typeof localBookmarks === "undefined" && !error) ||
      (isLoadingGlobalBookmarks && !globalBookmarksError),
    syncCookieBookmarks,
    setSortBy,
    currentPage,
    totalPages,
    setCurrentPage,
    count: hitcount ?? localBookmarks?.length ?? 0,
    createdAtSort,
    titleSort,
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

/**
 * Used to populate bookmark data, to show more info about the materials
 * @param {Object[]} bookmarks list of bookmarks
 * @returns {Object[]} bookmarks
 */
export const usePopulateBookmarks = (bookmarks) => {
  //works (not specific edition)
  const workIds = bookmarks?.filter((bookmark) =>
    bookmark?.materialId?.includes("work-of:")
  );

  //specific edition
  const workPids = bookmarks?.filter(
    (bookmark) => !bookmark?.materialId?.includes("work-of:")
  );

  const { data: workByIdsData, isLoading: idsToWorksLoading } = useData(
    workFragments.idsToWorks({ ids: workIds?.map((work) => work.materialId) })
  );

  const { data: workByPidsData, isLoading: pidsToWorkLoading } = useData(
    workFragments.pidsToWorks({
      pids: workPids?.map((work) => work.materialId),
    })
  );

  // Reorganize order and add bookmark data
  const data = useMemo(() => {
    if (!bookmarks) return [];
    const transformedWorkByIds = workByIdsData?.works?.map((work) => ({
      ...work,
      materialId: work?.workId,
    }));
    const transformedWorkByPids = workByPidsData?.manifestations?.map(
      (work) => ({
        ...work,
        materialId: work?.pid,
      })
    );
    const merged = [].concat(transformedWorkByIds, transformedWorkByPids);

    return bookmarks
      .map((bookmark) => {
        const workData = merged.find(
          (item) => item?.materialId === bookmark.materialId
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
  const isLoading = idsToWorksLoading || pidsToWorkLoading;
  return { data, isLoading };
};
