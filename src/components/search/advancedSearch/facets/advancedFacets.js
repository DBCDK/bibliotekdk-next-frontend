import { AdvFacetsTypeEnum } from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";
import mockedFacets from "./mockedFacets.json";
import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import { useState } from "react";

function AdvancedFacets(facets) {
  // filter out facets NOT found in request
  const filteredFacets = Object.values(AdvFacetsTypeEnum).filter((val) =>
    facets.find((facet) => {
      return facet.name.includes(val);
    })
  );

  return (
    <Accordion>
      {filteredFacets.map((facetName, index) => (
        <AccordianItem
          facetName={facetName}
          index={index}
          facets={facets}
          key={`${facetName}-${index}`}
        />
      ))}
    </Accordion>
  );
}

function AccordianItem({ facetName, facets, index }) {
  const [selectedItems, setSelectedItems] = useState([]);
  // @TODO - use query -> setQuery when checked or unchecked and do a live search
  const onItemClick = (checked, name) => {
    if (checked) {
      // selected -> add to list
      const fisk = selectedItems.concat([name]);
      setSelectedItems(fisk);
    } else {
      // not selected -> remove from list
      const indx = selectedItems.findIndex((sel) => sel === name);
      const fisk = [...selectedItems];
      fisk.splice(indx, 1);
      setSelectedItems(fisk);
    }
  };

  return (
    <Item
      title={facetName}
      subTitle={selectedItems.length}
      eventKey={index.toString()}
    >
      <ListItem
        onItemClick={onItemClick}
        facet={facets.find((facet) => {
          return facet.name.includes(facetName);
        })}
      />
    </Item>
  );
}

function ListItem({ facet, onItemClick }) {
  return (
    <ul>
      {facet.values.map((facet, index) => (
        <li key={`${index}-${facet.key}`} className={styles.item}>
          <Checkbox
            ariaLabel={facet.key}
            className={styles.checkbox}
            onChange={(checked) => onItemClick(checked, facet.key)}
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
  return AdvancedFacets(mockedFacets.facets);
}
