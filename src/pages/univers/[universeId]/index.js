import UniversePage from "@/components/universe/UniversePage";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { universeBasicInfo } from "@/lib/api/universe.fragments";

export default function Wrap() {
  return <UniversePage />;
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Wrap.getInitialProps = async (ctx) => {
  return fetchAll([universeBasicInfo], ctx, {
    universeId: ctx.query.universeId,
  });
  const res = await fetchAll([universeBasicInfo], ctx, {
    universeId: ctx.query.universeId,
  });
  const queries = Object.values(res.initialData);
  const initialData = queries[0]?.data;
  console.log("\n\n\n{ initialData }", initialData);
  return { initialData };
};
