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
 *
 * @param {string} generalMaterialType
 * @param {string} specificdMaterialType
 * @param {boolean} shortText
 * @returns {string} label for translations
 */
export const buttonTextLabelMaker = (
  generalMaterialType,
  specificdMaterialType,
  shortText = false
) => {
  const getActionLabel = () => {
    switch (generalMaterialType) {
      case "literature": {
        switch (specificdMaterialType) {
          case "e-bog":
            return "material-action-read";
          case "podcast":
            return "material-action-listen";
          case "lydbog (online)":
            return "material-action-listen";
          default:
            return "Error";
        }
      }
      case "article":
        return "material-action-read";
      case "music":
        return "material-action-listen";
      case "movie":
      case "sheetmusic":
        return "material-action-see";
      case "game":
        return "material-action-play";
      default:
        return "Error";
    }
  };

  const getMaterialLabel = () => {
    if (shortText) return "material-direction-here";

    if (generalMaterialType === "literature") {
      switch (specificdMaterialType) {
        case "e-bog":
          return "material-typename-ebook";
        case "podcast":
          return "material-typename-podcast";
        case "lydbog (online)":
          "material-typename-audiobook";
        /**
         * TODO more lydbog
         */
        default:
          return "Error";
      }
    }
    return `material-typename-${specificdMaterialType}`;
  };

  return [getActionLabel(), getMaterialLabel()];
};

/**
 * @param {string} materialType: general materialType
 * @param {string} selectedMaterialType: specific material type
 * @param {boolean} shortText: If material text is shortened or not
 * @returns
 */
export const constructButtonText = (
  materialType,
  selectedMaterialType,
  shortText
) => {
  const CONTEXT = "overview";

  /**
   * @param {string} materialType
   * @param {string} selectedMaterialType
   * @returns {string} translated material action (read, listen, watch)
   */
  const getActionText = (materialType, selectedMaterialType) => {
    switch (materialType) {
      case "literature": {
        switch (selectedMaterialType) {
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
   * @param {string} materialType
   * @param {string} selectedMaterialType
   * @returns {string} translated material (book, movie, audiobook)
   */
  const getMaterialText = (materialType, selectedMaterialType) => {
    if (materialType === "literature") {
      switch (selectedMaterialType) {
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
        /**
         * TODO more lydbog
         */
      }
    }

    return Translate({
      context: "overview",
      label: `material-typename-${materialType}`,
    }).toLowerCase();
  };

  // Construct string
  const actionText = getActionText(materialType, selectedMaterialType);
  const materialText = shortText
    ? Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase()
    : getMaterialText(materialType, selectedMaterialType);
  return actionText + " " + materialText;
};
