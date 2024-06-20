/**
 * @page - linkme
 * handle permalinks - grap query and redirect
 *
 * REDIRECTS TO ADVANCED SEARCH
 * Forfatter (fo=)
 * Titel (ti=)
 * Emne (em=)
 * Fritekst (tekst=)
 *
 * REDIRECTS TO WORKPAGE
 * Work ID (work.id=)
 * Record ID (rec.id=) (hvor rec.id svarer til rec.id + scrollToEdition=true i bibliotek.dk)
 * Isbn (isbn=)
 * Faust (faust=)
 *
 */
import { fetchAll } from "@/lib/api/apiServerOnly";
import {
  faustToWork,
  oclcToWorkId,
  pidToWorkId,
} from "@/lib/api/work.fragments";
import {
  encodeTitleCreator,
  isbnFromQuery,
  oclcFromQuery,
  parseLinkmeQuery,
} from "@/lib/utils";
import Custom404 from "@/pages/404";
import {
  fieldsToAdvancedUrl,
  getAdvancedUrl,
} from "@/components/search/advancedSearch/utils";

function Linkme() {
  return <Custom404 />;
}

export default Linkme;

// we focus on serverside redirects - if redirect fails we fallback to 404
Linkme.getInitialProps = async (ctx) => {
  const pid = ctx.query["rec.id"];
  const oclc = oclcFromQuery(ctx.query["ccl"]);
  const faust = ctx.query["faust"] || null;

  /************ START works *******************/
  // pid, faust and oclc can be changed for a work
  const serverQueries = await fetchAll(
    [pidToWorkId, faustToWork, oclcToWorkId],
    ctx,
    {
      pid: pid,
      oclc: oclc,
      faust: faust,
    },
    true
  );
  // make a path to redirect to
  const workId = Object.values(serverQueries.initialData)?.[0]?.data?.work
    ?.workId;
  const title = Object.values(serverQueries.initialData)?.[0]?.data?.work
    ?.titles?.main?.[0];
  const creators = Object.values(serverQueries.initialData)?.[0]?.data?.work
    ?.creators;

  const title_author = encodeTitleCreator(title, creators);
  if (title_author && workId && ctx.res) {
    let path;
    if (ctx.query["rec.id"]) {
      path = `/materiale/${title_author}/${workId}#${ctx.query["rec.id"]}`;
    } else {
      path = `/materiale/${title_author}/${workId}`;
    }
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
    return;
  }

  /**************** END WORKS ****************/

  // ISBN is a search
  const isbn = isbnFromQuery(ctx.query["ccl"]) || ctx.query["isbn"];
  if (isbn) {
    const path = getAdvancedUrl({ type: "isbn", value: isbn });
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
    return;
  }

  // @TODO handle all the rest :) fo, ti, em, tekst - links from faktalink and forfatterweb are already formatted
  // if we get to here (no rec.id .. no isbn .. no faust .. no oclc) the rest is just parameters - luckily we know exactly
  // what we recieve from faktalink and for fatterweb :) (hopefully)
  const queryFields = parseLinkmeQuery(ctx.query);
  if (queryFields?.length > 0) {
    const path = fieldsToAdvancedUrl({ inputFields: queryFields });
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
    return;
  }

  // no redirects - give up - Linkme component shows 404 not found
  return serverQueries.initialData;
};
