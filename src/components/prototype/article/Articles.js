import React from "react";
import useAPI from "../hooks/useAPI";

export default ({ path, promotedOnly = false }) => {
  const { isLoading, response } = useAPI(`{
    nodeQuery(filter: {conditions: {field: "promote", value: [${
      promotedOnly ? '"1"' : '"1", "0"'
    }]}}) {
      entities {
        entityUrl {
          path
        }
        ... on NodeArticle {
          title
        }
      }
    }
  }
  `);

  if (isLoading) {
    return <p>Indlæser</p>;
  }

  if (
    !response ||
    !response.nodeQuery ||
    !response.nodeQuery.entities ||
    !response.nodeQuery.entities.length
  ) {
    return <p>Kunne ikke finde nogen artikler</p>;
  }

  const entities = response.nodeQuery.entities;

  return (
    <div>
      <h1>Artikler</h1>
      <ul>
        {entities.map((entity) => {
          return (
            <li key={entity.entityUrl.path}>
              <strong>{entity.title}</strong> {entity.entityUrl.path}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
