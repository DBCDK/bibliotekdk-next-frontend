import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";
import cx from "classnames";
import styles from "./AdvancedSearchSort.module.css";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import animations from "css/animations";
import Link from "@/components/base/link";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

export const SortOrderEnum = Object.freeze({
  ASC: "asc",
  DESC: "desc",
});

export const SortIndexEnum = Object.freeze({
  SORT_LATEST_PUBLICATION_DATE: "sort.latestpublicationdate",
  SORT_CREATOR: "sort.creator",
  SORT_TITLE: "sort.title",
});

export function getSortTranslation(sortIndex, sortOrder) {
  return Translate({
    context: "advanced_search_sort",
    label: `${sortOrder}_${sortIndex}`.toLowerCase(),
  });
}

function sortOrderRevers(sortorder) {
  return sortorder === SortOrderEnum.ASC
    ? SortOrderEnum.DESC
    : SortOrderEnum.ASC;
}

function mergeSingleSorter({ index: sortIndex, order: sortOrder }) {
  // bug https://dbcjira.atlassian.net/browse/BIBDK2021-2387 -
  // we need to revert for dates (SortIndexEnum.SORT_LATEST_PUBLICATION_DATE) - asc is oldest first - makes sense for text - NOT dates
  sortOrder =
    sortIndex === SortIndexEnum.SORT_LATEST_PUBLICATION_DATE
      ? sortOrderRevers(sortOrder)
      : sortOrder;
  // END bug
  return {
    sortTranslation: getSortTranslation(sortIndex, sortOrder),
    sort: [
      {
        index: sortIndex,
        order: sortOrder,
      },
    ],
  };
}

function mergeSorters() {
  return Object.values(SortIndexEnum).flatMap((sortIndex) => {
    return Object.values(SortOrderEnum).map((sortOrder) => {
      return mergeSingleSorter({ index: sortIndex, order: sortOrder });
    });
  });
}

function handleOnSort(router, sortElement) {
  const query = {
    ...router.query,
    ...(!isEmpty(sortElement.sort) && {
      sort: JSON.stringify(sortElement.sort),
    }),
  };

  isEmpty(sortElement.sort) && delete query.sort;

  router.push(
    {
      pathname: router.pathname,
      query: query,
    },
    undefined,
    { scroll: false }
  );
}

export default function AdvancedSearchSort({ className }) {
  const router = useRouter();

  const { sort } = useAdvancedSearchContext();

  const bestMatch = {
    sortTranslation: Translate({
      context: "advanced_search_sort",
      label: "best_match",
    }),
    sort: [],
  };
  const sortings = [bestMatch, ...mergeSorters()];

  const iconSrc = "arrowDown.svg";
  const iconSimpleAnimations =
    iconSrc === "chevron_right.svg" &&
    cx(animations["h-elastic"], animations["f-elastic"]);

  return (
    <nav className={cx(className)}>
      <Text tag="span" type="text3" className={cx(styles.upper_first)}>
        {Translate({ context: "advanced_search_sort", label: "sort_button" })}:
      </Text>
      <Dropdown className={cx(styles.nav_element)}>
        <Dropdown.Toggle
          variant="success"
          size="sm"
          id="dropdown-basic"
          className={cx(styles.menuButton)}
        >
          <Text tag="span" type="text3" className={cx(styles.upper_first)}>
            <Link
              border={{ bottom: { keepVisible: true } }}
              href={false}
              onClick={() => {}}
            >
              {!isEmpty(sort)
                ? getSortTranslation(sort?.[0]?.index, sort?.[0]?.order)
                : bestMatch}
            </Link>
          </Text>
          <span className={styles.icon_area}>
            <Icon
              size={{ w: 2, h: 2 }}
              src={iconSrc}
              className={cx(styles.icon, iconSimpleAnimations, {
                [styles.icon_open]: iconSrc === "arrowDown.svg",
              })}
              alt=""
            />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.dropdown_items}>
          {sortings.map((sortElement) => {
            return (
              <Dropdown.Item
                tabIndex="-1"
                data-cy={`item-${sortElement.sortTranslation}`}
                key={`indexDropdown-${sortElement.sortTranslation}`}
                className={styles.dropdown_item}
                onClick={() => handleOnSort(router, sortElement)}
              >
                <Text
                  tag="span"
                  type="text3"
                  className={cx(styles.upper_first)}
                >
                  {sortElement?.sortTranslation}
                </Text>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  );
}
