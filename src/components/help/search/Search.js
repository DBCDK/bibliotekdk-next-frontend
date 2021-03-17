import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Title from "@/components/base/title/Title";
import { encodeString } from "@/lib/utils";

import styles from "./Search.module.css";
import Translate from "@/components/base/translate";
import { useState } from "react";

import { useData } from "@/lib/api/api";
import { helpTextSearch } from "@/lib/api/helptexts.fragments.js";

/**
 * Search component
 * Makes it possible to search for help texts.
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Search({
  result = [],
  query = "",
  isLoading,
  onQueryChange = () => {},
}) {
  return (
    <div className={styles.search}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Søg i hjælp"
        ></input>
        <button className={styles.button} type="submit">
          <span>
            {Translate({ context: "general", label: "searchButton" })}
          </span>
          <div className={styles.fill} />
        </button>
      </form>
      {query && result.length === 0 && !isLoading && (
        <div>
          <Title type="title4" tag="h4">
            {Translate({ context: "search", label: "noResults" })}
          </Title>
          <Text type="text2">
            {Translate({ context: "search", label: "noResultsResolution" })}
          </Text>
        </div>
      )}
      {(isLoading ? [{}, {}, {}] : result).map((doc, idx) => {
        return (
          <Link
            key={doc.id || idx}
            a={true}
            border={{
              top: { keepVisible: true },
              bottom: { keepVisible: true },
            }}
            className={`${styles.rowwrapper} ${
              isLoading ? styles.skeleton : ""
            }`}
            href={`/hjaelp/${encodeString(doc.orgTitle)}/${doc.nid}`}
            disabled={true}
            onClick={
              isLoading &&
              ((e) => {
                e.preventDefault();
                e.stopPropagation();
              })
            }
          >
            <div className={styles.row} data-cy="result-row">
              <Text
                type="text3"
                lines={1}
                skeleton={isLoading}
                className={styles.group}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: doc.group || "indlæser",
                  }}
                />
              </Text>
              <Title type="title5" tag="h3" lines={1} skeleton={isLoading}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: doc.title || "indlæser",
                  }}
                />
              </Title>
              <Text type="text2" lines={2} skeleton={isLoading}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: doc.body || "indlæser",
                  }}
                />
              </Text>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
Search.propTypes = {
  result: PropTypes.array,
  query: PropTypes.string,
  isLoading: PropTypes.bool,
  onQueryChange: PropTypes.func,
};

export default function Wrap() {
  // Does query need to be part of the url?
  // Seems like its not necessary, so we keep it local
  const [query, setQuery] = useState();
  const { isLoading, data } = useData(query && helpTextSearch(query));

  return (
    <Search
      result={data?.help?.result}
      query={query}
      onQueryChange={(q) => setQuery(q)}
      isLoading={isLoading}
    />
  );
}
