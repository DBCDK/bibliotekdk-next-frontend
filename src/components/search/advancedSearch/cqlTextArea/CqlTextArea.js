import styles from "./CqlTextArea.module.css";
import React, { useEffect } from "react";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";
import translate from "@/components/base/translate";
import CqlErrorMessage from "@/components/search/advancedSearch/cqlErrorMessage/CqlErrorMessage";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

export function CqlTextArea({ textAreaRef, doAdvancedSearch }) {
  const { parsedCQL, setParsedCQL } = useAdvancedSearchContext();

  useEffect(() => {
    if (textAreaRef?.current) {
      textAreaRef.current.style.height = 0;
      textAreaRef.current.style.height = `${textAreaRef?.current?.scrollHeight}px`;
    }
  }, [parsedCQL]);

  return (
    <div>
      <label className={styles.label}>
        <Text type="text4">
          {translate({ context: "search", label: "cqlsearchlabel" })}
        </Text>
      </label>
      <textarea
        className={styles.input}
        ref={textAreaRef}
        data-cy={cyKey({
          name: "cqlTxt",
          prefix: "advanced-search",
        })}
        id="cqlTextArea"
        value={parsedCQL}
        onChange={(event) => {
          setParsedCQL(event.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey === true) {
            e.preventDefault();
            doAdvancedSearch();
          }
        }}
        placeholder="hej med dig kaj"
      />
      <CqlErrorMessage cql={textAreaRef?.current?.value} />
    </div>
  );
}
