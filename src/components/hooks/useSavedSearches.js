/**
 * @file - Hook for advanced search saved searches. functions to get, save and delete searches from userdata db
 */

import { useMemo } from "react";
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

/**
 * Get a date on a stored saved search object
 */
export function getTimeStamp(now) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const stamp = new Date(now).toLocaleTimeString("en-GB", options);
  // remove the " AM/PM" part
  return stamp.replace("AM", "").replace("PM", "").replace(":", ".").trim();
}

export const useSavedSearches = () => {
  const { hasCulrUniqueId } = useAuthentication();
  const userDataMutation = useMutate();

  const { data, mutate } = useData(
    hasCulrUniqueId &&
      savedSearchesQuery({
        limit: 10,
        offset: 0,
      })
  );

  const mutateData = () => {
    setTimeout(() => {
      mutate();
    }, 100);
  };

  const savedSearches = useMemo(
    () =>
      data?.user?.savedSearches?.result?.map((search) => {
        const searchObject = JSON.parse(search.searchObject);
        return {
          ...searchObject,
          id: search.id,
          createdAt: search.createdAt,
        };
      }),
    [data]
  );

  const hitcount = useMemo(() => data?.user?.savedSearches?.hitcount, [data]);

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
  /**
   * deletes one or multiple saved searches. Provide with array of ids to be deleted.
   * ids to delete
   * @param {*} idsToDelete
   */
  const deleteSearches = async ({ idsToDelete }) => {
    try {
      await userDataMutation.post(deleteSavedSearches({ idsToDelete }));
      mutateData();
    } catch (err) {
      console.error(err);
    }
  };
/**
 * Fetches a saved search from userdata given a cql search. The cql has to be a full cql including facetts, filters etc.
 * @param {String} cql Cql strint
 * @returns 
 */
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
        return { savedObject: null, mutate }; // or an empty object {}, depending on your handling of empty states
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
    }, [data]); // useMemo depends on `data`, recalculates if `data` changes
  };

  const savedSearchKeys = useMemo(
    () => savedSearches?.map((search) => search?.key),
    [savedSearches]
  );

  return {
    savedSearches,
    savedSearchKeys,
    saveSearch,
    deleteSearches,
    hitcount,
    updateSearch,
    useSavedSearchByCql,
  };
};

export default useSavedSearches;
