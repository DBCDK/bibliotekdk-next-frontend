import { useState } from "react";

import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import dummy_data from "./dummy_data.json";
import Modal, { useModal } from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import { Options } from "./Options.page";

export default {
  title: "modal/Options",
};

export function AllOptions() {
  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>All options</StoryDescription>
      <Options
        data={dummy_data.data}
        title_author="fiske_hest"
        workId="work-of:870971-tsart:39160846"
        isLoading={false}
        context={{
          title_author: "fiske_hest",
          workId: "work-of:870971-tsart:39160846",
        }}
      />
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
      <Modal.Container>
        <Modal.Page id="options" component={Pages.Options} />
      </Modal.Container>

      <Options
        data={[]}
        isLoading={true}
        context={{ title_author: "fiske_hest" }}
      />
    </div>
  );
}
