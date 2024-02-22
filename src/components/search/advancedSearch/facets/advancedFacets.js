import { AdvFacetsTypeEnum } from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";

import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";

import { useFacets } from "@/components/search/advancedSearch/useFacets";

/**
 *
 * @param facets - facets from search result
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

  const { addFacet, removeFacet, selectedFacets } = useFacets();

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
    <Accordion className={styles.fisk}>
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
  const current = selectedFacets?.find((sel) =>
    sel.searchIndex.includes(facetName)
  );

  const titleElement = () => {
    return (
      <>
        <span>{facetName}</span>
        <span>{current?.values?.length || ""}</span>
      </>
    );
  };

  return (
    <Item
      title={titleElement()}
      eventKey={index.toString()}
      key={`${index}-${facetName}`}
      id={`${index}-${facetName}`}
    >
      <ListItem
        facet={facets.find((facet) => {
          return facet.name.includes(facetName);
        })}
        facetName={facetName}
        selectedFacets={selectedFacets}
        onItemClick={onItemClick}
      />
    </Item>
  );
}

function ListItem({ facet, facetName, selectedFacets, onItemClick }) {
  const current = selectedFacets?.find((sel) =>
    sel?.searchIndex?.includes(facetName)
  );

  let initialcheck;
  return (
    <ul data-cy={`${facetName}`}>
      {facet.values.map((facet, index) => (
        <li
          key={`${index}-${facet.key}`}
          className={styles.item}
          data-cy={`li-${facetName}-${facet.key}`}
        >
          {
            (initialcheck = !!current?.values?.find((val) => {
              return val.name === facet.key;
            }))
          }
          <Checkbox
            id={`${facet.key}-${index}`}
            ariaLabel={facet.key}
            className={styles.checkbox}
            onChange={(checked) => onItemClick(checked, facet.key, facetName)}
            checked={initialcheck}
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
