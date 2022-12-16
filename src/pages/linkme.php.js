/**
 * @file - handle permalink from the old bibliotek.dk. Permalinks come in the forms:
 *  rec.id=[pid]
 *  ccl=[ccl]
 *  cql=[cql]
 *  ref=worldcat&ccl=[ccl]
 *
 *  for now handle rec.id only - ccl & cql are searches - .. TODO - should we
 *  handle searches ?? - some cql should be handled by complex search - check it out
 */
import { fetchAll } from "@/lib/api/apiServerOnly";
import { useRouter } from "next/router";
import { pidToWorkId } from "@/lib/api/work.fragments";
import { encodeTitleCreator } from "@/lib/utils";
import { useData } from "@/lib/api/api";

function LinkmePhp() {
  const router = useRouter();
  const { data, isLoading, error } = useData(
    pidToWorkId({ pid: router.query["rec.id"] })
  );
  // check if data fetching is done
  if (isLoading) {
    return <div>Rediricting ... </div>;
  }
  if (error) {
    // TODO - something on error
    throw "ERROR";
  }

  // make a path to redirect to
  const workId = data?.work?.workId;
  const title = data?.work?.titles?.main?.[0];
  const creator = data?.work?.creators?.[0]?.display;
  const title_author = encodeTitleCreator(title, creator);
  const pathname = `/materiale/${title_author}/${workId}`;

  // if all is well - redirect to work page
  if (title_author && workId && data?.work) {
    router.push(pathname);
  } else {
    // something is  wrong - goto  404 (not found) page
    router?.push("/404");
  }
}

export default LinkmePhp;

/**
 * NOTE:
 *  link to material page
 *  query: {
 *           title_author: encodeTitleCreator(
 *             work?.titles?.main?.[0],
 *             work?.creators?.[0]?.display
 *           ),
 *           workId: work?.workId,
 *         }
 *
 */
LinkmePhp.getInitialProps = async (ctx) => {
  const pid = ctx.query["rec.id"];
  const serverQueries = await fetchAll([pidToWorkId], ctx, {
    pid: pid,
  });

  const workId = Object.values(serverQueries.initialData)?.[0]?.data?.work
    ?.workId;

  const title = Object.values(serverQueries.initialData)?.[0]?.data?.work
    ?.titles?.main?.[0];

  const creator = Object.values(serverQueries.initialData)?.[0]?.data?.work
    ?.creators?.[0]?.display;

  const title_author = encodeTitleCreator(title, creator);
  // redirect serverside
  // if this is a bot title and author and workid has been fetched - redirect
  // to appropiate page. We use 301 (moved permanently) status code
  if (title_author && workId && ctx.res) {
    const path = `/materiale/${title_author}/${workId}`;
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
  }

  return serverQueries;
};
