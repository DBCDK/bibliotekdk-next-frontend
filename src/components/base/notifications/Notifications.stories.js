import { StoryDescription, StoryTitle } from "@/storybook";

import { Notifications } from "./Notifications";

const exportedObject = {
  title: "base/Notifications",
};

export default exportedObject;

// a single notification in an array
function notification() {
  return [
    {
      nid: 13,
      langcode: {
        value: "en",
      },
      fieldNotificationText: {
        value: "dether er en warning",
      },
      fieldNotificationType: "warning",
    },
  ];
}

/**
 * Returns Notification
 *
 */
export function Notify() {
  const notes = notification();
  return (
    <div>
      <StoryTitle>Notifications</StoryTitle>
      <StoryDescription>Notification to be displayed</StoryDescription>
      <Notifications notificationObject={notes} />
    </div>
  );
}
