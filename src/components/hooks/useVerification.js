/**
 * @file
 *
 * hook to handle CPR verification process
 */

import useSWR from "swr";

const TYPE = { FFU: "ffu", FOLK: "folk" };

const KEY_NAME = "verification";

/**
 *
 * @param {*} value
 */
export default function useVerification() {
  const { data, mutate, error, isLoading } = useSWR(KEY_NAME, (key) =>
    JSON.parse(sessionStorage.getItem(key) || "{}")
  );

  console.log("### data", data);

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
    const ttl = 1000 * 60 * 10; // 10 minutes
    const expires = ts + ttl;

    // accesstoken type
    const _type = TYPE[type];
    // if valid type
    if (_type) {
      // remove already used props
      props = _trim(props);

      const _data = { ...props, expires, tokens: { [_type]: accessToken } };
      sessionStorage.setItem(KEY_NAME, JSON.stringify(_data));
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

        sessionStorage.setItem(KEY_NAME, JSON.stringify(_data));
        mutate(_data);
      }
    }
  }

  /**
   * close an open verification process
   */
  function _close() {
    console.log("useVerification => close...");

    sessionStorage.removeItem(KEY_NAME);
    mutate(null);
  }

  /**
   * close an open verification process
   */
  function _read() {
    console.log("useVerification => read...");
    const ts = Date.now();

    if (data?.expires > ts) {
      return data;
    }
    // expired or unset verification
    else {
      // close inActive verification
      if (data?.expires) {
        _close();
      }
      return null;
    }
  }

  return {
    create: _create,
    read: _read,
    update: _update,
    delete: _close,
    isLoading: !error && isLoading,
  };
}
