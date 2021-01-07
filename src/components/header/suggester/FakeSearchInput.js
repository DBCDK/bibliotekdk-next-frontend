import Text from "@/components/base/text";
import styles from "./FakeSearchInput.module.css";
import { openMobileSuggester } from "@/components/header/suggester/Suggester";

/**
 * A Fake Search Input Field
 * It looks like an input field, but its just styled that way
 * It acts like a button to open the mobile suggester modal
 *
 *
 * @param {obj} props
 * @param {string} props.className
 *
 * @returns {component}
 */
export default function FakeSearchInput({ className }) {
  return (
    <div
      className={`${styles.container} ${className}`}
      onClick={openMobileSuggester}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          openMobileSuggester();
        }
      }}
      tabindex="0"
    >
      <div className={styles.fakeinput}>
        <Text type="text2">Søg på bøger, film, osv.</Text>
      </div>
      <div className={styles.fakebutton}>
        <Text type="text2">Søg</Text>
      </div>
    </div>
  );
}
