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
    <div className={`${styles.searchItemContainer}`}>
      {item?.prefixlogicalopreator && (
        <div className={styles.prefixLogicalOperator}>
          <div />

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

  //used only for animation
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.scrollHeight; // Get the natural height based on content
      console.log("currentHeight", currentHeight);

      if (showContent) {
        containerRef.current.style.maxHeight = `${currentHeight}px`;
      } else {
        //   containerRef.current.style.transition = 'max-height 0.3s ease-out';
        setShowContent(true); // After setting, update the first render state
      }
    }
  }, [queriesItems]); // This effect runs every time queriesItems changes

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
    //animate then remove

    setQueriesItems(newQueriesItems);
  }, [queries]);

  //   useEffect(() => {
  //     const currentKeys = queriesItems.map((item) => item.key);
  //     const newKeys = queries.map((query) => query.key);

  //     // Find items that are in queriesItems but not in the new queries (these are to be removed)
  //     const keysToRemove = currentKeys.filter(key => !newKeys.includes(key));

  //     // Set these items to be exiting
  //     if (keysToRemove.length > 0) {
  //       setExitingItems(prev => {
  //         const newExiting = { ...prev };
  //         keysToRemove.forEach(key => newExiting[key] = true);
  //         return newExiting;
  //       });

  //       // Set a timeout to remove the items after the animation
  //       setTimeout(() => {
  //         setQueriesItems(current =>
  //           current.filter(item => !keysToRemove.includes(item.key))
  //         );
  //         setExitingItems(prev => {
  //           const newExiting = { ...prev };
  //           keysToRemove.forEach(key => delete newExiting[key]);
  //           return newExiting;
  //         });
  //       }, 300); // This should match the duration of the CSS transition
  //     }

  //     // Add or update items based on new queries
  //     let newQueriesItems = [
  //       ...queriesItems.filter(item => newKeys.includes(item.key))
  //     ];

  //     // Handling the addition of new items or updating existing ones
  //     queries.forEach(query => {
  //       if (newQueriesItems.length >= MAX_ITEMS) return;  // Prevent adding more than MAX_ITEMS
  //       const existingItem = newQueriesItems.find(item => item.key === query.key);
  //       if (existingItem) {
  //         // Update existing item
  //         existingItem.cql = query.cql;
  //         existingItem.fieldSearch = Object.keys(query.fieldSearch).length === 0 ? null : query.fieldSearch;
  //         existingItem.selectedFacets = query.selectedFacets;
  //       } else {
  //         // Add new item if it does not exist
  //         newQueriesItems.push({
  //           key: query.key,
  //           cql: query.cql,
  //           fieldSearch: Object.keys(query.fieldSearch).length === 0 ? null : query.fieldSearch,
  //           prefixLogicalOperator: newQueriesItems.length === 0 ? null : "AND",
  //           selectedFacets: query.selectedFacets,
  //         });
  //       }
  //     });

  //     // Ensure the first element does not have a prefixLogicalOperator
  //     if (newQueriesItems[0]?.prefixLogicalOperator) {
  //       newQueriesItems[0].prefixLogicalOperator = null;
  //     }

  //     setQueriesItems(newQueriesItems);
  //   }, [queries]);

  const router = useRouter();
  const updatePrefixLogicalOperator = ({ index, newOperator }) => {
    let newQueriesItems = [...queriesItems];
    newQueriesItems[index].prefixlogicalopreator = newOperator;

    setQueriesItems(newQueriesItems);
  };
  const facets = useMemo(() => mergeFacets(queriesItems), [queriesItems]);
  // ${!isFirstRender ? styles.show : ""}

  return (
    <div
      className={`${styles.container} ${
        showContent ? styles.showContainer : ""
      }`}
    >
      <Text type="text1" className={styles.title}>
        {Translate({ context: "search", label: "combineSearch" })}
      </Text>
      {queriesItems?.length === 0 && (
        <Text dataCy="combined-search-no-queries-selected">
          {Translate({ context: "search", label: "combineSearchInfoText" })}
        </Text>
      )}

      <div
        className={`${styles.searchItemsWrap} ${
          showContent ? styles.showItemsWrap : ""
        }`}
        ref={containerRef}
      >
        {queriesItems.map((item, index) => (
          <SearchItem
            //   className={exitingItems[item.key] ? styles.exiting : ''}
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
                    : "") + `${item.cql}`
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
