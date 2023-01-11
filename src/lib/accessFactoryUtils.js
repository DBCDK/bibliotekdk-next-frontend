import { chain } from "lodash";
import { AccessEnum } from "@/lib/enums";
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";

/**
 * Returns accesses for a single manifestation
 * these accesses have additional manifestation details
 * used by {@link getAllAccess}
 * @param manifestation
 * @return {*}
 */
export function getAccessForSingleManifestation(manifestation) {
  return manifestation?.access?.map((singleAccess) => {
    return {
      ...singleAccess,
      ...(manifestation?.pid && { pid: manifestation?.pid }),
      ...(manifestation?.titles?.main?.length > 0 && {
        titles: manifestation?.titles?.main,
      }),
      ...(manifestation?.creators?.length > 0 && {
        creators: manifestation?.creators,
      }),
      ...(manifestation?.materialTypes?.length > 0 && {
        materialTypesArray: flattenMaterialType(manifestation),
      }),
      ...(manifestation?.workTypes?.length > 0 && {
        workTypes: manifestation?.workTypes,
      }),
    };
  });
}

/**
 * Returns accesses for a all given manifestations
 * these accesses have additional manifestation details
 * from their respective manifestation
 * @param manifestations
 * @return {*}
 */
export function getAllAccess(manifestations) {
  return manifestations?.flatMap(getAccessForSingleManifestation);
}

/**
 * Enrich InfomediaAccess with url, origin, and accessType
 * @param singleInfomediaAccess
 * @return {*|{accessType: string, origin: string, url: string}}
 */
export function enrichInfomediaAccess(singleInfomediaAccess) {
  return singleInfomediaAccess?.id
    ? {
        ...singleInfomediaAccess,
        url: infomediaUrl(
          encodeTitleCreator(
            singleInfomediaAccess?.titles?.[0],
            singleInfomediaAccess?.creators?.[0]?.display
          ),
          `work-of:${singleInfomediaAccess?.pid}`,
          singleInfomediaAccess.id
        ),
        origin: "infomedia",
        accessType: "infomedia",
      }
    : singleInfomediaAccess;
}

/**
 * Enrich any type of access with __typename specific fields
 * @param singleAccess
 * @return {*}
 */
export function enrichSingleAccess(singleAccess) {
  const enrichMapper = {
    [AccessEnum.INFOMEDIA_SERVICE]: () => enrichInfomediaAccess(singleAccess),
  }[singleAccess?.__typename];

  return enrichMapper ? enrichMapper() : singleAccess;
}

/**
 * Prioritise a __typename AccessUrl-access
 * @param access
 * @return {number}
 */
export function prioritiseAccessUrl(access) {
  const accessUrl_priorityPenalty = [
    typeof access.url !== "string" || !access.url,
    typeof access?.loginRequired === "boolean" &&
      access?.loginRequired === true,
    access?.origin === "DBC Webarkiv",
    true,
  ];

  return (
    accessUrl_priorityPenalty?.length -
    accessUrl_priorityPenalty?.findIndex((priority) => priority === true) -
    1
  );
}

/**
 * Prioritise a __typename InfomediaService-access
 * @param access
 * @return {number}
 */
export function prioritiseInfomediaService(access) {
  return typeof access?.id === "string" && access?.id ? 0 : 1;
}

/**
 * Prioritise a __typename Ereol-access
 * @param access
 * @return {number}
 */
export function prioritiseEreol(access) {
  const ereol_priorityPenalty = [
    typeof access.url !== "string" || !access.url,
    !["Ereolen", "Ereolen Go"].includes(access?.origin),
    ["Ereolen Go"].includes(access?.origin),
    ["Ereolen"].includes(access?.origin),
  ];
  return (
    ereol_priorityPenalty?.length -
    ereol_priorityPenalty?.findIndex((priority) => priority === true) -
    1
  );
}

/**
 * Prioritise a __typename DigitalArticleService-access
 * @param access
 * @return {number}
 */
export function prioritiseDigitalArticleService(access) {
  return typeof access?.issn === "string" && access?.issn ? 0 : 1;
}

/**
 * Prioritise a __typename InterLibraryLoan-access
 * @param access
 * @return {number}
 */
export function prioritiseInterLibraryLoan(access) {
  return typeof access?.loanIsPossible === "boolean" && access?.loanIsPossible
    ? 0
    : 1;
}

/**
 * Prioritised access provides access with an object of primary and secondary priority.
 * - typenamePriority is based on the __typename property in access
 * - accessInternalValuePriority is based on deterministic and prioritised heuristics
 *   within each __typename (eg. "is the url present", "what is the origin", etc.)
 * @param access
 * @return {{typenamePriority: (number|*), accessInternalValuePriority: (*|number)}}
 */
export function prioritisedAccess(access) {
  const accessPriorityMapper = {
    // Et godt mantra: "Hurtigst, derefter tættest på kilden (altså også mest lignende oprindelige tilstand)"
    // ACCESS URL: alt andet > DBC Webarkiv
    [AccessEnum.ACCESS_URL]: () => prioritiseAccessUrl(access),
    // INFOMEDIA_SERVICE: id > nederst! (manglende id)
    [AccessEnum.INFOMEDIA_SERVICE]: () => prioritiseInfomediaService(access),
    // EREOL: Ereol > Ereolengo
    [AccessEnum.EREOL]: () => prioritiseEreol(access),
    // DIGITAL_ARTICLE_SERVICE
    [AccessEnum.DIGITAL_ARTICLE_SERVICE]: () =>
      prioritiseDigitalArticleService(access),
    // INTER_LIBRARY_LOAN: LoanIsPossible true > false
    [AccessEnum.INTER_LIBRARY_LOAN]: () => prioritiseInterLibraryLoan(access),
  };

  const indexAccess = Object.keys(accessPriorityMapper)?.findIndex(
    (singleAccess) => singleAccess === access?.__typename
  );
  const typenamePriority =
    indexAccess === -1 ? accessPriorityMapper.length : indexAccess;
  const accessInternalValuePriority =
    indexAccess === -1 ? 0 : accessPriorityMapper[access?.__typename]();

  return {
    typenamePriority: typenamePriority,
    accessInternalValuePriority: accessInternalValuePriority,
  };
}

