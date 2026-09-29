jest.mock("@dbcdk/login-nextjs/server", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/utils/jwt", () => ({
  decodeCookie: jest.fn(),
}));

import { translate } from "@/pages/api/ai/v7/cql";
import { fetchFacetValues, rankFacetValues } from "@/lib/aiCql/v7/facets";
import { getRerankConfig } from "@/lib/aiCql/v4.1/suggest";

const CONFIG = {
  apiKey: "test",
  baseUrl: "https://openrouter.test/api/v1",
  model: "test/model",
  fallbackModels: [],
  timeoutMs: 5000,
  referer: "",
  title: "t",
  requireParameters: false,
};

const SUGGEST = {
  enabled: true,
  url: "https://fbi.test/bibdk21/graphql",
  timeoutMs: 1000,
};

const AST = {
  clauses: [
    { field: "creatorcontributor", op: "=", values: ["jusi adler olsen"] },
    { field: "subject", op: "=", values: ["anden verdenskrig"] },
    { field: "title", op: "=", values: ["kvinden i bure"] },
  ],
};

function llm(ast) {
  return async () => ({
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        model: "test/model",
        choices: [
          {
            message: {
              tool_calls: [
                {
                  function: {
                    name: "build_query",
                    arguments: JSON.stringify(ast),
                  },
                },
              ],
            },
          },
        ],
      }),
  });
}

const FACETS = {
  "jusi adler olsen": ["vladimir d. nikolić", "jussi adler-olsen"],
  "anden verdenskrig": ["historie", "den anden verdenskrig"],
};

function run(options) {
  return translate("bøger af jusi adler olsen om anden verdenskrig", {
    config: CONFIG,
    suggest: SUGGEST,
    accessToken: "tok",
    facetConfig: { minScore: 0.5 },
    fetchImpl: llm(AST),
    facetsImpl: jest.fn(async ({ q }) => FACETS[q] || []),
    rankFacetsImpl: async ({ documents }) =>
      [...documents]
        .reverse()
        .map((value, i) => ({ value, score: i === 0 ? 0.8 : 0.3 })),
    suggestImpl: async () => ["Kvinden i buret"],
    rerankImpl: async ({ documents }) => documents,
    ...options,
  });
}

describe("v7 facet resolution", () => {
  it("puts the best reranked facet value of each clause in the CQL", async () => {
    const facetsImpl = jest.fn(async ({ q }) => FACETS[q] || []);
    const result = await run({ facetsImpl });

    expect(facetsImpl).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "jusi adler olsen",
        facet: "CREATORCONTRIBUTOR",
      })
    );
    expect(facetsImpl).toHaveBeenCalledWith(
      expect.objectContaining({ q: "anden verdenskrig", facet: "SUBJECT" })
    );
    expect(facetsImpl).not.toHaveBeenCalledWith(
      expect.objectContaining({ q: "kvinden i bure" })
    );
    expect(result.ast.clauses.map((c) => c.values[0])).toEqual([
      "jussi adler-olsen",
      "den anden verdenskrig",
      "Kvinden i buret",
    ]);
    expect(result.cql).toContain('"den anden verdenskrig"');
    expect(result.facets).toHaveLength(2);
  });

  it("keeps the value as written when the best score is too low", async () => {
    const result = await run({
      rankFacetsImpl: async ({ documents }) =>
        documents.map((value) => ({ value, score: 0.2 })),
    });

    expect(result.ast.clauses[0].values).toEqual(["jusi adler olsen"]);
    expect(result.facets[0].accepted).toBeNull();
  });

  it("skips the lookup without an access token", async () => {
    const facetsImpl = jest.fn();
    const result = await run({ accessToken: null, facetsImpl });

    expect(facetsImpl).not.toHaveBeenCalled();
    expect(result.ast).toEqual(expect.objectContaining(AST));
    expect(result.facets).toEqual([]);
  });
});

describe("v7 facet helpers", () => {
  it("searches the value in the default index and returns facet keys", async () => {
    let body;
    const values = await fetchFacetValues({
      q: "jusi adler olsen",
      facet: "CREATORCONTRIBUTOR",
      accessToken: "tok",
      url: SUGGEST.url,
      fetchImpl: async (url, init) => {
        body = JSON.parse(init.body);
        return {
          ok: true,
          text: async () =>
            JSON.stringify({
              data: {
                complexFacets: {
                  facets: [{ values: [{ key: "jussi adler-olsen" }] }],
                },
              },
            }),
        };
      },
    });

    expect(body.variables).toEqual({
      cql: 'term.default="jusi adler olsen"',
      facets: { facetLimit: 20, facets: ["CREATORCONTRIBUTOR"] },
    });
    expect(values).toEqual(["jussi adler-olsen"]);
  });

  it("returns reranked values with scores, empty on failure", async () => {
    const config = getRerankConfig({}, CONFIG);
    const ranked = await rankFacetValues({
      query: "q",
      documents: ["a", "b"],
      config,
      fetchImpl: async () => ({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              { index: 1, relevance_score: 0.9 },
              { index: 0, relevance_score: 0.1 },
            ],
          }),
      }),
    });

    expect(ranked).toEqual([
      { value: "b", score: 0.9 },
      { value: "a", score: 0.1 },
    ]);
    expect(
      await rankFacetValues({
        query: "q",
        documents: ["a"],
        config,
        fetchImpl: async () => ({ ok: false }),
      })
    ).toEqual([]);
  });
});
