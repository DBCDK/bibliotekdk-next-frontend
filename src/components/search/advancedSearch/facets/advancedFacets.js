import { AdvFacetsTypeEnum } from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";

import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import { useState } from "react";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

/**
 *
 * @param facets - facet from search result
 * @returns {JSX.Element}
 * @constructor
 */
export function AdvancedFacets({ facets }) {
  // filter out facets NOT found in response
  const filteredFacets = Object.values(AdvFacetsTypeEnum).filter((val) =>
    facets.find((facet) => {
      return facet.name.includes(val);
    })
  );

  const { addFacet, removeFacet } = useFacets();

  // @TODO - use query -> setQuery when checked or unchecked and do a live search
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
    <Accordion>
      {filteredFacets.map((facetName, index) => (
        <AccordianItem
          facetName={facetName}
          index={index}
          facets={facets}
          key={`${facetName}-${index}`}
          onItemClick={onItemClick}
        />
      ))}
    </Accordion>
  );
}

function AccordianItem({ facetName, facets, index, onItemClick }) {
  // const [selectedItems, setSelectedItems] = useState([]);

  return (
    <Item
      title={facetName}
      // subTitle={selectedItems.length}
      eventKey={index.toString()}
      key={`${index}-${facetName}`}
    >
      <ListItem
        onItemClick={onItemClick}
        facet={facets.find((facet) => {
          return facet.name.includes(facetName);
        })}
        facetName={facetName}
      />
    </Item>
  );
}

function ListItem({ facet, onItemClick, facetName }) {
  return (
    <ul>
      {facet.values.map((facet, index) => (
        <li key={`${index}-${facet.key}`} className={styles.item}>
          <Checkbox
            ariaLabel={facet.key}
            className={styles.checkbox}
            onChange={(checked) => onItemClick(checked, facet.key, facetName)}
          />
          <span>{facet.key}</span>
          <span className={styles.score}>{facet.score}</span>
        </li>
      ))}
    </ul>
  );
}

export default function wrap() {
  // @TODO useData to get REAL data
  return AdvancedFacets({});
}
