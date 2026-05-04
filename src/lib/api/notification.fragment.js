import { ApiEnums } from "@/lib/api/api";
import { getSite } from "@/components/hooks/useSiteConfig";

export function notificationsQuery() {
  const site = getSite();
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
