import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useSession } from "next-auth/react";
import * as workFragments from "@/lib/api/work.fragments";
import { useData, useFetcher, useMutate } from "@/lib/api/api";
import { useEffect, useState, useMemo } from "react";
import * as bookmarkMutations from "@/lib/api/bookmarks.mutations";
import * as bookmarkFragments from "@/lib/api/bookmarks.fragments";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  getCreatorDisplay,
} from "@/lib/utils";
import isEqual from "lodash/isEqual";
import {
  flattenMaterialType,
  formatMaterialTypesFromCode,
  formatMaterialTypesToCode,
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import useDataCollect from "@/lib/useDataCollect";
import { getCoverImage } from "@/components/utils/getCoverImage";

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

export function toBookmarkInput(bookmark) {
  const { materialId, workId, materialType } = bookmark;
  const isWork = materialId?.startsWith("work-of:");
  const selection = Object.prototype.hasOwnProperty.call(bookmark, "selection")
    ? bookmark.selection
    : isWork && materialId === workId && materialType
    ? { materialTypes: { specific: formatMaterialTypesFromCode(materialType) } }
    : null;
  if (!isWork || !selection) return { materialId };
  const field = selection.materialTypes.general ? "general" : "specific";
  return {
    materialId,
    selection: {
      materialTypes: {
        [field]: [...new Set(selection.materialTypes[field])].sort((a, b) =>
          a < b ? -1 : a > b ? 1 : 0
        ),
      },
    },
  };
}

export function getBookmarkKey(bookmark) {
  const { materialId, selection } = toBookmarkInput(bookmark);
  return JSON.stringify([materialId, selection || null]);
}

function normalizeBookmark(bookmark) {
  const selection = toBookmarkInput(bookmark).selection || null;
  return {
    ...bookmark,
    selection,
    bookmarkId: bookmark.id || bookmark.bookmarkId,
    workId:
      bookmark.material?.work?.workId ||
      bookmark.material?.manifestation?.ownerWork?.workId ||
      bookmark.snapshot?.workId ||
      bookmark.workId ||
      (bookmark.materialId?.startsWith("work-of:")
        ? bookmark.materialId
        : undefined),
    title: bookmark.snapshot?.title || bookmark.title,
    materialType:
      selection?.materialTypes?.specific?.join(" / ") ||
      (!bookmark.materialId?.startsWith("work-of:")
        ? bookmark.snapshot?.materialTypes
            ?.map((mt) => mt.materialTypeSpecific.code)
            .join(" / ") || bookmark.materialType
        : undefined),
    key: bookmark.id || bookmark.bookmarkId || getBookmarkKey(bookmark),
  };
}

const useBookmarksCore = ({
  hasCulrUniqueId,
  isMock = false,
  list = false,
  workId,
  userId,
} = {}) => {
  const collect = useDataCollect();
  hasCulrUniqueId = isMock ? false : hasCulrUniqueId;
  const fetch = useFetcher();
  const bookmarkMutation = useMutate();
  const [sortBy, setSort] = useState("createdAt");
  const [desktopPage, setDesktopPage] = useState(1);
  const [mutationError, setMutationError] = useState(null);
  const breakpoint = useBreakpoint();
  const isMobile = ["xs", "sm", "md"].includes(breakpoint);
  const { data: revision, mutate: mutateRevision } = useSWR(
    "bookmarks-revision",
    null,
    { fallbackData: 0 }
  );
  const {
    data: storedLocalBookmarks,
    mutate: mutateLocalBookmarks,
    error: localError,
  } = useSWR(KEY_NAME, () => JSON.parse(getLocalStorageItem(KEY_NAME) || "[]"));
  const localBookmarks = useMemo(
    () => storedLocalBookmarks?.map(normalizeBookmark),
    [storedLocalBookmarks]
  );
  const countOnly = !list && !workId;
  const {
    data: pages,
    error: globalError,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      hasCulrUniqueId && ((isMobile && list) || index === 0)
        ? [
            "patronBookmarks",
            userId,
            revision,
            sortBy,
            workId || null,
            countOnly,
            isMobile && list ? index : desktopPage - 1,
            isMobile && list,
            list,
          ]
        : null,
    async ([, , , sort, filterWorkId, onlyCount, page, , withMaterial]) => {
      const limit = filterWorkId ? 100 : onlyCount ? 1 : ITEMS_PER_PAGE;
      let offset = filterWorkId || onlyCount ? 0 : page * ITEMS_PER_PAGE;
      const items = [];
      let response;
      do {
        const result = await fetch(
          bookmarkFragments.fetchAll({
            sortBy: sort,
            offset,
            limit,
            workId: filterWorkId,
            countOnly: onlyCount,
            withMaterial,
          })
        );
        response = result?.data?.patron?.bookmarks;
        if (result?.errors?.length || response?.status !== "OK") {
          throw new Error(response?.status || "Could not fetch bookmarks");
        }
        items.push(...(response.items || []));
        offset += limit;
      } while (filterWorkId && offset < response.hitcount);
      return { ...response, items };
    },
    { revalidateFirstPage: false, persistSize: true }
  );
  const globalBookmarks = useMemo(
    () => pages?.flatMap((page) => page.items.map(normalizeBookmark)) || [],
    [pages]
  );
  const currentPage = isMobile && list ? size : desktopPage;
  const hitcount = hasCulrUniqueId
    ? pages?.[0]?.hitcount || 0
    : localBookmarks?.length || 0;
  const totalPages = Math.ceil(hitcount / ITEMS_PER_PAGE);
  const globalLoading =
    hasCulrUniqueId &&
    !globalError &&
    (!pages || (isMobile && list && !pages[size - 1]));

  function setCurrentPage(page) {
    if (isMobile && list && hasCulrUniqueId) setSize(Math.max(1, page));
    else setDesktopPage(Math.max(1, page));
  }

  function setSortBy(value) {
    if (!value || value === sortBy) return;
    setSort(value);
    setDesktopPage(1);
    setSize(1);
  }

  async function refreshBookmarks() {
    await mutateRevision((value) => (value || 0) + 1, { revalidate: false });
  }

  async function storeLocal(bookmarks) {
    setLocalStorageItem(KEY_NAME, JSON.stringify(bookmarks));
    await mutateLocalBookmarks(bookmarks, false);
  }

  const syncCookieBookmarks = async () => {
    if (!hasCulrUniqueId) return;
    const local = JSON.parse(getLocalStorageItem(KEY_NAME) || "[]");
    if (!Array.isArray(local) || local.length === 0) return;
    try {
      const result = await bookmarkMutation.post(
        bookmarkMutations.addBookmarks({
          bookmarks: createdAtSort([...local], "desc").map(toBookmarkInput),
        })
      );
      if (result.error) throw result.error;
      const response = result.data?.patron?.addBookmarks;
      const confirmed = new Set(
        response?.items
          ?.filter((item) => ["OK", "ALREADY_EXISTS"].includes(item.status))
          .map(getBookmarkKey)
      );
      const latestLocal = JSON.parse(getLocalStorageItem(KEY_NAME) || "[]");
      await storeLocal(
        latestLocal.filter(
          (bookmark) => !confirmed.has(getBookmarkKey(bookmark))
        )
      );
      await refreshBookmarks();
    } catch (error) {
      console.error("Error syncing local bookmarks", error);
    }
  };

  const deleteBookmarks = async (
    bookmarksToDelete,
    onDeleted = (count) => collect.collectDelMultipleBookmarks({ count })
  ) => {
    if (!bookmarksToDelete.length) return [];
    setMutationError(null);
    let deleted = bookmarksToDelete;
    if (hasCulrUniqueId) {
      const result = await bookmarkMutation.post(
        bookmarkMutations.deleteBookmarks({
          bookmarkIds: bookmarksToDelete.map((bookmark) => bookmark.bookmarkId),
        })
      );
      await refreshBookmarks();
      if (result.error) {
        setMutationError(result.error);
        return [];
      }
      const confirmed = new Set(
        result.data?.patron?.deleteBookmarks?.items
          ?.filter((item) => ["OK", "NOT_FOUND"].includes(item.status))
          .map((item) => item.id)
      );
      deleted = bookmarksToDelete.filter((bookmark) =>
        confirmed.has(bookmark.bookmarkId)
      );
      if (deleted.length !== bookmarksToDelete.length)
        setMutationError(new Error("Could not delete all bookmarks"));
    } else {
      const keys = new Set(bookmarksToDelete.map((bookmark) => bookmark.key));
      await storeLocal(
        (localBookmarks || []).filter((bookmark) => !keys.has(bookmark.key))
      );
    }
    if (deleted.length) onDeleted(deleted.length);
    return deleted.map((bookmark) => bookmark.key);
  };

  const setBookmark = async (value) => {
    if (hasCulrUniqueId && (globalLoading || globalError || isValidating))
      return;
    setMutationError(null);
    const bookmark = normalizeBookmark(value);
    const bookmarks = hasCulrUniqueId ? globalBookmarks : localBookmarks || [];
    const existing = bookmarks.find((item) =>
      value.key
        ? item.key === value.key
        : getBookmarkKey(item) === getBookmarkKey(bookmark)
    );
    if (existing) {
      await deleteBookmarks([existing], () =>
        collect.collectDelBookmark(value)
      );
    } else if (hasCulrUniqueId) {
      const result = await bookmarkMutation.post(
        bookmarkMutations.addBookmarks({
          bookmarks: [toBookmarkInput(bookmark)],
        })
      );
      await refreshBookmarks();
      if (
        !result.error &&
        result.data?.patron?.addBookmarks?.items?.some((item) =>
          ["OK", "ALREADY_EXISTS"].includes(item.status)
        )
      )
        collect.collectAddBookmark(value);
      else
        setMutationError(result.error || new Error("Could not add bookmark"));
    } else {
      await storeLocal([...bookmarks, { ...bookmark, createdAt: new Date() }]);
      collect.collectAddBookmark(value);
    }
  };

  function clearLocalBookmarks() {
    return storeLocal([]);
  }

  function createdAtSort(bookmarks = [], direction = "asc") {
    return [...bookmarks].sort((a, b) =>
      direction === "asc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  const titleSort = (bookmarkList = [], sortDirection = "asc") => {
    return [...bookmarkList].sort((a, b) => {
      const aTitle = a.titles?.full?.[0] || a?.title;
      const bTitle = b.titles?.full?.[0] || b?.title;
      if (aTitle < bTitle) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aTitle > bTitle) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedLocal =
    sortBy === "title"
      ? titleSort(localBookmarks)
      : createdAtSort(localBookmarks);
  const localPage = sortedLocal.slice(
    isMobile ? 0 : (desktopPage - 1) * ITEMS_PER_PAGE,
    desktopPage * ITEMS_PER_PAGE
  );
  return {
    setBookmark,
    deleteBookmarks,
    clearLocalBookmarks,
    syncCookieBookmarks,
    bookmarks: hasCulrUniqueId
      ? globalBookmarks
      : workId
      ? localBookmarks?.filter((bm) => bm.workId === workId)
      : localBookmarks,
    paginatedBookmarks: hasCulrUniqueId ? globalBookmarks : localPage,
    isLoading: hasCulrUniqueId ? globalLoading : !localBookmarks && !localError,
    error: (hasCulrUniqueId ? globalError : localError) || mutationError,
    retry: () => {
      setMutationError(null);
      return refreshBookmarks();
    },
    setSortBy,
    currentPage: hasCulrUniqueId ? currentPage : desktopPage,
    totalPages,
    setCurrentPage,
    count: hitcount,
    createdAtSort,
    titleSort,
  };
};

const useBookmarkImpl = (options) => {
  const { hasCulrUniqueId } = useAuthentication();
  const { data: session } = useSession();
  return useBookmarksCore({
    ...options,
    hasCulrUniqueId,
    userId: session?.user?.userId,
  });
};

const useBookmarkMock = (options) => {
  return useBookmarksCore({ ...options, isMock: true });
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
export function populateBookmark(bookmark, localWork) {
  const normalized = normalizeBookmark(bookmark);
  const { selection } = normalized;
  const isServerBookmark = !!bookmark.id;
  const material = bookmark.material;
  const work = isServerBookmark
    ? material?.work || material?.manifestation?.ownerWork
    : localWork;
  const pid = !bookmark.materialId?.startsWith("work-of:")
    ? bookmark.materialId
    : undefined;
  let selected;
  if (isServerBookmark && pid) {
    selected = material?.manifestation ? [material.manifestation] : [];
  } else if (isServerBookmark && selection) {
    selected = material?.manifestations || [];
  } else {
    const manifestations = work?.manifestations?.mostRelevant || [];
    let defaultTypes;
    if (!pid && !selection) {
      defaultTypes = manifestationMaterialTypeFactory([
        ...manifestations,
      ]).uniqueMaterialTypes[0]?.map((mt) => mt.specificCode);
    }
    selected = manifestations.filter((manifestation) => {
      if (pid) return manifestation.pid === pid;
      if (!selection)
        return isMaterialTypesMatch(defaultTypes, manifestation.materialTypes);
      const field = selection.materialTypes.general ? "general" : "specific";
      const property =
        field === "general" ? "materialTypeGeneral" : "materialTypeSpecific";
      const codes =
        manifestation.materialTypes?.map((mt) => mt[property]?.code) || [];
      return selection.materialTypes[field].every((code) =>
        codes.includes(code)
      );
    });
  }
  const first = selected[0];
  const workManifestations = work?.manifestations?.mostRelevant || [];
  const findCover = (manifestations, realOnly = false) => {
    const candidates = manifestations
      .filter(
        (manifestation) =>
          (manifestation.cover?.thumbnail || manifestation.cover?.detail) &&
          (!realOnly || manifestation.cover.origin !== "default")
      )
      .map((manifestation) => ({
        ...manifestation,
        cover: {
          ...manifestation.cover,
          detail: manifestation.cover.detail || manifestation.cover.thumbnail,
        },
      }));
    const cover = getCoverImage(candidates);
    return cover.thumbnail || cover.detail;
  };
  const image =
    findCover(selected, true) ||
    findCover(workManifestations, true) ||
    findCover(selected) ||
    findCover(workManifestations);
  const title =
    first?.titles?.full?.[0] ||
    first?.titles?.main?.[0] ||
    work?.titles?.full?.[0] ||
    work?.titles?.main?.[0] ||
    bookmark.snapshot?.title ||
    bookmark.title ||
    "";
  const creators = first?.creators?.length
    ? first.creators
    : work?.creators || [];
  const creator =
    getCreatorDisplay(
      creators.find((item) => item.__typename === "Corporation") || creators[0]
    ) ||
    bookmark.snapshot?.creator ||
    "";
  const snapshotTypes = (bookmark.snapshot?.materialTypes || []).filter(
    (type) => {
      if (!selection) return !!pid;
      const field = selection.materialTypes.general ? "general" : "specific";
      return selection.materialTypes[field].includes(
        type[
          field === "general" ? "materialTypeGeneral" : "materialTypeSpecific"
        ]?.code
      );
    }
  );
  const displayTypes = first?.materialTypes || snapshotTypes;
  const flatTypes = flattenMaterialType({ materialTypes: displayTypes });
  return {
    ...work,
    ...normalized,
    workId: work?.workId || normalized.workId,
    pid,
    title,
    titles: { main: [title], full: [title] },
    creators,
    creator,
    image,
    hasMaterial: selected.some((manifestation) => !!manifestation.pid),
    materialType:
      selection?.materialTypes?.specific?.join(" / ") ||
      formatMaterialTypesToCode(flatTypes),
    materialTypeLabel:
      formatMaterialTypesToPresentation(flatTypes) ||
      selection?.materialTypes?.specific?.join(" / "),
    manifestations: selected,
  };
}

export const usePopulateBookmarks = (bookmarks) => {
  const workIds = [
    ...new Set(
      bookmarks
        ?.filter((bookmark) => !bookmark.id)
        .map((bookmark) => bookmark.workId)
        .filter(Boolean)
    ),
  ];
  const { data, isLoading } = useData(
    workIds.length > 0 && workFragments.idsToWorks({ ids: workIds })
  );
  const populated = useMemo(
    () =>
      bookmarks
        ?.map((bookmark) =>
          populateBookmark(
            bookmark,
            data?.works?.find((work) => work.workId === bookmark.workId)
          )
        )
        .filter(Boolean) || [],
    [bookmarks, data]
  );
  return { data: populated, isLoading };
};
