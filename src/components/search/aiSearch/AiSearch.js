import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Button from "@/components/base/button";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { tokenize } from "@/components/utils/cql/parser";
import { TOKEN_TYPES } from "@/components/utils/cql/definitions";
import { MODE, MODE_PATH } from "@/components/utils/searchSyncCore";

import styles from "./AiSearch.module.css";

/**
 * Which translation endpoint to use. Defaults to the newest route (v4: AST →
 * catalogue suggester → CQL); set NEXT_PUBLIC_AI_CQL_ENDPOINT to an older one
 * (/api/ai/v3.2/cql, /api/ai/v3.1/cql, /api/ai/v3/cql, /api/ai/cql) to compare.
 */
const AI_CQL_ENDPOINT =
  process.env.NEXT_PUBLIC_AI_CQL_ENDPOINT || "/api/ai/v4/cql";

/**
 * Syntax highlighted CQL rendered as React elements (no innerHTML, since the
 * cql comes from the URL). Uses the same token classes as the CQL editor.
 */
function HighlightedCql({ cql }) {
  return tokenize(cql).map((token, i) => {
    if ([TOKEN_TYPES.QUERY_BEGIN, TOKEN_TYPES.QUERY_END].includes(token.type)) {
      return null;
    }
    const start = token.raw.indexOf(token.normalized);
    return (
      <React.Fragment key={i}>
        {token.raw.slice(0, start)}
        <span className={`token-type_${token.type}`}>{token.normalized}</span>
        {token.raw.slice(start + token.normalized.length)}
      </React.Fragment>
    );
  });
}

/**
 * Output of the translation: the generated CQL (or loading/error state)
 */
function CqlOutput({ cql, isLoading, error }) {
  return (
    <div className={styles.output} aria-live="polite">
      {isLoading && (
        <Text type="text4" className={styles.label}>
          Oversætter...
        </Text>
      )}

      {!isLoading && error && (
        <Text type="text2" className={styles.error} dataCy="ai-search-error">
          Kunne ikke oversætte din tekst til en søgning. Prøv igen.
        </Text>
      )}

      {!isLoading && !error && cql && (
        <>
          <Text type="text4" className={styles.label}>
            Din tekst oversat til CQL-søgning
          </Text>
          <pre className={styles.cql} data-cy="ai-search-cql">
            <HighlightedCql cql={cql} />
          </pre>
          <Text type="text3">
            <Link
              href={{ pathname: MODE_PATH[MODE.CQL], query: { cql } }}
              border={{ top: false, bottom: { keepVisible: true } }}
              dataCy="ai-search-edit-cql"
            >
              Rediger i CQL-søgning
            </Link>
          </Text>
        </>
      )}
    </div>
  );
}

/**
 * Præsentationskomponent: UI og events via props
 */
export function AiSearchView({
  prompt,
  onChange,
  onSearch,
  isLoading,
  error,
  output,
}) {
  return (
    <div>
      <div className={styles.aisearch}>
        <textarea
          className={styles.input}
          value={prompt}
          rows={3}
          data-cy="ai-search-input"
          placeholder="Beskriv med dine egne ord, hvad du søger efter"
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            // Enter submits, Shift+Enter inserts a newline
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSearch();
            }
          }}
          aria-label="AI-søgning"
        />
        <Button
          className={styles.button}
          size="medium"
          onClick={onSearch}
          disabled={isLoading}
          dataCy="ai-search-button"
        >
          {isLoading ? "Oversætter..." : "Søg"}
        </Button>
      </div>

      {output ? (
        <CqlOutput cql={output.cql} isLoading={isLoading} error={error} />
      ) : (
        <Text type="text3" className={styles.description}>
          AI oversætter din tekst til en CQL-søgning og udfører søgningen
        </Text>
      )}
    </div>
  );
}

/**
 * Wrapper-komponent: konverterer brugerens tekst til CQL via /api/ai/cql
 * og committer resultatet som en AI-søgning (prompt + cql i URL'en).
 */
export default function Wrap({ onCommit }) {
  const router = useRouter();
  const isAiMode = router?.query?.mode === MODE.AI;
  const urlPrompt = (isAiMode && router?.query?.prompt) || "";
  const urlCql = (isAiMode && router?.query?.cql) || "";

  const [prompt, setPrompt] = useState(urlPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Keep the input in sync with the URL (back/forward, deep links)
  useEffect(() => {
    setPrompt(urlPrompt);
  }, [urlPrompt]);

  const handleSearch = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch(AI_CQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const json = await res.json();

      if (!res.ok || !json?.cql) {
        setError(true);
        return;
      }

      onCommit?.(trimmed, json.cql);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Show the output panel while translating, on error, or when the URL has a cql
  const output = isLoading || error || urlCql ? { cql: urlCql } : null;

  return (
    <AiSearchView
      prompt={prompt}
      onChange={setPrompt}
      onSearch={handleSearch}
      isLoading={isLoading}
      error={error}
      output={output}
    />
  );
}
