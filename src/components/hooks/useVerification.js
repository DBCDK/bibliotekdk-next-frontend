import useSWR from "swr";
import { useEffect } from "react";
import useAuthentication from "@/components/hooks/user/useAuthentication";

/**
 * Settings
 */

// allowed token types
const TYPE = { FFU: "FFU", FOLK: "FOLK" };
//
const TTL = 1000 * 60 * 60 * 24; // 24 hours
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
  const { data, mutate, isValidating } = useSWR(
    "/api/verification/read",
    fetcher
  );

  const { isAuthenticated, isLoading } = useAuthentication();

  async function fetcher(url) {
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  }

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
        if (!isAuthenticated && !isLoading) {
          _delete();
        }
      }
    }
  }, [isAuthenticated, isLoading, data, isValidating]);

  /**
   * start an verification process
   *
   * @param {string} props.origin
   * @param {string} props.type
   *
   */
  async function _create({ type, origin } = {}) {
    console.log("useVerification => create: props", { type, origin });

    const payload = {
      ...(TYPE[type] && { type: TYPE[type] }),
      ...(origin && { origin }),
    };

    await fetch("/api/verification/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    mutate();
  }

  /**
   * update an existing verification process
   *
   * @param {string} props.type
   *
   */
  async function _update({ type } = {}) {
    console.log("useVerification => update: props", { type });

    const payload = {
      ...(TYPE[type] && { type: TYPE[type] }),
    };

    await fetch("/api/verification/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    mutate();
  }

  /**
   * close an open verification process
   */
  async function _delete() {
    console.log("useVerification delete called ....");

    await fetch("/api/verification/delete", { method: "POST" });
    mutate(null, false);
  }

  function _read() {
    return data?.expires > Date.now() ? data : null;
  }

  function _exist() {
    return data?.ts + TTL > Date.now();
  }

  console.log("useVerification => data", _read());

  return {
    exist: _exist,
    create: _create,
    read: _read,
    update: _update,
    delete: _delete,
    isLoading: isValidating && !data,
  };
}
