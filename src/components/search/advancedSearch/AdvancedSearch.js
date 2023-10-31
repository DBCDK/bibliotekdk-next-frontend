import Title from "@/components/base/title";
import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";

/**
 * @returns {React.JSX.Element}
 *
 */

export default function AdvancedSearch() {
  return (
    <div className={styles.container}>
      <Title type="title3">
        {Translate({ context: "search", label: "advancedSearch" })}
      </Title>
    </div>
  );
}
