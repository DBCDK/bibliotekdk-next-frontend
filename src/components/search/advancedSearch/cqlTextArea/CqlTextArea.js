import styles from "./CqlTextArea.module.css";
import React, { useMemo, useState } from "react";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";
import translate from "@/components/base/translate";
import { CqlErrorMessage } from "@/components/search/advancedSearch/cqlErrorMessage/CqlErrorMessage";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import {
  createErrorMessage,
  tokenize,
  validateTokens,
  highlight,
} from "@/components/utils/cql/parser";
import Editor from "react-simple-code-editor";
import { useData } from "@/lib/api/api";
import { complexSearchIndexes } from "@/lib/api/complexSearch.fragments";

export function CqlTextArea({ doAdvancedSearch }) {
  const { data } = useData(complexSearchIndexes());

  const { parsedCQL, setParsedCQL } = useAdvancedSearchContext();
  const [focused, setFocused] = useState(false);

  const indexes = useMemo(() => {
    if (!data?.complexSearchIndexes?.length) {
      return;
    }

    // Set containing all valid indexes
    const set = new Set();

    data?.complexSearchIndexes?.forEach?.((entry) => {
      set.add(entry?.index);

      // Add all aliases
      entry?.aliases?.forEach?.((index) => set.add(index));
    });

    return set;
  }, [data]);

  const message = useMemo(() => {
    const tokens = tokenize(parsedCQL);
    const validatedTokens = validateTokens(tokens, indexes);
    const { message } = createErrorMessage(validatedTokens, indexes);
    return message;
  }, [parsedCQL, indexes]);

  return (
    <div>
      <label className={styles.label}>
        <Text type="text1">
          {translate({ context: "search", label: "cqlsearchlabel" })}
        </Text>
      </label>
      <div
        className={`${styles.formatted} ${focused ? styles.focused : ""}`}
        data-cy={cyKey({
          name: "cqlTxt",
          prefix: "advanced-search",
        })}
      >
        <Editor
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={translate({
            context: "search",
            label: "cqlsearchPlaceholder",
          })}
          id="cqlTextArea"
          value={parsedCQL}
          onValueChange={(code) => setParsedCQL(code)}
          highlight={(code) => {
            const tokens = tokenize(code);
            const validatedTokens = validateTokens(tokens, indexes);
            return highlight(validatedTokens);
          }}
          padding={16}
          style={{
            background: "white",
            fontFamily:
              "ibm_plex_mono,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
            fontSize: 17,
            lineHeight: 1.5,
            minHeight: 84,
          }}
          insertSpaces={true}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey === true) {
              e.preventDefault();
              doAdvancedSearch();
            }
          }}
          ignoreTabKey={true}
        />
      </div>
      <CqlErrorMessage message={message} />
    </div>
  );
}
