export default function getMaterialTypes({ workId, type }) {
  //  Mock data
  const response = {
    [workId]: {
      materialTypes: {
        Bog: {
          pid: "870970-basis:06442870",
          cover: {
            detail: null,
          },
          lang: "danglish",
          pages: "xxvii, 123 sider, illustreret",
          released: "2020",
          contribution: ["some contributor", "some other contributor"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          notes: [
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "Why is the peacock's tail so beautiful?, Laurence Shafe;",
            "Art's 'contest with nature': Darwin, Haeckel, and the scientific art history of Alois Riegl, Marsha Morton;",
            "Cultural selection and the shape of time, Larry Silver;",
            "The evolution of culture or the cultural history of the evolutionary concept: epistemological problems at the interface between the two cultures, Sigrid Weigel;",
            "On the development of a theory of representation in Darwin and Warburg, Sabine Flach;",
            "On mimicry in Darwin and surrealism, Jan Soffner;",
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
        },
        "Bog stor skrift": {
          pid: "870970-basis:54926391",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54926391&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=7966902ee80cd277d0e8",
          },
          lang: "large danglish",
          pages: "321 sider",
          released: "2021",
          contribution: ["Awesome contributor"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          notes: [
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "Why is the peacock's tail so beautiful?, Laurence Shafe;",
            "On the development of a theory of representation in Darwin and Warburg, Sabine Flach;",
            "On mimicry in Darwin and surrealism, Jan Soffner;",
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
        },
        Ebog: {
          pid: "870970-basis:52849985",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52849985&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=7e911def9923337c6605",
          },
          lang: "digital danglish",
          pages: "6t 37min",
          released: "2021",
          contribution: ["Some Ebook contributor"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat.",
          notes: [
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "On mimicry in Darwin and surrealism, Jan Soffner;",
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
        },
        "Lydbog (bånd)": {
          pid: "870970-basis:04843819",
          cover: {
            detail: null,
          },
          lang: "audio danglish",
          pages: "5t 59min",
          released: "2019",
          contribution: ["Some Audio contributor"],
          description: "",
          notes: [
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "Why is the peacock's tail so beautiful?, Laurence Shafe;",
            "Art's 'contest with nature': Darwin, Haeckel, and the scientific art history of Alois Riegl, Marsha Morton;",
            "Cultural selection and the shape of time, Larry Silver;",
            "The evolution of culture or the cultural history of the evolutionary concept: epistemological problems at the interface between the two cultures, Sigrid Weigel;",
            "On the development of a theory of representation in Darwin and Warburg, Sabine Flach;",
            "On mimicry in Darwin and surrealism, Jan Soffner;",
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
        },
        "Lydbog (cd-mp3)": {
          pid: "870970-basis:54687117",
          cover: {
            detail: null,
          },
          lang: "audio danglish",
          pages: "5t 48min",
          released: "2019",
          contribution: ["Some Audio contributor"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          notes: [],
        },
        "Lydbog (net)": {
          pid: "870970-basis:54627890",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54627890&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=2a9e3e64e43b94aafe62",
          },
          lang: "audio danglish",
          pages: "5t 59min",
          released: "2019",
          contribution: ["Some Audio contributor"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl.",
          notes: [
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "Why is the peacock's tail so beautiful?, Laurence Shafe;",
            "Art's 'contest with nature': Darwin, Haeckel, and the scientific art history of Alois Riegl, Marsha Morton;",
            "Cultural selection and the shape of time, Larry Silver;",
            "The evolution of culture or the cultural history of the evolutionary concept: epistemological problems at the interface between the two cultures, Sigrid Weigel;",
            "On the development of a theory of representation in Darwin and Warburg, Sabine Flach;",
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "Why is the peacock's tail so beautiful?, Laurence Shafe;",
            "Art's 'contest with nature': Darwin, Haeckel, and the scientific art history of Alois Riegl, Marsha Morton;",
            "Cultural selection and the shape of time, Larry Silver;",
            "The evolution of culture or the cultural history of the evolutionary concept: epistemological problems at the interface between the two cultures;",
            "On the development of a theory of representation in Darwin and Warburg, Sabine Flach;",
            "On mimicry in Darwin and surrealism, Jan Soffner;",
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
        },
        Punktskrift: {
          pid: "874310-katalog:DBB0106054",
          cover: {
            detail: null,
          },
          lang: "dot danglish",
          pages: "321 sider",
          released: "2019",
          contribution: ["Some Audio contributor"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          notes: [
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
        },
      },
    },
  };

  // WorkId or type was not found
  if (!response[workId] && !response[workId].materialTypes[type]) {
    return { [workId]: {} };
  }

  return { [workId]: { ...response[workId].materialTypes[type] } };
}
