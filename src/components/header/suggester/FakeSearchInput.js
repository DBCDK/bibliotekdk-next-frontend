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
export default function FakeSearchInput({ query = "", className }) {
  const hasQuery = query && query !== "";
  const hasQueryClass = hasQuery ? styles.hasQuery : "";

  return (
    <div
      className={`${styles.container} ${className} ${hasQueryClass}`}
      onClick={openMobileSuggester}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          openMobileSuggester();
        }
      }}
      tabIndex="0"
    >
      <div className={styles.fakeinput} data-cy="fake-search-input">
        <Text type="text2" className={styles.placeholder}>
          {hasQuery
            ? query
            : Translate({
                context: "suggester",
                label: "placeholder",
              })}
        </Text>
        <Text type="text2" className={styles.placeholderxs}>
          {hasQuery
            ? query
            : Translate({
                context: "suggester",
                label: "placeholderMobile",
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
