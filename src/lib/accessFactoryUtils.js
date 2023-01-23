import { chain } from "lodash";
import { AccessEnum } from "@/lib/enums";
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";

/**
 * Access with additional manifestation details, possibly enriched,
 *   can any of these properties
 * @typedef {Object} Access
 * @property {string} origin
 * @property {string} url
 * @property {string} note
 * @property {boolean} loginRequired
 * @property {string} type
 * @property {string} id
 * @property {string} accessType
 * @property {boolean} canAlwaysBeLoaned
 * @property {string} issn
 * @property {boolean} loanIsPossible
 * @property {string} pid
 * @property {Array<string>} titles
 * @property {Array<object>} creators
 * @property {Array<string>} materialTypeArray
 * @property {Array<string>} workTypes
 */

/**
 * Returns accesses for a single manifestation
 * these accesses have additional manifestation details
 * used by {@link getAllAccess}
 * Manifestation details added to access are
 * - Access (itself)
 * - Pid
 * - Titles.main
 * - Creators
 * - MaterialTypesArray (MaterialTypes of the Manifestation, as a flat array)
 * - WorkTypes
 * @param manifestation
 * @return {Access[]}
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
 * @return {Access[]}
 */
export function getAllAccess(manifestations) {
  return manifestations?.flatMap(getAccessForSingleManifestation);
}

/**
 * Enrich InfomediaAccess with url, origin, and accessType
 * @param singleInfomediaAccess
 * @return {Access}
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
 * Currently only infomediaService-access is enriched
 * @param singleAccess
 * @return {Access}
 */
export function enrichSingleAccess(singleAccess) {
  const enrichMapper = {
    [AccessEnum.INFOMEDIA_SERVICE]: () => enrichInfomediaAccess(singleAccess),
  }[singleAccess?.__typename];

  return enrichMapper ? enrichMapper() : singleAccess;
}

/**
 * Prioritise a __typename AccessUrl-access
 * From lowest (3) to highest (0) priority (lower number sorts higher)
 * - (3) Missing or Non-string url (assume string url is valid url)
 * - (2) Login required
 * - (1) Origin is DBC Webarkiv
 * - (0) None of the above
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
 * * From lowest (1) to highest (0) priority (lower number sorts higher)
 * - (1) Missing or Non-string id (assume string id is valid id)
 * - (0) Present id of type string
 * @param access
 * @return {number}
 */
export function prioritiseInfomediaService(access) {
  return typeof access?.id === "string" && access?.id ? 0 : 1;
}

/**
 * Prioritise a __typename Ereol-access
 * From lowest (3) to highest (0) priority (lower number sorts higher)
 * - (3) Missing or Non-string url (assume string url is valid url)
 * - (2) Origin is neither Ereolen nor Ereolen Go
 * - (1) Origin is Ereolen Go
 * - (0) Origin is Ereolen
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
 * From lowest (3) to highest (0) priority (lower number sorts higher)
 * - (1) Missing or Non-string issn (assume string issn is valid url)
 * - (0) Present issn of type string
 * @param access
 * @return {number}
 */
export function prioritiseDigitalArticleService(access) {
  return typeof access?.issn === "string" && access?.issn ? 0 : 1;
}

/**
 * Prioritise a __typename InterLibraryLoan-access
 * From lowest (3) to highest (0) priority (lower number sorts higher)
 * - (1) LoanIsPossible either not boolean or false
 * - (0) LoanIsPossible is true
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
 * - -- (Order is: AccessUrl, InfomediaService, Ereol, DigitalArticleService, InterLibraryLoan)
 * - accessInternalValuePriority is based on deterministic and prioritised heuristics
 *   within each __typename (eg. "is the url present", "what is the origin", etc.)
 * - -- (Prioritisation specified in {@link prioritiseAccessUrl}, {@link prioritiseInfomediaService},
 *   {@link prioritiseEreol}, {@link prioritiseDigitalArticleService}, {@link prioritiseInterLibraryLoan})
 * @param access
 * @return {{typenamePriority: (number), accessInternalValuePriority: (number)}}
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
 * The sorting can be used within {@link sort} on an array
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
 * - Manifestation details are added by {@link getAccessForSingleManifestation}
 * - Sorting is prioritised with {@link prioritisedAccess} (see JSDoc for details)
 *   using sortfunction {@link sortPrioritisedAccess}
 * @param manifestations
 * @return {Access[]}
 */
export function getAllEnrichedAccessSorted(manifestations) {
  return chain(manifestations)
    ?.flatMap(getAccessForSingleManifestation)
    ?.map(enrichSingleAccess)
    ?.sort(sortPrioritisedAccess)
    ?.value();
}

/**
 * Helper function for checking if single access is __typename valid interLibraryLoan
 * @param singleAccess
 * @return {boolean}
 */
export function validInterLibraryLoanAccess(singleAccess) {
  return (
    singleAccess?.__typename === AccessEnum.INTER_LIBRARY_LOAN &&
    singleAccess?.loanIsPossible === true
  );
}

