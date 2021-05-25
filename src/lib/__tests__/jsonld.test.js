import { getJSONLD } from "../jsonld/work";

test("generateJSONLD", () => {
  const work = {
    path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
    title: "Klodernes kamp",
    creators: [{ name: "h g wells" }],
    description: "some description",
    manifestations: [
      {
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
        ],
      },
    ],
  };
  const actual = getJSONLD({ ...work, id: "some-id" });

  expect(actual).toMatchSnapshot();
});
