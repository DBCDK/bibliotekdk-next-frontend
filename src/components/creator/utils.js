/**
 * @file Shared creator helpers.
 */

import Translate from "@/components/base/translate";

/**
 * Resolve the portrait to show for a creator (a CreatorInfo object).
 * Uses the editorial image if available, otherwise the forfatterweb image.
 *
 * @param {Object} creator - CreatorInfo (from creatorByDisplay or search creatorHit)
 * @returns {{src: string, alt: string, credits: string|undefined}|null}
 */
export function getCreatorPortrait(creator) {
  const editorialImage = creator?.editorialData?.image;

  if (editorialImage?.medium) {
    return {
      src: editorialImage.medium,
      alt: editorialImage.alt || creator?.display,
      credits: editorialImage.credits,
    };
  }

  const forfatterwebUrl =
    creator?.forfatterweb?.image?.medium?.url ||
    creator?.forfatterweb?.image?.large?.url;

  if (forfatterwebUrl) {
    return {
      src: forfatterwebUrl,
      alt: creator?.display,
      credits: Translate({ context: "creator", label: "forfatterweb" }),
    };
  }

  return null;
}
