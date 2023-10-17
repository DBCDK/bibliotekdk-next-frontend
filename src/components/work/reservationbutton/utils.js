// Translate Context
export const context = { context: "overview" };
import { MaterialTypeEnum } from "@/lib/enums_MaterialTypes";
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

export function isOnlineTranslator(materialTypeArray) {
  const overrideWithIsOnline =
    materialTypeArray?.filter((specificMaterialType) =>
      [MaterialTypeEnum.EBOG, MaterialTypeEnum["LYDBOG (NET)"]].includes(
        specificMaterialType
      )
    ).length > 0;

  return overrideWithIsOnline
    ? Translate({
        context: "workTypeDistinctForm",
        label: "isOnline",
      })
    : "";
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
 * @param {Object} user
 * @returns
 */
export function handleGoToLogin(modal, access, user) {
  // if this is an infomedia article it should open in same window
  const urlTarget = access[0]?.id ? "_self" : "_blank";

  // check if we should open login modal on click
  const goToLogin =
    !user?.isAuthenticated &&
    access[0]?.loginRequired &&
    isEbookCentralOrEbscohost(access?.[0]?.url);

  return goToLogin
    ? openLoginModal({ modal }) //TODO should we give url as param to redirect to ebookcentral or ebscohost?
    : goToRedirectUrl(access[0]?.url, urlTarget);
}

/**
 * @TODO rework with JED 1.1 material type general
 * @param {string} workType: general materialType
 * @param {string} materialType: specific material type
 * @param {boolean} shortText: If material text is shortened or not
 * @returns
 */
export const constructButtonText = (workType, materialType, shortText) => {
  const CONTEXT = "overview";

  /**
   * @param {string} workType
   * @param {string} materialType
   * @returns {string} translated material action (read, listen, watch)
   */
  const getActionText = (workType, materialType) => {
    switch (workType) {
      case "literature": {
        switch (materialType) {
          case "e-bog":
            return Translate({
              context: CONTEXT,
              label: "material-action-read",
            });
          case "podcast":
            return Translate({
              context: CONTEXT,
              label: "material-action-listen",
            });
          case "lydbog (online)":
            return Translate({
              context: CONTEXT,
              label: "material-action-listen",
            });
          default:
            return "Error";
        }
      }
      case "article":
        return Translate({
          context: CONTEXT,
          label: "material-action-read",
        });
      case "music":
        return Translate({
          context: CONTEXT,
          label: "material-action-listen",
        });
      case "movie":
      case "sheetmusic":
        return Translate({ context: CONTEXT, label: "material-action-see" });
      case "game":
        return Translate({
          context: CONTEXT,
          label: "material-action-play",
        });
      default:
        return "Error";
    }
  };

  /**
   * @param {string} workType
   * @param {string} materialTypeSpecific
   * @returns {string} translated material (book, movie, audiobook)
   */
  const getMaterialText = (workType, materialType) => {
    if (workType === "literature") {
      switch (materialType) {
        case "e-bog":
          return Translate({
            context: "overview",
            label: "material-typename-ebook",
          }).toLowerCase();
        case "podcast":
          return Translate({
            context: "overview",
            label: "material-typename-podcast",
          }).toLowerCase();
        case "lydbog (online)":
          return Translate({
            context: "overview",
            label: "material-typename-audiobook",
          }).toLowerCase();
      }
    }

    return Translate({
      context: "overview",
      label: `material-typename-${workType}`,
    }).toLowerCase();
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
