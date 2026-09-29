jest.mock("@dbcdk/login-nextjs/server", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/utils/jwt", () => ({
  decodeCookie: jest.fn(),
}));

import { translate } from "@/pages/api/ai/v6/cql";
import { rankClauses } from "@/lib/aiCql/v6/relax";
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

const SUGGEST = { enabled: false };

const VALIDATION = {
  enabled: true,
  url: "https://fbi.test/bibdk21/graphql",
  timeoutMs: 1000,
  concurrency: 3,
  budgetMs: 5000,
};

const AST = {
  clauses: [
    { field: "creatorcontributor", op: "=", values: ["kim leine"] },
    { field: "subject", op: "=", values: ["grønland"] },
    { field: "specificmaterialtype", op: "=", values: ["lydbog"] },
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

function run(options) {
  return translate("lydbøger af kim leine om grønland", {
    config: CONFIG,
    suggest: SUGGEST,
    accessToken: "tok",
    validation: VALIDATION,
    fetchImpl: llm(AST),
    ...options,
  });
}

describe("v6 relaxation loop", () => {
  it("keeps the v4.1 query and skips the reranker when it has hits", async () => {
    const rankClausesImpl = jest.fn();
    const result = await run({
      hitcountImpl: async () => ({ hitcount: 12 }),
      rankClausesImpl,
    });

    expect(rankClausesImpl).not.toHaveBeenCalled();
    expect(result.relaxation.applied).toBeNull();
    expect(result.relaxation.attempts).toHaveLength(1);
  });

  it("drops the lowest ranked clause when the query has 0 hits", async () => {
    const rankClausesImpl = jest.fn(async () => ({
      order: [0, 2, 1],
      method: "reranker",
    }));
    const hitcountImpl = async ({ cql }) => ({
      hitcount: cql.includes("grønland") ? 0 : 4,
    });

    const result = await run({ hitcountImpl, rankClausesImpl });

    expect(rankClausesImpl).toHaveBeenCalledTimes(1);
    expect(result.relaxation.applied).toBe("drop:subject");
    expect(result.ast.clauses.map((c) => c.field)).toEqual([
      "creatorcontributor",
      "specificmaterialtype",
    ]);
    expect(result.cql).not.toContain("grønland");
  });

  it("keeps the original query with a warning when nothing has hits", async () => {
    const result = await run({
      hitcountImpl: async () => ({ hitcount: 0 }),
      rankClausesImpl: async () => ({ order: [0, 1, 2], method: "reranker" }),
    });

    expect(result.relaxation.applied).toBeNull();
    expect(result.warnings).toContain("No relaxed query had hits");
    expect(result.ast).toEqual(expect.objectContaining(AST));
  });
});

describe("v6 rankClauses", () => {
  it("returns the reranker order", async () => {
    let body;
    const fetchImpl = async (url, init) => {
      body = JSON.parse(init.body);
      return {
        ok: true,
        text: async () =>
          JSON.stringify({ results: [{ index: 1 }, { index: 0 }] }),
      };
    };

    const result = await rankClauses({
      query: "q",
      clauses: AST.clauses.slice(0, 2),
      config: getRerankConfig({}, CONFIG),
      fetchImpl,
    });

    expect(body.documents).toEqual([
      "creatorcontributor: kim leine",
      "subject: grønland",
    ]);
    expect(result).toEqual({ order: [1, 0], method: "reranker" });
  });

  it("falls back to DROP_PRIORITY when the reranker fails", async () => {
    const result = await rankClauses({
      query: "q",
      clauses: AST.clauses,
      config: getRerankConfig({}, CONFIG),
      fetchImpl: async () => ({ ok: false }),
    });

    expect(result).toEqual({ order: [0, 1, 2], method: "priority" });
  });
});
