import { dateObjectToDateOnlyString } from "@/utils/datetimeConverter";

describe("dateObjectToDateOnlyString", () => {
  it("converts date object to string", () => {
    const actual = dateObjectToDateOnlyString(
      new Date("november 19, 1975 23:15:30")
    );
    const expected = "1975-11-19";
    expect(actual).toEqual(expected);
  });
  it("adds leading 0s to month", () => {
    const actual = dateObjectToDateOnlyString(
      new Date("August 19, 1975 23:15:30")
    );
    const expected = "1975-08-19";
    expect(actual).toEqual(expected);
  });
  it("adds leading 0s to date", () => {
    const actual = dateObjectToDateOnlyString(
      new Date("August 07, 1975 23:15:30")
    );
    const expected = "1975-08-07";
    expect(actual).toEqual(expected);
  });
  it("adds leading 0s to year", () => {
    const actual = dateObjectToDateOnlyString(
      new Date("August 07, 375 23:15:30")
    );
    const expected = "0375-08-07";
    expect(actual).toEqual(expected);
  });
});
