import { StoryDescription, StoryTitle } from "@/storybook";

import { Notifications } from "./Notifications";

const exportedObject = {
  title: "base/Notifications",
};

export default exportedObject;

// a single notification in an array
function notification() {
  return {
    bibliotekdkCms: {
      notifications: [
        {
          documentId: "abc123",
          title: "Test notification",
          text: "dette er en warning",
          type: "warning",
          locale: "da",
        },
      ],
    },
  };
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
