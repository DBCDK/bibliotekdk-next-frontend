import styles from "./CqlTextArea.module.css";

import React, { useRef } from "react";

import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";

import { useRouter } from "next/router";

export function CqlTextArea() {
  const router = useRouter();
  const textAreaRef = useRef();
  const doAdvancedSearch = () => {
    const cql = textAreaRef.current.value;
    const query = { cql: cql };

    router.push({ pathname: router.pathname, query });
  };

  return (
    <div>
      <textarea
        className={styles.input}
        rows="4"
        cols="20"
        defaultValue="title=harry AND potter"
        ref={textAreaRef}
      />

      <div>
        <button
          className={styles.button}
          type="submit"
          data-cy={cyKey({
            name: "searchbutton",
            prefix: "advenced-search",
          })}
          onClick={() => doAdvancedSearch()}
        >
          <span>{Translate({ context: "header", label: "search" })}</span>
          <div className={styles.fill} />
        </button>
      </div>
    </div>
  );
}
