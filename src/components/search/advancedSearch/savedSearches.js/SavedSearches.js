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
import { FormatedFacets } from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";
import Accordion, { Item } from "@/components/base/accordion";
import ExpandIcon from "@/components/base/animation/expand";

const formatDate = (unixtimestamp) => {
  const date = new Date(unixtimestamp);

  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}. ${month} ${year}`;
};
function SavedItemRow({ item, index, checked, onSelect, expanded, ...props }) {
  console.log("item", item);
  const formatedDate = formatDate(item.unixtimestamp);
  console.log("formatedDate", formatedDate);
  const { saveSerach, deleteSearch, savedSearchKeys } = useSavedSearches();
  const { restartFacetsHook } = useFacets();
  const isSaved = true; //if an element is shown here it means it is saved//savedSearchKeys?.includes(item.key);
  return (
    <div className={styles.savedItemRow} {...props}>
      <Checkbox />
      <Text>{formatedDate}</Text>
      <Text className={styles.searchPreview}>
        {!isEmpty(item?.fieldSearch) ? (
          <div>
            <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
          </div>
        ) : (
          <Text type="text2">{item?.cql}</Text>
        )}{" "}
      </Text>
      <Text>{item.hitcount} </Text>
      <Icon
        style={{ cursor: "pointer" }}
        size={3}
        src={`${isSaved ? "heart_filled" : "heart"}.svg`}
        onClick={() => {
          if (isSaved) {
            //remove search
            deleteSearch(item);
          } else {
            saveSerach(item);
          }
        }}
      />
      <Icon
        className={`${styles.accordionIcon} ${
          expanded ? styles.accordionExpanded : styles.accordionCollapsed
        }`}
        //   style={{
        //     transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        //   }}
        size={3}
        src={`${expanded ? "collapseCircle" : "expand"}.svg`}
      />
    </div>
  );
}

export function SavedSearches() {
  const breakpoint = useBreakpoint();
  const router = useRouter();
  const { saveSerach, deleteSearch, savedSearchKeys, savedSearches } =
    useSavedSearches();

  const isButtonVisible = (path) => router.pathname === path;

  return (
    <div className={styles.container}>
      <Title
        type="title3"
        data-cy="advanced-search-search-history"
        className={styles.title}
      >
        Søgehistorik
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
          <Text type="text1" tag="span">
            Seneste søgninger
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
          <Text type="text1" tag="span">
            Gemte søgninger
          </Text>
        </Link>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}></div>
        <Accordion>
          {savedSearches?.map((item, index) => (
            <Item
              CustomHeaderCompnent={(props) => (
                <SavedItemRow {...props} item={item} />
              )}
              key={item.key}
              eventKey={item.key}
            >
              {item.key}
            </Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
