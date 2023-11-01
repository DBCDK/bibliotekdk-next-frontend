import Title from "@/components/base/title";
import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";
import TextInputs from "../fieldInput/TextInputs";
import { CqlTextArea } from "@/components/search/advancedSearch/cqlTextArea/CqlTextArea";

/**
 * Contains advanced search fields
 * @returns {React.JSX.Element}
 */

export default function AdvancedSearch() {
  const workType = "all";
  return (
    <div className={styles.container}>
      <Title type="title3" className={styles.title}>
        {Translate({ context: "search", label: "advancedSearch" })}
      </Title>
      <TextInputs workType={workType} />
      <CqlTextArea />
    </div>
  );
}
