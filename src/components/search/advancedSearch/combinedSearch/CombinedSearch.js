import styles from "./CombinedSearch.module.css";
import { useEffect, useState } from "react";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { useRouter } from "next/router";
import Translate from "@/components/base/translate";

import Button from "@/components/base/button/Button";
import { LogicalOperatorDropDown } from "@/components/search/advancedSearch/fieldInput/TextInputs";
import { FormatFieldSearchIndexes } from "../advancedSearchResult/topBar/TopBar";
import { FormatedFacets } from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";

//max number of search queries to be combined
const MAX_ITEMS = 4;

/**
 * Combines mutiple fieldsearch queries into one
 * @param {*} fieldSearchObjects
 * @returns
 */
function mergeFieldSearchObjects(fieldSearchObjects) {
  let mergedObject = {
    inputFields: [],
    dropdownSearchIndices: [],
  };

  fieldSearchObjects.forEach((item) => {
    if (item.fieldSearch?.inputFields?.length > 0) {
      let inputFieldsToAdd = item.fieldSearch.inputFields;
      inputFieldsToAdd[0].prefixLogicalOperator = item.prefixlogicalopreator;
      mergedObject.inputFields =
        mergedObject.inputFields.concat(inputFieldsToAdd);
    }
    if (item.fieldSearch?.dropdownSearchIndices?.length > 0) {
      item.fieldSearch.dropdownSearchIndices.forEach((dropdownItem) => {
        let index = mergedObject.dropdownSearchIndices.findIndex(
          (i) => i.searchIndex === dropdownItem.searchIndex
        );
        if (index === -1) {
          // if searchIndex not already added to mergedObject, add a new object with the searchIndex and value
          mergedObject.dropdownSearchIndices.push(dropdownItem);
        } else {
          // else merge with the already existing objectthe values
          mergedObject.dropdownSearchIndices[index].value =
            mergedObject.dropdownSearchIndices[index].value.concat(
              dropdownItem.value
            );
        }
      });
    }
  });

  return mergedObject;
}
function SearchItem({ item, index, updatePrefixLogicalOperator }) {
  return (
    <div className={styles.searchItemContainer}>
      {item?.prefixlogicalopreator && (
        <LogicalOperatorDropDown
          selected={item?.prefixlogicalopreator}
          onSelect={(newOperator) => {
            updatePrefixLogicalOperator({ index, newOperator });
          }}
        />
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
      <FormatedFacets facets={item.selectedFacets} />
    </div>
  );
}
export default function CombinedSearch({ queries = [], cancelCombinedSearch }) {
  //queries are all the selected/checked queries.
  //queriesItems are the queries selected for combination and shown in the combine queries overview.
  const [queriesItems, setQueriesItems] = useState([]);

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

    setQueriesItems(newQueriesItems);
  }, [queries]);

  const router = useRouter();
  const updatePrefixLogicalOperator = ({ index, newOperator }) => {
    let newQueriesItems = [...queriesItems];
    newQueriesItems[index].prefixlogicalopreator = newOperator;

    setQueriesItems(newQueriesItems);
  };

  return (
    <div className={styles.container}>
      <Text type="text1" className={styles.title}>
        {Translate({ context: "search", label: "combineSearch" })}
      </Text>
      {queriesItems?.length === 0 && (
        <Text dataCy="combined-search-no-queries-selected">
          {Translate({ context: "search", label: "combineSearchInfoText" })}
        </Text>
      )}

      {queriesItems?.length > 0 && (
        <div>
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
      )}

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
            //check if there is queries that does not have fieldsearch. If so make cql otherwise make fieldsearch
            const queriesHasCql = queriesItems.some(
              (item) => item.fieldSearch === null
            );
            let query;
            if (queriesHasCql) {
              const cql = queriesItems
                .map(
                  (item) =>
                    (item?.prefixlogicalopreator
                      ? item?.prefixlogicalopreator + " "
                      : "") + ` (${item.cql})`
                )
                .join(" ");
              query = {
                cql,
              };
            } else {
              //TODO check if all 4 fields has fieldsearch
              const mergedFieldSearch = mergeFieldSearchObjects(queriesItems);
              const stateToString = JSON.stringify(mergedFieldSearch);
              query = { fieldSearch: stateToString };
            }
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
