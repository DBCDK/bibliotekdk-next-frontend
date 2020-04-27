import React from 'react';
import useAPI from '../hooks/useAPI';

export default ({pid, limit = 5}) => {
  const {isLoading, response} = useAPI(`{
    record(pid: "${pid}") {
      recommendations(limit: ${limit}) {
        record {
          title
        }
        value
      }
    }
  }
  `);
  return (
    <div>
      <h3>Læs også ...</h3>
      {isLoading && <p>Indlæser</p>}
      <ol>
        {response &&
          response.record.recommendations.map((entry) => {
            return (
              <li>
                {entry.record.title} - {entry.value.toFixed(2)}
              </li>
            );
          })}
      </ol>
    </div>
  );
};
