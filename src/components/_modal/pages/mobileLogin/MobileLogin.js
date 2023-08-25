import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import styles from "./MobileLogin.module.css";
import SearchResultList from "../login/searchResultList/SearchResultList";
import LibrarySearch from "../login/librarySearch/LibrarySearch";

export default function MobileLogin({ context }) {
  const { removeModalsFromStore, onChange } = context;
  return (
    <div className={styles.login}>
      <Top onClose={removeModalsFromStore} />
      <LibrarySearch onChange={onChange} hideOnSmallScreen={false} />
      {/* <SearchResultList {...context} /> */}
    </div>
  );
}
