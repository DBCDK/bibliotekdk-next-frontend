// Translate Context
export const context = { context: "overview" };
import { goToRedirectUrl } from "@/components/work/utils";
import Translate, { hasTranslation } from "@/components/base/translate";
import { openLoginModal } from "@/components/_modal/pages/login/utils";

/**
 * Example:
 *
 * getBaseUrl("https://fjernleje.filmstriben.dk/some-movie");
 * yields: "fjernleje.filmstriben.dk"
 *
 * @param {string} url
 * @returns {string}
 */
export function getBaseUrl(url) {
  if (!url) {
    return "";
  }
  const match = url.match(/(http|https):\/\/(www\.)?(.*?\..*?)(\/|\?|$)/i);
  if (match) {
    return match[3];
  }
  return url;
}

/**
 * check if url is ebookcentral or ebscohost
 * @param {string} url
 * @returns
 */
export function isEbookCentralOrEbscohost(url) {
  return url && (url.includes("ebookcentral") || url.includes("ebscohost"));
}

export function workTypeTranslator(workTypes) {
  const workType = workTypes?.[0] || "fallback";
  return hasTranslation({
    context: "workTypeDistinctForm",
    label: workType.toLowerCase(),
  })
    ? Translate({
        context: "workTypeDistinctForm",
        label: workType.toLowerCase(),
      })
    : Translate({
        context: "workTypeDistinctForm",
        label: "fallback",
      });
}

/**
 * Open login modal if user is not authenticated and material is neither ebescost or ebookcentral and material requires login
 * otherwise open redirect url in new tab
 * @param {Object} modal
 * @param {Object} access
 * @param {Object} isAuthenticated
 * @returns
 */
export function handleGoToLogin(modal, access, isAuthenticated, type) {
  const a0 = access?.[0];
  if (!a0) return;

  // Publizon always requires login
  const isPublizon = a0.__typename === "Publizon";

  // Infomedia articles (have an id) should open in the same window/tab
  const urlTarget = a0.id ? "_self" : "_blank";

  // Add a CMS type query param for agencyUrl (only when relevant)
  const agencyUrl = a0.agencyUrl;
  const selector = agencyUrl?.includes("?") ? "&" : "?";
  const urlSuffix = type ? `${selector}type=${type}` : "";

  // Use agencyUrl for Publizon (with optional suffix), otherwise use the direct url
  const url = isPublizon
    ? agencyUrl
      ? agencyUrl + urlSuffix
      : undefined
    : a0.url;

  // Avoid pushing/opening an undefined URL
  if (!url) return;

  // Decide whether we should show the login modal instead of redirecting
  const goToLogin =
    (isPublizon && !isAuthenticated) ||
    (!isAuthenticated && a0.loginRequired && isEbookCentralOrEbscohost(url));

  return goToLogin
    ? openLoginModal({ modal }) // TODO: pass url to allow redirect after login?
    : goToRedirectUrl(url, urlTarget);
}

/**
 * @TODO rework with JED 1.1 material type general
 * @param {Array.<string>} workTypes : general materialType
 * @param {MaterialTypesArray} materialTypes : specific material type
 * @param {boolean} shortText : If material text is shortened or not
 * @returns
 */
export const constructButtonText = (
  workTypes,
  materialTypes,
  shortText = false
) => {
  const CONTEXT = "overview";

  // firstWorkType since we have no better option
  //   No better option because: The design and data cannot currently handle the complex
  //   situation in all cases. There can be more than one workType on a work, e.g.
  //   ["MOVIE","MUSIC"], where we could expect either "Listen here"/"Lyt her" or
  //   "See here"/"Se her", but in this case we would always use "See here",
  //   since "MOVIE" is first, but we can not necessarily expect that it
  //   should not be "Listen here".
  const workType = workTypes?.[0];

  // firstSubMaterialTypeCode since we have no better option
  //   No better option because: Same situation as with workTypes (e.g. ["EBOOKS", "AUDIO_BOOKS"])
  const materialType = materialTypes?.[0]?.generalCode;

  /**
   * @param {string} workType
   * @param {string} materialType
   * @returns {string} translated material action (read, listen, watch)
   */
  const getActionText = (workType, materialType) => {
    switch (workType) {
      case "ARTICLE":
        return Translate({
          context: CONTEXT,
          label: "material-action-read",
        });
      case "MUSIC":
        return Translate({
          context: CONTEXT,
          label: "material-action-listen",
        });
      case "MOVIE":
      case "SHEETMUSIC":
        return Translate({ context: CONTEXT, label: "material-action-see" });
      case "GAME":
        return Translate({
          context: CONTEXT,
          label: "material-action-play",
        });
      default: {
        switch (materialType) {
          case "BOOKS":
          case "EBOOKS":
            return Translate({
              context: CONTEXT,
              label: "material-action-read",
            });
          case "PODCASTS":
          case "AUDIO_BOOKS":
            return Translate({
              context: CONTEXT,
              label: "material-action-listen",
            });
        }
      }
    }

    const translation = {
      context: CONTEXT,
      label: `material-action-${workType}`,
    };

    return hasTranslation(translation)
      ? Translate(translation)
      : Translate({
          context: "overview",
          label: `material-action-go-to`,
        });
  };

  /**
   * @param {string} workType
   * @param {string} materialType
   * @returns {string} translated material (book, movie, audiobook)
   */
  const getMaterialText = (workType, materialType) => {
    switch (materialType) {
      case "BOOKS":
        return Translate({
          context: "overview",
          label: "material-typename-literature",
        }).toLowerCase();
      case "EBOOKS":
        return Translate({
          context: "overview",
          label: "material-typename-ebook",
        }).toLowerCase();
      case "PODCASTS":
        return Translate({
          context: "overview",
          label: "material-typename-podcast",
        }).toLowerCase();
      case "AUDIO_BOOKS":
        return Translate({
          context: "overview",
          label: "material-typename-audiobook",
        }).toLowerCase();
    }

    const translation = {
      context: "overview",
      label: `material-typename-${workType?.toLowerCase()}`,
    };

    return (
      hasTranslation(translation)
        ? Translate(translation)
        : Translate({
            context: "overview",
            label: `material-typename-default`,
          })
    ).toLowerCase();
  };

  // Construct string
  const actionText = getActionText(workType, materialType);
  const materialText = shortText
    ? Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase()
    : getMaterialText(workType, materialType);
  return actionText + " " + materialText;
};

/**
 * sorts a list of access so publizon comes first in the list.
 * @param {*} access list of access objects [{origin}]
 * @returns
 */
export const sortPublizonFirst = (access) => {
  return access?.sort((a, b) =>
    a?.__typename === "Publizon" ? -1 : b?.__typename === "Publizon" ? 1 : 0
  );
};
