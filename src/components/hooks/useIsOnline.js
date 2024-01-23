import { useEffect, useState } from "react";

export default function useIsOnline() {
  const [_, refresh] = useState();

  useEffect(() => {
    function onChange() {
      refresh({});
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
