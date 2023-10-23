/**
 * @file - LibrarySearch.js
 * search field for pickup locations with different texts for desktop and mobile
 */

import debounce from "lodash/debounce";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import styles from "./LibrarySearch.module.css";
import PropTypes from "prop-types";

/**
 * search field for pickup locations with different texts for desktop and mobile
 * for desktop, its shown in login modal
 * @param {*} props
 * @returns {JSX.Element}s
 */
export default function LibrarySearch(props) {
  const { onChange } = props;
  return (
    <section className={styles.librarySearchSection}>
      <Text type="text2">
        {Translate({ context: "addLibrary", label: "librarySearchLabel" })}
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
      <Text type="text3">
        {Translate({ context: "login", label: "use-loan-info" })}
      </Text>
    </section>
  );
}

LibrarySearch.propTypes = {
  onChange: PropTypes.func,
  desktop: PropTypes.bool,
};
