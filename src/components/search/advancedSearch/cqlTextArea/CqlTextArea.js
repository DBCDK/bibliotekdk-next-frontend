import styles from "./CqlTextArea.module.css";
import React, { useMemo, useState } from "react";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
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
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { convertStateToCql } from "../utils";
import HelpBtn from "../../help";

/**
 * Præsentationskomponent: UI og events via props
 */
export function CqlTextAreaView({
  parsedCQL,
  onChange,
  onSearch,
  onClear,
  indexes,
  message,
  focused,
  setFocused,
  isMobile,
}) {
  return (
    <Row>
      <Col>
        <Col
          className={`${styles.formatted} ${focused ? styles.focused : ""}`}
          data-cy="advanced-search-cqlTxt"
        >
          <Editor
            id="cqlTextArea"
            value={parsedCQL}
            onValueChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            highlight={(code) => {
              const tokens = tokenize(code);
              const validated = validateTokens(tokens, indexes);
              return highlight(validated);
            }}
            placeholder={Translate({
              context: "search",
              label: "cqlsearchPlaceholder",
            })}
            padding={16}
            style={{
              background: "white",
              fontFamily:
                "ibm_plex_mono,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Courier New",
              fontSize: 17,
              lineHeight: 1.5,
              minHeight: 84,
            }}
            insertSpaces
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                onSearch();
              }
            }}
            ignoreTabKey
          />
        </Col>
        <CqlErrorMessage message={message} />

        <Row className={styles.buttonRow}>
          <Col className={styles.button_group} sm={12}>
            <Button className={styles.button} size="medium" onClick={onSearch}>
              {Translate({ context: "search", label: "advancedSearch_button" })}
            </Button>

            <Text type="text3">
              <Link
                dataCy="advanced-search-clear-search"
                border={{ bottom: { keepVisible: true } }}
                onClick={onClear}
              >
                {Translate({
                  context: "search",
                  label: isMobile ? "mobile_clearSearch" : "clearSearch",
                })}
              </Link>
            </Text>

            <HelpBtn className={styles.help} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

/**
 * Wrapper-komponent: håndterer data, logik og eventhandlers
 */
export default function Wrap({ onClear }) {
  const router = useRouter();
  const isMobile = useBreakpoint() === "xs";

  const { data } = useData(complexSearchIndexes());
  const { resetFacets } = useFacets();
  const { resetQuickFilters } = useQuickFilters();

  const {
    parsedCQL,
    setParsedCQL,
    cqlFromUrl,
    fieldSearchFromUrl,
    setShowPopover,
    stateToString,
    resetObjectState,
  } = useAdvancedSearchContext();

  const [focused, setFocused] = useState(false);

  const indexes = useMemo(() => {
    if (!data?.complexSearchIndexes?.length) return new Set();
    const set = new Set();
    data.complexSearchIndexes.forEach((entry) => {
      set.add(entry?.index);
      entry?.aliases?.forEach((alias) => set.add(alias));
    });
    return set;
  }, [data]);

  const errorMessage = useMemo(() => {
    const tokens = tokenize(parsedCQL);
    const validatedTokens = validateTokens(tokens, indexes);
    const { message } = createErrorMessage(validatedTokens, indexes);
    return message;
  }, [parsedCQL, indexes]);

  const handleSearch = () => {
    const cqlParsedFromUrl = fieldSearchFromUrl
      ? convertStateToCql(fieldSearchFromUrl)
      : cqlFromUrl;

    if (parsedCQL !== (cqlParsedFromUrl || cqlFromUrl)) {
      resetFacets();
      resetQuickFilters();

      const query =
        !cqlFromUrl && parsedCQL === cqlParsedFromUrl
          ? { fieldSearch: stateToString }
          : { cql: parsedCQL };

      isMobile && document?.activeElement?.blur();

      router.push({ pathname: "/find/cql", query });
      setShowPopover(false);
    }
  };

  const handleClear = () => {
    resetObjectState();
    onClear();

    router.push({
      pathname: router.pathname,
      ...(router.query?.mode === "cql" && { query: { mode: "cql" } }),
    });
  };

  return (
    <CqlTextAreaView
      parsedCQL={parsedCQL}
      onChange={setParsedCQL}
      onSearch={handleSearch}
      onClear={handleClear}
      indexes={indexes}
      message={errorMessage}
      focused={focused}
      setFocused={setFocused}
      isMobile={isMobile}
    />
  );
}
