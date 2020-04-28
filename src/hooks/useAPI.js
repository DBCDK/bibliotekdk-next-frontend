import React, {useState, useEffect} from 'react';
import fetch from 'unfetch';

export default query => {
  const [state, setState] = useState({isLoading: true, query, response: null});
  useEffect(() => {
    (async () => {
      setState({
        isLoading: true,
        query,
        response: null
      });
      const res = await fetch(
        'http://bibliotekdk-next-api-1.frontend-staging.svc.cloud.dbc.dk/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query
          })
        }
      );
      const json = await res.json();

      setState({
        isLoading: false,
        query,
        response: json.data
      });
    })();
  }, [query]);

  return state;
};
