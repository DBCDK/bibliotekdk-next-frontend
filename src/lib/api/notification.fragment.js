import { ApiEnums } from "@/lib/api/api";

export function notificationsQuery() {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query NotificationsFragmentsNotificationQuery {
      bibliotekdkCms {
        notifications(status: PUBLISHED) {
          documentId
          title
          text
          type
        }
      }
    }`,
    slowThreshold: 3000,
  };
}