/**
 * Provide allowed accesses, divided into 3 seperate arrays:
 * - onlineAccesses: includes __typename: AccessUrl, InfomediaService, Ereol
 * - digitalArticleServiceAccesses: for __typename DigitalArticleService
 * - interLibraryLoanAccesses: for __typename InterLibraryLoanAccesses
 * For when user does not have DigitalArticleService-access
 * @param accesses
 * @param hasDigitalAccess
 * @return {{digitalArticleServiceAccesses: Access[], interLibraryLoanAccesses: Access[], onlineAccesses: Access[]}}
 */
export function getAllowedAccessesByTypeName(accesses, hasDigitalAccess) {
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

  const interLibraryLoanAccesses = accesses?.filter(
    validInterLibraryLoanAccess
  );

  return {
    onlineAccesses: onlineAccesses,
    digitalArticleServiceAccesses: digitalArticleServiceAccesses,
    interLibraryLoanAccesses: interLibraryLoanAccesses,
  };
}

/**
 * Provide the list of all allowed accesses using {@link getAllowedAccessesByTypeName}
 * argument is manifestations instead of accesses
 * @param manifestations
 * @param hasDigitalAccess
 * @return {Access[]}
 */
export function getAllAllowedEnrichedAccessSorted(
  manifestations,
  hasDigitalAccess
) {
  const {
    onlineAccesses,
    digitalArticleServiceAccesses,
    interLibraryLoanAccesses,
  } = getAllowedAccessesByTypeName(
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [],
    hasDigitalAccess
  );

  return [
    ...onlineAccesses,
    ...digitalArticleServiceAccesses,
    ...interLibraryLoanAccesses,
  ];
}

/**
 * Provide the count as all allowed accesses using {@link getAllowedAccessesByTypeName}
 * argument is manifestations instead of accesses
 * - Counting DigitalArticleService and InterLibraryLoan only once together
 * @param manifestations
 * @param hasDigitalAccess
 * @return {number}
 */
export function getCountOfAllAllowedEnrichedAccessSorted(
  manifestations,
  hasDigitalAccess
) {
  const {
    onlineAccesses,
    digitalArticleServiceAccesses,
    interLibraryLoanAccesses,
  } = getAllowedAccessesByTypeName(
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [],
    hasDigitalAccess
  );

  return (
    onlineAccesses.length +
    [...digitalArticleServiceAccesses, ...interLibraryLoanAccesses]?.slice(0, 1)
      ?.length
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
 * @return {Array<boolean>}
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
 * @return {Array<boolean>}
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
 * @param enrichedAccesses
 * @return {Array<boolean>}
 */
export function getAreAccessesPeriodicaLike(enrichedAccesses) {
  return enrichedAccesses?.map(getIsSingleAccessPeriodicaLike);
}

/**
 * Provide accessFactory that controls enriched accesses for given manifestations
 * - allEnrichedAccesses derived from {@link getAllEnrichedAccessSorted}
 * - getAllowedAccessesByTypeName derived from {@link getAllowedAccessesByTypeName}
 * - getAllAllowedEnrichedAccessSorted derived from {@link getAllAllowedEnrichedAccessSorted}
 * - getCountOfAllAllowedEnrichedAccessSorted derived from {@link getCountOfAllAllowedEnrichedAccessSorted}
 * - digitalCopyArray derived from {@link checkDigitalCopy}
 * - physicalCopyArray derived from {@link checkPhysicalCopy}
 * - isPeriodicalLikeArray derived from {@link getAreAccessesPeriodicaLike}
 * @param manifestations
 * @return {{digitalArticleServiceAccesses: Access[], interLibraryLoanAccesses: Access[], onlineAccesses: Access[]}|{digitalCopyArray: Array<boolean>, isPeriodicaLikeArray: Array<boolean>, getAllowedAccessesByTypeName(*): {digitalArticleServiceAccesses: Access[], interLibraryLoanAccesses: Access[], onlineAccesses: Access[]}, getAllAllowedEnrichedAccessSorted(*): Access[], physicalCopyArray: Array<boolean>, getCountOfAllAllowedEnrichedAccessSorted(*): number, allEnrichedAccesses: (Access[]|*[])}|number|Access[]}
 */
export function accessFactory(manifestations) {
  const allEnrichedAccesses =
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [];
  const digitalCopy = checkDigitalCopy(allEnrichedAccesses);
  const physicalCopy = checkPhysicalCopy(allEnrichedAccesses);
  const isPeriodicaLikeArray = getAreAccessesPeriodicaLike(allEnrichedAccesses);

  return {
    allEnrichedAccesses: allEnrichedAccesses,
    getAllowedAccessesByTypeName(hasDigitalAccess) {
      return getAllowedAccessesByTypeName(
        allEnrichedAccesses,
        hasDigitalAccess
      );
    },
    getAllAllowedEnrichedAccessSorted(hasDigitalAccess) {
      return getAllAllowedEnrichedAccessSorted(
        manifestations,
        hasDigitalAccess
      );
    },
    getCountOfAllAllowedEnrichedAccessSorted(hasDigitalAccess) {
      return getCountOfAllAllowedEnrichedAccessSorted(
        manifestations,
        hasDigitalAccess
      );
    },
    digitalCopyArray: digitalCopy,
    physicalCopyArray: physicalCopy,
    isPeriodicaLikeArray: isPeriodicaLikeArray,
  };
}
