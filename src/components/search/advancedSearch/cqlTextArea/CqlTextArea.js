import styles from "./CqlTextArea.module.css";

import React, { useEffect, useState } from "react";

import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";

import { useRouter } from "next/router";
import translate from "@/components/base/translate";
import CqlErrorMessage from "@/components/search/advancedSearch/cqlErrorMessage/CqlErrorMessage";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import TextareaAutosize from "react-textarea-autosize";

export function CqlTextArea({ textAreaRef, doAdvancedSearch }) {
  const router = useRouter();
  const defaultCql = router?.query?.cql || "term.title=(harry AND potter)";
  const { parsedCQL } = useAdvancedSearchContext();
  const [cqlValue, setCqlValue] = useState(defaultCql);

  useEffect(() => {
    if (parsedCQL) {
      setCqlValue(parsedCQL);
    }
  }, [parsedCQL]);

  return (
    <div>
      <label className={styles.label}>
        <Text type="text4">
          {translate({ context: "search", label: "cqlsearchlabel" })}
        </Text>
      </label>
      <TextareaAutosize
        minRows={2}
        className={styles.input}
        defaultValue={defaultCql}
        ref={textAreaRef}
        data-cy={cyKey({
          name: "cqlTxt",
          prefix: "advanced-search",
        })}
        id="cqlTextArea"
        value={cqlValue}
        onChange={(event) => setCqlValue(event.target.value)}
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
