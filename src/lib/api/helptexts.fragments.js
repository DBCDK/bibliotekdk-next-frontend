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

export function helpText(helpTxtId) {
  return {
    // delay: 1000, // for debugging
    query: `query ($helpTxtId: String!) {
        helptext: nodeById(id: $helpTxtId){
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
          
          monitor(name: "helptext_by_id")
        }`,
    variables: { helpTxtId },
    slowThreshold: 3000,
  };
}

export function helpTextSearch(q) {
  return {
    delay: 100, // add small delay to avoid flicker when query is fast
    query: `query ($q: String!) {
              help(q: $q) {
                result {
                  body
                  group
                  nid      
                  orgTitle
                  title
                }
              }
          monitor(name: "helptext_search")
        }`,
    variables: { q },
    slowThreshold: 3000,
  };
}
