// @TODO export below in a function
export function notificationsQuery() {
  return {
    query: `query {
  nodeQuery(filter: {conditions: {field: "type", value: "notification", operator: EQUAL}}) {
    count
    entities {
      ... on NodeNotification {
        nid
        langcode {
          value
        }
        fieldNotificationText
        fieldNotificationType
        }
      }  
    }
     monitor(name: "notifications")
  }`,
    variables: {},
    slowThreshold: 3000,
  };
}
