/**
 * @file This modal page handles saving a search from advanced search. The search will be saved in userdata
 */

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import { addSavedSearch } from "@/lib/api/userData.mutations";

import styles from "./SaveSearch.module.css";
import Input from "@/components/base/forms/input";
import { useEffect, useState } from "react";
import useSavedSearches from "@/components/hooks/useSavedSearches";
import { useMutate } from "@/lib/api/api";

export default function SaveSearch({ modal, context }) {
  const { item, back } = context;
  const [searchName, onSearchNameChange] = useState("");
  const userDataMutation = useMutate();

  useEffect(() => {
    onSearchNameChange(item?.name || item?.cql || "");
  }, [item]);
  // const { saveSearch } = useSavedSearches();
  //check user has saved the search item

  return (
    <div className={styles.container}>
      <Top back={back} />
      <Title type="title5" tag="h2">
        {Translate({
          context: "advanced_search_savedSearch",
          label: "saveYourSearch",
        })}
      </Title>
      <Text type="text2" tag="label">
        {Translate({
          context: "advanced_search_savedSearch",
          label: "addSavedSearchName",
        })}
      </Text>
      <Input
        type="text"
        invalid={searchName.length === 0}
        dataCy="save-search-input"
        onChange={(e) => onSearchNameChange(e.target.value)}
        autocomplete="off"
        placeholder={Translate({
          context: "advanced_search_savedSearch",
          label: "addSavedSearcInputPlaceholder",
        })}
        value={searchName}
      />
      <Button
        disabled={searchName.length === 0}
        onClick={async () => {
          const newItem = { ...item, name: searchName };
          await addSavedSearch({ searchObject: newItem, userDataMutation });

          // await  saveSearch(newItem);
          //todo close when save search is done
          modal.clear();
        }}
      >
        {Translate({ context: "advanced_search_savedSearch", label: "save" })}
      </Button>
    </div>
  );
}