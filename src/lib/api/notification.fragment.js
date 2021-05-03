// @TODO export below in a function
export function notificationsQuery({ language }) {
  return {
    query: `query($language: LanguageId!) {
  nodeQuery(filter: {conditions: {field: "type", value: "notification", operator: EQUAL}}) {
    count
    entities(language:$language) {
      ... on NodeNotification {
        nid
        langcode {
          value
        }
        fieldNotificationText{
          value
        }
        fieldNotificationType
        }
      }  
    }
     monitor(name: "notifications")
  }`,
    variables: { language },
    slowThreshold: 3000,
  };
}
