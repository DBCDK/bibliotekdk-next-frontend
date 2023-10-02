import { isPid } from "@/components/profile/utils";

test("getprofileurl", () => {
  let pid = "123456";
  let expected = false;
  let actual = isPid(pid);

  expect(actual).toEqual(expected);

  pid = "870970-basis:40754563";
  actual = isPid(pid);
  expected = true;
  expect(actual).toEqual(expected);

  // null
  pid = null;
  actual = isPid(pid);
  expected = false;
  expect(actual).toEqual(expected);

  // integer
  pid = 12345;
  actual = isPid(pid);
  expected = false;
  expect(actual).toEqual(expected);

  // a workid
  pid = "work-of:870970-basis:123214";
  actual = isPid(pid);
  expected = false;
  expect(actual).toEqual(expected);
});