/**
 * sortPrioritisedAccess sorts 2 accesses between each other using {@link prioritisedAccess}
 * The sorting can be used within {@link sort() on an array}
 * @param a
 * @param b
 * @return {number}
 */
export function sortPrioritisedAccess(a, b) {
  const priorityA = prioritisedAccess(a);
  const priorityB = prioritisedAccess(b);

  return (
    priorityA?.typenamePriority - priorityB?.typenamePriority ||
    priorityA?.accessInternalValuePriority -
      priorityB?.accessInternalValuePriority
  );
}

/**
 * Provide a sorted array of all enriched accesses with manifestation details
 * @param manifestations
 * @return {*}
 */
export function getAllEnrichedAccessSorted(manifestations) {
  return chain(manifestations)
    ?.flatMap(getAccessForSingleManifestation)
    ?.map(enrichSingleAccess)
    ?.sort(sortPrioritisedAccess)
    ?.value();
}

/**
 * Provide a list of all allowed accesses
 * For when user does not have DigitalArticleService-access
 * @param accesses
 * @param hasDigitalAccess
 * @return {*[]}
 */
export function getAllowedAccesses(accesses, hasDigitalAccess) {
  const onlineAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename !== AccessEnum.INTER_LIBRARY_LOAN &&
      singleAccess?.__typename !== AccessEnum.DIGITAL_ARTICLE_SERVICE
  );

  const digitalArticleServiceAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE &&
      hasDigitalAccess
  );

  const physicalAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.INTER_LIBRARY_LOAN &&
      singleAccess?.loanIsPossible === true
  );

  return [
    ...onlineAccesses,
    ...digitalArticleServiceAccesses?.slice(0, 1),
    ...physicalAccesses?.slice(0, 1),
  ];
}

/**
 * Provide the same as {@link getAllowedAccesses} but from manifestations
 * instead of accesses
 * @param manifestations
 * @param hasDigitalAccess
 * @return {*[]}
 */
export function getAllAllowedEnrichedAccessSorted(
  manifestations,
  hasDigitalAccess
) {
  return getAllowedAccesses(
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [],
    hasDigitalAccess
  );
}

/**
 * Check digitalCopy on single
 * @param singleAccess
 * @return {boolean}
 */
function checkSingleDigitalCopy(singleAccess) {
  return !!(
    singleAccess?.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE &&
    singleAccess?.issn
  );
}

/**
 * Check digitalCopy on all given accesses
 * @param enrichedAccesses
 * @return {boolean}
 */
export function checkDigitalCopy(enrichedAccesses) {
  return enrichedAccesses?.map(checkSingleDigitalCopy);
}

/**
 * Check physicalCopy on single
 * @param singleAccess
 * @return {boolean}
 */
function checkSinglePhysicalCopy(singleAccess) {
  return !!(
    singleAccess?.__typename === AccessEnum.INTER_LIBRARY_LOAN &&
    singleAccess?.loanIsPossible === true
  );
}

/**
 * Check physicalCopy on all given accesses
 * @param enrichedAccesses
 * @return {boolean}
 */
export function checkPhysicalCopy(enrichedAccesses) {
  return enrichedAccesses?.map(checkSinglePhysicalCopy);
}

/**
 * Check isPeriodica on single
 * @param singleAccess
 * @return {boolean}
 */
function getIsSingleAccessPeriodicaLike(singleAccess) {
  return (
    !!singleAccess?.workTypes?.find(
      (workType) => workType?.toLowerCase() === "periodica"
    ) ||
    !!singleAccess?.materialTypesArray?.find((mat) => mat.includes("årbog"))
  );
}

/**
 * Check isPeriodica on all given accesses
 * @returns {boolean}
 * @param enrichedAccesses
 */
export function getAreAccessesPeriodicaLike(enrichedAccesses) {
  return enrichedAccesses?.map(getIsSingleAccessPeriodicaLike);
}

/**
 * Provide accessFactory that controls enriched accesses for given manifestations
 * @param manifestations
 * @return {{getAllAllowedEnrichedAccessSorted(*): *[], digitalCopy: *, physicalCopy: *, allEnrichedAccesses: (*|*[])}|*[]}
 */
export function accessFactory(manifestations) {
  const allEnrichedAccesses =
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [];
  const digitalCopy = checkDigitalCopy(allEnrichedAccesses);
  const physicalCopy = checkPhysicalCopy(allEnrichedAccesses);
  const isPeriodicaLikeArray = getAreAccessesPeriodicaLike(allEnrichedAccesses);

  return {
    allEnrichedAccesses: allEnrichedAccesses,
    getAllAllowedEnrichedAccessSorted(hasDigitalAccess) {
      return getAllAllowedEnrichedAccessSorted(
        manifestations,
        hasDigitalAccess
      );
    },
    digitalCopyArray: digitalCopy,
    physicalCopyArray: physicalCopy,
    isPeriodicaLikeArray: isPeriodicaLikeArray,
  };
}
