import { useData } from "@/lib/api/api";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import styles from "./CombinedSearch.module.css";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text";
import isEqual from "lodash/isEqual";
import cx from "classnames";
import { IconLink } from "@/components/base/iconlink/IconLink";
import animations from "@/components/base/animation/animations.module.css";
import Link from "@/components/base/link";
import { useRouter } from "next/router";

import Translate, { hasTranslation } from "@/components/base/translate";
import IconButton from "@/components/base/iconButton/IconButton";
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
    console.log(item.fieldSearch);
    if (item.fieldSearch?.inputFields?.length > 0) {
      //Make sure that AND is added in the end of the new query to connect the it to the previous queries
      let inputFieldsToAdd = item.fieldSearch.inputFields;
      inputFieldsToAdd[0].prefixLogicalOperator = item.prefixlogicalopreator; //"AND";
      mergedObject.inputFields =
        mergedObject.inputFields.concat(inputFieldsToAdd);
    }
    if (item.fieldSearch?.dropdownSearchIndices?.length > 0) {
      mergedObject.dropdownSearchIndices =
        mergedObject.dropdownSearchIndices.concat(
          item.fieldSearch.dropdownSearchIndices
        );
    }
  });

  return mergedObject;
}
function SearchItem({ item, index, isLastItem, updatePrefixLogicalOperator }) {
  console.log("item", JSON.stringify(item.fieldSearch));
  return (
    <div className={styles.searchItemContainer}>
      {item?.prefixlogicalopreator && (
        <LogicalOperatorDropDown
          selected={item?.prefixlogicalopreator}
          onSelect={(newOperator) => {
            updatePrefixLogicalOperator({ index, newOperator });
            console.log("hej", newOperator);
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
  //queries are all the selected/checked queries. queriesItems are only the first 4 queries. They are shown in the combnination box.
  const [queriesItems, setQueriesItems] = useState([]); /* useState(() => {
    //User can only combine MAX_ITEMS of queries.
    return queries.slice(0, MAX_ITEMS).map((item) => ({
      cql: item.cql,
      fieldSearch:
        Object.keys(item.fieldSearch).length === 0 ? null : item.fieldSearch,
      prefixlogicalopreator: "AND",
    }));
  });
*/
  useEffect(() => {
    const newQueriesItems = queries.slice(0, MAX_ITEMS).map((item, index) => {
      console.log(index, "item", item);
      return {
        cql: item.cql,
        fieldSearch:
          Object.keys(item.fieldSearch).length === 0 ? null : item.fieldSearch,
        prefixlogicalopreator: index === 0 ? null : "AND",
        selectedFacets: item?.selectedFacets,
      };
    });

    setQueriesItems([...newQueriesItems]);
    //if queriesItems length is  dont do anything
  }, [queries]);

  console.log("CombinedSearch.queriesItems", queriesItems);

  console.log("CombinedSearch.queries", queries);
  const router = useRouter();
  const updatePrefixLogicalOperator = ({ index, newOperator }) => {
    let newQueriesItems = [...queriesItems];
    newQueriesItems[index].prefixlogicalopreator = newOperator;

    setQueriesItems(newQueriesItems);
  };

  return (
    <div className={styles.container}>
      <Text type="text1" className={styles.title}>
        Kombiner søgninger
      </Text>
      {queriesItems?.length === 0 && (
        <Text>
          Vælg en eller flere søgninger i listen for at sammensætte dem til en
          ny søgning
        </Text>
      )}

      {queriesItems?.length > 0 && (
        <div>
          {queriesItems.map((item, index) => (
            <SearchItem
              item={item}
              index={index}
              isLastItem={queriesItems.length - 1 === index}
              updatePrefixLogicalOperator={updatePrefixLogicalOperator}
            />
          ))}
        </div>
      )}

      {queries.length > MAX_ITEMS && (
        <div className={styles.errorBox}>
          <Text type="text2">Du kan maksimalt kombinere 4 søgninger</Text>
        </div>
      )}
      <div className={styles.buttonContainer}>
        <Button
          className={styles.searchButton}
          size="small"
          disabled={queries.length === 0}
          onClick={() => {
            console.log("queriesItems", queriesItems);
            //check if there is queries that does not have fieldsearch. If so make cql otherwise make fieldsearch
            const queriesHasCql = queriesItems.some(
              (item) => item.fieldSearch === null
            );
            let query;
            console.log("queriesHasCql", queriesHasCql);
            if (queriesHasCql) {
              const cql = queriesItems
                .map(
                  (item) =>
                    (item?.prefixlogicalopreator || "") + `(${item.cql})`
                )
                .join(" ");
              query = {
                cql,
              };
            } else {
              //TODO check if all 4 fields has fieldsearch
              const mergedFieldSearch = mergeFieldSearchObjects(queriesItems);
              console.log("mergedFieldSearch", mergedFieldSearch);
              const stateToString = JSON.stringify(mergedFieldSearch);
              query = { fieldSearch: stateToString };
            }
            console.log("query", query);
            router.push({ pathname: "/avanceret", query });
          }}
        >
          Søg
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
            Fortryd
          </Link>
        </Text>
      </div>
    </div>
  );
}
