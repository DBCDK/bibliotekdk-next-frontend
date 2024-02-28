import { AdvFacetsTypeEnum } from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";

import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";

import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useState } from "react";

/**
 *
 * @param facets - facets from search result
 * @returns {JSX.Element}
 * @constructor
 */
export function AdvancedFacets({ facets }) {
  // filter out emtpyt facets AND facets NOT found in response
  const filteredFacets = Object.values(AdvFacetsTypeEnum).filter((val) =>
    facets.find((facet) => {
      return facet.name.split(".")[1] === val;
    })
  );

  const { addFacet, removeFacet, selectedFacets } = useFacets();

  const onItemClick = (checked, name, facetName) => {
    if (checked) {
      // selected -> add to list
      addFacet(name, facetName);
    } else {
      // deselected - remove from list
      removeFacet(name, facetName);
    }
  };

  return (
    <Accordion className={styles.accordionContainer}>
      {filteredFacets.map((facetName, index) => (
        <AccordianItem
          facetName={facetName}
          index={index}
          facets={facets}
          key={`${facetName}-${index}`}
          selectedFacets={selectedFacets}
          onItemClick={onItemClick}
        />
      ))}
    </Accordion>
  );
}

function AccordianItem({
  facetName,
  facets,
  index,
  selectedFacets,
  onItemClick,
}) {
  const current = selectedFacets?.find((sel) => sel.searchIndex === facetName);

  const titleElement = () => {
    return (
      <div className={styles.countContainer}>
        <span>{facetName}</span>
        {current?.values?.length && (
          <span className={styles.count}>{current?.values?.length || ""}</span>
        )}
      </div>
    );
  };

  const facet = facets.find((fac) => {
    return fac.name.split(".")[1] === facetName;
  });

  return (
    <div className={styles.itemborder}>
      <Item
        title={titleElement()}
        eventKey={`${facetName}`}
        key={`${facetName}`}
        id={`${index}-${facetName}`}
      >
        <ListItem
          facet={facet}
          facetName={facetName}
          selectedFacets={selectedFacets}
          onItemClick={onItemClick}
        />
      </Item>
    </div>
  );
}

function ListItem({ facet, facetName, selectedFacets, onItemClick }) {
  const [numToShow, setNumToShow] = useState(5);
  const numberToShowMore = 20;

  const current = selectedFacets?.find((sel) => {
    return sel?.searchIndex === facetName;
  });

  // sort - we want selected items first
  const sorter = (a) => {
    const selected = !!current?.values?.find((val) => {
      return val.name === a.key;
    });

    return selected ? -1 : 1;
  };

  let initialcheck;
  // @TODO fold list - show 5 at first - showmore link to display 20 more :)

  return (
    <ul data-cy={`${facetName}`}>
      {facet?.values
        .sort(sorter)
        .slice(0, numToShow)
        .map((value, index) => (
          <li
            key={`${facetName}-${value.key}`}
            className={styles.item}
            data-cy={`li-${facetName}-${value.key}`}
          >
            {
              (initialcheck = !!current?.values?.find((val) => {
                return (
                  current &&
                  val.name === value.key &&
                  facet.name === `phrase.${current.searchIndex}`
                );
              }))
            }
            <Checkbox
              id={`${facetName}-${value.key}-${index}`}
              ariaLabel={value.key}
              className={styles.checkbox}
              onChange={(checked) => onItemClick(checked, value.key, facetName)}
              checked={initialcheck}
            />
            <span>{value.key}</span>
            <span className={styles.score}>{value.score}</span>
          </li>
        ))}
      {facet?.values?.length > numToShow && (
        <div onClick={() => setNumToShow(numToShow + numberToShowMore)}>
          fisk
        </div>
      )}
    </ul>
  );
}

export default function wrap() {
  // @TODO useData to get REAL data
  return AdvancedFacets({});
}
