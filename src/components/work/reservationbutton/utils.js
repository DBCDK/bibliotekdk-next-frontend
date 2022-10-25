// Translate Context
export const context = { context: "overview" };

/**
 * Example:
 *
 * getBaseUrl("https://fjernleje.filmstriben.dk/some-movie");
 * yields: "fjernleje.filmstriben.dk"
 *
 * @param {string} url
 * @returns {string}
 */
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";

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
 * Check if work can be ordered - run through given manifestations - if one
 * is reservable -> return true, if not return false
 *
 * @param manifestations
 * @return {boolean}
 */
export function checkRequestButtonIsTrue({ manifestations }) {
  // pjo 14/6 - bug 1020 - sort out some materialtypes - would be better to do
  // somewhere else
  const notReservable = ["Biograffilm", "Udstilling", "Teateropførelse"];
  return !!manifestations?.find(
    (manifestation) =>
      manifestation?.admin?.requestButton &&
      !notReservable.includes(manifestation?.materialType)
  );
}

/**
 * Check if order of digital copy is an option - if one af the manifestions in work
 * has an issn (International Standard Serial Number) return true, if not return false
 * @param manifestations
 * @return {boolean}
 */
export function checkDigitalCopy({ manifestations }) {
  return !!manifestations?.find((manifestation) =>
    manifestation?.onlineAccess?.find((access) => access?.issn)
  );
}

/**
 * Select the manifestations that match the chosen type
 * @param {Array<Object>} manifestations
 * @param {String} type
 * @returns {Array<Object>}
 */
export function selectMaterialBasedOnType(manifestations, type) {
  function flattenWord(word) {
    return word?.toLowerCase().replace(/[^0-9a-z]/gi, "");
  }

  return manifestations?.filter((manifestation) => {
    return manifestation.materialTypes.find(
      (materialType) => flattenWord(materialType.specific) === flattenWord(type)
    );
  });
}

/**
 * infomedia url is specific for this gui - set an url on the online access object
 * @param onlineAccess
 * @param title
 * @return {*}
 */
export function addToInfomedia_TempUsingAlfaApi(onlineAccess, title) {
  return onlineAccess?.map((access) => {
    if (access.infomediaId) {
      access.url = infomediaUrl(
        encodeTitleCreator(title),
        `work-of:${access.pid}`,
        access.infomediaId
      );
      access.accessType = "infomedia";
    }
    return access;
  });
}

/**
 * Find and return the manifestation we want on the reservation button.
 * If manifestation has an online url it is the preferred - for easy access
 * @param manifestations
 * @return {*}
 */
export function selectMaterial(manifestations) {
  // check if onlineacces. if so get the first manifestation with an online url - if any
  let selectedManifestation;
  let url;
  manifestations?.every((manifest) => {
    // outer loop -> manifestations
    if (manifest.access?.length > 0) {
      // inner loop -> onlineaccess
      manifest.access.every((access) => {
        // special case: "dfi.dk" is not a 'real' onlineaccess
        if (access.url && access.url.indexOf("dfi.dk") === -1) {
          url = access.url;
          // we found an online access -> break inner loop
          return false;
        }
        // continue inner loop
        return true;
      });
      if (url) {
        // outer loop -> check if url has been set - if so
        // this is the manifestation we are looking for
        selectedManifestation = manifest;
        // break outer loop
        return false;
      }
    }
    // continue outer loop
    return true;
  });
  // if a manifestion with an url has been found it will be returned - if not
  // return the first manifestation in array
  return selectedManifestation || manifestations?.[0];
}

/**
 * Find and return the manifestation we want on the reservation button.
 * If manifestation has an online url it is the preferred - for easy access
 * @param manifestations
 * @return {*}
 */
export function selectMaterial_TempUsingAlfaApi(manifestations) {
  // check if onlineacces. if so get the first manifestation with an online url - if any
  let selectedManifestation;
  let url;
  manifestations?.every((manifest) => {
    // outer loop -> manifestations
    if (manifest.onlineAccess?.length > 0) {
      // inner loop -> onlineaccess
      manifest.onlineAccess.every((access) => {
        // special case: "dfi.dk" is not a 'real' onlineaccess
        if (access.url && access.url.indexOf("dfi.dk") === -1) {
          url = access.url;
          // we found an online access -> break inner loop
          return false;
        }
        // continue inner loop
        return true;
      });
      if (url) {
        // outer loop -> check if url has been set - if so
        // this is the manifestation we are looking for
        selectedManifestation = manifest;
        // break outer loop
        return false;
      }
    }
    // continue outer loop
    return true;
  });
  // if a manifestion with an url has been found it will be returned - if not
  // return the first manifestation in array
  return selectedManifestation || manifestations?.[0];
}
