import styles from "./CqlTextArea.module.css";

import React, { useEffect, useRef, useState } from "react";

import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";

import { useRouter } from "next/router";
import translate from "@/components/base/translate";
import CqlErrorMessage from "@/components/search/advancedSearch/cqlErrorMessage/CqlErrorMessage";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

export function CqlTextArea({ textAreaRef, doAdvancedSearch }) {
  const router = useRouter();
  const defaultCql = router?.query?.cql; // || "term.title=(harry AND potter)";
  const { parsedCQL } = useAdvancedSearchContext();
  const [cqlValue, setCqlValue] = useState(defaultCql);
  const [rows, setRows] = useState(2);
  const measurementsCacheRef = useRef(null);

  useEffect(() => {
    if (parsedCQL) {
      setCqlValue(parsedCQL);
      //      adjustTextAreaHeight(parsedCQL)
      //  adjustTextAreaHeight(parsedCQL)
    }
  }, [parsedCQL]);

  useEffect(() => {
    if (cqlValue) {
      setTimeout(() => {
      
        //  adjustTextAreaHeight(cqlValue);
      }, 1);
      //  adjustTextAreaHeight(parsedCQL)
    }
  }, [cqlValue]);

  /**
   * will adjust the height and the number of rows in the textarea according the the value
   * @param {*} newValue new textarea value
   */
  const adjustTextAreaHeight = (newValue) => {
    if (newValue) {
      // calculate the number of rows based on the content
      console.log("CqlTextArea.newValue", newValue);
      const trimmed= newValue.trim();
      const newlineCount = (trimmed.match(/\n/g) || []).length + 2;
      console.log("CqlTextArea.trimmed", trimmed);
      console.log("CqlTextArea.newlineCount", newlineCount);

      setRows(newlineCount);

      
      console.log(
        "CqlTextArea.textAreaRef.current.scrollHeight",
        textAreaRef.current.scrollHeight
      );
      // adjust the height of the textarea
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  };




  //console.log('CqlTextArea.rows',rows)
  return (
    <div>
      <label className={styles.label}>
        <Text type="text4">
          {translate({ context: "search", label: "cqlsearchlabel" })}
        </Text>
      </label>
      <textarea
        className={styles.input}
        rows={rows}
        defaultValue={defaultCql}
        ref={textAreaRef}
        data-cy={cyKey({
          name: "cqlTxt",
          prefix: "advanced-search",
        })}
        id="cqlTextArea"
        value={cqlValue}
        onChange={(event) => {
          const value = event.target.value;
          console.log("value", value);
          setCqlValue(value);
         adjustTextAreaHeight(value);
        //  resizeTextarea()
        }}
        // onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey === true) {
            e.preventDefault();
            doAdvancedSearch();
          }
        }}
      />

      <CqlErrorMessage cql={textAreaRef?.current?.value} />
    </div>
  );
}
