import Header from "@/components/header/Header";
import Page from "@/components/profile/bookmarks";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";

export default function LoansAndReservations() {
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
LoansAndReservations.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
