import { fetchAll } from "@/lib/api/apiServerOnly";
import SeriesPage from "@/components/series/SeriesPage";

export default function Wrap() {
  return <SeriesPage />;
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
