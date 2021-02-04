import { StoryTitle, StoryDescription } from "@/storybook";

import { Notifications } from "./Notifications";
import { Rating } from "@/components/base/rating/Rating";

export default {
  title: "Notifications",
};

// a single notification in an array
export function notification() {
  const notification = [
    {
      data: {
        nodeQuery: {
          count: 1,
          entities: [
            {
              nid: 13,
              langcode: {
                value: "en",
              },
              fieldNotificationText: "dether er en warning",
              fieldNotificationType: "warning",
            },
          ],
        },
      },
    },
  ];
  return notification;
}

/**
 * Returns Bookmark button
 *
 */
export function Notify() {
  const notes = notification();
  return (
    <div>
      <StoryTitle>Notifications</StoryTitle>
      <StoryDescription>Notification to be displayed</StoryDescription>
      <Notifications notifications={notes} />
    </div>
  );
}
