import isEmpty from "lodash/isEmpty";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import {
  DropdownIndicesEnum,
  formattersAndComparitors,
} from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import {
  MUSICALEXERCISE_ENUM,
  NOTA_ENUM,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";

function getInputFieldsQueryToCql(inputFields) {
  return checkAndExpandInputFields(inputFields)
    ?.filter(
      (item) =>
        !isEmpty(item.value) &&
        (!isEmpty(item.searchIndex) || item.isParenthesis)
    )
    .map((item, index) => {
      //first item should not have a prefixLogicalOperator
      const prefix =
        !isEmpty(item.prefixLogicalOperator) && index !== 0
          ? [item.prefixLogicalOperator]
          : [];
      const searchIndexWithValue = `${item.startParenthesis ? "(" : ""}${
        item.searchIndex
      }="${item?.value?.replace(/"/g, '\\"').replace(/[?\\]/g, "\\$&")}" ${
        item.endParenthesis ? ")" : ""
      }`;

      // We spread prefix, in case it is empty, and ensure no weird spaces
      return [...prefix, searchIndexWithValue.trim()].join(" ");
    });
}

/**
 * Inputfields may contain AND,OR operators - if so we expand with extra fields for the cql query.
 * We make sure NOT to alter the original inputfields so we can return to the fieldsearch
 * @param inputFields
 * @returns {*}
 */
export function checkAndExpandInputFields(inputFields) {
  const expanded = [];

  inputFields?.forEach((field) => {
    const parts = field?.value?.split(/( AND | OR | NOT )/);

    if (parts?.length > 1) {
      let operator = null;

      for (let i = 0; i < parts.length; i += 2) {
        const value = parts[i];
        const logic = parts[i + 1]?.trim();

        expanded.push({
          prefixLogicalOperator:
            i === 0 ? field.prefixLogicalOperator : operator,
          startParenthesis: i === 0,
          searchIndex: field.searchIndex,
          value: value.trim(),
        });

        if (logic) {
          operator = LogicalOperatorsEnum[logic];
        }
      }
      // last element in expanded array is marked with endParenthesis
      const last = expanded.pop();
      last["endParenthesis"] = true;
      expanded.push(last);
    } else {
      expanded.push(field);
    }
  });

  return expanded;
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
            return "term.source=(* NOT nota)";
          } else {
            //if all is selected we do nothing
            return;
          }
        }
        // so is musicalexercises - that is a special case .. like NOTA :)
        else if (
          searchIndex.searchIndex === DropdownIndicesEnum.MUSICALEXERCISE
        ) {
          const value = searchIndex.value[0]?.value;
          if (value === MUSICALEXERCISE_ENUM.ONLY_EXCERSIZE) {
            return 'musicalexercise = "true"';
          } else if (value === MUSICALEXERCISE_ENUM.NO_EXCERSIZE) {
            return 'musicalexercise = "false"';
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
  const NO_PREFIX = ["lix", "let", "publicationyear"];
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
    case "title":
      return "term.title";
    default:
      return "term.default";
  }
}

/**
 * Get a single input field
 * @param type
 * @param value
 * @returns {{prefixLogicalOperator: null, searchIndex: string, value}}
 */
export function getAdvancedSearchField({ type, value, operator = null }) {
  return {
    value: value,
    prefixLogicalOperator: operator,
    searchIndex: typeToFieldindex(type),
  };
}

/**
 * Convert one or more inputfields to a query string
 * @param inputfields
 */
export function fieldsToAdvancedUrl({ inputFields, traceId }) {
  const urlObject = {
    inputFields: Array.isArray(inputFields) ? inputFields : [inputFields],
  };

  let res = `/avanceret?fieldSearch=${encodeURIComponent(
    JSON.stringify(urlObject)
  )}`;

  if (traceId) {
    res += `&tid=${encodeURIComponent(traceId)}`;
  }

  return res;
}

/**
 * Get an url by type. Some types uses simplesearch (subject, creator) and some uses advanced search (fieldsearch).
 * @param type - the index to search in
 * @param value - the value to search for
 * @returns {string}
 */
export function getUrlByType({ type, value, traceId }) {
  const simpelsearchTypes = ["subject", "creator"];
  // we want some types to use simplesearch .. i know this is advancedUrl .. but .. it
  // is the easiest way
  if (simpelsearchTypes.includes(type)) {
    return `/find?q.all="${value}"&tid=${traceId}`;
  }

  const inputField = getAdvancedSearchField({ type, value });
  return fieldsToAdvancedUrl({ inputFields: inputField, traceId });
}


/**
 * Tries to parse a query param that might be plain JSON or URL-encoded JSON.
 * Returns {} if parsing fails, so "%" or bad input won't break the app.
 */
export const parseSearchUrl = (value) => {
  if (!value) return {};
  try { return JSON.parse(value); } catch {
    console.error("Failed to parse search url", value);
  }
  return {};
}