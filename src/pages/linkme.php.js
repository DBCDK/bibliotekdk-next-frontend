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
import {
  pidToWorkId,
  oclcToWorkId,
  faustToWork,
} from "@/lib/api/work.fragments";
import {
  encodeTitleCreator,
  getCanonicalWorkUrl,
  parseLinkmeQuery,
} from "@/lib/utils";
import { useData } from "@/lib/api/api";
import Custom404 from "@/pages/404";
import { isbnFromQuery } from "@/lib/utils";
import { getAdvancedUrl } from "@/components/search/advancedSearch/utils";

/**
 * check if query is ok - for now we only check on rec.id.
 * TODO check on cql also - what kind of cql is supported by complex search
 * @param query
 * @returns {boolean}
 */
export function checkQuery(query) {
  return !!query["rec.id"];
}

/**
 * Strip query parameter to get id from worldcat.org
 * ccl is of the form: wcx=1317822460
 * @param ccl
 * @returns {string}
 */
function getOclcId(ccl) {
  if (!ccl) {
    return null;
  }
  if (ccl.startsWith("wcx=")) {
    return ccl.replace("wcx=", "");
  }
  return null;
}

function LinkmePhp() {
  const router = useRouter();
  const isOclc = router?.query?.["ref"] === "worldcat";

  // handle rec.id, faust, oclc
  const { data, isLoading } = useData(
    router?.query?.["rec.id"]
      ? pidToWorkId({ pid: router.query["rec.id"] })
      : isOclc
      ? oclcToWorkId({ oclc: getOclcId(router.query["ccl"]) })
      : router?.query?.["faust"]
      ? faustToWork({ faust: router.query["faust"] })
      : null
  );

  // check if data fetching is done
  if (isLoading) {
    return <div>Redirecting ... </div>;
  }

  // client side - no data .. no error .. -> not found
  if (!data || data?.error) {
    return <Custom404 />;
  }

  // we have ccl and recognize it as something we can handle :)
  // make a path to redirect to
  const workId = data?.work?.workId;
  const title = data?.work?.titles?.main?.[0];
  const creators = data?.work?.creators;
  const pathname = getCanonicalWorkUrl({ title, creators, id: workId });

  // do we scroll to edition ? - this one is for loans on profile page where we do NOT want
  // to scroll to specific edition - see @components/profile/utils.js::getWorkUrlForProfile
  const scrollToEdition =
    router?.query?.["scrollToEdition"] === "true" || false;
  // if all is well - redirect to work page
  if (workId && data?.work) {
    const routerPath = {
      pathname: pathname,
      ...(scrollToEdition && { hash: router.query["rec.id"] }),
    };
    router.replace(routerPath);
  } else {
    // something is wrong - we did not find title/author - goto  404 (not found) page
    // check if clientside
    return <Custom404 />;
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
  // this is the old linkme page - queries comes in the form linkme.php? ...
  // the new linkme page handles a given set of parameters in query - we need to preparse
  // the old queries and pass them to the new linkme page
  // throw "fisk";

  const newQuery = parseLinkmeQuery(ctx.query);

  ctx.res.writeHead(301, { location: "/linkme", query: newQuery });
  ctx.res.end();
  return;

  // const pid = ctx.query["rec.id"];
  // // @TODO add some server queries (and variables) ?? oclcToWorkId, faustToWork
  // const serverQueries = await fetchAll([pidToWorkId], ctx, {
  //   pid: pid,
  // });
  //
  // const workId = Object.values(serverQueries.initialData)?.[0]?.data?.work
  //   ?.workId;
  //
  // const title = Object.values(serverQueries.initialData)?.[0]?.data?.work
  //   ?.titles?.main?.[0];
  //
  // const creators = Object.values(serverQueries.initialData)?.[0]?.data?.work
  //   ?.creators;
  //
  // const title_author = encodeTitleCreator(title, creators);
  //
  // console.log(serverQueries.initialData, "SERVERQUERIS");
  //
  // // redirect serverside
  // // if this is a bot title and author and workid has been fetched - redirect
  // // to appropiate page. We use 301 (moved permanently) status code
  // if (title_author && workId && ctx.res) {
  //   const path = `/materiale/${title_author}/${workId}#${ctx.query["rec.id"]}`;
  //   ctx.res.writeHead(301, { Location: path });
  //   ctx.res.end();
  //   return;
  // } else {
  //   // we do some redirects here - check for cql, ccl, ccl=is (isbn), worldcat links and handle some of it - if
  //   // we give up we redirect to old.bibliotek.dk
  //   const hasCql = !!ctx.query["cql"];
  //   const hasCcl = !!ctx.query["ccl"];
  //   const isOclc = ctx.query["ref"] === "worldcat";
  //   const isIsbn = ctx.query["ccl"]?.includes("is=");
  //
  //   if (isIsbn) {
  //     const isbnnumber = isbnFromQuery(ctx.query["ccl"]);
  //     if (isbnnumber) {
  //       const path = getAdvancedUrl({ type: "isbn", value: isbnnumber });
  //       ctx.res.writeHead(301, { Location: path });
  //       ctx.res.end();
  //       return;
  //     }
  //   }
  //
  //   const basePath = "https://old.bibliotek.dk/";
  //   if (!isOclc && (hasCql || hasCcl)) {
  //     // we have no data - if ccl or cql is given we throw it back at old.bibliotek
  //     const path = `${basePath}${ctx.req["url"]}`;
  //     ctx.res.writeHead(301, { Location: path });
  //     ctx.res.end();
  //     return;
  //   }
  // }
  //
  // return serverQueries;
};
