import SeriesPage from "@/components/series/SeriesPage";
import { seriesById } from "@/lib/api/work.fragments";
import { fetchAll } from "@/lib/api/apiServerOnly";

export default function Wrap() {
  return <SeriesPage />;
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Wrap.getInitialProps = async (ctx) => {
  return fetchAll([seriesById], ctx, { seriesId: ctx.query.seriesId });
};
