import React from 'react';
import useAPI from '../hooks/useAPI';
import Recommendations from '../components/Recommendations';
import styles from './Work.css';

export default ({pid, onWorkClick}) => {
  const {isLoading, response} = useAPI(`{
    manifestation(pid: "${pid}") {
      title
      creators {
        name
        functionSingular
      }
      abstract
    }
  }
  `);
  const collectionRes = useAPI(`{
    manifestation(pid: "${pid}") {
      collection {
        cover {
          detail
        }
        materialType
        publication
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
          <h1>{response.manifestation.title}</h1>
          {response.manifestation.creators.map(creator => (
            <h2 key={creator.name}>
              {creator.name} ({creator.functionSingular})
            </h2>
          ))}

          <p>{response.manifestation.abstract}</p>
        </div>
      )}
      <h3>Alle udgaver:</h3>
      <div className={styles.Collection}>
        {collectionRes.response &&
          collectionRes.response.manifestation.collection
            .filter(entry => entry.cover.detail)
            .map(entry => {
              return (
                <div>
                  <div>
                    <img src={entry.cover.detail} alt={entry.type} />
                  </div>
                  <div>{entry.materialType}</div>
                  <div>{entry.publication}</div>
                </div>
              );
            })}
      </div>
      <Recommendations pid={pid} limit={5} onWorkClick={onWorkClick} />
    </div>
  );
};
