/**
 * @file Contains GraphQL queries for fetching creator data
 */

import { ApiEnums } from "@/lib/api/api";
import { cacheWorkFragment } from "@/lib/api/fragments.utils";
import { cacheWork } from "./work.fragments";

const createCqlString = ({
  creatorId,
  generalMaterialType,
  creatorFunction,
  subjects,
  language,
  publicationYears,
  genreAndForm,
}) => {
  let cql = `phrase.creator="${creatorId}"`; // CQL format for creator search using allowed index
  if (generalMaterialType) {
    cql += ` AND phrase.generalmaterialtype="${generalMaterialType}"`;
  }
  if (creatorFunction) {
    cql += ` AND phrase.creatorcontributorfunction="${creatorFunction}"`;
  }
  if (subjects && subjects.length > 0) {
    cql += ` AND (${subjects
      .map((subject) => `phrase.subject="${subject}"`)
      .join(" AND ")})`;
  }
  if (language) {
    cql += ` AND phrase.mainlanguage="${language}"`;
  }
  if (genreAndForm) {
    cql += ` AND phrase.genreandform="${genreAndForm}"`;
  }
  if (publicationYears && publicationYears.length > 0) {
    cql += ` AND publicationyear=(${publicationYears
      ?.map((year) => '"' + year + '"')
      ?.join(" OR ")})`;
  }
  return cql;
};
/**
 * Fetch works by creator ID using complexSearch
 *
 * @param {string} creatorId - The creator/author ID to fetch works for
 * @param {number} limit - Number of results to fetch
 * @param {number} offset - Offset for pagination
 */
export function worksByCreator({
  creatorId,
  limit = 100,
  offset = 0,
  generalMaterialType,
  creatorFunction,
  subjects,
  language,
  publicationYears,
  genreAndForm,
}) {
  const cql = createCqlString({
    creatorId,
    generalMaterialType,
    creatorFunction,
    subjects,
    language,
    publicationYears,
    genreAndForm,
  });

  const sort = [{ index: "sort.latestpublicationdate", order: "DESC" }]; // Sort newest first

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query worksByCreator($cql: String!, $offset: Int!, $limit: PaginationLimitScalar!, $sort: [SortInput!]) {
  complexSearch(cql: $cql) {
    hitcount
    errorMessage
    works(limit: $limit, offset: $offset, sort: $sort) {
      workId
      workTypes
      abstract
      subjects {
        dbcVerified {
          display
        }
      }
      genreAndForm
      workYear {
        year
      }
      materialTypes {
        materialTypeSpecific {
          display
        }
        materialTypeGeneral {
          display
        }
      }
      manifestations {
        bestRepresentation {
          abstract
          subjects {
            dbcVerified {
              display
            }
          }
          physicalDescription {
            summaryFull
          }
        }
        mostRelevant {
          edition {
            publicationYear {
              year
            }
          }
          cover {
            detail: detail_207
            origin
            thumbnail
          }
          contributors {
            display
            roles {
              function {
                singular
              }
            }
          }
        }
      }
      creators {
        display
        ... on Person {
          __typename
          nameSort
          roles {
            function {
              plural
              singular
            }
            functionCode
          }
        }
      }
      titles {
        main
        full
      }
      extendedWork {
        ... on PeriodicalArticle {
          parentPeriodical {
            titles {
              main
            }
          }
          parentIssue {
            display
          }
        }
      }
      ...cacheWorkFragment
    }
  }
}
    ${cacheWorkFragment}`,
    variables: {
      cql,
      limit,
      offset,
      sort,
    },
    slowThreshold: 3000,
    onLoad: ({ data, keyGenerator, cache }) => {
      data?.complexSearch?.works?.forEach((work) => {
        cache(
          keyGenerator(cacheWork({ workId: work.workId })),
          { data: { work } },
          false
        );
      });
    },
  };
}

/**
 * Fetch general material type facets for a creator's works
 * Applies filters from other dropdowns but excludes generalMaterialType filter
 */
export function generalMaterialTypeFacets({ creatorId, filters = {} }) {
  const cql = createCqlString({ creatorId, ...filters });

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query generalMaterialTypeFacets($cql: String!) {
      complexSearch(cql: $cql, facets: {facetLimit: 50, facets: [GENERALMATERIALTYPE]}) {
        facets {
          name
          values {
            key
          }
        }
      }
    }`,
    variables: { cql },
    slowThreshold: 3000,
  };
}

/**
 * Fetch CREATORFUNCTION facets for a creator's works
 * Applies filters from other dropdowns but excludes creatorFunction filter
 */
