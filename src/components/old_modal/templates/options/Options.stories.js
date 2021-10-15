import { useState } from "react";

import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { Modal } from "@/components/old_modal";
import { Options } from "@/components/old_modal/templates/options/Options.template";
import dummy_data from "./dummy_data.json";

export default {
  title: "modal/Options",
};

export function AllOptions() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>All options</StoryDescription>

      <Modal onClose={null} onLang={null} template={"options"}>
        <Options
          data={dummy_data.data}
          title_author="fiske_hest"
          workId="work-of:870971-tsart:39160846"
          isLoading={false}
        />
      </Modal>
    </div>
  );
}

/**
 * Options template - loading
 *
 */
export function Loading() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        Skeleton version of the options template
      </StoryDescription>

      <Modal onClose={null} onLang={null} template={"options"}>
        <Options data={[]} isLoading={true} />
      </Modal>
    </div>
  );
}
