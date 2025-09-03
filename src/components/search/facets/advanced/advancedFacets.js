import {
  AdvFacetsTypeEnum,
  FacetValidDatabases,
  FilterTypeEnum,
} from "@/lib/enums";
import Accordion, { Item } from "@/components/base/accordion/Accordion";

import styles from "./advancedFacets.module.css";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import Link from "@/components/base/link/Link";

import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useState, useEffect, useRef } from "react";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import { useData } from "@/lib/api/api";
import { complexFacetsOnly } from "@/lib/api/complexSearch.fragments";
import { parseOutFacets } from "@/components/search/advancedSearch/utils";
import Skeleton from "@/components/base/skeleton";
import translate from "@/components/base/translate";
import { LinkToHelpTxt } from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import { useRouter } from "next/router";

/**
 *
 * @param facets - facets from search result
 * @returns {JSX.Element}
 * @constructor
 */
export function AdvancedFacets({
  facets,
  isLoading,
  selectedFacets,
  onItemClick,
  origin = "advancedSearch",
  translateContext = "complex-search-facets",
}) {
  // special handling of the facet.source
  // the sources we wish to handle
  const validSource = Object.values(FacetValidDatabases).map((val) =>
    val.toLowerCase()
  );

  // variable that holds facets to be shown
  // advancedFacets is used for both advanced search AND simplesearch - so we differ with the 'origin' param
  let filteredFacets;
  if (origin === "advancedSearch") {
    // filter out unwanted sources
    facets = facets?.filter((fac) => {
      if (fac.name !== "facet.source") {
        return true;
      } else {
        const validValues = fac.values.filter((fac) =>
          validSource.includes(fac.key)
        );
        if (validValues.length > 0) {
          fac.values = validValues;
          return true;
        }
      }
      return false;
    });
    // end special handling of facet.source
    filteredFacets = Object.values(AdvFacetsTypeEnum).filter((val) =>
      facets?.find((facet) => {
        return facet.name.split(".")[1] === val;
      })
    );
  } else {
    // facets for simple search
    filteredFacets = Object.values(FilterTypeEnum).filter((val) =>
      facets?.find((facet) => {
        return facet.name === val;
      })
    );
  }

  return (
    <Accordion className={styles.accordionContainer}>
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
          origin={origin}
          translateContext={translateContext}
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
  origin,
  translateContext,
}) {
  if (isLoading) {
    return (
      <Skeleton className={styles.skeleton}>
        <div>fisk</div>
      </Skeleton>
    );
  }

  // Global excluded categories @TODO - this is a lousy solution from filters page - refactor
  // Exclude types from facetbrowser - in simple search facets most are shown in the quickfilters
  const excluded = [
    FilterTypeEnum.WORK_TYPES,
    FilterTypeEnum.ACCESS_TYPES,
    FilterTypeEnum.CHILDREN_OR_ADULTS,
    FilterTypeEnum.FICTION_NONFICTION,
  ];
  if (excluded.includes(facetName)) {
    return null;
  }

  // we use current to display number of selected values in this specific facet
  const current = selectedFacets?.find((sel) => sel.searchIndex === facetName);

  const titleElement = () => {
    return (
      <div className={styles.countContainer}>
        <Text tag="span" type="text3" className={styles.facettitle}>
          {translate({
            context: translateContext,
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

  /** Advanced facets are now used as filters for simple search - check
   * origin parameter an act accordingly **/
  let facet;
  if (origin === "simpleSearch") {
    facet = facets.find((fac) => {
      return fac.name === facetName;
    });
  } else {
    facet = facets.find((fac) => {
      return fac.name.split(".")[1] === facetName;
    });
  }

  return (
    <div className={styles.itemborder}>
      <Item
        title={titleElement()}
        eventKey={`${facetName}`}
        key={`${facetName}`}
        id={`${index}-${facetName}`}
        // avoid scrolling to open accordion
        useScroll={false}
        bgColor="transparent"
        iconColor="var(--blue)"
      >
        <ListItem
          facet={facet}
          facetName={facetName}
          selectedFacets={selectedFacets}
          onItemClick={onItemClick}
          origin={origin}
        />
      </Item>
    </div>
  );
}

function ListItem({ facet, facetName, selectedFacets, onItemClick, origin }) {
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

  const values = (Array.isArray(facet?.values) ? facet.values : []).slice();
  const visible = values.sort(sorter).slice(0, numToShow);

  let initialcheck;
  return (
    <>
      {/* we want to show a link to a helptext for term.source (fagbibliografier) */}
      {facetName === "source" && (
        <LinkToHelpTxt
          introTxt={translate({
            context: "complex-search-facets",
            label: "fagbib_introtext",
          })}
          helptxtLink={{
            label: "Fagbibliografier",
            href: "/hjaelp/fagbibliografier/234",
          }}
          className={styles.helptxtlink}
        />
      )}
      <ul data-cy={`${facetName}`}>
        {visible.map((value, index) => (
          <li
            key={`${facetName}-${value.key}-${index}`}
            className={styles.item}
            data-cy={`li-${facetName}-${value.key}`}
          >
            {
              (initialcheck = !!current?.values?.find((val) => {
                return (
                  val.name === value.key ||
                  val === value.key ||
                  val === value.term
                );
              }))
            }
            <Checkbox
              id={`${facetName}-${value.key}-${index}`}
              ariaLabel={value.key}
              className={styles.checkbox}
              onChange={(checked) => {
                onItemClick({ checked, value, facetName });
              }}
              checked={initialcheck}
            ></Checkbox>
            {/* Set a label for the checkbox - in that way the checkbox's selected value will be set when clicking the label */}
            <label htmlFor={`${facetName}-${value.key}-${index}`}>
              <Text tag="span" type="text3" className={styles.facettext}>
                {value.term || value.key}
              </Text>
            </label>
            {origin === "advancedFacets" && (
              <Text tag="span" type="text3" className={styles.score}>
                {value.score}
              </Text>
            )}
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

export default function Wrap({ cql, replace = false }) {
  const {
    facetsFromEnum,
    facetLimit,
    addFacet,
    removeFacet,
    selectedFacets,
    clearFacetsUrl,
  } = useFacets();

  const router = useRouter();
  const prevModeRef = useRef();

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

  const onItemClick = ({ checked, value, facetName }) => {
    console.log("... clicked?", checked, facetName);

    const name = value?.key;

    if (checked) {
      // selected -> add to list
      addFacet(name, facetName, replace, value?.traceId);
    } else {
      // deselected - remove from list
      removeFacet(name, facetName, replace);
    }
  };

  // Reset facets-URL når route-param "mode" ændrer sig
  useEffect(() => {
    if (!router.isReady) return;

    const mode = router.query?.mode ?? null;

    // Init: ingen reset første gang
    if (prevModeRef.current === undefined) {
      prevModeRef.current = mode;
      return;
    }

    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      clearFacetsUrl(); // forventer at denne bevarer scroll (tilpas i hook hvis nødvendigt)
    }
  }, [router.isReady, router.query.mode, clearFacetsUrl]);

  return (
    <AdvancedFacets
      facets={facets}
      isLoading={isLoading}
      selectedFacets={selectedFacets}
      onItemClick={onItemClick}
      origin="advancedSearch"
      translateContext="complex-search-facets"
    />
  );
}
