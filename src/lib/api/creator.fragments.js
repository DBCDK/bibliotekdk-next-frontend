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
}) => {
  let cql = `phrase.creatorcontributor="${creatorId}"`; // CQL format for creator search using allowed index
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
}) {
  const cql = createCqlString({
    creatorId,
    generalMaterialType,
    creatorFunction,
    subjects,
    language,
    publicationYears,
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
 * Fetch creator overview data by VIAF id (viafid)
 */
export function creatorOverview({ viafid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query CreatorOverview($viafid: String!) {
  creatorByViafid(viafid: $viafid) {
    display
    viafid
    generated {
      summary {
        text
        disclaimer
      }
    }
    wikidata {
      education
      image {
        url
        attributionText
      }
      nationality
      occupation
      description
      awards
    }
  }
}`,
    variables: { viafid },
    slowThreshold: 3000,
  };
}
