import React from 'react';
import useAPI from '../hooks/useAPI';
import styles from './Recommendations.css';

export default ({pid, limit = 5, onWorkClick}) => {
  const {isLoading, response} = useAPI(`{
    record(pid: "${pid}") {
      recommendations(limit: ${limit}) {
        record {
          pid
          title
          cover {
            url
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
          response.record.recommendations.map((entry, idx) => {
            return (
              <div
                className={styles.Entry}
                onClick={() => {
                  if (onWorkClick) {
                    onWorkClick(entry.record.pid);
                  }
                }}
              >
                <div>{idx + 1}</div>
                {entry.record.cover && (
                  <img src={entry.record.cover.url} alt={entry.type} />
                )}
                <div>{entry.record.title}</div>
                <div>{entry.value.toFixed(2)}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
