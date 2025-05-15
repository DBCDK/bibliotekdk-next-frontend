const { buildCookieHeader } = require("../cookies"); // eller import hvis ES-modules

describe("buildCookieHeader", () => {
  function mockReq(existingCookies) {
    return { headers: { cookie: existingCookies } };
  }

  function mockRes(setCookies) {
    return { getHeader: () => setCookies };
  }

  test("returns only existing cookies if no new cookies", () => {
    const req = mockReq("foo=bar; hello=world");
    const res = mockRes([]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("foo=bar; hello=world");
  });

  test("returns only new cookies if no existing cookies", () => {
    const req = mockReq("");
    const res = mockRes(["newcookie=value; Path=/; HttpOnly"]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("newcookie=value");
  });

  test("merges existing and new cookies", () => {
    const req = mockReq("foo=bar");
    const res = mockRes(["hello=world; Path=/;"]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("foo=bar; hello=world");
  });

  test("overwrites existing cookie with new cookie", () => {
    const req = mockReq("foo=bar; hello=old");
    const res = mockRes(["hello=new; Path=/;"]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("foo=bar; hello=new");
  });

  test("deletes cookie via Max-Age=0", () => {
    const req = mockReq("foo=bar; hello=world");
    const res = mockRes(["hello=gone; Max-Age=0; Path=/;"]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("foo=bar");
  });

  test("deletes cookie via Expires", () => {
    const req = mockReq("foo=bar; hello=world");
    const res = mockRes([
      "hello=gone; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/;",
    ]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("foo=bar");
  });

  test("handles multiple new cookies and overwrites", () => {
    const req = mockReq("foo=old; hello=old; stay=safe");
    const res = mockRes([
      "foo=new; Path=/;",
      "hello=new; Path=/;",
      "extra=added; Path=/;",
    ]);
    const result = buildCookieHeader(req, res);

    const expectedCookies = [
      "stay=safe",
      "foo=new",
      "hello=new",
      "extra=added",
    ];
    const resultCookies = result.split("; ").sort();
    expect(resultCookies).toEqual(expectedCookies.sort());
  });

  test("handles multiple deletions and additions", () => {
    const req = mockReq("a=1; b=2; c=3; d=4");
    const res = mockRes([
      "b=del; Max-Age=0; Path=/;",
      "c=del; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/;",
      "e=5; Path=/;",
    ]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("a=1; d=4; e=5");
  });

  test("returns empty string if no cookies at all", () => {
    const req = mockReq("");
    const res = mockRes([]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("");
  });

  test("ignores falsy set-cookie values", () => {
    const req = mockReq("x=1");
    const res = mockRes([undefined, null, "y=2; Path=/;"]);
    const result = buildCookieHeader(req, res);
    expect(result).toBe("x=1; y=2");
  });
});
