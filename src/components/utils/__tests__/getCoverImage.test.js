import { getCoverImage } from "@/components/utils/getCoverImage";

test("details from moreinfo and default", () => {
  const manifestationsMoreinfo = [
    {
      cover: {
        origin: "fbiinfo",
        detail: "moreinfourl",
      },
    },
  ];

  const manifestationsDefault = [
    {
      cover: {
        detail: "defaultUrl",
      },
    },
  ];

  const manifestationsNull = [];

  let actual = getCoverImage(manifestationsMoreinfo).detail;
  let expected = "moreinfourl";
  expect(actual).toEqual(expected);

  actual = getCoverImage(manifestationsDefault).detail;
  expected = "defaultUrl";
  expect(actual).toEqual(expected);

  actual = getCoverImage(manifestationsNull)?.detail;
  expected = null;
  expect(actual).toEqual(expected);
});
