import { useEffect, useState } from "react";

import merge from "lodash/merge";

import Top from "../base/top";

import Title from "@/components/base/title";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Checkbox from "@/components/base/forms/checkbox";

import Translate from "@/components/base/translate";

import useFilters, { includedTypes } from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import response from "./dummy.data";

import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Filter.module.css";
import { FilterTypeEnum } from "@/lib/enums";

function SelectedFilter({
  isLoading,
  data,
  terms,
  workType,
  onSelect,
  modal,
  active,
}) {
  const name = data?.name;
  const values = data?.values || [];

  const [sortOrder, setSortOrder] = useState("numerical");

  /**
   * Sort alphabetically by term OR numerical by count - depending on sortOrder chosen
   * @param a
   * @param b
   * @returns {boolean}
   */
  const sortFilters = (a, b) => {
    // only handle language filters
    /*if (name !== "language") {
      return 0;
    }*/
    if (sortOrder === "numerical") {
      return a.score < b.score ? 1 : -1;
    } else {
      return a.term.toLowerCase() > b.term.toLowerCase() ? 1 : -1;
    }
  };

  /**
   * Remove value.teŕms defined in remove array
   * @param value
   * @returns {boolean}
   */
  const removeLanguages = (value) => {
    // only handle language filters
    if (name !== "language") {
      return true;
    }
    const languagesToRemove = ["Miscellaneous", "Sproget kan ikke bestemmes"];
    return !languagesToRemove.includes(value?.term);
  };

  const [orderedValues, setOrderedValues] = useState(null);

  // do not show the link to sort alphabetically/numerically if there are
  // less than 2 filter values
  const showSort = values?.length > 2;

  useEffect(() => {
    if (!name || !active) {
      return;
    }

    // remove languages ("Miscellaneous", "Sproget kan ikke bestemmes")
    const valuecopy = values.filter(removeLanguages);

    // selected facets
    const selectedWithHits = valuecopy?.filter(
      (value) => terms.includes(value.term) || terms.includes(value.key)
    );
    // the rest of the facets
    const selectedNoHits = valuecopy
      .filter((el) => !selectedWithHits.includes(el))
      .sort(sortFilters);

    const nonSelected = valuecopy
      .filter((el) => !selectedWithHits.includes(el))
      .filter((el) => !selectedNoHits.includes(el));

    setOrderedValues([...selectedWithHits, ...selectedNoHits, ...nonSelected]);
  }, [name, active, sortOrder]);

  if (!name || !orderedValues) {
    return null;
  }

  // handle term select
  function handleTermSelect(title) {
    let copy = [...terms];

    const index = copy.indexOf(title);
    // remove if already exist
    if (index > -1) {
      copy.splice(index, 1);
    } else {
      copy.push(title);
    }

    onSelect({ [name]: copy });
  }

  // Get workType specific title if set, else fallback to title
  const category = Translate({
    context: "facets",
    label: workType ? `label-${workType}-${name}` : `label-${name}`,
  });

  return (
    <>
      <Top modal={modal} back sticky />
      <div className={styles.divflex}>
        <Text type="text1" className={styles.category}>
          {category}
        </Text>
        {showSort && (
          <Link
            dataCy={`${category}-SORT`}
            border={{ top: false, bottom: { keepVisible: true } }}
            onClick={() => {
              setSortOrder(
                sortOrder === "numerical" ? "alphabetically" : "numerical"
              );
            }}
            className={styles.sortlink}
          >
            <Text type="text3">
              {Translate({
                context: "facets",
                label: `label-sortorder-${sortOrder}`,
              })}
            </Text>
          </Link>
        )}
      </div>
      <List.Group
        label={Translate({ context: "facets", label: "terms-group-label" })}
        className={`${styles.group} ${styles.terms}`}
        enabled={!isLoading}
        data-cy="list-terms"
      >
        {orderedValues?.map((term, idx) => {
          const title = term.term;
          const key = term.key;

          const isCheked = terms.includes(title);

          return (
            <List.Select
              key={`${key}-${idx}`}
              selected={false}
              onSelect={() => handleTermSelect(title)}
              label={title}
              className={`${styles.select} ${animations["on-hover"]}`}
              includeArrows={false}
              labelledBy={`checkbox-item-${name}-${idx}`}
            >
              <div className={styles.wrap}>
                <Checkbox
                  checked={isCheked}
                  id={`checkbox-${title}`}
                  ariaLabel={Translate({
                    context: "facets",
                    label: "checkbox-aria-label",
                    vars: [title],
                  })}
                  readOnly
                  tabIndex="-1"
                />
                <Text
                  id={`checkbox-item-${name}-${idx}`}
                  lines={1}
                  skeleton={isLoading}
                  type="text3"
                  dataCy={`text-${title}`}
                  className={[
                    styles.term,
                    animations["h-border-bottom"],
                    animations["h-color-blue"],
                  ].join(" ")}
                >
                  {title}
                </Text>
                {/* outcommented for now - let's see ..
                <Text
                  lines={1}
                  skeleton={isLoading}
                  type="text3"
                  dataCy={`text-${score}`}
                  className={styles.score}
                >
                  {score}
                </Text>*/}
              </div>
            </List.Select>
          );
        })}
      </List.Group>
    </>
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Filter(props) {
  const { data, selected, onSubmit, onClear, isLoading, modal, context } =
    props;

  // facet data
  const facets = data?.search?.facets || [];

  // Facet will contain a specific selected facet/category, if any selected
  const { facet } = context;

  // Global excluded categories
  const excluded = [FilterTypeEnum.WORK_TYPES];

  // extract workType if any selected
  const workType = selected.workTypes?.[0];

  // currently
  const selectedFacet = facet && facets.find((obj) => obj.name === facet?.name);

  return (
    <div className={`${styles.filter}`} data-cy="filter-modal">
      {facet ? (
        <SelectedFilter
          {...props}
          terms={selected?.[facet.name] || []}
          workType={workType}
          data={selectedFacet}
        />
      ) : (
        <>
          <Top modal={modal} back={false} />
          <span className={styles.wrap}>
            <Title type="title4" className={styles.title}>
              {Translate({
                context: "modal",
                label: "title-filter",
              })}
            </Title>
            <Link
              dataCy="clear-all-filters"
              className={styles.clear}
              onClick={() => onClear && onClear()}
              border={{ bottom: { keepVisible: true } }}
            >
              <Text type="text3">
                {Translate({
                  context: "general",
                  label: "clearAll",
                })}
              </Text>
            </Link>
          </span>

          <List.Group
            enabled={!isLoading}
            data-cy="list-facets"
            className={styles.group}
            label={Translate({
              context: "facets",
              label: "facets-group-label",
            })}
          >
            {facets
              .map((facet, idx) => {
                // exclude unwanted categories (see excluded array)
                if (excluded.includes(facet.name)) {
                  return null;
                }
                // remove Empty categories
                if (facet.values.length === 0) {
                  return null;
                }

                // selected terms in this category
                const selectedTerms = selected?.[facet.name];

                // Get workType specific title if set, else fallback title
                const title = Translate({
                  context: "facets",
                  label: workType
                    ? `label-${workType}-${facet.name}`
                    : `label-${facet.name}`,
                });

                return (
                  <List.Select
                    key={`${facet.name}-${idx}`}
                    selected={false}
                    onSelect={() => modal.push("filter", { facet })}
                    label={facet.name}
                    className={`${styles.item} ${animations["on-hover"]}`}
                    includeArrows={true}
                    labelledBy={`checkbox-item-${facet.name}`}
                  >
                    <span>
                      <Text
                        id={`checkbox-item-${facet.name}`}
                        lines={1}
                        skeleton={isLoading}
                        type="text1"
                        dataCy={`text-${facet.name}`}
                        className={[
                          styles.facet,
                          animations["h-border-bottom"],
                          animations["h-color-blue"],
                        ].join(" ")}
                      >
                        {title}
                      </Text>
                      {selectedTerms?.length > 0 && (
                        <Text type="text3" className={styles.selected}>
                          {selectedTerms.join(", ")}
                        </Text>
                      )}
                    </span>
                  </List.Select>
                );
              })
              .filter((c) => c)}
          </List.Group>
          <Button
            dataCy="vis-resultater"
            skeleton={isLoading}
            onClick={() => onSubmit && onSubmit()}
            className={styles.submit}
          >
            {Translate({
              context: "search",
              label: "showXResults",
              vars: [null],
            })}
          </Button>
        </>
      )}
    </div>
  );
}

export function FilterSkeleton() {
  // dummy data
  const dummy = response.data;

  return (
    <Filter
      isLoading={true}
      data={dummy}
      selected={{}}
      modal={{}}
      context={{}}
    />
  );
}

export default function Wrap(props) {
  const { modal, context } = props;

  // update query params when modal closes
  useEffect(() => {
    if (!modal.isVisible && modal.hasBeenVisible) {
      setQuery({ exclude: ["modal"] });
    }
  }, [modal.isVisible]);

  // get search query from context
  const { facet } = context;

  // connected filters hook
  const { filters, setFilters, setQuery } = useFilters();

  // connected q hook
  const { hasQuery, getQuery } = useQ();

  // Get q object
  const q = getQuery();

  // extract selected workType, if any
  const workType = filters.workTypes?.[0];

  // Exclude irrelevant worktype categories
  // undefined will result in a include-all fallback at the fragment api call function.
  const facetFilters = (workType && includedTypes[workType]) || undefined;

  // hitcount according to selected filters
  const { data: hitcountData } = useData(
    hasQuery && searchFragments.hitcount({ q, filters })
  );

  // On a specific filter category page we make sure to remove filters from within that category.
  // This will make sure facet hitcounts won't change, when you select/unselect filters.
  const filtersForCategory =
    facet && filters?.[facet?.name]
      ? { ...filters, [facet?.name]: [] }
      : filters;

  // facets according to query filters
  const { data, isLoading } = useData(
    hasQuery &&
      searchFragments.facets({
        q,
        filters: filtersForCategory,
        facets: facetFilters,
      })
  );

  // merge data
  const mergedData = merge({}, data, hitcountData);

  if (isLoading) {
    return <FilterSkeleton {...props} />;
  }

  // Dont clear the workType filter onClear
  const excludeOnClear = { workTypes: filters.workTypes };

  return (
    <Filter
      data={mergedData}
      selected={filters}
      onSelect={(selected) => {
        // Updates selected filter in useFilters
        setFilters({ ...filters, ...selected });
      }}
      onSubmit={() => {
        // exclude modal param -> will close the modal on submit
        setQuery({ exclude: ["modal"] });
      }}
      onClear={() => setFilters({ ...excludeOnClear })}
      {...props}
    />
  );
}
