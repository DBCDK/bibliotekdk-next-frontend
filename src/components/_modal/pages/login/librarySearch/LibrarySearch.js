import debounce from "lodash/debounce";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import styles from "./LibrarySearch.module.css";
import cx from "classnames";

export default function LibrarySearch(props) {
  const { onChange, smallScreen } = props;
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
      <Search
        dataCy="pickup-search-input"
        placeholder={Translate({
          context: "order",
          label: "pickup-input-placeholder",
        })}
        className={styles.search}
        onChange={debounce((value) => onChange(value), 100)}
      />
      <Text type="text3" className={styles.hideOnSmallScreen}>
        {Translate({ context: "login", label: "use-loan-info" })}
      </Text>
    </section>
  );
}
