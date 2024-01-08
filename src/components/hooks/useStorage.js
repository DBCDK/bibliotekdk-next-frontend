/**
 * @file
 *
 * hook to handle CPR verification process
 */

import useSWR from "swr";

import { setLocalStorageItem, getLocalStorageItem } from "@/lib/utils";

/**
 * Settings
 */

// storage key name
const KEY_NAME = "storage";

/**
 *
 * Storage custom hook, store small pieces of informtion
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
    JSON.parse(getLocalStorageItem(key) || "null")
  );

  console.log("### data", data);

  /**
   * set item
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
   * read item
   * @param {string} name
   *
   * @returns {object}
   *
   */
  function _read(name) {
    const item = data?.[name];

    console.log("item", item);

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
      delete data?.[name];
      mutate(data);
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
