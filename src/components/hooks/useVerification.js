/**
 * @file
 *
 * hook to handle CPR verification process
 */

import useSWR from "swr";

const TYPE = { FFU: "ffu", FOLK: "folk" };

const KEY_NAME = "verification";
const EXPIRATION_TTL = 1000 * 60 * 10; // 10 minutes
const TS_TTL = 1000 * 60 * 60 * 24; // 24 hours

/**
 *
 * @param {*} value
 */
export default function useVerification() {
  const { data, mutate, error, isLoading } = useSWR(KEY_NAME, (key) =>
    JSON.parse(localStorage.getItem(key) || "null")
  );

  console.log("useVerification => data", data);

  /**
   * remove already used props from props obj.
   *
   * @param {object} props
   * @returns {object} props.type
   *
   */
  function _trim(props) {
    delete props.type;
    delete props.accessToken;
    return props;
  }

  /**
   * open an verification process
   *
   * @param {string} props.accessToken
   * @param {string} props.type
   *
   */
  function _create(props) {
    console.log("useVerification => create...", { ...props });
    const { type, accessToken } = props;

    // clear verifications
    _close();

    const ts = Date.now();
    const ttl = EXPIRATION_TTL;
    const expires = ts + ttl;

    // accesstoken type
    const _type = TYPE[type];
    // if valid type
    if (_type) {
      // remove already used props
      props = _trim(props);

      const _data = { ...props, expires, ts, tokens: { [_type]: accessToken } };
      localStorage.setItem(KEY_NAME, JSON.stringify(_data));
      mutate(_data);
    }
  }

  /**
   * update an existing verification process
   *
   * @param {string} props.accessToken
   * @param {string} props.type
   * @param {string} props.origin
   *
   */
  function _update(props) {
    console.log("useVerification => update...", { ...props });
    const { type, accessToken } = props;

    const ts = Date.now();

    // if not expired
    if (data?.expires > ts) {
      // accesstoken type
      const _type = TYPE[type];
      // if valid type add token
      if (_type) {
        // remove already used props
        props = _trim(props);

        const _data = {
          ...data,
          ...props,
          tokens: { ...data.tokens, [_type]: accessToken },
        };

        localStorage.setItem(KEY_NAME, JSON.stringify(_data));
        mutate(_data);
      }
    }
  }

  /**
   * close an open verification process
   */
  function _close() {
    console.log("useVerification => close...");

    localStorage.removeItem(KEY_NAME);
    mutate(null);
  }

  /**
   * read an open verification process WITHIN expiration
   *  @returns {object|null}
   */
  function _read() {
    console.log("useVerification => read...");
    const ts = Date.now();

    if (data?.expires > ts) {
      return data;
    }

    // expired or unset verification
    return null;
  }

  /**
   * check if a verification process exist BEYOND expiration
   *  @returns {boolean}
   */
  function _exist() {
    const ts = Date.now();
    const ttl = TS_TTL;
    const expires = data?.ts + ttl;

    if (expires > ts) {
      return true;
    }

    // expired or unset verification
    return false;
  }

  return {
    exist: _exist,
    create: _create,
    read: _read,
    update: _update,
    delete: _close,
    isLoading: !error && isLoading,
  };
}
