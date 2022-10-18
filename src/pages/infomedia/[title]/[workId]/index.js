import { fetchAll } from "@/lib/api/apiServerOnly";
import { useRouter } from "next/router";
import { useData } from "@/lib/api/api";
import { infomediaIdFromPid } from "@/lib/api/infomedia.fragments";
import { Custom } from "@/pages/404";
import useUser from "@/components/hooks/useUser";

function parseForPid(workId) {
  const parts = workId.split(":");
  return `${parts[1]}:${parts[2]}`;
}

export default function Wrap() {
  const router = useRouter();
  const { workId, review: reviewPid } = router?.query;
  const pid = reviewPid ? reviewPid : parseForPid(workId);
  const user = useUser();

  const infomediaIds = useData(
    user.isAuthenticated && pid && infomediaIdFromPid({ pid: pid })
  )
    ?.data?.manifestation?.access?.map((obj) => obj.id)
    .filter((id) => id);

  if (infomediaIds?.length === 1) {
    router?.replace(`${router?.asPath}/${infomediaIds?.[0]}`);
  }
  return <Custom />;
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
