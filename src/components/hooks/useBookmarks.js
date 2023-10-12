import useSWR from "swr";
import * as workFragments from "@/lib/api/work.fragments";
import { useData, useMutate } from "@/lib/api/api";
import { useEffect, useState, useMemo } from "react";
import * as bookmarkMutations from "@/lib/api/bookmarks.mutations";
import * as bookmarkFragments from "@/lib/api/bookmarks.fragments";
import { useSession } from "next-auth/react";
import useBreakpoint from "@/components/hooks/useBreakpoint";

const KEY_NAME = "bookmarks";
const itemsPerPage = 4;

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
  const [currentPage, setCurrentPage] = useState(1);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  let {
    data: localBookmarks,
    mutate: mutateLocalBookmarks,
    error,
  } = useSWR(KEY_NAME, (key) => JSON.parse(localStorage.getItem(key) || "[]"));
  const {
    data: globalBookmarksUserObject,
    isLoading: isLoadingGlobalBookmarks,
    error: globalBookmarksError,
    mutate: mutateGlobalBookmarks,
  } = useData(
    isAuthenticated &&
      bookmarkFragments.fetchAll({
        sortBy,
        limit: isMobile ? currentPage * itemsPerPage : itemsPerPage,
        offset: isMobile ? 0 : (currentPage - 1) * itemsPerPage,
      })
  );
  const bookmarkMutation = useMutate();
  const globalBookmarks =
    globalBookmarksUserObject?.user?.bookmarks?.result?.map((bookmark) => ({
      ...bookmark,
      key: bookmark.materialId + bookmark.materialType,
    }));

  let hitcount;

  if (isAuthenticated) {
    hitcount = globalBookmarksUserObject?.user?.bookmarks?.hitcount || 0;
  } else {
    hitcount = localBookmarks?.length || 0;
  }

  const totalPages = Math.ceil(hitcount / itemsPerPage);

  const syncCookieBookmarks = async () => {
    if (!isAuthenticated) return; // Not authenticated
    const cookies = await JSON.parse(localStorage.getItem(KEY_NAME));
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

  /**
   * sorts bookmarkList by createdAt
   * @param {*} bookmarkList list of bookmarks
   * @param {*} sortDirection can be either asc or desc
   * @returns bookmarkList
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
   * @param {*} bookmarkList list of bookmarks
   * @param {*} sortDirection can be either asc or desc
   * @returns bookmarkList
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
  function sortedBookMarks(bookmarksToSort) {
    return sortBy === "createdAt"
      ? createdAtSort(bookmarksToSort)
      : titleSort(bookmarksToSort);
  }
  /**
   * Returns a of localbookmarks that corresponds to the current page of local bookmarks.
   */
  function currenPageBookmark(bookmarkToPaginate) {
    const startIdx = isMobile ? 0 : (currentPage - 1) * itemsPerPage;
    const endIdx = isMobile
      ? startIdx + itemsPerPage * currentPage
      : startIdx + itemsPerPage;
    const currentPageBookmarks = bookmarkToPaginate.slice(startIdx, endIdx);
    return currentPageBookmarks;
  }

  return {
    setBookmark,
    deleteBookmarks,
    clearLocalBookmarks,
    bookmarks: isAuthenticated
      ? globalBookmarks
      : sortedBookMarks(localBookmarks),
    paginatedBookmarks: isAuthenticated
      ? globalBookmarks
      : currenPageBookmark(sortedBookMarks(localBookmarks)),
    isLoading:
      (typeof localBookmarks === "undefined" && !error) ||
      (isLoadingGlobalBookmarks && !globalBookmarksError),
    syncCookieBookmarks,
    setSortBy,
    currentPage,
    totalPages,
    setCurrentPage,
    count: hitcount ?? localBookmarks?.length ?? 0,
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
    bookmark?.materialId?.includes("work-of:")
  );
  const workPids = bookmarks?.filter(
    (bookmark) => !bookmark?.materialId?.includes("work-of:")
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

  return { data };
};
