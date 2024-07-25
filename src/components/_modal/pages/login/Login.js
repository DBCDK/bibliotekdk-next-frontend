/**
 * @file - Login.js
 * contains the login page for login modal
 */

import PropTypes from "prop-types";
import { useState } from "react";

import Title from "@/components/base/title";

import Top from "@/components/_modal/pages/base/top";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";

import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";

import { signIn } from "@dbcdk/login-nextjs/client";
import { showLoanerForm } from "./utils";
import MitIDButton from "./mitIDButton/MitIDButton";
import LibrarySearch from "./librarySearch/LibrarySearch";

import styles from "./Login.module.css";
import SearchResultList from "./searchResultList/SearchResultList";
import MobileLoginButton from "./mobileLoginButton/MobileLoginButton";
import useWindowSize from "@/components/hooks/useWindowSize";
import { useLastLoginBranch } from "@/components/hooks/useLastLoginBranch";

/**
 * contains the login page for login modal - both for desktop and mobile
 * for mobile, the page shows a button, which opens a new modal with pickup locations selection and MitID login button
 * for desktop, the page shows a search field, which filters the pickup locations and MitID login button
 * @param {Object}
 * @param {boolean}data
 * @param className
 * @param {boolean} isVisible
 * @param {function} onChange
 * @param {boolean} hasQuery dont show loading skeleton if there is no query / before user has typed anything
 * @param {boolean} isLoading
 * @param includeArrows
 * @param {Object} modal
 * @param {Object} context
 * @param {string} title
 */
export function Login({
  data,
  isVisible,
  onChange,
  hasQuery,
  isLoading,
  includeArrows,
  modal,
  context,
}) {
  const allBranches = data?.result;
  const {
    title,
    mode = LOGIN_MODE.PLAIN_LOGIN,
    originUrl = null,
    pids = [],
    selectedAccesses = [],
    workId = null,
    singleManifestation = null,
    callbackUID = null,
  } = context || {};
  const windowWidth = useWindowSize().width;
  const isMobile = windowWidth <= 414;

  const showResultsList = hasQuery && allBranches?.length > 0 && !isMobile;
  const showMitIDLogin =
    !hasQuery || !allBranches || allBranches.length < 1 || isMobile;
  const { setLastLoginBranch } = useLastLoginBranch();
  const onSelect = (branch) => {
    //spørg morten om alle har branch id
    if (branch.branchId) {
      setLastLoginBranch(branch);
    }
    //save last login branch id
    if (branch?.borrowerCheck) {
      modal.push("openAdgangsplatform", {
        agencyId: branch.agencyId,
        branchId: branch.branchId,
        agencyName: originUrl ? originUrl : branch.agencyName, //TODO do we have originUrl and how does it look like?
        callbackUID: callbackUID,
      });
      return;
    }
    if (showLoanerForm(mode)) {
      modal.push("loanerform", {
        branchId: branch.branchId,
        pids: pids,
        selectedAccesses: selectedAccesses,
        workId: workId,
        singleManifestation: singleManifestation,
      });
    } else {
      modal.push("loginNotSupported", {
        libraryName: branch.agencyName,
      });
    }
  };

  /**
   * If we close the login modal without loggin in,
   * we need to remove f. ex. order modal from store,
   * which we would have opened after login
   */
  function removeModalsFromStore() {
    modal.setStore([]);
  }

  return (
    <div className={styles.login}>
      <Top onClose={removeModalsFromStore} />
      <div>
        <Title type="title4" className={styles.title} tag="h2">
          {title}
        </Title>
      </div>
      {/* shown above 414px /> */}
      <LibrarySearch
        onChange={onChange}
        desktop={true}
        onLibrarySelect={onSelect}
      />
      {/* shown up to 414px /> */}
      <MobileLoginButton
        title={title}
        onChange={onChange}
        removeModalsFromStore={removeModalsFromStore}
        isLoading={isLoading}
        onSelect={onSelect}
        isVisible={isVisible}
        includeArrows={includeArrows}
      />
      {showResultsList && (
        <SearchResultList
          allBranches={allBranches}
          isLoading={isLoading}
          onSelect={onSelect}
          isVisible={isVisible}
          includeArrows={includeArrows}
        />
      )}
      {showMitIDLogin && <MitIDButton callBackUUID={callbackUID} />}
    </div>
  );
}

Login.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.object,
  onChange: PropTypes.func,
};

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const { originUrl = null } = props;

  const [query, setQuery] = useState("");

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "", limit: 50 })
  );

  const dummyData = {
    hitcount: 10,
    result: [
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a branch name" },
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a branch name" },
    ],
  };

  const includeArrows = !!query;

  return (
    <Login
      {...props}
      isLoading={isLoading}
      data={isLoading ? dummyData : data?.branches}
      onChange={(q) => setQuery(q)}
      hasQuery={!!query}
      includeArrows={includeArrows}
      onLogin={signIn}
      origin={originUrl}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  skeleton: PropTypes.bool,
};
