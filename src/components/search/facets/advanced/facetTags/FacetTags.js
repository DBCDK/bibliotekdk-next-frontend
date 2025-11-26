import { useFacets } from "@/components/search/advancedSearch/useFacets";
import styles from "./FacetTags.module.css";
import Icon from "@/components/base/icon/Icon";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link/Link";
import useFilters from "@/components/hooks/useFilters";
import { useRouter } from "next/router";

/**
 * For simple search facets. Imitate an advanced facet from search filters
 * @param filters
 * @returns {*[]}
 */
function parseFilters(filters) {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([key]) => key !== "workTypes")
  );

  const parsedAsFacet = [];
  for (const [key, value] of Object.entries(cleanedFilters)) {
    if (value.length > 0) {
      parsedAsFacet.push({
        searchIndex: key,
        values: value?.map((val) => ({ name: val, term: val })),
      });
    }
  }

  return parsedAsFacet;
}

export function FacetTags({ facets, onClear, onRemove, className = "" }) {
  if (!facets || facets.length < 1) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.actions}>
        <div className={styles.headline}>
          <Text tag="span" type="text3">
            {Translate({ context: "facets", label: "label-selected-filters" })}
          </Text>
        </div>
        <Link
          onClick={onClear}
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
        {facets?.map((tag) =>
          tag?.values?.map((val, index) => {
            return (
              <span
                className={styles.tag}
                key={`${tag.searchIndex}-${val.name}-${index}`}
              >
                <Text tag="span" type="text3" className={styles.tagtext}>
                  {val.name}
                </Text>
                <span>
                  <Icon
                    onClick={() => {
                      onRemove(val?.name, tag?.searchIndex);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onRemove(val?.name, tag?.searchIndex);
                      }
                    }}
                    tabIndex={0}
                    src="close_white.svg"
                    size={2}
                    className={styles.tagicon}
                  />
                </span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function Wrap(props) {
  const router = useRouter();

  const mode = router?.query?.mode || "simpel";
  const isSimple = mode === "simpel";

  // useFacets for advanced search result
  const { selectedFacets, removeFacet, clearFacetsUrl } = useFacets();

  // filters for simple search result.
  const { filters, setFilters, setFilter, setQuery } = useFilters();

  const facets = isSimple ? parseFilters(filters) : selectedFacets;

  if (!facets || facets.length < 1) {
    return null;
  }

  // For simple search. Fake a filter to be removed.
  const constructFilter = (name, searchIndex) => {
    return { checked: false, facetName: searchIndex, value: { term: name } };
  };

  const setAFilterAndQuery = (name, searchIndex) => {
    setFilter(constructFilter(name, searchIndex));
    setQuery({ include: filters });
  };

  const handleRemove = (name, searchIndex) => {
    if (isSimple) {
      setAFilterAndQuery(name, searchIndex);
    } else {
      removeFacet(name, searchIndex);
    }
  };

  const handleClear = () => {
    if (isSimple) {
      setFilters({});
    } else {
      clearFacetsUrl();
    }
  };

  return (
    <FacetTags
      facets={facets}
      onClear={handleClear}
      onRemove={handleRemove}
      {...props}
    />
  );
}
