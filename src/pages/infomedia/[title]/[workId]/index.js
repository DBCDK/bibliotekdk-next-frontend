import { fetchAll } from "@/lib/api/apiServerOnly";
import { useRouter } from "next/router";
import { useData } from "@/lib/api/api";
import * as infomediaFragments from "@/lib/api/infomedia.fragments";
import Custom404 from "@/pages/404";
import useAuthentication from "@/components/hooks/user/useAuthentication";

function parseForPid(workId) {
  const parts = workId.split(":");
  return `${parts[1]}:${parts[2]}`;
}

export default function Wrap() {
  const router = useRouter();
  const { workId, review: reviewPid } = router?.query;
  const pid = reviewPid ? reviewPid : parseForPid(workId);
  const { isAuthenticated } = useAuthentication();

  const infomediaIds = useData(
    isAuthenticated &&
      pid &&
      infomediaFragments.infomediaIdFromPid({ pid: pid })
  )
    ?.data?.manifestation?.access?.map((obj) => obj.id)
    .filter((id) => id);

  if (infomediaIds?.length === 1) {
    router?.replace(`${router?.asPath}/${infomediaIds?.[0]}`);
  }
  return <Custom404 />;
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
