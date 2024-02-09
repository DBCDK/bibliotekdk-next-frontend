import useSWR from "swr";
import * as workFragments from "@/lib/api/work.fragments";
import { useData, useMutate } from "@/lib/api/api";
import { useEffect, useState, useMemo } from "react";
import * as bookmarkMutations from "@/lib/api/bookmarks.mutations";
import * as bookmarkFragments from "@/lib/api/bookmarks.fragments";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import isEqual from "lodash/isEqual";
import {
  flattenMaterialType,
  formatMaterialTypesFromCode,
  formatMaterialTypesToCode,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";

const KEY_NAME = "bookmarks";
const ITEMS_PER_PAGE = 25;

export const BookmarkSyncProvider = () => {
  const { syncCookieBookmarks } = useBookmarks();
  const { hasCulrUniqueId } = useAuthentication();

  useEffect(() => {
    const sync = async () => {
      await syncCookieBookmarks();
    };

    if (hasCulrUniqueId) {
      sync();
    }
  }, [hasCulrUniqueId]);

  return <></>;
};

const useBookmarksCore = ({ hasCulrUniqueId, isMock = false } = {}) => {
  hasCulrUniqueId = isMock ? false : hasCulrUniqueId;

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

  const getABookMark = ({ materialId, materialType, title, workId }) => {
    return {
      materialId: materialId,
      materialType: materialType,
      title: title,
      workId: workId,
    };
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
            bookmarks: [getABookMark(value)],
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
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      if (aDate < bDate) {
        return sortDirection === "asc" ? 1 : -1;
      }
      if (aDate > bDate) {
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
      const aTitle = a.titles?.full?.[0];
      const bTitle = b.titles?.full?.[0];
      if (aTitle < bTitle) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aTitle > bTitle) {
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
    const startIdx = isMobile
      ? 0
      : (currentPage > 0 ? currentPage - 1 : currentPage) * ITEMS_PER_PAGE;
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
    getABookMark,
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
  const { hasCulrUniqueId } = useAuthentication();
  return useBookmarksCore({ hasCulrUniqueId });
};

const useBookmarkMock = () => {
  return useBookmarksCore({ isMock: true });
};

//OBS order does not matter in this implementation. should order matter?
// "BOOK / SOUND_RECORDING_CD" and "SOUND_RECORDING_CD / BOOK" would both match
export const isMaterialTypesMatch = (
  workTypesOfBookmark,
  materialTypesOfWork
) => {
  if (!materialTypesOfWork || !workTypesOfBookmark) return false;
  const materialTypeCodes = materialTypesOfWork.map(
    (mt) => mt?.materialTypeSpecific?.code
  );
  return isEqual(new Set(workTypesOfBookmark), new Set(materialTypeCodes));
};

/**
 * Find the work index where one pid in mostRelevant matches the given materialId
 * OBS: we cannot simply look for matching workIds, since workIds might be changing
 * @returns {number} index of work
 */
export function findRelevantWorkIdx(
  workByIdsDataRemovedDuplicates,
  materialId,
  pid,
  materialType,
  workId
) {
  if (
    !workByIdsDataRemovedDuplicates ||
    !materialId ||
    (!pid && !materialType)
  ) {
    return -1;
  }

  return workByIdsDataRemovedDuplicates?.findIndex((w) => {
    if (!w?.workId || w?.workId !== workId) {
      return false;
    }
    if (pid) {
      return w?.manifestations?.mostRelevant?.some(
        (mostRelevant) => mostRelevant.pid === pid
      );
    }
    if (materialType) {
      return w?.manifestations?.mostRelevant?.some((mostRelevant) => {
        return isEqual(
          formatMaterialTypesToCode(flattenMaterialType(mostRelevant)),
          materialType
        );
      });
    }
  });
}

const useBookmarks = process.env.STORYBOOK_ACTIVE
  ? useBookmarkMock
  : useBookmarkImpl;
export default useBookmarks;

/**
 * Used to populate bookmark data, to show more info about the materials
 * Uses workid to find all manifestations for the work
 * filters the relevant manifestations based on the materialtype
 * and if pid provided, it will find the one relevant pid (specific edition was bookmarked)
 * @param {Object[]} bookmarks list of bookmarks
 * @returns {Object[]} bookmarks
 */
export const usePopulateBookmarks = (bookmarks) => {
  //all works both for specific edition and entire work
  const workIds = bookmarks?.map((work) => work.workId);
  const { data: workByIdsData, isLoading: idsToWorksLoading } = useData(
    workIds &&
      workFragments.idsToWorks({
        ids: workIds,
      })
  );
  const workByIdsDataRemovedDuplicates = workByIdsData?.works?.filter(
    (value, idx) => workByIdsData?.works?.indexOf(value) === idx
  );

  const data = useMemo(() => {
    if (!bookmarks) return [];

    const relevantWorksByBookmarkId = bookmarks?.map((bookmark) => {
      const relevantMaterialTypes = formatMaterialTypesFromCode(
        bookmark?.materialType
      );

      const workIdx = findRelevantWorkIdx(
        workByIdsDataRemovedDuplicates,
        bookmark?.materialId,
        bookmark?.pid,
        bookmark?.materialType,
        bookmark?.workId
      );
      const work =
        workIdx > -1 ? workByIdsDataRemovedDuplicates[workIdx] : null;

      const manifestationWithCorrectMaterialTypes =
        work?.manifestations?.mostRelevant.filter((m) =>
          isMaterialTypesMatch(relevantMaterialTypes, m?.materialTypes)
        );

      const specificManifestation =
        manifestationWithCorrectMaterialTypes?.filter(
          (m) => m?.pid === bookmark?.materialId
        );
      const isSpecificEdition = !isEmpty(specificManifestation);

      if (!work) return;
      return {
        ...work,
        bookmarkId: bookmark?.bookmarkId,
        materialId: bookmark?.materialId,
        materialType: bookmark?.materialType,
        pid: isSpecificEdition ? bookmark?.materialId : undefined,
        key: bookmark?.key,
        manifestations: isSpecificEdition
          ? specificManifestation
          : manifestationWithCorrectMaterialTypes,
      };
    });

    return relevantWorksByBookmarkId.filter((item) => item); // filter nulls
  }, [bookmarks, workByIdsData]);
  return { data, isLoading: idsToWorksLoading };
};
