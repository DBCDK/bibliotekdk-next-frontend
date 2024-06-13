import isEmpty from "lodash/isEmpty";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import {
  DropdownIndicesEnum,
  formattersAndComparitors,
} from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { NOTA_ENUM } from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";

function getInputFieldsQueryToCql(inputFields) {
  return inputFields
    ?.filter((item) => !isEmpty(item.value) && !isEmpty(item.searchIndex))
    .map((item, index) => {
      //first item should not have a prefixLogicalOperator
      const prefix =
        !isEmpty(item.prefixLogicalOperator) && index !== 0
          ? [item.prefixLogicalOperator]
          : [];
      const searchIndexWithValue = `${item.searchIndex}="${item?.value?.replace(
        /"/g,
        '\\"'
      )}"`;

      // We spread prefix, in case it is empty, and ensure no weird spaces
      return [...prefix, searchIndexWithValue].join(" ");
    });
}

function getDropdownQuery(dropdownSearchIndices) {
  const OR = LogicalOperatorsEnum.OR;
  const AND = LogicalOperatorsEnum.AND;

  return (
    dropdownSearchIndices
      ?.filter((searchIndex) => !isEmpty(searchIndex.value))
      .map((searchIndex) => {
        const { getComparator, getFormatValue } = formattersAndComparitors(
          searchIndex.searchIndex
        );
        //nota is a special case. We handle it seperatly
        if (searchIndex.searchIndex === DropdownIndicesEnum.NOTA) {
          const value = searchIndex.value[0]?.value;
          if (value === NOTA_ENUM.ONLY_NOTA) {
            return 'term.source = "nota"';
          } else if (value === NOTA_ENUM.NOT_NOTA) {
            return "term.source=(* AND nota)";
          } else {
            //if all is selected we do nothing
            return;
          }
        } else {
          return searchIndex.value
            .map((singleValue) => {
              return `${searchIndex.searchIndex}${getComparator?.(
                singleValue?.value
              )}"${getFormatValue?.(singleValue?.value)}"`;
            })
            .join(` ${OR} `);
        }
      })
      // Items are wrapped inside parenthesis to ensure precedence
      .filter((item) => !!item)
      .map((item) => `(${item})`)
      .join(` ${AND} `)
  );
}

export function getQuickFiltersQuery(quickFilters) {
  const AND = LogicalOperatorsEnum.AND;
  const cqlArray = quickFilters?.map(
    (filter) => `(${filter.searchIndex}="${filter.value}")`
  );

  return cqlArray?.join(` ${AND} `);
}

function mapFacetIndex(facetIndex) {
  const INDEXPREFIX = "phrase.";
  const NO_PREFIX = ["lix", "let"];
  if (NO_PREFIX.includes(facetIndex)) {
    return facetIndex;
  }

  return `${INDEXPREFIX}${facetIndex}`;
}

export function getFacetsQuery(facets) {
  const OR = LogicalOperatorsEnum.OR;
  const AND = LogicalOperatorsEnum.AND;

  if (isEmpty(facets)) {
    return "";
  }

  return (
    facets
      ?.filter((facet) => !isEmpty(facet.values))
      .map((facet) => {
        const searchindex = mapFacetIndex(facet.searchIndex);
        //  For now we use AND with a variable
        return facet.values
          .map((singleValue) => {
            return `${searchindex}="${singleValue?.value}"`;
          })
          .join(` ${OR} `);
      })
      // Items are wrapped inside parenthesis to ensure precedence
      .map((item) => `(${item})`)
      .join(` ${AND} `)
  );
}

export function getWorkTypeQuery(workType) {
  if (isEmpty(workType) || workType === "all") {
    return "";
  }

  return `(worktype=${workType})`;
}

