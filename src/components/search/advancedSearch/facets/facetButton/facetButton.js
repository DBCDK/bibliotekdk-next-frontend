import styles from "./facetButton.module.css";
import Button from "@/components/base/button/Button";
import { useModal } from "@/components/_modal";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

export function FacetButton({ cql }) {
  const modal = useModal();
  const { selectedFacets } = useFacets();

  let count = 0;
  const allValues = selectedFacets?.map((sel) => {
    count += sel.values.length;
    return sel.values;
  });
  console.log(allValues, count, "ALLVALUES");
  return (
    <div className={styles.buttonWrap}>
      <Button
        type="secondary"
        size="medium"
        className={styles.facetbutton}
        onClick={() =>
          modal.push("advancedFacets", {
            cql: cql,
            replace: true,
          })
        }
      >
        Filtrer din søgning
      </Button>
    </div>
  );
}
