import debounce from "lodash/debounce";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import styles from "./LibrarySearch.module.css";
import cx from "classnames";

export default function LibrarySearch(props) {
  const { onChange, smallScreen = false } = props;
  return (
    <section
      className={cx({
        [styles.librarySearchSection]: true,
        [styles.hideOnSmallScreen]: smallScreen,
      })}
    >
      <Text type="text2" className={styles.hideOnSmallScreen}>
        {Translate({ context: "login", label: "login-via-library" })}
      </Text>
      <Text type="text2" className={styles.hideOnLargeScreen}>
        {Translate({ context: "order", label: "pickup-search-title-2" })}
      </Text>
      <Search
        dataCy="pickup-search-input"
        placeholder={Translate({
          context: "login",
          label: "search-for-library",
        })}
        className={styles.search}
        onChange={debounce((value) => onChange(value), 100)}
      />
      <Text type="text3" className={styles.hideOnSmallScreen}>
        {Translate({ context: "login", label: "use-loan-info" })}
      </Text>
      <Text type="text3" className={styles.hideOnLargeScreen}>
        {Translate({ context: "order", label: "pickup-search-description" })}
      </Text>
    </section>
  );
}
