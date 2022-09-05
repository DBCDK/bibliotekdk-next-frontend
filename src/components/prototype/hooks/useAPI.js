import React, { useState, useEffect } from "react";
import fetch from "unfetch";
import config from "../../../config";

export default (query) => {
  const [state, setState] = useState({
    isLoading: true,
    query,
    response: null,
  });

  // Calculate apiUrl
  const apiUrl = config[query?.apiUrl]?.url
    ? config[query.apiUrl]?.url
    : config.api.url;

  useEffect(() => {
    (async () => {
      setState({
        isLoading: true,
        query,
        response: null,
      });
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });
      const json = await res.json();

      setState({
        isLoading: false,
        query,
        response: json.data,
      });
    })();
  }, [query]);

  return state;
};
