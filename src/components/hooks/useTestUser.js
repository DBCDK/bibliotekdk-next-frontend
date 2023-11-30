import { useState, useEffect } from "react";
import {
  enableFbiApiTestUsers,
  fbiApiTestUsersEnabled,
} from "@dbcdk/login-nextjs/client";
import useSWR from "swr";

/**
 * A hook for checking if test user mode is enabled
 */
export default function useTestUser() {
  let { data: enabled, mutate } = useSWR("test-user", () =>
    fbiApiTestUsersEnabled()
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  function setEnabledHandler(state) {
    if (!ready) {
      return;
    }

    // save in localstorage
    enableFbiApiTestUsers(state);

    // broadcast
    mutate();
  }

  return { enabled, setEnabled: setEnabledHandler };
}
