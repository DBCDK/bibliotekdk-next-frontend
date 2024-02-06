import { AccessEnum } from "@/lib/enums";
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";

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
 * @property {Array<Object>} creators
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
 * @returns {Access[]}
 */
export function getAccessForSingleManifestation(manifestation) {
  const { flatMaterialTypes } = manifestationMaterialTypeFactory([
    manifestation,
  ]);

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
        materialTypesArray: flatMaterialTypes?.[0],
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
 * @returns {Access[]}
 */
export function getAllAccess(manifestations) {
  return manifestations?.flatMap(getAccessForSingleManifestation) || [];
}

/**
 * Enrich InfomediaAccess with url, origin, and accessType
 * @param singleInfomediaAccess
 * @returns {Access}
 */
export function enrichInfomediaAccess(singleInfomediaAccess) {
  return singleInfomediaAccess?.id
    ? {
        ...singleInfomediaAccess,
        url: infomediaUrl(
          encodeTitleCreator(
            singleInfomediaAccess?.titles?.[0],
            singleInfomediaAccess?.creators
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
 * @returns {Access}
 */
export function enrichSingleAccess(singleAccess) {
  const enrichMapper = {
    [AccessEnum.INFOMEDIA_SERVICE]: () => enrichInfomediaAccess(singleAccess),
  }[singleAccess?.__typename];

  return enrichMapper ? enrichMapper() : singleAccess;
}

/**
 * Manually maintained list of special access urls and origins.
 *  Accesses can be considered special if they do not have an
 *  url/origin that provides direct access
 * - i.e. dfi.dk is a special access. It is a link to information on how to watch the
 *   movie at a specific location
 *
 * Used by: {@link prioritiseAccessUrl} through {@link checkSpecialAccess}
 * @type {{urls: string[], origins: string[]}}
 */
const specialAccessTypes = {
  origins: ["www.dfi.dk", "nota.dk"],
  urls: ["www.filmstriben.dk/bibliotek/"],
};

/**
 * Helper function for checking if single access is __typename AccessUrl and checks
 * if the access origin is part of the {@link specialAccessTypes}.origins
 * or if the access url startsWith elements in {@link specialAccessTypes}.urls
 * @param singleAccess
 * @returns {boolean}
 */
function checkSpecialAccess(singleAccess) {
  return (
    singleAccess?.__typename === AccessEnum.ACCESS_URL &&
    (specialAccessTypes.origins.includes(singleAccess?.origin) ||
      specialAccessTypes.urls.filter((singleUrl) =>
        singleAccess?.url?.startsWith(singleUrl)
      ).length > 0)
  );
}

/**
 * Prioritise a __typename AccessUrl-access
 * From lowest (3) to highest (0) priority (lower number sorts higher)
 * - (4) Missing or Non-string url (assume string url is valid url)
 * - (3) Login required
 * - (2) Origin is part of {@link specialAccessTypes}
 * - (1) Origin is DBC Webarkiv
 * - (0) None of the above
 * @param access
 * @returns {number}
 */
export function prioritiseAccessUrl(access) {
  const accessUrl_priorityPenalty = [
    typeof access.url !== "string" || !access.url,
    typeof access?.loginRequired === "boolean" &&
      access?.loginRequired === true,
    checkSpecialAccess(access),
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
 * @returns {number}
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
 * @returns {number}
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
 * @returns {number}
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
 * @returns {number}
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
 * @returns {{typenamePriority: (number), accessInternalValuePriority: (number)}}
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
 * @returns {number}
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
 * @returns {Access[]}
 */
export function getAllEnrichedAccessSorted(manifestations) {
  return manifestations
    ?.flatMap(getAccessForSingleManifestation)
    ?.map(enrichSingleAccess)
    ?.sort(sortPrioritisedAccess);
}

/**
 * Helper function for checking if single access is __typename valid interLibraryLoan
 * @param singleAccess
 * @returns {boolean}
 */
export function validInterLibraryLoanAccess(singleAccess) {
  return (
    singleAccess?.__typename === AccessEnum.INTER_LIBRARY_LOAN &&
    singleAccess?.loanIsPossible === true
  );
}

/**
 * Provide allowed accesses, divided into 4 seperate arrays:
 * - onlineAccesses: includes __typename: AccessUrl, InfomediaService, Ereol (excluding {@link specialAccessTypes})
 * - digitalArticleServiceAccesses: for __typename DigitalArticleService
 * - interLibraryLoanAccesses: for __typename InterLibraryLoanAccesses
 *   and when user does not have DigitalArticleService-access
 * - specialAccesses: includes __typename: AccessUrl and meets criteria in {@link checkSpecialAccess} {@link specialAccessTypes}
 * @param accesses
 * @param hasDigitalAccess
 * @returns {{digitalArticleServiceAccesses: Access[], interLibraryLoanAccesses: Access[], onlineAccesses: Access[], specialAccesses: Access[]}}
 */
export function getAllowedAccessesByTypeName(accesses, hasDigitalAccess) {
  const onlineAccesses = accesses
    ?.filter(
      (singleAccess) =>
        singleAccess?.__typename !== AccessEnum.INTER_LIBRARY_LOAN &&
        singleAccess?.__typename !== AccessEnum.DIGITAL_ARTICLE_SERVICE
    )
    ?.filter((singleAccess) => !checkSpecialAccess(singleAccess))
    //  bug Vi skal kun bruge RESOURCE i forhold til url adgang - se https://dbcjira.atlassian.net/browse/SP-1274
    ?.filter(
      (singleAccess) =>
        singleAccess?.__typename !== AccessEnum.ACCESS_URL ||
        (singleAccess?.__typename === AccessEnum.ACCESS_URL &&
          singleAccess?.type === "RESOURCE")
    );

  const digitalArticleServiceAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE &&
      hasDigitalAccess
  );

  const interLibraryLoanAccesses = accesses?.filter(
    validInterLibraryLoanAccess
  );

  const specialAccesses = accesses?.filter(checkSpecialAccess);

  return {
    onlineAccesses: onlineAccesses,
    digitalArticleServiceAccesses: digitalArticleServiceAccesses,
    interLibraryLoanAccesses: interLibraryLoanAccesses,
    specialAccesses: specialAccesses,
  };
}

/**
 * Provide the list of all allowed accesses using {@link getAllowedAccessesByTypeName}
 * argument is manifestations instead of accesses
 * @param manifestations
 * @param hasDigitalAccess
 * @returns {Access[]}
 */
export function getAllAllowedEnrichedAccessSorted(
  manifestations,
  hasDigitalAccess
) {
  const {
    onlineAccesses,
    digitalArticleServiceAccesses,
    interLibraryLoanAccesses,
    specialAccesses,
  } = getAllowedAccessesByTypeName(
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [],
    hasDigitalAccess
  );

  return [
    ...onlineAccesses,
    ...digitalArticleServiceAccesses,
    ...interLibraryLoanAccesses,
    ...specialAccesses,
  ];
}

/**
 * Provide the count as all allowed accesses using {@link getAllowedAccessesByTypeName}
 * argument is manifestations instead of accesses
 * - Counting DigitalArticleService and InterLibraryLoan only once together
 * @param manifestations
 * @param hasDigitalAccess
 * @returns {number}
 */
export function getCountOfAllAllowedEnrichedAccessSorted(
  manifestations,
  hasDigitalAccess
) {
  const {
    onlineAccesses,
    digitalArticleServiceAccesses,
    interLibraryLoanAccesses,
    specialAccesses,
  } = getAllowedAccessesByTypeName(
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [],
    hasDigitalAccess
  );

  return (
    onlineAccesses.length +
    [...digitalArticleServiceAccesses, ...interLibraryLoanAccesses]?.slice(0, 1)
      ?.length +
    specialAccesses.length
  );
}

/**
 * Check digitalCopy on single
 * @param singleAccess
 * @returns {boolean}
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
 * @returns {Array<boolean>}
 */
export function checkDigitalCopy(enrichedAccesses) {
  return enrichedAccesses?.map(checkSingleDigitalCopy);
}

/**
 * Check physicalCopy on single
 * @param singleAccess
 * @returns {boolean}
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
 * @returns {Array<boolean>}
 */
export function checkPhysicalCopy(enrichedAccesses) {
  return enrichedAccesses?.map(checkSinglePhysicalCopy);
}

/**
 * Check isPeriodica on single
 * if true, worktype is either "periodica" or "årbog"
 * @param singleAccess
 * @returns {boolean}
 */
function getIsSingleAccessPeriodicaLike(singleAccess) {
  return (
    !!singleAccess?.workTypes?.find(
      (workType) => workType?.toLowerCase() === "periodica"
    ) ||
    !!singleAccess?.materialTypesArray?.find((mat) =>
      mat?.specificCode?.includes("YEARBOOK")
    )
  );
}

/**
 * Check isPeriodica on all given accesses
 * @param enrichedAccesses
 * @returns {Array<boolean>}
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
 * @returns {{digitalArticleServiceAccesses: Access[], interLibraryLoanAccesses: Access[], onlineAccesses: Access[]}|{digitalCopyArray: Array<boolean>, isPeriodicaLikeArray: Array<boolean>, getAllowedAccessesByTypeName(*): {digitalArticleServiceAccesses: Access[], interLibraryLoanAccesses: Access[], onlineAccesses: Access[]}, getAllAllowedEnrichedAccessSorted(*): Access[], physicalCopyArray: Array<boolean>, getCountOfAllAllowedEnrichedAccessSorted(*): number, allEnrichedAccesses: (Access[]|*[])}|number|Access[]}
 */
export function accessFactory(manifestations) {
  const allEnrichedAccesses =
    (manifestations && getAllEnrichedAccessSorted(manifestations)) || [];
  const allEnrichedAccessesSortedInclSpecialUrls =
    getAllAllowedEnrichedAccessSorted(manifestations, true);
  const digitalCopy = checkDigitalCopy(allEnrichedAccesses);
  const physicalCopy = checkPhysicalCopy(allEnrichedAccesses);
  const isPeriodicaLikeArray = getAreAccessesPeriodicaLike(allEnrichedAccesses);

  return {
    allEnrichedAccesses: allEnrichedAccessesSortedInclSpecialUrls,
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
