import useSWR from "swr";
import * as workFragments from "@/lib/api/work.fragments";
import { useData, useMutate } from "@/lib/api/api";
import { useEffect, useState, useMemo } from "react";
import * as bookmarkMutations from "@/lib/api/bookmarks.mutations";
import * as bookmarkFragments from "@/lib/api/bookmarks.fragments";
import { useSession } from "next-auth/react";
import useBreakpoint from "@/components/hooks/useBreakpoint";

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
  } = useSWR(KEY_NAME, (key) => JSON.parse(localStorage.getItem(key) || "[]"));
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
    const cookies = await JSON.parse(localStorage.getItem(KEY_NAME) || "[]");
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

      //console.log("VALUE ", value);

      if (existingIndex === -1) {
        // Doesn't exist - Add
        await bookmarkMutation.post(
          bookmarkMutations.addBookmarks({
            bookmarks: [
              {
                materialId: value.materialId,
                materialType: value.materialType, //TODO id instead of string
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
      localStorage.setItem(KEY_NAME, stringified);
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

//OBS order does not matter in this implementation. should it order matter?
// "BOOK / SOUND_RECORDING_CD" and "SOUND_RECORDING_CD / BOOK" would both match
const isMaterialTypesMatch = (workTypesOfBookmark, materialTypesOfWork) => {
  if (!materialTypesOfWork || !workTypesOfBookmark) return false;
  const workTypesCount = workTypesOfBookmark.length;
  //number of single worktypes in compound worktype
  const matches = materialTypesOfWork.filter((mt) => {
    const code = mt?.materialTypeSpecific?.code;
    return workTypesOfBookmark.includes(code);
  });

  //if number of matches is equal to number of worktypes in compound worktype, we have found manifestation with correct
  //materilatype
  return matches.length === workTypesCount;
};

const useBookmarks = process.env.STORYBOOK_ACTIVE
  ? useBookmarkMock
  : useBookmarkImpl;
export default useBookmarks;

//TODO create new usePopulateBookmarks that used workId instead of materialId to work for all bookmarks in same manner
// and then get manifestations for the relevant pids

export const usePopulateBookmarksNew2 = (bookmarks) => {
  //all works both for specific edition and entire work
  const { data: workByIdsData, isLoading: idsToWorksLoading } = useData(
    workFragments.idsToWorks({
      //TODO check which data idsToWorks really needs to get out
      ids: bookmarks?.map((work) => work.workId), //get workIds
    })
  );

  const workByIdsDataRemovedDuplicates = workByIdsData?.works?.filter(
    (value, idx) => workByIdsData?.works?.indexOf(value) === idx
  );

  //specific edition
  //use these pids to find the specific editions and remove all irrelevnat pids from editions
  const specificEditions = bookmarks?.filter(
    (bookmark) => !bookmark?.materialId?.includes("work-of:")
  );

  const relevantWorksByBookmarkId = bookmarks?.map((bookmark) => {
    const materialTypes = bookmark?.materialType?.split(" / ");
    const work = workByIdsDataRemovedDuplicates?.find(
      (w) => w?.workId === bookmark?.workId
    );

    let manifestationWithCorrectMaterialType =
      work?.manifestations?.mostRelevant.filter((m) =>
        isMaterialTypesMatch(materialTypes, m?.materialTypes)
      );

    // if bookmarkId is in specificEdition array, then filter the specific edition out
    const specificEditionBookmark = specificEditions?.find(
      (se) => se?.bookmarkId === bookmark?.bookmarkId
    );
    if (specificEditionBookmark) {
      const specificManifestation =
        manifestationWithCorrectMaterialType?.filter(
          (m) => m?.pid === specificEditionBookmark?.materialId
        );
      manifestationWithCorrectMaterialType = specificManifestation;
    }
    console.log("bookmark ", bookmark);
    return {
      ...work,
      bookmarkId: bookmark?.bookmarkId,
      materialId: bookmark?.materialId,
      pid: specificEditionBookmark ? bookmark?.materialId : undefined,
      key: bookmark?.key,
      workId: bookmark?.workId,
      manifestations: manifestationWithCorrectMaterialType,
    };
  });

  console.log("RELEVANT WORKS BASED ON BOOKMARK", relevantWorksByBookmarkId);

  const data = useMemo(() => {
    if (!bookmarks) return [];
    //cannot group if there are multiple worktypes for same workid in order
    const groupedByWorkIdAndType = {};
    relevantWorksByBookmarkId?.forEach((rw) => {
      rw.manifestations?.forEach((manifestation) => {
        const key = rw?.key;
        if (!groupedByWorkIdAndType[key]) {
          groupedByWorkIdAndType[key] = [];
        }
        groupedByWorkIdAndType[key].push(manifestation);
      });
    });

    return relevantWorksByBookmarkId.filter((item) => item); // filter nulls
  }, [bookmarks, workByIdsData]);
  return { data, isLoading: idsToWorksLoading };
};

export const usePopulateBookmarksNew = (bookmarks) => {
  console.log("bookmarks RELEANT ", bookmarks);
  //works (not specific edition)
  const workIds = bookmarks?.filter((bookmark) =>
    bookmark?.materialId?.includes("work-of:")
  );
  const { data: workByIdsData, isLoading: idsToWorksLoading } = useData(
    workFragments.idsToWorks({
      //TODO get out less
      ids: workIds?.map((work) => work.materialId),
    })
  );

  //find relevant pids with relevant worktype //TODO check if I can use manifestationsByType!!!
  const relevantWorks = workByIdsData?.works?.map((work) => {
    const materialTypes = bookmarks
      .find((b) => b?.materialId === work.workId)
      ?.materialType?.split(" / "); //either single worktype ("BOOK") or compound worktype such as "BOOK / SOUND_RECORDING_CD"
    const manifestationWithCorrectMaterialType =
      work?.manifestations?.mostRelevant.filter((m) =>
        isMaterialTypesMatch(materialTypes, m?.materialTypes)
      );

    return manifestationWithCorrectMaterialType;
  });

  const relevantPidsPerWork = relevantWorks?.map((work) =>
    work?.map((m) => m?.pid)
  );

  const flattedPids = relevantPidsPerWork?.flat();
  //get manifestations from these pids
  const {
    data: manifestatonsForWorks,
    isLoading: manifestatonsForWorksIsLoading,
  } = useData(
    workFragments.pidsToWork({
      pids: flattedPids,
    })
  );

  //get work by pids together with specific edition

  //specific edition
  const workPids = bookmarks?.filter(
    (bookmark) => !bookmark?.materialId?.includes("work-of:")
  );

  const { data: workByPidsData, isLoading: pidsToWorkLoading } = useData(
    workFragments.pidsToWork({
      pids: workPids?.map((work) => work.materialId),
    })
  );

  const data = useMemo(() => {
    if (!bookmarks) return [];
    const groupedByWorkId = {};
    manifestatonsForWorks?.manifestations?.forEach((manifestation) => {
      const workId = manifestation?.ownerWork?.workId;
      if (!groupedByWorkId[workId]) {
        groupedByWorkId[workId] = [];
      }
      groupedByWorkId[workId].push(manifestation);
    });

    const transformedWorkByIds = Object.entries(groupedByWorkId).map(
      ([materialId, manifestations]) => ({
        manifestations,
        materialId,
      })
    );

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
  console.log(
    "bookmarks idsToWorksLoading || pidsToWorkLoading",
    idsToWorksLoading,
    pidsToWorkLoading
  );

  return { data, isLoading };

  //...
};

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
  console.log("BOOKMARKS ", bookmarks);

  //specific edition
  const workPids = bookmarks?.filter(
    (bookmark) => !bookmark?.materialId?.includes("work-of:")
  );

  const { data: workByIdsData, isLoading: idsToWorksLoading } = useData(
    workFragments.idsToWorks({ ids: workIds?.map((work) => work.materialId) })
  );

  console.log("workByIdsData ", workByIdsData);

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
