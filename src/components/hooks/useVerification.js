/**
 * @file
 *
 * hook to handle CPR verification process
 */

import useSWR from "swr";
import { useEffect } from "react";

import useUser from "@/components/hooks/useUser";

/**
 * Settings
 */

// allowed token types
const TYPE = { FFU: "ffu", FOLK: "folk" };
// storage key name
const KEY_NAME = "verification";
// verification process ttl (when using read() function)
const EXPIRATION_TTL = 1000 * 60 * 60; // 60 minutes
// verification object ttl (when using exist() function)
const TS_TTL = 1000 * 60 * 60 * 24; // 24 hours
// wipe verification if an anon session is returned
const CLEAR_ON_SIGNOUT = true;

/**
 *
 * Verification custom hook, to handle ffu users who wants to
 * create or associate with a bibdk account.
 *
 * verifications will be cleared if a anon sesson is returned
 *
 * provides the following functions:
 *
 *  exist() - returns if any verification object exists (ttl default 24 hours)
 *  create() - creates an verification object
 *  read() - returns if any verification process is active (ttl default 60 minutes)
 *  update() - update an verification
 *  delete() - delete an verification
 *
 */
export default function useVerification() {
  const { data, mutate, error, isValidating } = useSWR(KEY_NAME, (key) =>
    JSON.parse(localStorage.getItem(key) || "null")
  );

  const { isLoggedIn } = useUser();

  /**
   * cleanup
   * clear verifications if anon session (user is logged out)
   */
  useEffect(() => {
    // if clear allowed
    if (CLEAR_ON_SIGNOUT) {
      // data is fetched
      if (!isValidating && data) {
        // user is not loggedin (anon sesison)
        if (!isLoggedIn) {
          _close();
        }
      }
    }
  }, [isLoggedIn, data, isValidating]);

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
   * start an verification process
   *
   * @param {string} props.accessToken
   * @param {string} props.type
   *
   */
  function _create(props = {}) {
    const { type, accessToken } = props;

    // clear verifications
    _close();

    const ts = Date.now();
    const ttl = EXPIRATION_TTL;
    const expires = ts + ttl;

    // accesstoken type
    const _type = type && TYPE[type];

    // token obj
    const obj = {};

    // if valid type
    if (_type) {
      obj.tokens = { [_type]: accessToken };
    }

    // trim props from top level (added in tokens obj)
    props = _trim(props);

    const _data = { ...props, expires, ts, ...obj };
    localStorage.setItem(KEY_NAME, JSON.stringify(_data));
    mutate(_data);
  }

  /**
   * update an existing verification process
   *
   * @param {string} props.accessToken
   * @param {string} props.type
   * @param {string} props.origin
   *
   */
  function _update(props = {}) {
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
    localStorage.removeItem(KEY_NAME);
    mutate(null);
  }

  /**
   * read an open verification process WITHIN expiration
   *  @returns {object|null}
   */
  function _read() {
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
    isLoading: isValidating && !data,
  };
}
