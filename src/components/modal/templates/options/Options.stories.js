import { useState } from "react";

import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { Modal } from "@/components/modal";
import { Options } from "@/components/modal/templates/options/Options.template";
import dummy_data from "./dummy_data.json";

export default {
  title: "modal/Options",
};

export function OnlineUrl() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url + Infomedia reference</StoryTitle>
      <StoryDescription>Option with url and infomedia</StoryDescription>

      <Modal onClose={null} onLang={null} template={"options"}>
        <Options data={dummy_data.data} isLoading={false} />
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
