import { useEffect, useState } from "react";

export default function useIsOnline() {
  const state = useState();

  useEffect(() => {
    function onChange() {
      state[1]({});
    }
    window.addEventListener("offline", onChange);
    window.addEventListener("online", onChange);
    return () => {
      window.removeEventListener("offline", onChange);
      window.removeEventListener("online", onChange);
    };
  }, []);

  return typeof window === "undefined" ? true : window.navigator.onLine;
}
