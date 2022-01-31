import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import { References } from "@/components/_modal/pages/references/References";
import { Edition } from "@/components/_modal/pages/order/Order.page";
import dummywork from "./dummydata.json";

export default {
  title: "modal/References",
};

export function referenceLinks() {
  const context = {
    pids: ["820030-katalog:246833"],
    work: {},
    manifestation: {},
  };
  return (
    <div>
      <StoryTitle>Link reference systems</StoryTitle>
      <StoryDescription>endnote refworks download</StoryDescription>
      <References context={context} />
    </div>
  );
}

export function editionSingleManifestation() {
  const work = dummywork.work;
  const manifestation = dummywork.work.manifestations[0];
  return (
    <Edition
      material={manifestation}
      work={work}
      isLoading={false}
      showOrderTxt={false}
      singleManifestation={true}
    />
  );
}

export function editionAnyManifestation() {
  const work = dummywork.work;
  const manifestation = dummywork.work.manifestations[0];
  return (
    <Edition
      material={manifestation}
      work={work}
      isLoading={false}
      showOrderTxt={false}
      singleManifestation={false}
    />
  );
}

export function editionAnyManifestationWithOrderTxt() {
  const work = dummywork.work;
  const manifestation = dummywork.work.manifestations[0];
  return (
    <Edition
      material={manifestation}
      work={work}
      isLoading={false}
      showOrderTxt={true}
      singleManifestation={false}
    />
  );
}
