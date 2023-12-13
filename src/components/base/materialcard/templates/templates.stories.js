import { StoryDescription, StoryTitle } from "@/storybook";
import { MaterialCardImages } from "@/components/base/materialcard/templates/templates";

const exportedObject = {
  title: "MaterialCard/templates",
};

const covers = [
  "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=53588697&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=06bb715d932ba34098b2",
  "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=21678783&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=54646db03d538703e6c1",
  "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24777057&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4d9e99b14209aef2a5d6",
];

export default exportedObject;

export function MaterialCardImagesBase() {
  const storyTitle = "Only checkboxes";

  return (
    <div>
      <StoryTitle>MaterialCardImages - {storyTitle}</StoryTitle>
      <StoryDescription>
        MaterialCardImages - {storyTitle}, aka a simple test
      </StoryDescription>
      <div style={{ width: "200px" }}>
        <MaterialCardImages covers={covers} fullTitle={"Hugo hejs"} />
      </div>
    </div>
  );
}
