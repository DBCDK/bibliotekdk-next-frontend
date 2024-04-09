import { AdvFacetsTypeEnum } from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";

import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import Link from "@/components/base/link/Link";

import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useRef, useState } from "react";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/complexSearch.fragments";
import { parseOutFacets } from "@/components/search/advancedSearch/utils";
import Skeleton from "@/components/base/skeleton";
import translate from "@/components/base/translate";

/**
 *
 * @param facets - facets from search result
 * @returns {JSX.Element}
 * @constructor
 */
export function AdvancedFacets({ facets, isLoading, replace = false }) {
  const { addFacet, removeFacet, selectedFacets } = useFacets();

  const scrollRef = useRef();

  const filteredFacets = Object.values(AdvFacetsTypeEnum).filter((val) =>
    facets?.find((facet) => {
      return facet.name.split(".")[1] === val;
    })
  );

  function scrollToRef(ref) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  const onItemClick = (checked, name, facetName) => {
    if (checked) {
      // selected -> add to list
      addFacet(name, facetName, replace);
      scrollToRef(scrollRef);
    } else {
      // deselected - remove from list
      removeFacet(name, facetName, replace);
      scrollToRef(scrollRef);
    }
  };

  return (
    <Accordion className={styles.accordionContainer}>
      <div ref={scrollRef} />
      {isLoading && <AccordianItem isLoading={isLoading} />}
      {filteredFacets?.map((facetName, index) => (
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
  if (isLoading) {
    return (
      <Skeleton className={styles.skeleton}>
        <div>fisk</div>
      </Skeleton>
    );
  }

  const current = selectedFacets?.find((sel) => sel.searchIndex === facetName);

  const titleElement = () => {
    return (
      <div className={styles.countContainer}>
        <Text tag="span" type="text3" className={styles.facettitle}>
          {translate({
            context: "complex-search-facets",
            label: `label-${facetName}`,
          })}
        </Text>
        {current?.values?.length && (
          <Text tag="span" type="text3" className={styles.count}>
            {current?.values?.length || ""}
          </Text>
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
  const sorter = (a, b) => {
    const aselected = !!current?.values?.find((val) => {
      return val.name === a.key;
    });

    const bselected = !!current?.values?.find((val) => {
      return val.name === b.key;
    });

    // if both a and b are selected we leave the order as is
    if (bselected && aselected) {
      return 0;
    }
    // if only a is selected we put it on top
    return aselected ? -1 : 1;
  };

  const numericsort = (a, b) => {
    const aselected = !!current?.values?.find((val) => {
      return val.name === a.key;
    });
    // if a i selected we leave as is
    if (aselected) {
      return 0;
    }
    return a.score > b.score ? 1 : -1;
  };

  let initialcheck;
  return (
    <ul data-cy={`${facetName}`}>
      {facet?.values
        .sort(numericsort)
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
            <Checkbox
              id={`${facetName}-${value.key}-${index}`}
              ariaLabel={value.key}
              className={styles.checkbox}
              onChange={(checked) => {
                onItemClick(checked, value.key, facetName);
              }}
              checked={initialcheck}
            />
            <Text tag="span" type="text3">
              {value.key}
            </Text>
            <Text tag="span" type="text3" className={styles.score}>
              {value.score}
            </Text>
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

export default function Wrap({ cql, replace }) {
  const { facetsFromEnum, facetLimit } = useFacets();
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
  // @TODO parse out empty facets (score=0)
  const facets = parseOutFacets(facetResponse?.complexSearch?.facets);

  return AdvancedFacets({
    hitcount: facetResponse?.complexSearch?.hitcount,
    facets: facets,
    isLoading: isLoading,
    replace: replace,
  });
}
