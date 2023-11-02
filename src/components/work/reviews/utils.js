import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import { encodeString } from "@/lib/utils";
import { dateToShortDate, numericToISO } from "@/utils/datetimeConverter";
import {
  getWorkUrl,
  getMaterialReviewUrl,
  getInfomediaReviewUrl,
} from "@/lib/utils";

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
 * Selecting the correct review template
 *
 * @param review
 *
 * @returns string
 */

export function getReviewType(data) {
  if (data.review?.reviewByLibrarians?.length > 0) {
    return "isMaterialReview";
  }
  if (data.access?.find((a) => a.__typename === "InfomediaService")) {
    return "isInfomediaReview";
  }
  return "isExternalReview";
}

/**
 *
 * @param {Object} data
 * @returns {string}
 */
export function getPublisher(data) {
  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";
  const isExternalReview = isType === "isExternalReview";

  if (isMaterialReview) {
    return Translate({ context: "general", label: "lecturerStatement" });
  }

  if (isExternalReview) {
    return (
      data.hostPublication?.title ||
      data.access?.find(({ __typename }) => __typename === "AccessUrl")?.origin
    );
  }

  return data.hostPublication?.title;
}

/**
 *
 * @param {Object} data
 * @returns {string}
 */
export function getDate(data) {
  const date =
    data.hostPublication?.issue ||
    (data.recordCreationDate && numericToISO(data.recordCreationDate));

  if (date === "1970-01-01") {
    return data.edition?.publicationYear?.display || null;
  }

  return dateToShortDate(date, "d. ");
}

/**
 *
 * @param {Object} data
 * @returns {string}
 */
export function getContent(data) {
  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";

  if (isMaterialReview) {
    return data.review?.reviewByLibrarians
      ?.map((p) => p)
      .filter(
        (p) =>
          !p.content?.startsWith("Materialevurdering") &&
          !p.content?.startsWith("Indscannet version")
      );
  }

  if (data.abstract) {
    // Remove abstracts containing only a rating "Vurdering:"
    const filtered = data.abstract.filter(
      (abs) => !abs.startsWith("Vurdering:")
    );
    return filtered;
  }

  return [];
}

/**
 *
 * @param {Object} data
 * @returns {string}
 */
export function getUrls(data, work) {
  const { workId, titles } = work;
  const title = titles?.main?.[0];
  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";
  const isInfomediaReview = isType === "isInfomediaReview";

  const urlTxt = title && encodeString(title);

  if (isMaterialReview) {
    return data.pid && [getMaterialReviewUrl(urlTxt, workId, data.pid)];
  }

  if (isInfomediaReview) {
    const infomediaAccess = data.access?.find((a) => a.id);
    return (
      infomediaAccess.id && [
        getInfomediaReviewUrl(urlTxt, workId, infomediaAccess.id),
      ]
    );
  }

  return data.access
    .filter((d) => d.__typename === "AccessUrl" && d.url !== "")
    .map((a) => a.url);
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
  }

  // add tailing dot space after each paragraph
  chunks.push(". ");

  return chunks;
}

/**
 * Check if a paragraph holds a link to another work - if so parse as link
 * if not return a period (.)
 * @param work
 * @returns {React.ReactElement|string}
 */
function lectorLink({ work, key }) {
  if (!work) {
    return ". ";
  }

  const creators = work?.creators || [];
  const title = work?.titles?.main?.[0] || "";

  const path = getWorkUrl(title, creators, work?.workId);
  return (
    <Link key={key} href={path} border={{ bottom: { keepVisible: true } }}>
      {work?.titles?.main}
    </Link>
  );
}
