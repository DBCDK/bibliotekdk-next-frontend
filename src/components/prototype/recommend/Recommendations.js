import React from "react";
import useAPI from "../hooks/useAPI";
import styles from "./Recommendations.module.css";

export default ({ pid, limit = 5, onWorkClick }) => {
  const { isLoading, response } = useAPI(`{
    manifestation(pid: "${pid}") {
      recommendations(limit: ${limit}) {
        manifestation {
          pid
          title
          cover {
            detail
          }
        }
        value
      }
    }
  }
  `);
  return (
    <div className={styles.Recommendations}>
      <h3>Læs også ...</h3>
      {isLoading && <p>Indlæser</p>}
      <div>
        {response &&
          response.manifestation.recommendations.map((entry, idx) => {
            return (
              <div
                className={styles.Entry}
                onClick={() => {
                  if (onWorkClick) {
                    onWorkClick(entry.manifestation.pid);
                  }
                }}
              >
                <div>{idx + 1}</div>
                {entry.manifestation.cover && (
                  <img
                    src={entry.manifestation.cover.detail}
                    alt={entry.type}
                  />
                )}
                <div>{entry.manifestation.title}</div>
                <div>{entry.value.toFixed(2)}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
