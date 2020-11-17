import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { Series } from "./Series";

export default {
  title: "Work: Series",
};

export function SeriesSlider() {
  const works = [
    {
      id: "work-of:870970-basis:29238669",
      title: "Tvunget til tavshed",
      creators: [
        {
          name: "Linda Castillo",
        },
      ],
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=29238669&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=5516c0ca3582f2ef4caa",
      },
      series: {
        part: 1,
      },
    },
    {
      id: "work-of:870970-basis:29344825",
      title: "Bøn om tavshed",
      creators: [
        {
          name: "Linda Castillo",
        },
      ],
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=29344825&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=002c20ba10566827889c",
      },
      series: {
        part: 2,
      },
    },
    {
      id: "work-of:870970-basis:50988732",
      title: "Bryd tavsheden",
      creators: [
        {
          name: "Linda Castillo",
        },
      ],
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46095464&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=c95a56bf20625e300472",
      },
      series: {
        part: 3,
      },
    },
    {
      id: "work-of:870970-basis:51294521",
      title: "Meldt savnet",
      creators: [
        {
          name: "Linda Castillo",
        },
      ],
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46090802&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=81e3bcb34d684c20e1ed",
      },
      series: {
        part: 4,
      },
    },
    {
      id: "work-of:870970-basis:51578120",
      title: "Sidste åndedrag",
      creators: [
        {
          name: "Linda Castillo",
        },
      ],
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46095294&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=db85ee17bc265fc0e22a",
      },
      series: {
        part: 5,
      },
    },
    {
      id: "work-of:870970-basis:51965906",
      title: "Døden venter",
      creators: [
        {
          name: "Linda Castillo",
        },
      ],
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46929837&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ef5deaafddcd14461d8b",
      },
      series: {
        part: 6,
      },
    },
    {
      id: "work-of:870970-basis:52649153",
      title: "Efter stormen",
      creators: [
        {
          name: "Linda Castillo",
        },
      ],
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46099397&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=3876554a20f94c2364d8",
      },
      series: {
        part: 7,
      },
    },
  ];

  return (
    <div>
      <StoryTitle>Serier</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <Series works={works} />
    </div>
  );
}

export function LoadingSeries() {
  return (
    <div>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        The loading/skeleton version of the review slider, uses the Infomedia
        template as skeleton elements.
      </StoryDescription>
      <Series isLoading={true} />
    </div>
  );
}
