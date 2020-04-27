import React from 'react';
import useAPI from '../hooks/useAPI';
import Recommendations from '../components/Recommendations';

export default ({pid}) => {
  const {isLoading, response} = useAPI(`{
    record(pid: "${pid}") {
      title
      creator {
        name
      }
    }
  }
  `);
  return (
    <div>
      {isLoading && <p>Indlæser</p>}
      {response && (
        <div>
          <h1>{response.record.title}</h1>
          <h2>{response.record.creator.name}</h2>
        </div>
      )}
      <Recommendations pid={pid} limit={2} />
    </div>
  );
};
