import { StoryTitle } from "@/storybook";
import ErrorRow from "./ErrorRow";

const exportedObject = {
  title: "profile/ErrorRow",
};
export default exportedObject;
/**
 * Returns an error row
 *
 */
export function ErrorRowStory() {
  return (
    <div>
      <StoryTitle>Error Row</StoryTitle>
      <ErrorRow text="Noget gik galt, da reserveringen skulle slettes. Prøv igen." />
    </div>
  );
}
