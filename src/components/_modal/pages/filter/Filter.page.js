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
import QuickFilter from "@/components/search/advancedSearch/quickfilter/QuickFilter";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

function SelectedFilter({
  isLoading,
  data,
  terms,
  workType,
  onSelect,
  modal,
  active,
  origin,
  translateContext = "facets",
}) {
  const name = data?.name;
  const values = data?.values || [];

  const [sortOrder, setSortOrder] = useState("numerical");

  const { sortChronological } = useFacets();
  const sortByTerm = sortChronological?.includes(name);
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
      if (sortByTerm) {
        return Number(a.term) > Number(b.term) ? -1 : +1;
      }
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

    // selected, but term is not not in facet result
    const selectedNoHits = terms
      .filter(
        (term) => !valuecopy.find((el) => term === el.term || term === el.key)
      )
      .map((term) => ({ key: term, term, score: 0 }));

    const nonSelected = valuecopy
      .filter((el) => !selectedWithHits.includes(el))
      .filter((el) => !selectedNoHits.includes(el))
      .sort(sortFilters);

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

    console.log({ [name]: copy }, "SÅDAN SKAL DE SE UD");
    onSelect({ [name]: copy });
  }

  // Get workType specific title if set, else fallback to title
  const category = Translate({
    context: translateContext,
    label: workType ? `label-${workType}-${name}` : `label-${name}`,
  });

  return (
    <>
      <Top modal={modal} back sticky />
      <div className={styles.divflex}>
        <Text type="text1">{category}</Text>
        {showSort && (
          <Link
            dataCy={`${category}-SORT`}
            border={{ top: false, bottom: { keepVisible: true } }}
            onClick={() => {
              setSortOrder(
                sortOrder === "numerical" ? "alphabetically" : "numerical"
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSortOrder(
                  sortOrder === "numerical" ? "alphabetically" : "numerical"
                );
              }
            }}
          >
            <Text type="text3" tag="span">
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
        {orderedValues
          // TODO: Remove when AI has fixed their thing
          ?.filter((term) => term.term !== "sammensat materiale")
          ?.map((term, idx) => {
            const title = term.term;
            const key = term.key;
            const score = term.score;

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
                  {/* show facet count for mobileFacets (complex search) only */}
                  {origin === "mobileFacets" && (
                    <Text
                      lines={1}
                      skeleton={isLoading}
                      type="text3"
                      dataCy={`text-${score}`}
                      className={styles.score}
                    >
                      {score}
                    </Text>
                  )}
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
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function Filter(props) {
  const {
    data,
    selected,
    onSubmit,
    onClear,
    isLoading,
    modal,
    context,
    origin,
    cql,
    translateContext = "facets",
  } = props;

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

  const hitcount = data?.search?.hitcount;

  return (
    <div className={`${styles.filter}`} data-cy="filter-modal">
      {facet ? (
        <SelectedFilter
          {...props}
          terms={selected?.[facet.name] || []}
          workType={workType}
          data={selectedFacet}
          translateContext={translateContext}
        />
      ) : (
        <>
          <Top modal={modal} back={false} />
          <span className={styles.wrap}>
            <Title type="title4" tag="h2">
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
          {origin === "mobileFacets" && <QuickFilter />}
          <List.Group
            enabled={!isLoading}
            data-cy="list-facets"
            className={styles.group}
            label={Translate({
              context: translateContext,
              label: "facets-group-label",
            })}
            disableGroupOutline
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
                  context: translateContext,
                  label: workType
                    ? `label-${workType}-${facet.name}`
                    : `label-${facet.name}`,
                });

                return (
                  <List.FormLink
                    key={`${facet.name}-${idx}`}
                    onSelect={() =>
                      modal.push(origin, { facet: facet, cql: cql })
                    }
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
                  </List.FormLink>
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
              label: hitcount > 1 ? "showXResults" : "showXResult",
              vars: origin === "mobileFacets" ? [hitcount] : [null],
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
      const page = !isSynced ? ["page"] : [];
      setQuery({ exclude: ["modal", ...page] });
    }
  }, [modal.isVisible]);

  // get search query from context
  const { facet } = context;

  // connected filters hook
  const { filters, setFilters, setQuery, isSynced } = useFilters();

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
        const page = !isSynced ? ["page"] : [];
        setQuery({ exclude: ["modal", ...page] });
      }}
      onClear={() => setFilters({ ...excludeOnClear })}
      {...props}
      origin="filter"
    />
  );
}
