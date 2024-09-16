import { AdvFacetsTypeEnum, FacetValidDatabases } from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";

import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import Link from "@/components/base/link/Link";

import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useRef, useState } from "react";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import { useData } from "@/lib/api/api";
import { complexFacetsOnly } from "@/lib/api/complexSearch.fragments";
import { parseOutFacets } from "@/components/search/advancedSearch/utils";
import Skeleton from "@/components/base/skeleton";
import translate from "@/components/base/translate";
import { LinkToHelpTxt } from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";

/**
 *
 * @param facets - facets from search result
 * @returns {JSX.Element}
 * @constructor
 */
export function AdvancedFacets({ facets, isLoading, replace = false }) {
  const { addFacet, removeFacet, selectedFacets } = useFacets();

  const scrollRef = useRef();

  // special handling of the facet.source
  // the sources we wish to handle
  const validSource = Object.values(FacetValidDatabases).map((val) =>
    val.toLowerCase()
  );

  // filter out unwanted sources
  facets = facets?.filter((fac) => {
    if (fac.name !== "facet.source") {
      return true;
    } else {
      const validValuse = fac.values.filter((fac) =>
        validSource.includes(fac.key)
      );
      if (validValuse.length > 0) {
        fac.values = validValuse;
        return true;
      }
    }
    return false;
  });
  // end special handling of facet.source

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
        // avoid scrolling to open accordion
        useScroll={false}
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

  const { sortChronological } = useFacets();

  const current = selectedFacets?.find((sel) => {
    return sel?.searchIndex === facetName;
  });

  // sort - we want selected items first other items sorted by score .. or key if numerical
  // should we sort chronological?
  const sortByKey = sortChronological?.includes(facetName);
  const sorter = (a, b) => {
    const aselected = !!current?.values?.find((val) => {
      return val.name === a.key;
    });

    const bselected = !!current?.values?.find((val) => {
      return val.name === b.key;
    });

    // check selected values - if both are selected we leave as is - if first is selected we put it on top .. etc
    if (aselected || bselected) {
      return bselected && aselected ? 0 : bselected ? 1 : aselected ? -1 : 0;
    }

    if (sortByKey) {
      return Number(a?.key) > Number(b?.key) ? -1 : 1;
    }
    // other items by score  :)
    return a?.score > b?.score ? -1 : 1;
  };

  let initialcheck;
  return (
    <>
      {/* we want to show a link to a helptext for term.source (fagbibliografier) */}
      {facetName === "source" && (
        <LinkToHelpTxt
          helptxtLink={{
            label: "Fagbibliografier",
            href: "/hjaelp/Fagbibliografier/666",
          }}
          className={styles.helptxtlink}
        />
      )}
      <ul data-cy={`${facetName}`}>
        {[...facet?.values]
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
              ></Checkbox>
              {/* Set a label for the checkbox - in that way the checkbox's selected value will be set when clicking the label */}
              <label htmlFor={`${facetName}-${value.key}-${index}`}>
                <Text tag="span" type="text3" className={styles.facettext}>
                  {value.key}
                </Text>
              </label>
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
              <Text
                tag="span"
                type="text3"
                dataCy={`${facetName}-showmore-link`}
              >
                {Translate({ context: "profile", label: "showMore" })}
              </Text>
            </Link>
          </div>
        )}
      </ul>
    </>
  );
}

export default function Wrap({ cql, replace }) {
  const { facetsFromEnum, facetLimit } = useFacets();
  // use the useData hook to fetch data
  const { data: facetResponse, isLoading } = useData(
    complexFacetsOnly({
      cql: cql,
      facets: {
        facetLimit: facetLimit,
        facets: facetsFromEnum,
      },
    })
  );

  const facets = parseOutFacets(facetResponse?.complexFacets?.facets);

  return AdvancedFacets({
    facets: facets,
    isLoading: isLoading,
    replace: replace,
  });
}
