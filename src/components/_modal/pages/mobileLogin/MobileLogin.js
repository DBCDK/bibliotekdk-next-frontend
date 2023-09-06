/**
 * @file MobileLogin.js
 * Login modal for mobiles with search field and pickup locations selection
 */

import Top from "@/components/_modal/pages/base/top";
import styles from "./MobileLogin.module.css";
import SearchResultList from "../login/searchResultList/SearchResultList";
import LibrarySearch from "../login/librarySearch/LibrarySearch";
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";
import PropTypes from "prop-types";
import { useState } from "react";

/**
 * Login modal for mobiles with search field and pickup locations selection for mobile phones
 * @param  {Object} context
 * @returns {JSX.Element}
 */
export default function MobileLogin({ context }) {
  const { removeModalsFromStore, isVisible, onSelect, agency } = context;

  const [query, setQuery] = useState("");

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "" })
  );

  const allBranches = !query ? agency : data?.branches?.result;
  const includeArrows = !!query;

  return (
    <div className={styles.login}>
      <Top onClose={removeModalsFromStore} />
      <LibrarySearch onChange={(q) => setQuery(q)} desktop={false} />
      <SearchResultList
        allBranches={allBranches}
        isLoading={isLoading}
        onSelect={onSelect}
        isVisible={isVisible}
        includeArrows={includeArrows}
      />
    </div>
  );
}

MobileLogin.propTypes = {
  removeModalsFromStore: PropTypes.func,
  isVisible: PropTypes.bool,
  onSelect: PropTypes.func,
  agency: PropTypes.object,
};
