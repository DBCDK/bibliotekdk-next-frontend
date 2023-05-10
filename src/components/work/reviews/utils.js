import { encodeTitleCreator } from "@/lib/utils";
import Link from "@/components/base/link";

/**
 * Sort reviews by
 * 1. ReviewMatVurd
 * 2. review with an url - direct access
 * 3. reviews with stars (judgment)
 * 4. others
 */
export function sortReviews(a, b) {
  return (
    !!b.review?.reviewByLibrarians?.length -
      !!a.review?.reviewByLibrarians?.length ||
    Number(!!b.access?.find((a) => a.url)) -
      Number(!!a.access?.find((a) => a.url)) ||
    Number(!!b.access?.find((a) => a.id)) -
      Number(!!a.access?.find((a) => a.id)) ||
    Number(!!b.review?.rating) - Number(!!a.review?.rating) ||
    0
  );
}

/**
 * replaces reference in content with a link to the manifestation
 * removes the \\ markup from the content where a title reference is missing from the manifestation list.
 */
export function contentParser({ content, manifestations }) {
  const chunks = [];

  if (manifestations?.length === 0) {
    chunks.push(content?.replaceAll("\\", ""));
  } else {
    manifestations
      ?.filter((manifestation) => !!manifestation)
      .forEach(({ ownerWork: work }, idx) => {
        const arr = content.split(work?.titles?.main);
        arr.forEach((chunk) => chunks.push(chunk));
        chunks.splice(idx + 1, 0, lectorLink({ work, key: `link-${idx}` }));
      });
    /** the regexp is not supported by javascript - (lookbehind) - simply replace \ ... **/
    // No manifestation references was found, search and replace \\ notations with "" in paragraph content
    /*else {
    const regex = /(?<=\\)(.*?)(?=\\)/g;
    const match = content?.match(regex);
    const trimmed = content?.replace(`\\${match}\\`, `"${match}"`);
    chunks.push(trimmed);
  }*/
  }

  // add tailing dot space after each paragraph
  chunks.push(". ");

  return chunks;
}

/**
 * Check if a paragraph holds a link to another work - if so parse as link
 * if not return a period (.)
 * @param work
 * @return {JSX.Element|string}
 */
function lectorLink({ work, key }) {
  if (!work) {
    return ". ";
  }

  // @TODO there may be more than one creator - for now simply grab the first
  // @TODO if more should be handled it should be done here: src/lib/utils::encodeTitleCreator
  const creator = work?.creators[0]?.display || "";
  const title = work?.titles?.main?.[0] || "";
  const title_crator = encodeTitleCreator(title, creator);

  const path = `/materiale/${title_crator}/${work?.workId}`;
  return (
    <Link key={key} href={path}>
      {work?.titles?.main}
    </Link>
  );
}
