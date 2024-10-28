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
import { useLastLoginBranch } from "@/components/hooks/useLastLoginBranch";
import { useState } from "react";
import LastLoginLibrary from "@/components/_modal/pages/login/lastLoginLibrary/LastLoginLibrary";
import useWindowSize from "@/components/hooks/useWindowSize";

/**
 * search field for pickup locations with different texts for desktop and mobile
 * for desktop, its shown in login modal
 * for mobile, its hidden in login modal and shown in a separate modal after clicking on a @MobileLoginButton
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
export default function LibrarySearch(props) {
  const { onChange, desktop } = props;
  //is true when search input is empty
  const [isSearchInputEmpty, setIsSearchInputEmpty] = useState(true);
  const windowWidth = useWindowSize().width;
  const { lastLoginBranch } = useLastLoginBranch();
  const isMobile = windowWidth <= 414;

  return (
    <section
      className={cx({
        [styles.librarySearchSection]: true,
        [styles.hide]: desktop,
      })}
    >
      {lastLoginBranch && isSearchInputEmpty && !isMobile && (
        <LastLoginLibrary context={props?.context} />
      )}
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
        onChange={debounce((value) => {
          setIsSearchInputEmpty(value?.length === 0);
          onChange(value);
        }, 100)}
      />
    </section>
  );
}

LibrarySearch.propTypes = {
  onChange: PropTypes.func,
  desktop: PropTypes.bool,
};
