import PropTypes from "prop-types";
import { useState } from "react";

import Title from "@/components/base/title";

import Top from "@/components/_modal/pages/base/top";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";

import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";

import { signIn } from "next-auth/react";
import getConfig from "next/config";
import Router from "next/router";
import { showLoanerForm } from "./utils";
import MitIDButton from "./mitIDButton/MitIDButton";
import LibrarySearch from "./librarySearch/LibrarySearch";

import styles from "./Login.module.css";
import SearchResultList from "./searchResultList/SearchResultList";
import MobileLoginButton from "./mobileLoginButton/MobileLoginButton";

/**
 * @param {obj}
 * @param {boolean}data
 * @param className
 * @param {boolean} isVisible
 * @param {function} onChange
 * @param {boolean} hasQuery dont show loading skeleton if there is no query / before user has typed anything
 * @param {boolean} isLoading
 * @param includeArrows
 * @param {obj} modal
 * @param {obj} context
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
  const APP_URL =
    getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

  // remove all modal params from callbackurl - to avoid redirect to modal after coming back from login
  const regexp = /(\?|&)modal=\d+$/g;

  const callbackurl = `${APP_URL}${Router.asPath}`.replace(regexp, "");

  //TODO also check on if large screen
  const showResultsList = hasQuery && allBranches?.length > 0;
  const showMitIDLogin = !hasQuery || !allBranches || allBranches.length < 1;

  const onSelect = (branch) => {
    //if we have callbackUID, we want to redirect to order modal after login and therefor, we append it to url
    let newUrl = callbackUID
      ? callbackurl + `&modal=${callbackUID}`
      : callbackurl;

    if (branch?.borrowerCheck) {
      modal.push("openAdgangsplatform", {
        callbackUrl: newUrl,
        agencyId: branch.agencyId,
        agencyName: originUrl ? originUrl : branch.agencyName, //TODO do we have originUrl and how does it look like?
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
      <LibrarySearch onChange={onChange} smallScreen={true} />
      {/* only shown up to 414px /> */}
      <MobileLoginButton
        context={context}
        onChange={onChange}
        allBranches={allBranches}
        onSelect={onSelect}
        isLoading={isLoading}
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
      {showMitIDLogin && <MitIDButton callbackUrl={callbackurl} />}
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
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { agency, originUrl = null } = props;

  const [query, setQuery] = useState("");

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "" })
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

  const branches = !query ? agency : data?.branches;
  const includeArrows = !!query;
  return (
    <Login
      {...props}
      isLoading={isLoading}
      data={isLoading ? dummyData : branches}
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
