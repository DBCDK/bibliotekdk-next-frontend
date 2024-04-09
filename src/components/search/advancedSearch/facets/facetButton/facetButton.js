import styles from "./facetButton.module.css";
import Button from "@/components/base/button/Button";
import { useModal } from "@/components/_modal";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import Link from "@/components/base/link/Link";

export function FacetButton({ cql, isLoading }) {
  const modal = useModal();
  const { selectedFacets, resetFacets } = useFacets();
  // find number of filters
  let count = 0;
  selectedFacets?.map((sel) => {
    count += sel.values.length;
    return sel.values;
  });

  return (
    <div className={count > 0 ? styles.buttonWrap : styles.counterwrap}>
      <Button
        type="secondary"
        size="medium"
        className={styles.facetbutton}
        onClick={() =>
          // modal.push("advancedFacets", {
          //   cql: cql,
          //   replace: true,
          // })
          modal.push("mobileFacets", { cql: cql })
        }
      >
        <Text
          tag="span"
          type="text1"
          skeleton={isLoading}
          dataCy={"result-row-laanemuligheder-wrap"}
        >
          {count > 0
            ? Translate({ context: "search", label: "filters" })
            : Translate({ context: "search", label: "filter-your-search" })}
        </Text>
        {count > 0 && (
          <>
            <Text
              tag="span"
              type="text1"
              skeleton={isLoading}
              dataCy={"result-row-laanemuligheder-wrap"}
              className={styles.count}
            >
              {count}
            </Text>
          </>
        )}
      </Button>
      {count > 0 && (
        <Link
          onClick={() => resetFacets()}
          border={{
            top: false,
            bottom: {
              keepVisible: true,
            },
          }}
          className={styles.mobileclear}
        >
          <Text tag="span" type="text3">
            {Translate({ context: "facets", label: "label-clear-filters" })}
          </Text>
        </Link>
      )}
    </div>
  );
}
