import Breadcrumb from "./Breadcrumb";
import { StoryTitle } from "@/storybook";

const exportedObject = {
  title: "profile/Breadcrumb",
};

export function BreadcrumbStory() {
  return (
    <div>
      <StoryTitle>Breadcrumb</StoryTitle>
      <Breadcrumb />
    </div>
  );
}

export default exportedObject;
