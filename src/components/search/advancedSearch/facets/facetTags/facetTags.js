import { useFacets } from "@/components/search/advancedSearch/useFacets";
import styles from "./facetTags.module.css";
import Icon from "@/components/base/icon/Icon";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link/Link";
import useFilters from "@/components/hooks/useFilters";

/**
 * For simple search facets. Imitate an advanced facet from search filters
 * @param filters
 * @returns {*[]}
 */
function parseFilters(filters) {
  const parsedAsFacet = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value.length > 0) {
      parsedAsFacet.push({
        searchIndex: key,
        values: value?.map((val) => ({ name: val, term: val })),
      });
    }
  }

  return parsedAsFacet;
}

export function FacetTags({ origin = "advancedSearch" }) {
  // useFacets for advanced search result
  const { selectedFacets, removeFacet, resetFacets } = useFacets();

  // filters for simple search result.
  const { filters, setFilters, setAFilter, setQuery } = useFilters();

  const facetsToParse =
    origin === "simpleSearch" ? parseFilters(filters) : selectedFacets;

  if (facetsToParse?.length < 1) {
    return null;
  }

  // For simple search. Fake a filter to be removed.
  const constructFilter = (name, searchIndex) => {
    return { checked: false, facetName: searchIndex, value: { term: name } };
  };
  const setAFilterAndQuery = (name, searchIndex) => {
    setAFilter(constructFilter(name, searchIndex));
    setQuery({ include: filters });
  };

  const removeAFacet = (name, searchIndex) => {
    origin === "simpleSearch"
      ? setAFilterAndQuery(name, searchIndex)
      : removeFacet(name, searchIndex);
  };

  const clearTags = () => {
    origin === "simpleSearch" ? setFilters({}) : resetFacets();
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <div className={styles.headline}>
          <Text tag="span" type="text3">
            {Translate({ context: "facets", label: "label-selected-filters" })}
          </Text>
        </div>
        <Link
          onClick={clearTags}
          border={{
            top: false,
            bottom: {
              keepVisible: true,
            },
          }}
        >
          <Text tag="span" type="text3">
            {Translate({ context: "facets", label: "label-clear-filters" })}
          </Text>
        </Link>
      </div>
      <div className={styles.tagscontainer}>
        {facetsToParse?.map((tag) =>
          tag?.values?.map((val, index) => {
            return (
              <span className={styles.tag} key={`${val.name}-${index}`}>
                <Text tag="span" type="text3" className={styles.tagtext}>
                  {val.name}
                </Text>
                <span>
                  <Icon
                    onClick={() => {
                      removeAFacet(val?.name, tag?.searchIndex);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        removeAFacet(val?.name, tag?.searchIndex);
                      }
                    }}
                    tabIndex={0}
                    src="close_white.svg"
                    size={2}
                    className={styles.tagicon}
                  ></Icon>
                </span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
