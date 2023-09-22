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
import cx from "classnames";

/**
 * search field for pickup locations with different texts for desktop and mobile
 * for desktop, its shown in login modal
 * for mobile, its hidden in login modal and shown in a separate modal after clicking on a @MobileLoginButton
 * @param {*} props
 * @returns {JSX.Element}s
 */
export default function LibrarySearch(props) {
  const { onChange, desktop } = props;
  return (
    <section
      className={cx({
        [styles.librarySearchSection]: true,
        [styles.hide]: desktop,
      })}
    >
      <Text type="text2">
        {desktop
          ? Translate({ context: "login", label: "login-via-library" })
          : Translate({ context: "order", label: "pickup-search-title-2" })}
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
        {desktop
          ? Translate({ context: "login", label: "use-loan-info" })
          : Translate({ context: "order", label: "pickup-search-description" })}
      </Text>
    </section>
  );
}

LibrarySearch.propTypes = {
  onChange: PropTypes.func,
  desktop: PropTypes.bool,
};
