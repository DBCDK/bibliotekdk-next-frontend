/**
 * @file
 *
 * hook to handle small pices of (local)storage
 */

import useSWR from "swr";

import { setLocalStorageItem, getLocalStorageItem } from "@/lib/utils";
import { useEffect } from "react";
import useAuthentication from "./user/useAuthentication";

// storage key name
const KEY_NAME = "storage";

// allow clear on signout prop
const CLEAR_ON_SIGNOUT = true;

/**
 *
 * Storage custom hook, store small pieces of informtion
 *
 * 'clearOnSignout' can be added as a prop, if item should be removed after user is signed out
 *
 * Provides the following functions:
 *    create() - creates a storage item
 *    read() - returns a storage item - if not expired
 *    update() - update a storage item
 *    delete() - delete a storage item
 *
 */
export default function useStorage() {
  const { data, mutate, isValidating } = useSWR(KEY_NAME, (key) =>
    JSON.parse(getLocalStorageItem(key) || "{}")
  );

  const { isAuthenticated } = useAuthentication();

  /**
   * cleanup
   * clear storage item on signout (user is logged out)
   */
  useEffect(() => {
    // if clear allowed
    if (CLEAR_ON_SIGNOUT) {
      // data is fetched
      if (!isValidating && data) {
        // user is not loggedin (anon sesison)
        if (!isAuthenticated) {
          // remove items with prop 'clearOnSignout'
          Object.entries(data).forEach(
            ([k, v]) => v.clearOnSignout && _delete(k)
          );
        }
      }
    }
  }, [isAuthenticated, data, isValidating]);

  /**
   * set a storage item
   * @param {string} name
   * @param {object} props
   * @param {int} ttl time in ms
   *
   */
  function _create(name, props = {}, ttl = null) {
    if (name) {
      const ts = Date.now();
      const expires = ttl ? ts + ttl : null;

      data[name] = { ...props, expires };

      setLocalStorageItem(KEY_NAME, JSON.stringify(data));
      mutate(data);
    }
    return null;
  }

  /**
   * read a storage item
   * @param {string} name
   *
   * @returns {object}
   *
   */
  function _read(name) {
    const item = data?.[name];
    if (item) {
      const ts = Date.now();
      if (item?.expires && item?.expires > ts) {
        return item;
      }
      _delete(name);
    }
    return null;
  }

  /**
   * update a storage item
   * @param {string} name
   * @param {object} props
   * @param {int} ttl time in ms
   *
   */
  function _update(name, props = {}, ttl = null) {
    const item = data?.[name];

    if (item) {
      const ts = Date.now();
      const expires = ttl ? ts + ttl : item.expires;

      data[name] = { ...item, ...props, expires };

      setLocalStorageItem(KEY_NAME, JSON.stringify(data));
      mutate(data);
    }
    return null;
  }

  /**
   * delete a storage item
   *  @param {string} name
   *
   */
  function _delete(name) {
    const item = data?.[name];

    if (item) {
      const copy = { ...data };
      delete copy?.[name];

      setLocalStorageItem(KEY_NAME, JSON.stringify(copy));
      mutate(copy);
    }
  }

  return {
    create: _create,
    read: _read,
    update: _update,
    delete: _delete,
    isLoading: isValidating && !data,
  };
}