/**
 * Complex search returns empty valued facets - values with a score of 0.
 * Here we filter out all the empty facet values - and if a facet has none
 * values we filter out the entire facet :)
 *
 * @TODO - should complexsearch filter out the empty values ??
 *
 * eg.
 * [
 *     {
 *         "key": "brætspil",
 *         "score": 1
 *     },
 *     {
 *         "key": "aarbog",
 *         "score": 0
 *     },
 *     {
 *         "key": "aarbog (cd)",
 *         "score": 0
 *     }
 * ]
 *
 * @param facets
 * @returns {*}
 */
export function parseOutFacets(facets) {
  // find the facet values with a score higher than 0
  const sanitizedFacets = facets
    ?.map((facet) => {
      return {
        name: facet.name,
        values: facet.values.filter((value) => value?.score > 0),
      };
    })
    // filter out entire facet if there are no values
    .filter((facet) => facet.values.length > 0);

  return sanitizedFacets;
}

export function facetsFromUrl(router) {
  const query = router?.query;
  const facets = query?.facets;

  // check the facets
  const verifiedFacets = facets && JSON.parse(facets);
  return Array.isArray(verifiedFacets) ? JSON.stringify(verifiedFacets) : "[]";
}

/**
 * Combine given query with query generated from selected facets
 * @param cql
 * @param selectedFacets
 * @returns {string|*}
 */
export function getCqlAndFacetsQuery({ cql, selectedFacets, quickFilters }) {
  if (!cql) {
    return null;
  }
  let cqlAndFacetsQuery;
  const facetCql = getFacetsQuery(selectedFacets);
  const quickFilterCql = getQuickFiltersQuery(quickFilters);
  if (cql) {
    cqlAndFacetsQuery = facetCql ? cql + " AND " + facetCql : cql;
  }

  if (cqlAndFacetsQuery) {
    cqlAndFacetsQuery = quickFilterCql
      ? cqlAndFacetsQuery + " AND " + quickFilterCql
      : cqlAndFacetsQuery;
  }

  return cqlAndFacetsQuery;
}

export function convertStateToCql({
  inputFields,
  dropdownSearchIndices,
  facets,
  quickFilters,
  workType,
} = {}) {
  const inputFieldsQuery = getInputFieldsQueryToCql(inputFields);
  const dropdownQuery = getDropdownQuery(dropdownSearchIndices);
  const facetQuery = getFacetsQuery(facets);
  const quickFilterQuery = getQuickFiltersQuery(quickFilters);
  const workTypeQuery = getWorkTypeQuery(workType);

  const AND = LogicalOperatorsEnum.AND;

  const result = [
    ...(!isEmpty(workTypeQuery) ? [workTypeQuery] : []),
    ...(!isEmpty(inputFieldsQuery) ? [inputFieldsQuery.join(" ")] : []),
    ...(!isEmpty(dropdownQuery) ? [dropdownQuery] : []),
    ...(!isEmpty(facetQuery) ? [facetQuery] : []),
    ...(!isEmpty(quickFilterQuery) ? [quickFilterQuery] : []),
  ].join(`) ${AND} (`);

  return !isEmpty(result) ? "(" + result + ")" : "";
}

/**
 * Known indexes for generating url's
 * @param type
 * @returns {string}
 */
function typeToFieldindex(type) {
  switch (type) {
    case "dk5":
      return "dk5";
    case "creator":
      return "term.creatorcontributor";
    case "subject":
      return "term.subject";
    case "isbn":
      return "term.isbn";
    default:
      return "term.default";
  }
}

/**
 * Get an url to advanced search (fieldsearch).
 * @param type - the index to search in
 * @param value - the value to search for
 * @returns {string}
 */
export function getAdvancedUrl({ type, value }) {
  const inputField = {
    value: value,
    prefixLogicalOperator: null,
    searchIndex: typeToFieldindex(type),
  };

  const urlObject = {
    inputFields: [inputField],
  };

  return `/avanceret?fieldSearch=${encodeURIComponent(
    JSON.stringify(urlObject)
  )}`;
}
