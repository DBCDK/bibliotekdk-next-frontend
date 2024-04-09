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

//max number of search queries to be combined
const MAX_ITEMS = 4;
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
      inputFieldsToAdd[0].prefixLogicalOperator = "AND";
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
function SearchItem({ item, index, isLastItem }) {
  console.log("item", JSON.stringify(item.fieldSearch));
  return (
    <div className={styles.searchItemContainer}>
      <div key={item.cql} className={styles.searchItem}>
        <div className={styles.searchItemNumber}>
          <Text>{index}</Text>
        </div>
        {item.fieldSearch ? (
          <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
        ) : (
          <Text type="text2">{item?.cql}</Text>
        )}
      </div>
      {!isLastItem && (
        <LogicalOperatorDropDown
          selected={item?.prefixlogicalopreator}
          onSelect={(selected) => {
            console.log("hej", selected);
          }}
        />
      )}
    </div>
  );
}
export default function CombinedSearch({ queries = [], cancelCombinedSearch }) {
  const [queriesItems, setQueriesItems] = useState(() => {
    //User can only combine MAX_ITEMS of queries
    return queries.slice(0, MAX_ITEMS).map((item) => ({
      cql: item.cql,
      fieldSearch:
        Object.keys(item.fieldSearch).length === 0 ? null : item.fieldSearch,
      prefixlogicalopreator: "AND",
    }));
  });

  useEffect(() => {
    const newQueriesItems = queries.slice(0, MAX_ITEMS).map((item) => ({
      cql: item.cql,
      fieldSearch:
        Object.keys(item.fieldSearch).length === 0 ? null : item.fieldSearch,
      prefixlogicalopreator: "AND",
    }));

    setQueriesItems([...newQueriesItems]);
    //if queriesItems length is  dont do anything
  }, [queries]);

  console.log("CombinedSearch.queriesItems", queriesItems);

  console.log("CombinedSearch.queries", queries);
  const router = useRouter();

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
              index={index + 1}
              isLastItem={queriesItems.length - 1 === index}
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
            //check if all queries has fieldsearch. If so make fieldsearch otherwise make cql search
            const queryMissingFieldsearch = queriesItems.some(
              (item) => item.fieldSearch === null
            );
            let query;
            console.log("queryMissingFieldsearch", queryMissingFieldsearch);
            if (queryMissingFieldsearch) {
              query = {
                cql: queriesItems.map((item) => item.cql).join(" AND "),
              };
            } else {
              //TODO check if all 4 fields has fieldsearch
              const mergedFieldSearch = mergeFieldSearchObjects(queriesItems);

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
