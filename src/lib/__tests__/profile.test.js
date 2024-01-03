import { isPid } from "@/components/profile/utils";

describe("isPid", () => {
  test("Random numbers? Fail", () => {
    let pid = "123456";
    let expected = false;
    let actual = isPid(pid);
    expect(actual).toEqual(expected);
  });
  test("Basic pid? Succeed", () => {
    const pid = "870970-basis:40754563";
    const actual = isPid(pid);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test("Complicated pid? Succeed", () => {
    const pid = "800010-katalog:99121952643105763";
    const actual = isPid(pid);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test("Too many :? Fail", () => {
    const pid = "800010-katal:og:99121952643105763";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("Double :? Fail", () => {
    const pid = "800010:katalog:99121952643105763";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("Pid does not start with numbers? Fail", () => {
    const pid = "workof:99121952643105763";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("Less than 6 agency/branch Id? Fail", () => {
    const pid = "12-katalog:99121952643105763";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("Less than 8 characters in last part (faust, ISBN, localId, whatever)? Succeed", () => {
    const pid = "800010-katalog:99";
    const actual = isPid(pid);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test("Empty middle part? (description or whatever)? Fail", () => {
    const pid = "800010-:12345689";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("Empty first part? (agency/branch id)? Fail", () => {
    const pid = "-katalog:12345689";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("Empty last part? (faust, ISBN, localId, whatever)? Fail", () => {
    const pid = "123456-katalog:";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("null? Fail", () => {
    const pid = null;
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("integer? Fail", () => {
    const pid = 12345;
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test("a workid? Fail", () => {
    const pid = "work-of:870970-basis:123214";
    const actual = isPid(pid);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});
