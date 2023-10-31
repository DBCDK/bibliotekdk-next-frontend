import Title from "@/components/base/title";
import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";
import { CqlTextArea } from "@/components/search/advancedSearch/cqlTextArea/CqlTextArea";

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
      <CqlTextArea />
    </div>
  );
}
