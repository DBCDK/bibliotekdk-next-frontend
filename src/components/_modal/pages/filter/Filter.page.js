import { useEffect, useMemo } from "react";

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

import response from "./dummy.data";

import { useData } from "@/lib/api/api";
import { facets, hitcount } from "@/lib/api/search.fragments";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Filter.module.css";

function SelectedFilter({ isLoading, terms, onSelect, modal, context }) {
  // selected facet ("category")
  const { facet } = context;

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

    onSelect({ [facet.name]: copy });
  }

  return (
    <>
      <Top modal={modal} back sticky />

      <Text type="text1" className={styles.category}>
        {Translate({
          context: "facets",
          label: `label-${facet.name}`,
        })}
      </Text>
      <List.Group
        className={`${styles.group} ${styles.terms}`}
        enabled={!isLoading}
        data-cy="list-terms"
      >
        {facet?.values.map((term, idx) => {
          const title = term.term;
          const key = term.key;
          const count = term.count;

          const isCheked = terms.includes(title);

          return (
            <List.Select
              key={`${key}-${idx}`}
              selected={false}
              onSelect={() => handleTermSelect(title)}
              label={title}
              className={`${styles.select} ${animations["on-hover"]}`}
              includeArrows={false}
            >
              <div className={styles.wrap}>
                <Checkbox
                  checked={isCheked}
                  id={`checkbox-${title}`}
                  readOnly
                  tabIndex="-1"
                />
                <Text
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
                <Text
                  lines={1}
                  skeleton={isLoading}
                  type="text3"
                  dataCy={`text-${count}`}
                  className={styles.count}
                >
                  {count}
                </Text>
              </div>
            </List.Select>
          );
        })}
      </List.Group>
    </>
  );
}

/**
 *
 * function to build selected filters
 *
 * @param {array} facet
 * @param {array} selected
 *
 * @returns {component}
 */
function Selected({ facet, selected }) {
  const match = useMemo(
    () => selected.map((s) => facet.values.find((f) => f.key === s)),
    [facet, selected]
  );

  return (
    <Text type="text3" className={styles.selected}>
      {selected.join(", ")}
    </Text>
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Filter(props) {
  const { data, selected, onSubmit, onClear, isLoading, modal, context } =
    props;

  // facet data
  const facets = data?.search?.facets || [];
  const hitcount = data?.search?.hitcount || null;

  // Facet will contain a specific selected facet/category, if any selected
  const { facet } = context;

  // Global excluded categories
  const excluded = ["workType"];

  // extract workType if any selected
  const workType = selected.workType?.[0];

  return (
    <div className={`${styles.filter}`} data-cy="filter-modal">
      {facet ? (
        <SelectedFilter terms={selected?.[facet.name] || []} {...props} />
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
                  >
                    <span>
                      <Text
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
              vars: [hitcount],
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
  const { q } = context;

  // connected filters hook
  const { filters, setFilters, setQuery } = useFilters();

  // extract selected workType, if any
  const workType = filters.workType?.[0];

  // Exclude irrelevant worktype categories
  // undefined will result in a include-all fallback at the fragment api call function.
  const facetFilters = (workType && includedTypes[workType]) || undefined;

  // hitcount according to selected filters
  const { data: hitcountData } = useData(q && hitcount({ q, filters }));

  // facets according to query filters
  const { data, isLoading } = useData(
    q && facets({ q, filters, facets: facetFilters })
  );

  // merge data
  const mergedData = merge({}, data, hitcountData);

  console.log("wwwwwww mergedData", mergedData);

  if (isLoading) {
    return <FilterSkeleton {...props} />;
  }

  // Dont clear the workType filter onClear
  const excludeOnClear = { workType: filters.workType };

  return (
    <Filter
      data={mergedData}
      selected={filters}
      onSelect={(selected) => {
        console.log("wwwww selected", selected);

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
