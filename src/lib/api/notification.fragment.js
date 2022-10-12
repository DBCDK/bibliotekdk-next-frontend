// @TODO export below in a function
import { ApiEnums } from "@/lib/api/api";

export function notificationsQuery({ language }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query NotificationsFragmentsNotificationQuery($language: LanguageId!) {
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
