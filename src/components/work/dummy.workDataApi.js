export default function dummy_workDataApi({ workId }) {
  const response = {
    [workId]: {
      work: {
        path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
        title: "Klodernes kamp",
        creators: ["h g wells"],
        materialTypes: [
          {
            materialType: "Bog",
            pid: "870970-basis:06442870",
            cover: {
              detail: null,
            },
          },
          {
            materialType: "Bog stor skrift",
            pid: "870970-basis:54926391",
            cover: {
              detail:
                "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54926391&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=7966902ee80cd277d0e8",
            },
          },
          {
            materialType: "Ebog",
            pid: "870970-basis:52849985",
            cover: {
              detail:
                "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52849985&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=7e911def9923337c6605",
            },
          },
          {
            materialType: "Lydbog (bånd)",
            pid: "870970-basis:04843819",
            cover: {
              detail: null,
            },
          },
          {
            materialType: "Lydbog (cd-mp3)",
            pid: "870970-basis:54687117",
            cover: {
              detail: null,
            },
          },
          {
            materialType: "Lydbog (net)",
            pid: "870970-basis:54627890",
            cover: {
              detail:
                "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54627890&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=2a9e3e64e43b94aafe62",
            },
          },
          {
            materialType: "Punktskrift",
            pid: "874310-katalog:DBB0106054",
            cover: {
              detail: null,
            },
          },
        ],
      },
    },
  };

  // WorkId or type was not found
  if (!workId) {
    return {};
  }

  return response[workId];
}
