import styles from "./CqlTextArea.module.css";

import React from "react";

import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";

import { useRouter } from "next/router";
import translate from "@/components/base/translate";
import CqlErrorMessage from "@/components/search/advancedSearch/cqlErrorMessage/CqlErrorMessage";

export function CqlTextArea({ textAreaRef }) {
  const router = useRouter();
  //const textAreaRef = useRef();

  // const doAdvancedSearch = () => {
  //   const cql = textAreaRef.current.value;

  //   if (isEmpty(cql)) {
  //     textAreaRef.current.focus();
  //   }
  //   const query = { cql: cql };
  //   router.push({ pathname: router.pathname, query });
  // };

  const defaultCql = router?.query?.cql || "title=harry AND potter";

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
      />

      <CqlErrorMessage cql={textAreaRef?.current?.value} />
    </div>
  );
}
