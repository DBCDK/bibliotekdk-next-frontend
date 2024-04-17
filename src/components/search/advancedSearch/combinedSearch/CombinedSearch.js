import styles from "./CombinedSearch.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { useRouter } from "next/router";
import Translate from "@/components/base/translate";

import Button from "@/components/base/button/Button";
import { LogicalOperatorDropDown } from "@/components/search/advancedSearch/fieldInput/TextInputs";
import { FormatFieldSearchIndexes } from "../advancedSearchResult/topBar/TopBar";
import { FormatedFacets } from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

//max number of search queries to be combined
const MAX_ITEMS = 4;

/**
 * Merges facets form multiple
 * @param {*} fieldSearchObjects
 * @returns
 */
function mergeFacets(fieldSearchObjects) {
  let facets = [];
  fieldSearchObjects.forEach((item) => {
    if (item.selectedFacets?.length > 0) {
      item.selectedFacets?.forEach((facet) => {
        let index = facets.findIndex(
          (i) => i.searchIndex === facet.searchIndex
        );
        if (index === -1) {
          // if searchIndex not already added, add a new object with the searchIndex and value
          facets.push(facet);
        } else {
          // else merge with the already existing objects (and filter for duplicates)
          facets[index].values = facets[index]?.values?.concat(
            facet.values.filter(
              (value) => !facets[index]?.values?.includes(value)
            )
          );
        }
      });
    }
  });
  return facets;
}

function SearchItem({ item, index, updatePrefixLogicalOperator }) {
  return (
    <div className={styles.searchItemContainer}>
      {item?.prefixlogicalopreator && (
        <div className={styles.prefixLogicalOperator}>
          <LogicalOperatorDropDown
            selected={item?.prefixlogicalopreator}
            onSelect={(newOperator) => {
              updatePrefixLogicalOperator({ index, newOperator });
            }}
          />
        </div>
      )}

      <div key={item.cql} className={styles.searchItem}>
        <div className={styles.searchItemNumber}>
          <Text>{index + 1}</Text>
        </div>
        {item.fieldSearch ? (
          <div>
            <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
          </div>
        ) : (
          <Text type="text2">{item?.cql}</Text>
        )}
      </div>
    </div>
  );
}

/**
 * renders component to combine multipe advanced search queries
 * @param {Array} [queries=[]] - An array containing the selected/checked queries.
 * @param {function} cancelCombinedSearch - A function to cancel the combined search.
 */
export default function CombinedSearch({ queries = [], cancelCombinedSearch }) {
  //queriesItems are the queries selected for combination and shown in the combine queries overview.
  const [queriesItems, setQueriesItems] = useState([]);
  const { restartFacetsHook } = useFacets();
  const containerRef = useRef(null);
  const searchItemsWrapper = useRef(null);

//   useEffect(() => {
//     if (containerRef.current) {
//         containerRef.current.style.maxHeight = `${1000}px`;

//       setTimeout(() => {
//         containerRef.current.style.maxHeight = `${1000}px`;

//       }, 0);
//     }
//   }, []);
  useEffect(() => {
    if (searchItemsWrapper.current) {
      const currentHeight = searchItemsWrapper.current.scrollHeight; // get the element height based on content
      searchItemsWrapper.current.style.overflow = `hidden`;
      searchItemsWrapper.current.style.maxHeight = `${currentHeight}px`;
      setTimeout(() => {
        searchItemsWrapper.current.style.overflow = `visible`;
      }, 300);
    }
  }, [queriesItems]);

  //this useeffect will run when queries are updated. It will update the state of queriesItems according to the changes in queries
  useEffect(() => {
    //Remove the unchecked queries from queriesItems
    let newQueriesItems = [
      ...queriesItems.filter((item) =>
        queries.some((query) => query.key === item.key)
      ),
    ];

    //first element should not have prefixLogicalOperator
    if (newQueriesItems[0]?.prefixlogicalopreator) {
      newQueriesItems[0].prefixlogicalopreator = null;
    }
    //array of keys of the selected quries to be combined
    const keys = newQueriesItems.map((item) => item.key);

    //add queries to queriesItems if they are not already added and there are 4 or less queries in the queriesItems
    queries.forEach((item) => {
      //can only combine MAX_ITEMS elements
      if (newQueriesItems.length >= MAX_ITEMS) {
        return;
      }
      //add to list of queries to be combined
      if (!keys.includes(item.key)) {
        newQueriesItems.push({
          key: item.key,
          cql: item.cql,
          fieldSearch:
            Object.keys(item.fieldSearch).length === 0
              ? null
              : item.fieldSearch,
          prefixlogicalopreator: newQueriesItems.length === 0 ? null : "AND",
          selectedFacets: item?.selectedFacets,
        });
      }
    });
    //todo animate then remove
    setQueriesItems(newQueriesItems);
  }, [queries]);

  const router = useRouter();
  const updatePrefixLogicalOperator = ({ index, newOperator }) => {
    let newQueriesItems = [...queriesItems];
    newQueriesItems[index].prefixlogicalopreator = newOperator;

    setQueriesItems(newQueriesItems);
  };
  const facets = useMemo(() => mergeFacets(queriesItems), [queriesItems]);

  return (
    <div ref={containerRef} className={styles.container}>
      <Text type="text1" className={styles.title}>
        {Translate({ context: "search", label: "combineSearch" })}
      </Text>
      {queriesItems?.length === 0 && (
        <Text dataCy="combined-search-no-queries-selected">
          {Translate({ context: "search", label: "combineSearchInfoText" })}
        </Text>
      )}

      <div className={styles.searchItemsWrap} ref={searchItemsWrapper}>
        {queriesItems.map((item, index) => (
          <SearchItem
            key={item.key}
            item={item}
            index={index}
            isLastItem={queriesItems.length - 1 === index}
            updatePrefixLogicalOperator={updatePrefixLogicalOperator}
          />
        ))}
      </div>

      <FormatedFacets facets={facets} className={styles.facets} />

      {queries.length > MAX_ITEMS && (
        <div className={styles.errorBox} data-cy="combine-search-error-box">
          <Text type="text2">
            {Translate({
              context: "search",
              label: "maxCombinationsMessage",
              vars: [MAX_ITEMS],
            })}
          </Text>
        </div>
      )}
      <div className={styles.buttonContainer}>
        <Button
          className={styles.searchButton}
          size="small"
          disabled={queries.length === 0}
          onClick={() => {
            //check if there are queries that does not have fieldsearch. If so make cql otherwise make fieldsearch
            const cql = queriesItems
              .map(
                (item) =>
                  (item?.prefixlogicalopreator
                    ? item?.prefixlogicalopreator + " "
                    : "") + `(${item.cql})`
              )
              .join(" ");
            const query = {
              cql,
              facets: JSON.stringify(facets),
            };
            restartFacetsHook();
            router.push({ pathname: "/avanceret", query });
          }}
        >
          {Translate({ context: "general", label: "searchButton" })}
        </Button>
        <Text>
          <Link
            border={{
              top: false,
              bottom: {
                keepVisible: true,
              },
            }}
            onClick={cancelCombinedSearch}
          >
            {Translate({ context: "general", label: "cancel" })}
          </Link>
        </Text>
      </div>
    </div>
  );
}
