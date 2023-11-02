import styles from "./CqlTextArea.module.css";

import React, { useRef } from "react";

import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";

import { useRouter } from "next/router";
import translate from "@/components/base/translate";
import isEmpty from "lodash/isEmpty";

export function CqlTextArea() {
  const router = useRouter();
  const textAreaRef = useRef();
  const doAdvancedSearch = () => {
    const cql = textAreaRef.current.value;

    if (isEmpty(cql)) {
      textAreaRef.current.focus();
    }

    const query = { cql: cql };
    router.push({ pathname: router.pathname, query });
  };
  const defaultCql = router?.query?.cql || "title=harry AND potter";

  return (
    <div>
      <label for="cqlTextArea" style={{ display: "block" }}>
        {translate({ context: "search", label: "cqlsearchlabel" })}
      </label>
      <textarea
        className={styles.input}
        rows="4"
        cols="20"
        defaultValue={defaultCql}
        ref={textAreaRef}
        data-cy={cyKey({
          name: "cqlTxt",
          prefix: "advanced-search",
        })}
        id="cqlTextArea"
      />

      <div>
        <button
          className={styles.button}
          type="submit"
          data-cy={cyKey({
            name: "searchbutton",
            prefix: "advanced-search",
          })}
          onClick={() => doAdvancedSearch()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              doAdvancedSearch();
            }
          }}
        >
          <span>{Translate({ context: "header", label: "search" })}</span>
          <div className={styles.fill} />
        </button>
      </div>
    </div>
  );
}
