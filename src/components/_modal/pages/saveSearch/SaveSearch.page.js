/**
 * @file This modal page handles saving a search from advanced search. The search will be saved in userdata
 */

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import { signIn } from "@dbcdk/login-nextjs/client";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";
import useVerification from "@/components/hooks/useVerification";
import useAccessToken from "@/components/hooks/user/useAccessToken";

import useStorage from "@/components/hooks/useStorage";

import styles from "./SaveSearch.module.css";
import Input from "@/components/base/forms/input";
import { useEffect, useState } from "react";
import useSavedSearches from "@/components/hooks/useSavedSearches";

export default function SaveSearch({ modal, context }) {
  const { title, item, back } = context;
  const [searchName, onSearchNameChange] = useState("");

  useEffect(() => {
    onSearchNameChange(item?.name || item?.cql || "");
  }, [item]);
  const { saveSerach, deleteSearch, savedSearchKeys } = useSavedSearches();
  //check user has saved the search item
  console.log("modal item", item);

  console.log("modal context", context);

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
        placeholder={"hej medd sig"}
        value={searchName}
      />
      <Button
        disabled={searchName.length === 0}
        onClick={() => {
          //todo check if empty
          const newItem = { ...item, name: searchName };
          console.log("saving newItem", newItem);
          //save item with name
          saveSerach(newItem);
          //todo close modal
        }}
      >
        {Translate({ context: "advanced_search_savedSearch", label: "save" })}
      </Button>
    </div>
  );
}
