import { StoryTitle, StoryDescription } from "@/storybook";

import dummy_data from "./dummy_data.fixture.json";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import { Options } from "./Options.page";

const exportedObject = {
  title: "modal/Options",
};

export default exportedObject;

export function AllOptions() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>
        All options. Physical and digital copy are combined into one entry
      </StoryDescription>
      <Options
        data={dummy_data.data}
        title_author="fiske_hest"
        workId="work-of:870971-tsart:39160846"
        isLoading={false}
        context={{
          title_author: "fiske_hest",
          workId: "work-of:870971-tsart:39160846",
          orderPossible: true,
          onlineAccess:
            dummy_data.data.work.materialTypes[0].manifestations[0]
              .onlineAccess,
        }}
      />
    </div>
  );
}

export function NoPhysicalOption() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>
        Physical order is not possible. Digital copy will have its own entry.
      </StoryDescription>
      <Options
        data={dummy_data.data}
        title_author="fiske_hest"
        workId="work-of:870971-tsart:39160846"
        isLoading={false}
        context={{
          title_author: "fiske_hest",
          workId: "work-of:870971-tsart:39160846",
          orderPossible: false,
        }}
      />
    </div>
  );
}

export function NoDigitalCopyOption() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>
        Digital copy is not possible. Physical order will have its own entry.
      </StoryDescription>
      <Options
        data={{
          work: {
            title: "Sådan gør du din ferie mere bæredygtig",
            materialTypes: [
              {
                materialType: "Tidsskriftsartikel",
                manifestations: [
                  {
                    onlineAccess: [
                      {
                        url: "https://videnskab.dk/forskerzonen/kultur-samfund/saadan-goer-du-din-ferie-mere-baeredygtig",
                        origin: "videnskab.dk",
                      },
                      {
                        pid: "870971-tsart:39160846",
                        infomediaId: "e842b5ee",
                      },
                      {
                        type: "webArchive",
                        url: "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=36160780&attachment_type=856_a&bibliotek=870971&source_id=870970&key=68d322934a78818989ce",
                        pid: "870971-tsart:36160780",
                        accessType: "webArchive",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        }}
        title_author="fiske_hest"
        workId="work-of:870971-tsart:39160846"
        isLoading={false}
        context={{
          title_author: "fiske_hest",
          workId: "work-of:870971-tsart:39160846",
          orderPossible: true,
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
