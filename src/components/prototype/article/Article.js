import React from "react";
import useAPI from "../../../hooks/useAPI";

export default ({ path }) => {
  const { isLoading, response } = useAPI(`{
    route(path: "${path}") {
      ... on EntityCanonicalUrl {
        nodeContext {
          nid
          title
          ... on NodeArticle {
            body {
              value
              format
              processed
              summary
              summaryProcessed
            }
            fieldImage {
              targetId
              alt
              title
              width
              height
              url
            }
          }
        }
      }
    }
  }
  `);

  if (isLoading) {
    return <p>Indlæser</p>;
  }

  if (!response || !response.route || !response.route.nodeContext) {
    return <p>Artiklen eksisterer ikke</p>;
  }

  const { title, body, fieldImage } = response.route.nodeContext;

  return (
    <div>
      <h3>Path: {path}</h3>
      <div>
        {title && <h1>{title}</h1>}
        {fieldImage && (
          <img
            src={fieldImage.url}
            alt={fieldImage.alt}
            style={{ maxWidth: 150, maxHeight: 200 }}
          />
        )}
        {body && body.value && (
          <div dangerouslySetInnerHTML={{ __html: body.value }} />
        )}
      </div>
    </div>
  );
};
