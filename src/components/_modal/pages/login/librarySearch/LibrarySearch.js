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
import Select from "@/components/_modal/pages/login/Select";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";
import { signIn } from "@dbcdk/login-nextjs/client";
import { useState } from "react";

/**
 * search field for pickup locations with different texts for desktop and mobile
 * for desktop, its shown in login modal
 * for mobile, its hidden in login modal and shown in a separate modal after clicking on a @MobileLoginButton
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
export default function LibrarySearch(props) {
  const { onChange, desktop } = props;
  const [isSearchInputEmpty, setIsSearchInputEmpty] = useState(true);
  const { lastLoginBranch } = useLastLoginBranch();
  const branchId = lastLoginBranch?.branchId;

  const onLogin = () => {
    const callbackUrl = getCallbackUrl(branchId);

    signIn(
      "adgangsplatformen",
      { callbackUrl },
      { agency: branchId, force_login: 1 }
    );
  };

  return (
    <section
      className={cx({
        [styles.librarySearchSection]: true,
        [styles.hide]: desktop,
      })}
    >
      {lastLoginBranch && isSearchInputEmpty && (
        <>
          <Text type="text1">
            {Translate({ context: "login", label: "latest-login" })}
          </Text>
          <Select
            className={styles.select}
            branch={lastLoginBranch}
            onSelect={onLogin}
            includeArrows={true}
          />

          <Text className={styles.otherOptions} type="text1">
            {Translate({ context: "login", label: "other-options" })}
          </Text>
        </>
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
