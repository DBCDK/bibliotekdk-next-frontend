import styles from "./CqlTextArea.module.css";

import React, { useState } from "react";

import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";

import { useRouter } from "next/router";
import translate from "@/components/base/translate";
import CqlErrorMessage from "@/components/search/advancedSearch/cqlErrorMessage/CqlErrorMessage";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

export function CqlTextArea({ textAreaRef }) {
  const router = useRouter();
  const defaultCql = router?.query?.cql || "title=harry AND potter";
  const { parsedCQL } = useAdvancedSearchContext();
  const [cqlValue, setCqlValue] = useState(defaultCql);

  useState(() => {
    if (parsedCQL) {
      setCqlValue(parsedCQL);
    }
  }, [parsedCQL]);
  return (
    <div>
      <label
        for="cqlTextArea"
        style={{ display: "block" }}
        className={styles.label}
      >
        <Text type="text4">
          {translate({ context: "search", label: "cqlsearchlabel" })}
        </Text>
      </label>
      <textarea
        className={styles.input}
        rows="4"
        defaultValue={defaultCql}
        ref={textAreaRef}
        data-cy={cyKey({
          name: "cqlTxt",
          prefix: "advanced-search",
        })}
        id="cqlTextArea"
        value={cqlValue}
        onChange={(event) => {
          setCqlValue(event.target.value);
        }}
      />

      <CqlErrorMessage cql={textAreaRef?.current?.value} />
    </div>
  );
}