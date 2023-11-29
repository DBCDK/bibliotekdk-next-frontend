import { fetchAll } from "@/lib/api/apiServerOnly";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Wrap() {
  const router = useRouter();

  useEffect(() => {
    if (router && !router.query.hasOwnProperty("universeNumber")) {
      router?.replace({
        pathname: router.pathname + "/[universeNumber]",
        query: { ...router.query, seriesNumber: 0 },
      });
    }
  }, [router?.query]);
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Wrap.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
