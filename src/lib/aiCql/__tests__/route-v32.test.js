jest.mock("@dbcdk/login-nextjs/server", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/utils/jwt", () => ({
  decodeCookie: jest.fn(),
}));

import {
  selectCreatorSuggestion,
  translate,
} from "@/pages/api/ai/v3.2/cql";

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

const VALIDATION = {
  enabled: true,
  url: "https://fbi.test/bibdk21/graphql",
  timeoutMs: 1000,
  concurrency: 2,
  maxRelaxations: 6,
  budgetMs: 10000,
};

const AST = {
  clauses: [
    { field: "creator", op: "=", values: ["dostojveski"] },
    { field: "specificmaterialtype", op: "=", values: ["bog"] },
  ],
};
const ORIGINAL_CQL =
  'term.creator="dostojveski" AND worktype=literature';
const CORRECTED_CQL =
  'term.creator="F.M. Dostojevskij" AND worktype=literature';

function toolCall(ast) {
  return {
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
  };
}

describe("v3.2 creator correction", () => {
  it("uses the first creator suggestion", async () => {
    const llmFetch = jest.fn(async () => toolCall(AST));
    const hitcountImpl = jest.fn(async ({ cql }) => ({
      hitcount: cql === CORRECTED_CQL ? 3 : 0,
      errorMessage: null,
      durationMs: 1,
    }));
    const suggestImpl = jest.fn(async () => [
      "F.M. Dostojevskij",
      "Fjodor Dostojevskij",
      "Fjodor M. Dostojevski",
      "F Dostoevski",
    ]);

    const result = await translate("find en bog af dostojveski", {
      config: CONFIG,
      validation: VALIDATION,
      accessToken: "tok",
      fetchImpl: llmFetch,
      hitcountImpl,
      suggestImpl,
    });

    expect(result.cql).toBe(CORRECTED_CQL);
    expect(result.strategy).toBe("catalogue-correction");
    expect(result.hitcount).toBe(3);
    expect(result.original).toEqual({ cql: ORIGINAL_CQL, hitcount: 0 });
    expect(result.ast.clauses).toContainEqual({
      field: "worktype",
      op: "=",
      values: ["literature"],
    });
    expect(result.ast.clauses).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "specificmaterialtype" }),
      ])
    );
    expect(result.resolutions).toContainEqual({
      field: "creator",
      input: "dostojveski",
      value: "F.M. Dostojevskij",
      method: "catalogue-suggestion",
    });
    expect(llmFetch).toHaveBeenCalledTimes(1);
    expect(suggestImpl).toHaveBeenCalledWith({
      q: "dostojveski",
      accessToken: "tok",
      url: VALIDATION.url,
      timeoutMs: VALIDATION.timeoutMs,
    });
  });

  it("returns the first non-empty catalogue suggestion", () => {
    expect(
      selectCreatorSuggestion(["", "F.M. Dostojevskij", "Fjodor Dostojevski"])
    ).toBe("F.M. Dostojevskij");
  });

  it("returns null without catalogue suggestions", () => {
    expect(selectCreatorSuggestion([])).toBeNull();
  });
});
