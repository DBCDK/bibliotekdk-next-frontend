/**
 * Helptexts - published
 */
export function publishedHelptexts() {
  return {
    query: `query {
      nodeQuery (limit:20 filter: {conditions: [
        {field: "type", value: ["help_text"]},
        {field: "status", value:"1"}
      ] }) {
        count
        entities {
        ... on NodeHelpText {
            nid
            title
            body{
              value
              processed
            }
            fieldHelpTextGroup
            fieldImage {
              alt
              title
              url
              width
              height
            }
          }
        }
      }
     monitor(name: "published_helptexts")
    }`,
    variables: {},
    slowThreshold: 3000,
  };
}