export function creatorFunctionFacets({ creatorId, filters = {} }) {
  const cql = createCqlString({ creatorId, ...filters });

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query creatorFunctionFacets($cql: String!) {
      complexSearch(cql: $cql, facets: {facetLimit: 50, facets: [CREATORCONTRIBUTORFUNCTION]}) {
        facets {
          name
          values {
            key
          }
        }
      }
    }`,
    variables: { cql },
    slowThreshold: 3000,
  };
}

/**
 * Fetch SUBJECT facets for a creator's works
 * Applies filters from other dropdowns but excludes subjects filter
 */
export function subjectFacets({ creatorId, filters = {} }) {
  const cql = createCqlString({ creatorId, ...filters });

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query subjectFacets($cql: String!) {
      complexFacets(cql: $cql, facets: {facetLimit: 100, facets: [SUBJECT]}) {
        hitcount
        facets {
          name
          values {
            score
            key
          }
        }
      }
    }`,
    variables: { cql },
    slowThreshold: 3000,
  };
}

/**
 * Fetch LANGUAGE facets for a creator's works
 * Applies filters from other dropdowns but excludes language filter
 */
export function languageFacets({ creatorId, filters = {} }) {
  const cql = createCqlString({ creatorId, ...filters });

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query languageFacets($cql: String!) {
      complexSearch(cql: $cql, facets: {facetLimit: 50, facets: [MAINLANGUAGE]}) {
        facets {
          name
          values {
            key
          }
        }
      }
    }`,
    variables: { cql },
    slowThreshold: 3000,
  };
}

/**
 * Fetch LANGUAGE facets for a creator's works
 * Applies filters from other dropdowns but excludes language filter
 */
export function publicationYearFacets({ creatorId, filters = {} }) {
  const cql = createCqlString({ creatorId, ...filters });

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query publicationYearFacets($cql: String!) {
      complexFacets(cql: $cql, facets: {facetLimit: 500, facets: [PUBLICATIONYEAR]}) {
        hitcount
        facets {
          name
          values {
            score
            key
          }
        }
      }
    }`,
    variables: { cql },
    slowThreshold: 3000,
  };
}

/**
 * Fetch GENREANDFORM facets for a creator's works
 * Applies filters from other dropdowns but excludes genreAndForm filter
 */
export function genreAndFormFacets({ creatorId, filters = {} }) {
  const cql = createCqlString({ creatorId, ...filters });

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query genreAndFormFacets($cql: String!) {
      complexSearch(cql: $cql, facets: {facetLimit: 50, facets: [GENREANDFORM]}) {
        facets {
          name
          values {
            key
          }
        }
      }
    }`,
    variables: { cql },
    slowThreshold: 3000,
  };
}

/**
 * Fetch creator overview data by VIAF id (viafid)
 */
export function creatorOverview({ display }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query CreatorOverview($display: String!) {
  creatorByDisplay(display: $display) {
    display
    viafid
    forfatterweb {
      url
      image {
        large {
          url
        }
      }
    }
    generated {
      summary {
        text
        disclaimer
      }
      shortSummary {
        text
        disclaimer
      }
      dataSummary {
        text
      }
      topSubjects
    }
    wikidata {
      education
      image {
        medium
        attributionText
      }
      nationality
      occupation
      description
      awards
    }
  }
}`,
    variables: { display },
    slowThreshold: 3000,
  };
}

/**
 * Fetch up to N works for a creator including review relations (Infomedia etc.)
 * Excludes articles and reviews via workType filter.
 */
export function reviewsForCreator({ creator, limit = 100, offset = 0 }) {
  const cql = `phrase.creator="${creator}" NOT workType="review" NOT workType="article"`;
  const sort = [{ index: "sort.latestpublicationdate", order: "DESC" }];

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query ReviewsForCreator($cql: String!, $offset: Int!, $limit: PaginationLimitScalar!, $sort: [SortInput!]) {
  complexSearch(cql: $cql) {
    hitcount
    errorMessage
    works(offset: $offset, limit: $limit, sort: $sort) {
      workId
      titles {
        main
      }
      manifestations {
        mostRelevant {
          cover {
            detail: detail_207
            origin
            thumbnail
          }
          materialTypes {
            materialTypeSpecific {
              code
            }
          }
        }
      }
      relations {
        hasReview {
          creators {
            display
          }
          hostPublication {
            title
            issue
          }
          review {
            rating
          }
          access {
            __typename
            ... on InfomediaService {
              id
            }
          }
        }
      }
    }
  }
}`,
    variables: { cql, offset, limit, sort },
    slowThreshold: 3000,
  };
}
