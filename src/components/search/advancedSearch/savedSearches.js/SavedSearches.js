import React, { useState } from "react";
import useAdvancedSearchHistory, {
  getDateTime,
  getTimeStamp,
} from "@/components/hooks/useAdvancedSearchHistory";
import styles from "./SavedSearches.module.css";
import Text from "@/components/base/text";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import { FormatFieldSearchIndexes } from "@/components/search/advancedSearch/advancedSearchResult/topBar/TopBar";
import Link from "@/components/base/link/Link";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title/Title";
import cx from "classnames";
import { cyKey } from "@/utils/trim";
import Icon from "@/components/base/icon/Icon";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import MenuDropdown from "@/components/base/dropdown/menuDropdown/MenuDropdown";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import Button from "@/components/base/button";
import CombinedSearch from "@/components/search/advancedSearch/combinedSearch/CombinedSearch";
import useSavedSearches from "../../../hooks/useSavedSearches";



export function SavedSearches() {

  const breakpoint = useBreakpoint();
  const router = useRouter();
  const { saveSerach, deleteSearch, savedSearchKeys, savedSearches } = useSavedSearches();

  const isButtonVisible = (path) => router.pathname === path;


  return (
    <div className={styles.container}>
      <Title
        type="title3"
        data-cy="advanced-search-search-history"
        className={styles.title}
      >
        Gemte søgninger
      </Title>
      <div className={styles.navigationButtons}>
        {/**TODO: export this to a seperate component? reuse from search history */}
        <Link
          onClick={() => router.push("/avanceret/soegehistorik")}
          border={{
            top: false,
            bottom: {
              keepVisible: isButtonVisible("/avanceret/soegehistorik"),
            },
          }}
        >
          <Text type="text3" tag="span">
            seneste søgninger
          </Text>
        </Link>

        <Link
          onClick={() => router.push("/avanceret/gemte-soegninger")}
          // href="/avanceret/gemte-soegninger"
          border={{
            top: false,
            bottom: {
              keepVisible: isButtonVisible("/avanceret/gemte-soegninger"),
            },
          }}
        >
          <Text type="text3" tag="span">
            Gemte søgninger
          </Text>
        </Link>
      </div>
      <div className={styles.tableContainer}>

      {savedSearches?.map(search=><p>{search.key}</p>)}
      </div>

    </div>
  );
}
