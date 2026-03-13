import { ApiEnums } from "@/lib/api/api";

export function notificationsQuery({ locale }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query NotificationsFragmentsNotificationQuery($locale: BibliotekdkCmsI18NLocaleCode) {
      bibliotekdkCms {
        notifications(status: PUBLISHED, locale: $locale) {
          documentId
          title
          text
          type
          locale
        }
      }
    }`,
    variables: { locale },
    slowThreshold: 3000,
  };
}
