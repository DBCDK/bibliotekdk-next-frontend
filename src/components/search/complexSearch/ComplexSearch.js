
import Title from "@/components/base/title";
import styles from "./ComplexSearch.module.css";
import Translate from "@/components/base/translate/Translate";

/**
 * @returns {React.JSX.Element}
 *
 */

export default function ComplexSearch() {
  return (
    <div className={styles.container}>
    <Title type="title3">{Translate({context:"search", label:"complexSearch"})}</Title>
    </div>
  );
}
