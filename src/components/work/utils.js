import Translate from "@/components/base/translate";
import { uniq } from "lodash";
import { uniqueEntries } from "@/lib/utils";
import Router from "next/router";

export function openLocalizationsModal(modal, pids, workId, materialType) {
  modal.push("localizations", {
    title: Translate({ context: "modal", label: "title-order" }),
    pids: pids,
    workId: workId,
    materialType: materialType,
  });
}

export function openOrderModal(
  modal,
  workId,
  singleManifestation,
  manifestation
) {
  modal.push("order", {
    title: Translate({ context: "modal", label: "title-order" }),
    pid: manifestation.pid,
    workId: workId,
    type: manifestation.materialTypes.specific,
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
    window.open(parsedUrl, target);
  } catch (_) {
    Router.push(url);
  }
}

/**
 * Generates the work page description
 * @param {object} work The work
 * @returns {string}
 */
export function getPageDescription({ title, creators, materialTypes }) {
  const creator = creators?.[0]?.display;
  const allowedTypes = ["lydbog", "ebog", "bog"];
  const types = uniq(
    materialTypes
      .map((entry) => {
        for (let i = 0; i < allowedTypes?.length; i++) {
          if (entry?.toLowerCase().includes(allowedTypes?.[i])) {
            return allowedTypes?.[i];
          }
        }
      })
      .filter((type) => !!type)
  );

  let typesString = "";
  types.forEach((type, idx) => {
    if (idx > 0) {
      if (idx === types.length - 1) {
        // last element
        typesString += " eller ";
      } else {
        // middle element
        typesString += ", ";
      }
    } else {
      // first element
      typesString = " som ";
    }
    typesString += type;
  });

  return `Lån ${title}${
    creator ? ` af ${creator}` : ""
  }${typesString}. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.`;
}

/**
 * Get materialtypes from given manifestations.
 * @param manifestations
 * @returns {*}
 */
function getMaterialTypes(manifestations) {
  return uniqueEntries(
    manifestations?.flatMap((manifestation) => {
      return manifestation.materialTypes?.map((materialType) => {
        return materialType.specific;
      });
    })
  );
}

/**
 * Get title and description for search engines.
 * @param work
 * @returns {{description: string, title: string}}
 */
export function getSeo(work) {
  const materialTypes = getMaterialTypes(work?.manifestations?.all);
  //return materialTypes;
  // Return title and description
  return {
    title: `${work?.titles?.main[0]}${
      work?.creators && work?.creators[0]
        ? ` af ${work?.creators[0].display}`
        : ""
    }`,
    description: getPageDescription({
      title: work?.titles?.main[0],
      creators: work?.creators,
      materialTypes,
    }),
  };
}
