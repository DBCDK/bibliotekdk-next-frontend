import { useState, useEffect } from "react";

import merge from "lodash/merge";

import Top from "../base/top";

import { cyKey } from "@/utils/trim";

import Title from "@/components/base/title";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Checkbox from "@/components/base/forms/checkbox";

import Translate from "@/components/base/translate";

import useFilters from "@/components/hooks/useFilters";

import response from "./dummy.data";

import { useData } from "@/lib/api/api";
import { facets, hitcount } from "@/lib/api/search.fragments";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Filter.module.css";

function SelectedFilter({ isLoading, terms, onSelect, modal, context }) {
  // Selected terms
  // const [terms, setTerms] = useState([]);

  // facet ("category") selected
  const { facet } = context;

  // Reset on facet (page) change
  // useEffect(() => {
  //   setTerms([]);
  // }, [facet]);

  // update selected terms in main-modal context
  // useEffect(() => {
  // if (modal.stack && facet) {
  //   // previous selected
  //   const selected = modal.stack?.[0]?.context?.selected || {};
  //   modal.update(0, {
  //     selected: { ...selected, [facet.name]: terms },
  //   });
  // }
  // if (facet && onSelect) {
  //   onSelect({ [facet.name]: terms });
  // }
  // }, [terms]);

  // handle term select
  function handleTermSelect(title) {
    let copy = [...terms];
    const index = copy.indexOf(title);
    // remove if already exist
    if (index > -1) {
      delete copy.splice(index, 1);
    } else {
      copy.push(title);
    }
    // setTerms(copy);

    onSelect({ [facet.name]: copy });
  }

  return (
    <>
      <Text type="text1" className={styles.category}>
        {Translate({
          context: "facets",
          label: `label-${facet.name}`,
        })}
      </Text>
      <List.Group enabled={!isLoading} data-cy="list-facets">
        {facet?.values.map((term, idx) => {
          const title = term.term;
          const count = term.count;

          const isCheked = terms.includes(title);

          return (
            <List.Select
              key={`${title}-${idx}`}
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
                  lines="1"
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
                  lines="1"
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
      <Button
        // disabled={terms.length === 0}
        skeleton={isLoading}
        onClick={() => {
          // previous selected
          // const selected = modal.stack?.[0]?.context?.selected || {};

          // modal.update(0, {
          //   selected: { ...selected, [facet.name]: terms },
          // });

          // Hack-alert (multiple setState calls after eachother)
          // setTimeout(() => modal.prev(), 100);
          modal.prev();

          // const uid = modal.stack?.[0]?.uid;
          // onChange && onChange({ [facet.name]: terms, modal: [uid] });
        }}
        className={styles.submit}
      >
        {Translate({ context: "general", label: "save" })}
      </Button>
    </>
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
  const { data, selected, onSubmit, isLoading, modal, context } = props;

  console.log("selected", selected);

  // facet data
  const facets = data?.search?.facets || [];
  const hitcount = data?.search?.hitcount || null;

  // Facet will contain a specific selected facet/category, if any selected
  const { facet } = context;

  return (
    <div className={`${styles.filter}`} data-cy="filter-modal">
      <Top
        title={
          !facet &&
          Translate({
            context: "modal",
            label: "title-filter",
          })
        }
      />
      {facet ? (
        <SelectedFilter terms={selected?.[facet.name] || []} {...props} />
      ) : (
        <>
          <List.Group
            enabled={!isLoading}
            data-cy="list-facets"
            className={styles.list}
          >
            {facets.map((facet, idx) => {
              const title = Translate({
                context: "facets",
                label: `label-${facet.name}`,
              });

              const selectedTerms = selected?.[facet.name];

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
                    {selectedTerms && (
                      <Text type="text3" className={styles.selected}>
                        {selectedTerms.join(", ")}
                      </Text>
                    )}
                  </span>
                </List.Select>
              );
            })}
          </List.Group>
          <Button
            skeleton={isLoading}
            onClick={() => onSubmit && onSubmit(["modal"])}
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
  const { context, active } = props;

  // get search query from context
  const { q } = context;

  // connected filters hook
  const { filters, setFilters, getQuery, setQuery } = useFilters();

  // hitcount according to selected filters
  const { data: hitcountData } = useData(q && hitcount({ q, filters }));

  // facets according to query filters
  const { data, isLoading } = useData(q && facets({ q, filters }));

  // useEffect(() => {}, [active]);

  // merge data
  const mergedData = merge({}, data, hitcountData);

  if (isLoading) {
    return <FilterSkeleton {...props} />;
  }

  return (
    <Filter
      data={mergedData}
      selected={{ ...getQuery(), ...filters }}
      onSelect={(selected) => {
        setFilters({ ...filters, ...selected });
      }}
      onSubmit={(excluded) => {
        setQuery(excluded);
      }}
      {...props}
    />
  );
}
