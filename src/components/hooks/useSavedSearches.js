/**
 * @file - Hook for advanced search saved searches. functions to get, save and delete searches from userdata db
 */

import { useEffect, useMemo, useState } from "react";
import {
  addSavedSearch,
  deleteSavedSearches,
  updateSavedSearch,
} from "@/lib/api/userData.mutations";
import {
  getSavedSearchByCql,
  savedSearchesQuery,
} from "@/lib/api/user.fragments";
import { useData, useMutate } from "@/lib/api/api";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useBreakpoint from "@/components/hooks/useBreakpoint";

const ITEMS_PER_PAGE = 10;

export const useSavedSearches = () => {
  const { hasCulrUniqueId } = useAuthentication();
  const userDataMutation = useMutate();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";
  const [currentPage, setCurrentPage] = useState(1);
  const [savedSearches, setSavedSearches] = useState([]);

  const { data, isLoading, mutate } = useData(
    hasCulrUniqueId &&
      savedSearchesQuery({
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
      })
  );

  useEffect(() => {
    if (data?.user?.savedSearches?.result) {
      setSavedSearches((prev) => {
        //if mobile, dont replace previous page. It should keep it and extend it with data from new page.
        const prevPage = isMobile ? prev : [];

        // set of saved searches id's for fast lookup
        const savedSearchIds = new Set(prevPage.map((search) => search.id));
        return [
          ...prevPage,
          ...data.user.savedSearches.result
            .filter((search) => !savedSearchIds.has(search.id))
            .map((search) => {
              const searchObject = JSON.parse(search.searchObject);
              return {
                ...searchObject,
                id: search.id,
                createdAt: search.createdAt,
              };
            }),
        ];
      });
    }
  }, [data]);

  const mutateData = () => {
    setTimeout(() => {
      mutate();
    }, 100);
  };

  const hitcount = useMemo(() => data?.user?.savedSearches?.hitcount, [data]);
  const totalPages = useMemo(
    () => Math.ceil(hitcount / ITEMS_PER_PAGE),
    [hitcount]
  );

  const saveSearch = async ({ searchObject }) => {
    try {
      await userDataMutation.post(addSavedSearch({ searchObject }));
      mutateData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateSearch = async ({ searchObject }) => {
    try {
      await userDataMutation.post(updateSavedSearch({ searchObject }));
      mutateData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSearches = async ({ idsToDelete }) => {
    try {
      await userDataMutation.post(deleteSavedSearches({ idsToDelete }));
      if (isMobile) {
        setSavedSearches((prev) =>
          prev.filter((item) => !idsToDelete.includes(item.id))
        );
      } else {
        mutateData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const useSavedSearchByCql = ({ cql }) => {
    const { hasCulrUniqueId } = useAuthentication();

    const { data, mutate } = useData(
      cql &&
        hasCulrUniqueId &&
        getSavedSearchByCql({
          cql,
        })
    );

    return useMemo(() => {
      if (!data?.user?.savedSearchByCql) {
        return { savedObject: null, mutate };
      }

      const jsonSearchObject = data.user.savedSearchByCql.searchObject;
      return {
        savedObject: {
          ...JSON.parse(jsonSearchObject || "{}"),
          id: data.user.savedSearchByCql.id,
          createdAt: data.user.savedSearchByCql.createdAt,
        },
        mutate,
      };
    }, [data]);
  };

  return {
    savedSearches,
    saveSearch,
    deleteSearches,
    hitcount,
    updateSearch,
    currentPage,
    totalPages,
    setCurrentPage,
    useSavedSearchByCql,
    isLoading,
  };
};

export default useSavedSearches;
