export function getDescription() {
  //  Mock data
  const response = {
    work: {
      abstract: [examples.ABSTRACT],
    },
  };

  return response;
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
