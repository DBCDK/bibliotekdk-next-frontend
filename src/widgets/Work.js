import React from 'react';
import useAPI from '../hooks/useAPI';
import Recommendations from '../components/Recommendations';
import styles from './Work.css';

console.log(styles);

export default ({pid}) => {
  const {isLoading, response} = useAPI(`{
    record(pid: "${pid}") {
      title
      creator {
        name
      }
      abstract
    }
  }
  `);
  const collectionRes = useAPI(`{
    record(pid: "${pid}") {
      collection {
        cover {
          url
        }
        type
        date
      }
    }
  }
  `);

  // console.log(collection);
  return (
    <div className={styles.Work}>
      {isLoading && <p>Indlæser</p>}
      {response && (
        <div>
          <h1>{response.record.title}</h1>
          <h2>{response.record.creator.name}</h2>
          <p>{response.record.abstract}</p>
        </div>
      )}
      <h3>Alle udgaver:</h3>
      <div className={styles.Collection}>
        {collectionRes.response &&
          collectionRes.response.record.collection
            .filter(entry => entry.cover)
            .map(entry => {
              return (
                <div>
                  <div>
                    <img src={entry.cover.url} alt={entry.type} />
                  </div>
                  <div>{entry.type}</div>
                  <div>{entry.date}</div>
                </div>
              );
            })}
      </div>
      <Recommendations pid={pid} limit={5} />
    </div>
  );
};
