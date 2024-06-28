/**
 * @file linkme.php.js - handle permalink from the old bibliotek.dk. Permalinks come in the forms:
 *
 *  linkme.php?rec.id=[pid]
 *  linkme.php?ref=worldcat&ccl=[ccl]
 *  linkme.php?ccl=[ccl]
 *  linkme.php?cql=[cql]
 *
 *  we now have a page with a defined api @see linkme.js .. so we convert
 *  given query to a query applicable to the api :) and redirect to linkme page
 *
 *
 */

import { parseLinkme } from "@/lib/utils";
import Custom404 from "@/pages/404";

/**
 * check if query is ok - for now we only check on rec.id.
 * TODO check on cql also - what kind of cql is supported by complex search
 * @param query
 * @returns {boolean}
 */
export function checkQuery(query) {
  return !!query["rec.id"];
}

function LinkmePhp() {
  return <Custom404 />;
}

export default LinkmePhp;

LinkmePhp.getInitialProps = async (ctx) => {
  // pids
  const pid = ctx.query["rec.id"];
  if (pid) {
    const path = `/linkme?rec.id=${pid}`;
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
    return;
  }
  // oclc - we check the ref param and pass ccl if verified
  // there are a lot of oclc numbers that does NOT find a work
  // you can get a list from ha-proxy in kibana - look for linkme.php :)
  const isOclc = ctx.query["ref"] === "worldcat";
  if (isOclc) {
    const path = `/linkme?ccl=${ctx.query["ccl"]}`;
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
    return;
  }

  // the rest are searches defined by either ccl OR cql
  const queryToParse = ctx.query["ccl"] || ctx.query["cql"] || null;
  const path = parseLinkme(queryToParse);

  if (path) {
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
    return;
  }

  // we give up - @TODO should we keep linkme.php url ?? and show 404 .. OR go to linkme page to show 404 ???

  return {};
};
