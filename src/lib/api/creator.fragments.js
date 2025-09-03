/**
 * @file Contains GraphQL queries for fetching creator data
 */

import { ApiEnums } from "@/lib/api/api";
import {
  cacheWorkFragment,
  creatorsFragment,
  materialTypesFragment,
  tvSeriesFragment,
} from "@/lib/api/fragments.utils";
import { cacheWork } from "./work.fragments";

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
}) {
  let cql = `phrase.creator="${creatorId}"`; // CQL format for creator search using allowed index
  if (generalMaterialType) {
    cql += ` AND phrase.generalmaterialtype="${generalMaterialType}"`;
  }
  if (creatorFunction) {
    cql += ` AND phrase.creatorfunction="${creatorFunction}"`;
  }
  if (subjects && subjects.length > 0) {
    const subjectQuery = subjects
      .map((subject) => `phrase.subject="${subject}"`)
      .join(" AND ");
    cql += ` AND (${subjectQuery})`;
  }
  const sort = [{ index: "sort.latestpublicationdate", order: "DESC" }]; // Sort newest first

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query worksByCreator($cql: String!, $offset: Int!, $limit: PaginationLimitScalar!, $sort: [SortInput!]) {
  complexSearch(cql: $cql, facets: {facetLimit: 50, facets: [GENERALMATERIALTYPE]}) {
    hitcount
    errorMessage
    works(limit: $limit, offset: $offset, sort: $sort) {
      workId
      traceId
      series {
        title
        numberInSeries
      }
      mainLanguages {
        isoCode
        display
      }
      abstract
      subjects {
        dbcVerified {
          display
        }
      }
      workYear {
        year
      }
      manifestations {
        mostRelevant {
          pid
          abstract
          cover {
            detail: detail_207
            origin
            thumbnail
          }
          materialTypes {
            ...materialTypesFragment
          }
          hostPublication {
            title
            issue
          }
          publisher
          edition {
            summary
            edition
            publicationYear {
              display
              year
            }
          }
          physicalDescription {
            summaryFull
            numberOfPages
          }
          subjects {
            dbcVerified {
              display
            }
          }
        }
        bestRepresentation {
          cover {
            detail: detail_207
            origin
            thumbnail
          }
          materialTypes {
            ...materialTypesFragment
          }
          abstract
          subjects {
            dbcVerified {
              display
            }
          }
          physicalDescription {
            summaryFull
            numberOfPages
          }
        }
        all {
          cover {
            detail: detail_207
            origin
            thumbnail
          }
          materialTypes {
            ...materialTypesFragment
          }
        }
      }
      creators {
        ...creatorsFragment
      }
      titles {
        main
        full
        parallel
        sort
        tvSeries {
          ...tvSeriesFragment
        }
      }
      ...cacheWorkFragment
    }
  }
}
    ${cacheWorkFragment}
    ${creatorsFragment}
    ${materialTypesFragment}
    ${tvSeriesFragment}`,
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
  let cql = `phrase.creator="${creatorId}"`;

  // Apply other filters but not generalMaterialType
  if (filters.creatorFunction) {
    cql += ` AND phrase.creatorfunction="${filters.creatorFunction}"`;
  }
  if (filters.subjects && filters.subjects.length > 0) {
    const subjectQuery = filters.subjects
      .map((subject) => `phrase.subject="${subject}"`)
      .join(" AND ");
    cql += ` AND (${subjectQuery})`;
  }

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
  let cql = `phrase.creator="${creatorId}"`;

  // Apply other filters but not creatorFunction
  if (filters.generalMaterialType) {
    cql += ` AND phrase.generalmaterialtype="${filters.generalMaterialType}"`;
  }
  if (filters.subjects && filters.subjects.length > 0) {
    const subjectQuery = filters.subjects
      .map((subject) => `phrase.subject="${subject}"`)
      .join(" AND ");
    cql += ` AND (${subjectQuery})`;
  }

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query creatorFunctionFacets($cql: String!) {
      complexSearch(cql: $cql, facets: {facetLimit: 50, facets: [CREATORFUNCTION]}) {
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
  let cql = `phrase.creator="${creatorId}"`;

  // Apply other filters but not subjects
  if (filters.generalMaterialType) {
    cql += ` AND phrase.generalmaterialtype="${filters.generalMaterialType}"`;
  }
  if (filters.creatorFunction) {
    cql += ` AND phrase.creatorfunction="${filters.creatorFunction}"`;
  }

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query subjectFacets($cql: String!) {
      complexSearch(cql: $cql, facets: {facetLimit: 50, facets: [SUBJECT]}) {
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
