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
import { useFacets } from "../useFacets";
import { useQuickFilters } from "../useQuickFilters";
import { useRouter } from "next/router";
import Button from "@/components/base/button";
import Link from "@/components/base/link";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Translate from "@/components/base/translate";
import useBreakpoint from "@/components/hooks/useBreakpoint";

export function CqlTextArea() {
  const { data } = useData(complexSearchIndexes());

  const router = useRouter();

  const {
    parsedCQL,
    setParsedCQL,
    cqlFromUrl,
    fieldSearchFromUrl,
    setShowPopover,
    stateToString,
  } = useAdvancedSearchContext();

  const isMobile = useBreakpoint() === "xs";

  // we need to clear the global facets
  const { resetFacets } = useFacets();
  const { resetQuickFilters } = useQuickFilters();

  const handleSearch = () => {
    // this is a new search - clear the facets
    // However, do not push to URL at this point as this is done in just a moment
    // when the search query is pushed (with no facets or quickfilters set)
    resetFacets();
    resetQuickFilters();

    const cqlParsedFromUrl = fieldSearchFromUrl
      ? convertStateToCql(fieldSearchFromUrl)
      : cqlFromUrl;
    if (!cqlFromUrl && parsedCQL === cqlParsedFromUrl) {
      const query = { fieldSearch: stateToString };
      router.push({ pathname: "/avanceret", query });
    } else {
      const query = {
        cql: parsedCQL,
      };
      router.push({ pathname: "/avanceret", query });
    }

    setShowPopover(false);
  };

  const handleClear = () => {
    resetObjectState();
    router.push({
      pathname: router.pathname,
      ...(router.query?.mode === "cql" && { query: { mode: "cql" } }),
    });
  };

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
      <Row>
        <label htmlFor="cqlTextArea" className={styles.label}>
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
                handleSearch();
              }
            }}
            ignoreTabKey={true}
          />
        </div>
        <CqlErrorMessage message={message} />
      </Row>
      <Row className={styles.buttonRow}>
        <Col className={styles.button_group} sm={12}>
          <Button
            className={styles.button}
            size="medium"
            onClick={() => handleSearch()}
          >
            {Translate({
              context: "search",
              label: "advancedSearch_button",
            })}
          </Button>

          <Text type="text3">
            <Link
              dataCy="advanced-search-clear-search"
              border={{ bottom: { keepVisible: true } }}
              onClick={() => handleClear()}
            >
              {isMobile
                ? Translate({
                    context: "search",
                    label: "mobile_clearSearch",
                  })
                : Translate({
                    context: "search",
                    label: "clearSearch",
                  })}
            </Link>
          </Text>
        </Col>
      </Row>
    </div>
  );
}
