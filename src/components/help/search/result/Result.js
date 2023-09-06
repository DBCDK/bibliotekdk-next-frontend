import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Title from "@/components/base/title/Title";
import { encodeString } from "@/lib/utils";

import styles from "./Result.module.css";
import Translate from "@/components/base/translate";

/**
 * Shows help text search result
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Result({ result = [], isLoading, query }) {
  return (
    <div className={styles.search}>
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
      {query &&
        (isLoading ? [{}, {}, {}] : result).map((doc, idx) => {
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
                      __html: doc.group
                        ? Translate({ context: "helpmenu", label: doc.group })
                        : "indlæser",
                    }}
                  />
                </Text>
                <Title type="title5" tag="h3" lines={1} skeleton={isLoading}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: doc.orgTitle || "indlæser",
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
Result.propTypes = {
  result: PropTypes.array,
  isLoading: PropTypes.bool,
  query: PropTypes.string,
};

export default Result;
