import Top from "@/components/_modal/pages/base/top";
import styles from "./MobileLogin.module.css";
import SearchResultList from "../login/searchResultList/SearchResultList";
import LibrarySearch from "../login/librarySearch/LibrarySearch";
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";
import { useState } from "react";

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
      <LibrarySearch onChange={(q) => setQuery(q)} hideOnSmallScreen={false} />
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
