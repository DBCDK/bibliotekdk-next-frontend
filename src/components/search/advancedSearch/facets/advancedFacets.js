import { AdvFacetsTypeEnum } from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";

import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import Link from "@/components/base/link/Link";

import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useState } from "react";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/complexSearch.fragments";
import { parseOutFacets } from "@/components/search/advancedSearch/utils";
import Skeleton from "@/components/base/skeleton";

/**
 *
 * @param facets - facets from search result
 * @returns {JSX.Element}
 * @constructor
 */
export function AdvancedFacets({ facets, isLoading }) {
  const { addFacet, removeFacet, selectedFacets } = useFacets();

  const filteredFacets = Object.values(AdvFacetsTypeEnum).filter((val) =>
    facets?.find((facet) => {
      return facet.name.split(".")[1] === val;
    })
  );

  const onItemClick = (checked, name, facetName) => {
    if (checked) {
      // selected -> add to list
      addFacet(name, facetName);
      // pushFacetUrl();
    } else {
      // deselected - remove from list
      removeFacet(name, facetName);
      // pushFacetUrl();
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
          isLoading={isLoading}
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
  isLoading,
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

  if (isLoading) {
    return (
      <div className={styles.itemborder}>
        <Skeleton className={styles.skeleton} />
      </div>
    );
  }

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

  // console.log(current, "CURRENT");

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
      {facet?.values
        .sort(sorter)
        .slice(0, numToShow)
        .map((value, index) => (
          <li
            key={`${facetName}-${value.key}-${index}`}
            className={styles.item}
            data-cy={`li-${facetName}-${value.key}`}
          >
            {
              (initialcheck = !!current?.values?.find((val) => {
                return val.name === value.key;
              }))
            }
            {/*{initialcheck && console.log(initialcheck, value, "INITIAL ??")}*/}
            <Checkbox
              id={`${facetName}-${value.key}-${index}`}
              ariaLabel={value.key}
              className={styles.checkbox}
              onChange={(checked) => {
                onItemClick(checked, value.key, facetName);
              }}
              checked={initialcheck}
            />
            <span>{value.key}</span>
            <span className={styles.score}>{value.score}</span>
          </li>
        ))}
      {facet?.values?.length > numToShow && (
        <div
          onClick={() => {
            setNumToShow(numToShow + numberToShowMore);
          }}
          className={styles.showmorelink}
        >
          <Link
            border={{
              top: false,
              bottom: {
                keepVisible: true,
              },
            }}
          >
            <Text tag="span" type="text3" dataCy={`${facetName}-showmore-link`}>
              {Translate({ context: "profile", label: "showMore" })}
            </Text>
          </Link>
        </div>
      )}
    </ul>
  );
}

export default function Wrap({ cql }) {
  const { facetsFromEnum, facetLimit } = useFacets();

  console.log(cql, "CQL");

  // use the useData hook to fetch data
  const { data: facetResponse, isLoading } = useData(
    hitcount({
      cql: cql,
      facets: {
        facetLimit: facetLimit,
        facets: facetsFromEnum,
      },
    })
  );

  console.log(facetResponse, "FASTRESPNSE");

  // @TODO parse out empty facets (score=0)
  const facets = parseOutFacets(facetResponse?.complexSearch?.facets);

  return AdvancedFacets({
    facets: facets,
    isLoading: isLoading,
  });
}
