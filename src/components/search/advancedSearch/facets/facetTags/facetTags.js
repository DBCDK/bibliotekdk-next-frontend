import { useFacets } from "@/components/search/advancedSearch/useFacets";
import styles from "./facetTags.module.css";
import Icon from "@/components/base/icon/Icon";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link/Link";

export function FacetTags() {
  const { selectedFacets, removeFacet, clearFacetsUrl } = useFacets();

  if (selectedFacets?.length < 1) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <div className={styles.headline}>
          <Text tag="span" type="text3">
            {Translate({ context: "facets", label: "label-selected-filters" })}
          </Text>
        </div>
        <Link
          onClick={() => clearFacetsUrl()}
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
        {selectedFacets?.map((tag) =>
          tag.values.map((val, index) => {
            return (
              <span
                className={styles.tag}
                key={`${tag.searchIndex}-${val.name}-${index}`}
              >
                <span>{val.name}</span>
                <span>
                  <Icon
                    onClick={() => {
                      removeFacet(val?.name, tag?.searchIndex);
                    }}
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

// export default function Wrap() {
//   const { selectedFacets, removeFacet, clearFacetsUrl } = useFacets();
//   return FacetTags({
//     selectedFacets: selectedFacets,
//     removeFacet: removeFacet,
//     clearFacetsUrl: clearFacetsUrl,
//   });
// }
