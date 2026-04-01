import { ApiEnums } from "@/lib/api/api";

export function notificationsQuery() {
  const site = process.env.NEXT_PUBLIC_SITE || "bibliotekDk"; //TODO: maybe store default in a constant and reuse it in other queries
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query NotificationsFragmentsNotificationQuery($site: String!) {
      bibliotekdkCms {
        notifications(
          status: PUBLISHED
          filters: { sites: { name: { eq: $site } } }
        ) {
          documentId
          title
          text
          type
        }
      }
    }`,
    variables: { site },
    slowThreshold: 3000,
  };
}
