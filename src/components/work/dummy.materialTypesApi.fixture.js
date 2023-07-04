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
          language: ["danglish"],
          physicalDescription: "xxvii, 123 sider, illustreret",
          datePublished: "2020",
          creators: [
            {
              name: "some contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
            {
              name: "some extra contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
          ],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          content: [
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
          materialType: "Bog",
          subjects: [
            { type: "DBCS", value: "far-søn-forholdet" },
            { type: "DBCS", value: "døden" },
            { type: "DBCS", value: "alkoholmisbrug" },
            { type: "DBCS", value: "forfattere" },
            { type: "DBCS", value: "familien" },
            { type: "DBCS", value: "parforhold" },
            { type: "DBCS", value: "forældre" },
            { type: "DBCS", value: "børn" },
            { type: "DBCS", value: "barndom" },
            { type: "DBCS", value: "identitet" },
            { type: "DBCS", value: "barndomserindringer" },
            { type: "DBCS", value: "erindringer" },
            { type: "SOME", value: "Dont show me!" },
            { type: "DBCS", value: "Norge." },
            { type: "DBCS", value: "Sverige" },
            { type: "DBCS", value: "Sverige" },
            { type: "DBCS", value: "1980-1989" },
            { type: "DBCS", value: "1990-1999" },
            { type: "DBCS", value: "2000-2009" },
            { type: "DBCO", value: "fiske og hest" },
            { type: "DBCO", value: "fiske og hest" },
            { type: "genre", value: "hund og kat" },
          ],
        },
        "Bog stor skrift": {
          pid: "870970-basis:54926391",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54926391&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=7966902ee80cd277d0e8",
          },
          language: ["large danglish"],
          physicalDescription: "321 sider",
          datePublished: "2021",
          creators: [
            {
              name: "Awsome contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
          ],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          content: [
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "Why is the peacock's tail so beautiful?, Laurence Shafe;",
            "On the development of a theory of representation in Darwin and Warburg, Sabine Flach;",
            "On mimicry in Darwin and surrealism, Jan Soffner;",
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
          materialType: "Bog stor skrift",
          subjects: [
            { type: "DBCS", value: "far-søn-forholdet" },
            { type: "DBCS", value: "døden" },
            { type: "DBCS", value: "alkoholmisbrug" },
            { type: "DBCS", value: "forfattere" },
            { type: "DBCS", value: "familien" },
            { type: "DBCS", value: "parforhold" },
            { type: "DBCS", value: "forældre" },
            { type: "DBCS", value: "børn" },
            { type: "DBCS", value: "barndom" },
          ],
        },
        "E-bog": {
          pid: "870970-basis:52849985",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52849985&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=7e911def9923337c6605",
          },
          language: ["digital danglish"],
          physicalDescription: "6t 37min",
          datePublished: "2021",
          creators: [
            {
              name: "some ebook contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
          ],
          description: examples.ABSTRACT,
          content: [
            "Introduction, Barbara Larson;",
            "Darwin, Burke, and the biological sublime, Barbara Larson;",
            "On mimicry in Darwin and surrealism, Jan Soffner;",
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
          materialType: "E-bog",
          subjects: [
            { type: "DBCS", value: "far-søn-forholdet" },
            { type: "DBCS", value: "døden" },
            { type: "DBCS", value: "alkoholmisbrug" },
            { type: "DBCS", value: "forfattere" },
            { type: "DBCS", value: "familien" },
            { type: "DBCS", value: "parforhold" },
            { type: "DBCS", value: "forældre" },
          ],
        },
        "Lydbog (bånd)": {
          pid: "870970-basis:04843819",
          cover: {
            detail: null,
          },
          language: ["audio danglish"],
          physicalDescription: "5t 59min",
          datePublished: "2019",
          creators: [
            {
              name: "some audio contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
          ],
          description: "",
          content: [
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
          materialType: "Lydbog (bånd)",
          subjects: [
            { type: "DBCS", value: "far-søn-forholdet" },
            { type: "DBCS", value: "døden" },
            { type: "DBCS", value: "alkoholmisbrug" },
            { type: "DBCS", value: "forfattere" },
            { type: "DBCS", value: "familien" },
            { type: "DBCS", value: "parforhold" },
            { type: "DBCS", value: "forældre" },
            { type: "DBCS", value: "børn" },
            { type: "DBCS", value: "barndom" },
            { type: "DBCS", value: "identitet" },
            { type: "DBCS", value: "barndomserindringer" },
            { type: "DBCS", value: "erindringer" },
            { type: "DBCS", value: "Norge" },
            { type: "DBCS", value: "Sverige" },
            { type: "DBCS", value: "1980-1989" },
            { type: "DBCS", value: "1990-1999" },
            { type: "DBCS", value: "2000-2009" },
            { type: "DBCS", value: "barndomserindringer" },
            { type: "DBCS", value: "erindringer" },
            { type: "DBCS", value: "Norge" },
            { type: "DBCS", value: "Sverige" },
            { type: "DBCS", value: "1980-1989" },
            { type: "DBCS", value: "1990-1999" },
            { type: "DBCS", value: "2000-2009" },
          ],
        },
        "Lydbog (cd-mp3)": {
          pid: "870970-basis:54687117",
          cover: {
            detail: null,
          },
          language: ["audio danglish"],
          physicalDescription: "5t 48min",
          datePublished: "2019",
          creators: [
            {
              name: "some audio contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
          ],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          content: [],
          materialType: "Lydbog (cd-mp3)",
          subjects: [
            { type: "DBCS", value: "far-søn-forholdet" },
            { type: "DBCS", value: "døden" },
            { type: "DBCS", value: "alkoholmisbrug" },
            { type: "DBCS", value: "forfattere" },
            { type: "DBCS", value: "familien" },
            { type: "DBCS", value: "parforhold" },
            { type: "DBCS", value: "forældre" },
            { type: "DBCS", value: "børn" },
            { type: "DBCS", value: "barndom" },
            { type: "DBCS", value: "identitet" },
            { type: "DBCS", value: "barndomserindringer" },
            { type: "DBCS", value: "erindringer" },
            { type: "DBCS", value: "Norge" },
            { type: "DBCS", value: "Sverige" },
            { type: "DBCS", value: "1980-1989" },
            { type: "DBCS", value: "1990-1999" },
            { type: "DBCS", value: "2000-2009" },
          ],
        },
        "Lydbog (net)": {
          pid: "870970-basis:54627890",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54627890&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=2a9e3e64e43b94aafe62",
          },
          language: ["audio danglish"],
          physicalDescription: "5t 59min",
          datePublished: "2019",
          creators: [
            {
              name: "some audio contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
          ],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl.",
          content: [
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
          materialType: "Lydbog (net)",
          subjects: [],
        },
        Punktskrift: {
          pid: "874310-katalog:DBB0106054",
          cover: {
            detail: null,
          },
          language: ["dot danglish"],
          physicalDescription: "321 sider",
          datePublished: "2019",
          creators: [
            {
              name: "some audio contributor",
              functionSingular: "illustrator",
              type: "ill",
            },
          ],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
          content: [
            "Contemporary art and the aesthetics of natural selection, Ellen Levy;",
            "index",
          ],
          materialType: "Punktskrift",
          subjects: examples.SUBJECTS,
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

export function getSubjectsDbcVerified({ workId }) {
  //  Mock data
  const response = {
    work: {
      subjects: {
        dbcVerified: examples.SUBJECTS,
      },
    },
  };

  // WorkId or type was not found
  if (!response?.work?.subjects?.dbcVerified) {
    return { [workId]: {} };
  }

  return { [workId]: [...response?.work.subjects?.dbcVerified] };
}

export function getDescription() {
  //  Mock data
  const response = {
    work: {
      abstract: [examples.ABSTRACT],
    },
  };

  return response;

  // WorkId or type was not found
  if (!response?.work?.abstract) {
    return { [workId]: {} };
  }

  return { [workId]: [...response?.work?.abstract] };
}

const examples = Object.freeze({
  SUBJECTS: [
    { display: "far-søn-forholdet" },
    { display: "døden" },
    { display: "alkoholmisbrug" },
    { display: "forfattere" },
    { display: "familien" },
    { display: "parforhold" },
    { display: "forældre" },
    { display: "børn" },
    { display: "barndom" },
    { display: "identitet" },
    { display: "barndomserindringer" },
    { display: "erindringer" },
    { display: "Norge" },
    { display: "Sverige" },
    { display: "1980-1989" },
    { display: "1990-1999" },
    { display: "2000-2009" },
  ],
  ABSTRACT:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
});
