import Text from "@/components/base/text";
import styles from "./FakeSearchInput.module.css";
import { openMobileSuggester } from "@/components/header/suggester/Suggester";
import Translate from "@/components/base/translate";

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
      tabIndex="0"
    >
      <div className={styles.fakeinput}>
        <Text type="text2">
          {Translate({
            context: "suggester",
            label: "placeholder",
          })}
        </Text>
      </div>
      <div className={styles.fakebutton}>
        <Text type="text2">
          {Translate({
            context: "suggester",
            label: "search",
          })}
        </Text>
      </div>
    </div>
  );
}
