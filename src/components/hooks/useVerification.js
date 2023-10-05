/**
 * @file
 *
 * hook to handle CPR verification process
 */

import useSWR from "swr";

const KEY_NAME = "addlibrary-verification";

/**
 *
 * @param {*} value
 */
export default function useVerification() {
  // state of the active selected mode [dark/light/system]
  const { data, mutate, error, isLoading } = useSWR(KEY_NAME, (key) =>
    JSON.parse(localStorage.getItem(key) || "{}")
  );

  /**
   * open an verification process
   *
   * @param {string} user.agencyId
   * @param {string} user.localId
   *
   */
  function _create(accessToken) {
    _close();

    const ts = Date.now();
    const _data = { accessToken, ts };
    sessionStorage.setItem(KEY_NAME, JSON.stringify(_data));
    mutate(_data, false);
  }

  /**
   * close an open verification process
   */
  function _close() {
    sessionStorage.removeItem(KEY_NAME);
    mutate({}, false);
  }

  return {
    data,
    create: _create,
    close: _close,
    isLoading: !error && isLoading,
  };
}
