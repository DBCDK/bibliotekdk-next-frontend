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
Wrap.getInitialProps = (ctx) => {
  return fetchAll([universeBasicInfo], ctx);
};
