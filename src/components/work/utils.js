import Translate from "@/components/base/translate";
import Router from "next/router";
import { manifestationMaterialTypeUtils } from "@/lib/manifestationFactoryFunctions";

export function openLocalizationsModal(modal, pids, workId, materialType) {
  modal.push("localizations", {
    title: Translate({ context: "modal", label: "title-order" }),
    pids: pids,
    workId: workId,
    materialType: materialType,
  });
}

export function openOrderModal(modal, pid, workId, singleManifestation) {
  modal.push("order", {
    title: Translate({ context: "modal", label: "title-order" }),
    pid: pid,
    workId: workId,
    ...(singleManifestation && { orderType: "singleManifestation" }),
  });
}

export function openReferencesModal(modal, pids, workId, work, manifestation) {
  modal.push("references", {
    title: Translate({
      context: "references",
      label: "label_references_title",
    }),
    pids: pids,
    workId: workId,
    manifestation: manifestation,
  });
}

export function onOnlineAccess(url, target = "_blank") {
  try {
    const parsedUrl = new URL(url);
    window.open(parsedUrl.href, target);
  } catch (_) {
    Router.push(url);
  }
}

/**
 * Generates the work page description
 * @param {object} work The work
 * @returns {string}
 */
function getPageDescription(work) {
  const title = work?.titles?.main[0];
  const creator = work?.creators?.[0]?.display;

  const { uniqueMaterialTypes: materialTypes, inUniqueMaterialTypes } =
    manifestationMaterialTypeUtils(work?.manifestations?.all);

  // We check for "bog", "ebog", "lydbog ..."-something, and combined material (= "sammensat materiale")
  let types = [];

  inUniqueMaterialTypes(["bog"]) && types.push("bog");
  inUniqueMaterialTypes(["ebog"]) && types.push("ebog");
  materialTypes
    ?.filter((matArray) => matArray.length === 1)
    .filter((matArray) => matArray?.[0].startsWith("lydbog")) &&
    types.push("lydbog");
  materialTypes?.filter((matArray) => matArray.length > 1).length > 1 &&
    types.push("sammensat materiale");

  const typesString =
    "som " + types.slice(0, -1).join(", ") + " eller " + types.slice(-1);

  return `Lån ${title}${
    creator && ` af ${creator}`
  } ${typesString}. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.`;
}

/**
 * Get title and description for search engines.
 * @param work
 * @returns {{description: string, title: string}}
 */
export function getSeo(work) {
  // Return title and description
  return {
    title: `${work?.titles?.main[0]}${
      work?.creators && work?.creators[0]
        ? ` af ${work?.creators[0].display}`
        : ""
    }`,
    description: getPageDescription(work),
  };
}
