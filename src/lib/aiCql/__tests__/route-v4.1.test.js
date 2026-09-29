jest.mock("@dbcdk/login-nextjs/server", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/utils/jwt", () => ({
  decodeCookie: jest.fn(),
}));

import { translate } from "@/pages/api/ai/v4.1/cql";
import { getRerankConfig, rerankSuggestions } from "@/lib/aiCql/v4.1/suggest";

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

describe("v4.1 suggester reranking", () => {
  it("uses the reranker's first result instead of the suggester's first", async () => {
    const suggestImpl = jest.fn(async () => [
      "F.M. Dostojevskij",
      "Fjodor Dostojevskij",
    ]);
    const rerankImpl = jest.fn(async ({ documents }) => [
      documents[1],
      documents[0],
    ]);

    const result = await translate("bøger af dostojveski", {
      config: CONFIG,
      suggest: SUGGEST,
      accessToken: "tok",
      fetchImpl: llm({
        clauses: [
          { field: "creatorcontributor", op: "=", values: ["dostojveski"] },
        ],
      }),
      suggestImpl,
      rerankImpl,
    });

    expect(rerankImpl).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "dostojveski",
        documents: ["F.M. Dostojevskij", "Fjodor Dostojevskij"],
      })
    );
    expect(result.cql).toBe('term.creatorcontributor="Fjodor Dostojevskij"');
    expect(result.suggestions[0].accepted).toBe("Fjodor Dostojevskij");
  });

  it("sends the Voyage model and restores documents by ranked index", async () => {
    let request;
    const fetchImpl = async (url, init) => {
      request = { url, ...init, body: JSON.parse(init.body) };
      return {
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              { index: 1, relevance_score: 0.9 },
              { index: 0, relevance_score: 0.2 },
            ],
          }),
      };
    };
    const config = getRerankConfig(
      { AI_CQL_RERANK_TIMEOUT_MS: "2000" },
      CONFIG
    );

    const result = await rerankSuggestions({
      query: "dostojveski",
      documents: ["F.M. Dostojevskij", "Fjodor Dostojevskij"],
      config,
      fetchImpl,
    });

    expect(request.url).toBe("https://openrouter.test/api/v1/rerank");
    expect(request.body).toEqual({
      model: "voyageai/rerank-2.5-lite",
      query: "dostojveski",
      documents: ["F.M. Dostojevskij", "Fjodor Dostojevskij"],
      top_n: 2,
    });
    expect(result).toEqual(["Fjodor Dostojevskij", "F.M. Dostojevskij"]);
  });

  it("keeps the original order when reranking fails", async () => {
    const documents = ["First", "Second"];
    const result = await rerankSuggestions({
      query: "query",
      documents,
      config: getRerankConfig({}, CONFIG),
      fetchImpl: async () => ({ ok: false }),
    });

    expect(result).toEqual(documents);
  });

  it("only reranks the top 3 suggestions", async () => {
    let sent;
    const fetchImpl = async (url, init) => {
      sent = JSON.parse(init.body).documents;
      return {
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [{ index: 2 }, { index: 0 }, { index: 1 }],
          }),
      };
    };

    const result = await rerankSuggestions({
      query: "query",
      documents: ["A", "B", "C", "D", "E"],
      config: getRerankConfig({}, CONFIG),
      fetchImpl,
    });

    expect(sent).toEqual(["A", "B", "C"]);
    expect(result).toEqual(["C", "A", "B", "D", "E"]);
  });
});
