import Text from "@/components/base/text";
import styles from "./FakeSearchInput.module.css";
import Translate from "@/components/base/translate";
import ClearSvg from "@/public/icons/close.svg";
import Icon from "@/components/base/icon";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

/**
 * A Fake Search Input Field
 * It looks like an input field, but its just styled that way
 * It acts like a button to open the mobile suggester modal
 *
 *
 * @param {Object} props
 * @param {string} props.className
 *
 * @returns {React.JSX.Element}
 */
export default function FakeSearchInput({ className, showButton = true }) {
  const { setShowPopover } = useAdvancedSearchContext();

  return (
    <div
      className={`${styles.container} ${className}`}
      tabIndex="0"
      onClick={() => setShowPopover(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setShowPopover(true);
        }
      }}
    >
      <div className={styles.fakeinput} data-cy="fake-search-input">
        <Text type="text2" className={styles.placeholder}>
          {Translate({
            context: "suggester",
            label: "placeholder",
          })}
        </Text>
        <Text type="text2" className={styles.placeholderxs}>
          {Translate({
            context: "suggester",
            label: "placeholderMobile",
          })}
        </Text>
        <span data-cy="fake-search-input-clear" className={`${styles.clear}`}>
          <Icon size={{ w: "auto", h: 2 }} alt="">
            <ClearSvg />
          </Icon>
        </span>
      </div>
      {showButton && (
        <div className={styles.fakebutton} data-cy="fake-search-input-button">
          <Text type="text2">
            {Translate({
              context: "suggester",
              label: "search",
            })}
          </Text>
        </div>
      )}
    </div>
  );
}
