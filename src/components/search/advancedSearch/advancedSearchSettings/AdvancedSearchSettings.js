import Title from "@/components/base/title";
import styles from "./AdvancedSearchSettings.module.css";
import Translate from "@/components/base/translate/Translate";
import FieldInputContainer from "../fieldInput/FieldInput";

/**
 * @returns {React.JSX.Element}
 *
 */

export default function AdvancedSearch() {
  const materialType = "all";
  return (
    <div className={styles.container}>
      <Title type="title3" className={styles.title}>
        {Translate({ context: "search", label: "advancedSearch" })}
      </Title>
      <FieldInputContainer materialType={materialType} />
    </div>
  );
}
