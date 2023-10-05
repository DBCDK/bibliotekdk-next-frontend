/**
 * @file - Login.js
 * contains the login page for login modal
 */

import PropTypes from "prop-types";
import { useState } from "react";

import Title from "@/components/base/title";

import Top from "@/components/_modal/pages/base/top";

import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";

import { signIn } from "next-auth/react";

import LibrarySearch from "./librarySearch/LibrarySearch";

import Translate from "@/components/base/translate/Translate";

import SearchResultList from "./searchResultList/SearchResultList";
import useWindowSize from "@/components/hooks/useWindowSize";

import styles from "./AddLibrary.module.css";

/**
 * contains the login page for login modal - both for desktop and mobile
 * for mobile, the page shows a button, which opens a new modal with pickup locations selection and MitID login button
 * for desktop, the page shows a search field, which filters the pickup locations and MitID login button
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
export function AddLibrary({
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
  const { title } = context;
  const windowWidth = useWindowSize().width;
  const isMobile = windowWidth <= 414;

  const showResultsList = hasQuery && allBranches?.length > 0 && !isMobile;

  const onSelect = (branch) => {
    if (branch?.borrowerCheck) {
      const adgangsplatformTitle = Translate({
        context: "addLibrary",
        label: "adgangsplatformTitle",
        vars: [branch.agencyName],
      });
      const adgangsplatformText = Translate({
        context: "addLibrary",
        label: "adgangsplatformText",
      });

      const UID = modal.saveToStore("verify", {
        branchId: branch.branchId,
        agencyName: branch.agencyName,
        callbackUID: UID,
      });

      modal.push("openAdgangsplatform", {
        title: adgangsplatformTitle,
        text: adgangsplatformText,
        agencyId: branch.agencyId,
        branchId: branch.branchId,
        agencyName: branch.agencyName,
        callbackUID: UID,
      });
    }
    // if Agency doesn't support borchk - show error in modal
    else {
      const errorTitle = Translate({
        context: "errorMessage",
        label: "addLibraryNoBorchkTitle",
      });
      const errorText = Translate({
        context: "errorMessage",
        label: "addLibraryNoBorchkText",
        vars: [`<strong>${branch.agencyName}</strong>`],
        renderAsHtml: true,
      });

      modal.push("errorMessage", {
        title: errorTitle,
        text: errorText,
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

      <LibrarySearch onChange={onChange} />

      {showResultsList && (
        <SearchResultList
          allBranches={allBranches}
          isLoading={isLoading}
          onSelect={onSelect}
          isVisible={isVisible}
          includeArrows={includeArrows}
        />
      )}
    </div>
  );
}

AddLibrary.propTypes = {
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
  const { originUrl = null } = props;

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

  const includeArrows = !!query;

  return (
    <AddLibrary
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
