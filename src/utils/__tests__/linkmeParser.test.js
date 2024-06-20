import { linkmeParser } from "@/utils/linkmeParser";

describe("linkmeparser test", () => {
  it("recognize a faust number in url", () => {
    let actual = linkmeParser("12345678");
    let expected = "faust.id=12345678";
    expect(actual).toEqual(expected);

    actual = linkmeParser("123456789");
    expected = "faust.id=123456789";
    expect(actual).toEqual(expected);
  });

  it("recognize a isbn number in url", () => {
    let actual = linkmeParser("1234567890");
    let expected = "isbn.id=1234567890";
    expect(actual).toEqual(expected);

    actual = linkmeParser("123456789012");
    expected = "isbn.id=123456789012";
    expect(actual).toEqual(expected);
  });

  it("recognize a pid", () => {
    let actual = linkmeParser("870970-basis:22653377");
    let expected = "rec.id=870970-basis:22653377";
    expect(actual).toEqual(expected);
  });

  // it("parse more complex ccl", () => {
  //   let actual = linkmeParser(
  //     "fo%3DVeds%C3%B8%20Olesen%2C%20Anne-Marie%20og%20ti%3DGlasborgen"
  //   );
  //   let expected = "fisk";
  //   expect(actual).toEqual(expected);
  // });
});
