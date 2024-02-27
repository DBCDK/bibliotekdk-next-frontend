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
  // filter out emtpyt facets AND facets NOT found in response
  const filteredFacets = Object.values(AdvFacetsTypeEnum).filter((val) =>
    facets.find((facet) => {
      return facet.name.includes(val);
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
  const current = selectedFacets?.find((sel) =>
    sel.searchIndex.includes(facetName)
  );

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

  return (
    <div className={styles.itemborder}>
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
    </div>
  );
}

function ListItem({ facet, facetName, selectedFacets, onItemClick }) {
  const current = selectedFacets?.find((sel) =>
    sel?.searchIndex?.includes(facetName)
  );

  // sort - we want selected items first
  const sorter = (a) => {
    const selected = !!current?.values?.find((val) => {
      return val.name === a.key;
    });

    return selected ? -1 : 1;
  };

  let initialcheck;
  return (
    <ul data-cy={`${facetName}`}>
      {facet.values.sort(sorter).map((value, index) => (
        <li
          key={`${index}-${value.key}`}
          className={styles.item}
          data-cy={`li-${facetName}-${value.key}`}
        >
          {
            (initialcheck = !!current?.values?.find((val) => {
              return val.name === value.key;
            }))
          }
          <Checkbox
            id={`${value.key}-${index}`}
            ariaLabel={value.key}
            className={styles.checkbox}
            onChange={(checked) => onItemClick(checked, value.key, facetName)}
            checked={initialcheck}
          />
          <span>{value.key}</span>
          <span className={styles.score}>{value.score}</span>
        </li>
      ))}
    </ul>
  );
}

export default function wrap() {
  // @TODO useData to get REAL data
  return AdvancedFacets({});
}
