import Header from "@/components/header/Header";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";

import Page from "@/components/profile/orderHistoryPage";
/**
 * Renders the OrderHistory component
 */
export default function MyLibraries() {
  const router = useRouter();

  return (
    <>
      <Header router={router} />
      <Page />
    </>
  );
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
MyLibraries.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
