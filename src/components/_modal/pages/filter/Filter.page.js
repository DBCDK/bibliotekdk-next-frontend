import { useState, useEffect } from "react";

import Top from "../base/top";

import { cyKey } from "@/utils/trim";

import Title from "@/components/base/title";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Checkbox from "@/components/base/forms/checkbox";

import Translate from "@/components/base/translate";

import response from "./dummy.data";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Filter.module.css";

function SelectedFilter({ isLoading, modal, context }) {
  const { facet } = context;

  const [terms, setTerms] = useState([]);

  function handleTermSelect(title) {
    let copy = [...terms];

    const index = copy.indexOf(title);

    // remove if already exist
    if (index > -1) {
      delete copy.splice(index, 1);
    } else {
      copy.push(title);
    }

    setTerms(copy);
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
        disabled={terms.length === 0}
        skeleton={isLoading}
        onClick={() => {
          modal.update(0, {
            selected: { [facet.name]: terms },
          });

          // Hack-alert (multiple setState calls after eachother)
          setTimeout(() => modal.prev(), 100);
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
  const { data, onSubmit, isLoading, modal, context } = props;

  const facets = data?.search?.facets || [];

  const { facet, selected } = context;

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
        <SelectedFilter {...props} />
      ) : (
        <>
          <List.Group
            enabled={!isLoading}
            data-cy="list-facets"
            className={styles.orderPossibleGroup}
          >
            {facets.map((facet, idx) => {
              const title = Translate({
                context: "facets",
                label: `label-${facet.name}`,
              });

              return (
                <List.Select
                  key={`${facet.name}-${idx}`}
                  selected={false}
                  onSelect={() => modal.push("filter", { facet })}
                  label={facet.name}
                  className={animations["on-hover"]}
                  includeArrows={true}
                >
                  <Text
                    lines="1"
                    skeleton={isLoading}
                    type="text3"
                    dataCy={`text-${facet.name}`}
                    className={[
                      styles.facet,
                      animations["h-border-bottom"],
                      animations["h-color-blue"],
                    ].join(" ")}
                  >
                    {title}
                  </Text>
                </List.Select>
              );
            })}
          </List.Group>
          <Button
            skeleton={isLoading}
            onClick={() => {
              onSubmit && onSubmit(selected);
              modal.clear();
            }}
            className={styles.submit}
          >
            {Translate({ context: "general", label: "accept" })}
          </Button>
        </>
      )}
    </div>
  );
}

export default function Wrap(props) {
  // dummy data
  const data = response.data;

  return <Filter data={data} {...props} />;
}
