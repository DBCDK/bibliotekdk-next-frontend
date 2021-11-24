export default function dummy_workDataApi({ workId }) {
  const response = {
    [workId]: {
      work: {
        path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
        title: "Klodernes kamp",
        creators: [{ name: "h g wells" }],
        materialTypes: [
          {
            materialType: "Bog",
            cover: {
              detail: null,
            },
            manifestations: [
              { pid: "870970-basis:06442870", onlineAccess: null },
            ],
            count: "53",
          },
          {
            materialType: "Bog stor skrift",
            cover: {
              detail:
                "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54926391&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=7966902ee80cd277d0e8",
            },
            manifestations: [
              { pid: "870970-basis:54926391", onlineAccess: null },
            ],
          },
          {
            materialType: "Ebog",
            cover: {
              detail:
                "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52849985&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=7e911def9923337c6605",
            },
            manifestations: [
              {
                pid: "870970-basis:52849985",
                onlineAccess: [{ url: "https://ebookurl.dk", note: "" }],
              },
            ],
          },
          {
            materialType: "Lydbog (bånd)",
            cover: {
              detail: null,
            },
            manifestations: [
              { pid: "870970-basis:04843819", onlineAccess: null },
            ],
          },
          {
            materialType: "Lydbog (cd-mp3)",
            cover: {
              detail: null,
            },
            manifestations: [
              { pid: "870970-basis:54687117", onlineAccess: null },
            ],
          },
          {
            materialType: "Lydbog (net)",
            cover: {
              detail:
                "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54627890&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=2a9e3e64e43b94aafe62",
            },
            manifestations: [
              {
                pid: "870970-basis:54627890",
                onlineAccess: [{ url: "https://audiobookurl.dk", note: "" }],
              },
            ],
          },
          {
            materialType: "Punktskrift",
            cover: {
              detail: null,
            },
            manifestations: [{ pid: "874310-katalog:DBB0106054" }],
          },
        ],
        workTypes: ["literature"],
      },
    },
  };

  // WorkId or type was not found
  if (!workId) {
    return {};
  }

  return response[workId];
}
