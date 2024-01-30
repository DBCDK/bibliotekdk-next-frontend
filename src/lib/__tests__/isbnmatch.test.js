import { isbnFromQuery } from "../utils";

describe("test isbn from ccl regular expression", () => {
  it("get isbn from query string", () => {
    const actual = isbnFromQuery("is=123-45");
    const expected = "123-45";

    expect(actual).toEqual(expected);
  });

  it("don NOT get isbn from query string if other fields appended", () => {
    const actual = isbnFromQuery("^is=123-45&ti=fisk");
    const expected = null;

    expect(actual).toEqual(expected);
  });

  it("do NOT get isbn from query string if it does not come from start of string", () => {
    const actual = isbnFromQuery("fo=hans&is=123-45&ti=fisk");
    const expected = null;

    expect(actual).toEqual(expected);
  });
});
