import {
  fetchHitcount,
  firstWithHits,
  getFbiApiUrl,
  getValidationConfig,
  HitcountError,
} from "@/lib/aiCql/hitcount";

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  };
}

describe("getFbiApiUrl / getValidationConfig", () => {
  it("prefers explicit urls and otherwise derives from NEXT_PUBLIC_FBI_API_URL", () => {
    expect(getFbiApiUrl({ AI_CQL_FBI_API_URL: "http://x/y/graphql" })).toBe(
      "http://x/y/graphql"
    );
    expect(
      getFbiApiUrl({
        NEXT_PUBLIC_FBI_API_BIBDK21_URL: "http://b/bibdk21/graphql",
        NEXT_PUBLIC_FBI_API_URL: "http://a/SimpleSearch/graphql",
      })
    ).toBe("http://b/bibdk21/graphql");
    expect(
      getFbiApiUrl({
        NEXT_PUBLIC_FBI_API_URL: "https://fbi-api.dbc.dk/SimpleSearch/graphql",
      })
    ).toBe("https://fbi-api.dbc.dk/bibdk21/graphql");
    expect(
      getFbiApiUrl({
        NEXT_PUBLIC_FBI_API_URL: "https://fbi-api.dbc.dk/SimpleSearch/graphql",
        FBI_API_FORCE_PROFILE: "bibdk21-test",
      })
    ).toBe("https://fbi-api.dbc.dk/bibdk21-test/graphql");
    expect(getFbiApiUrl({})).toBeNull();
    expect(getFbiApiUrl({ NEXT_PUBLIC_FBI_API_URL: "nope" })).toBeNull();
  });

  it("reads the validation settings with defaults", () => {
    const c = getValidationConfig({
      NEXT_PUBLIC_FBI_API_URL: "https://fbi-api.dbc.dk/SimpleSearch/graphql",
    });
    expect(c).toMatchObject({
      enabled: true,
      url: "https://fbi-api.dbc.dk/bibdk21/graphql",
      timeoutMs: 6000,
      concurrency: 3,
      llmRetries: 1,
      maxRelaxations: 6,
      budgetMs: 12000,
    });
    expect(
      getValidationConfig({
        AI_CQL_VALIDATE: "false",
        AI_CQL_LLM_RETRIES: "0",
        AI_CQL_MAX_RELAXATIONS: "3",
        AI_CQL_HITCOUNT_CONCURRENCY: "0",
      })
    ).toMatchObject({
      enabled: false,
      llmRetries: 0,
      maxRelaxations: 3,
      concurrency: 1,
    });
  });
});

describe("fetchHitcount", () => {
  const base = { accessToken: "tok", url: "https://fbi.test/graphql" };

  it("posts the CQL and returns the hit count", async () => {
    let seen;
    const fetchImpl = async (url, init) => {
      seen = { url, init };
      return response(200, {
        data: { complexSearch: { hitcount: 42, errorMessage: null } },
      });
    };
    const r = await fetchHitcount({
      ...base,
      cql: 'term.creator="x"',
      fetchImpl,
    });
    expect(r.hitcount).toBe(42);
    expect(r.errorMessage).toBeNull();
    expect(seen.url).toBe(base.url);
    expect(seen.init.headers.Authorization).toBe("Bearer tok");
    const body = JSON.parse(seen.init.body);
    expect(body.variables).toEqual({ cql: 'term.creator="x"' });
    expect(body.query).toMatch(/complexSearch\(cql: \$cql\)/);
  });

  it("treats a CQL error as 0 hits", async () => {
    const fetchImpl = async () =>
      response(200, {
        data: { complexSearch: { hitcount: 0, errorMessage: "Unknown index" } },
      });
    const r = await fetchHitcount({ ...base, cql: "x", fetchImpl });
    expect(r).toMatchObject({ hitcount: 0, errorMessage: "Unknown index" });
  });

  it("rejects with HitcountError on HTTP, GraphQL and network failures", async () => {
    await expect(
      fetchHitcount({
        ...base,
        cql: "x",
        fetchImpl: async () => response(500, "boom"),
      })
    ).rejects.toMatchObject({ name: "HitcountError", status: 500 });
    await expect(
      fetchHitcount({
        ...base,
        cql: "x",
        fetchImpl: async () => response(200, { errors: [{ message: "bad" }] }),
      })
    ).rejects.toBeInstanceOf(HitcountError);
    await expect(
      fetchHitcount({
        ...base,
        cql: "x",
        fetchImpl: async () => {
          throw new Error("ECONNRESET");
        },
      })
    ).rejects.toMatchObject({ name: "HitcountError" });
    await expect(
      fetchHitcount({ cql: "x", url: base.url, fetchImpl: async () => null })
    ).rejects.toMatchObject({ message: "No FBI-API access token" });
  });
});

describe("firstWithHits", () => {
  const hits = { a: 0, b: 0, c: 5, d: 9 };
  const check = async (cql) => ({ hitcount: hits[cql] ?? 0 });

  it("returns the first candidate in order with hits and records attempts", async () => {
    const attempts = [];
    const candidates = ["a", "b", "c", "d"].map((cql) => ({ cql }));
    const winner = await firstWithHits(candidates, {
      check,
      concurrency: 2,
      attempts,
    });
    expect(winner.cql).toBe("c");
    expect(winner.hitcount).toBe(5);
    expect(attempts.map((a) => a.cql).sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("prefers the earlier candidate inside a batch", async () => {
    const winner = await firstWithHits([{ cql: "d" }, { cql: "c" }], {
      check,
      concurrency: 3,
    });
    expect(winner.cql).toBe("d");
  });

  it("returns null when nothing matches or the budget is spent", async () => {
    expect(
      await firstWithHits([{ cql: "a" }, { cql: "b" }], {
        check,
        concurrency: 1,
      })
    ).toBeNull();
    const attempts = [];
    expect(
      await firstWithHits([{ cql: "c" }], {
        check,
        hasTime: () => false,
        attempts,
      })
    ).toBeNull();
    expect(attempts).toEqual([]);
  });
});
