import { fetchAll } from "@/lib/api/apiServerOnly";
import UniversePage from "@/components/universe/UniversePage";

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
  return fetchAll([], ctx);
};
