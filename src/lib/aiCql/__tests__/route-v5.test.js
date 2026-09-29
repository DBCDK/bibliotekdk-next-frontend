import { translate } from "@/pages/api/ai/v5/cql";

const CONFIG = {
  apiKey: "test",
  baseUrl: "https://openrouter.test/api/v1",
  model: "google/gemma-4-26b-a4b-it",
  fallbackModels: [],
  timeoutMs: 5000,
  referer: "",
  title: "t",
  requireParameters: false,
};

const RERANK_CONFIG = { apiKey: "test" };

function llm(candidates, requests = []) {
  return async (url, init) => {
    requests.push(JSON.parse(init.body));
    return {
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          model: "google/gemma-4-26b-a4b-it",
          choices: [{ message: { content: JSON.stringify({ candidates }) } }],
        }),
    };
  };
}

const AUTHOR = {
  clauses: [{ field: "creatorcontributor", op: "=", values: ["kim leine"] }],
};
const SUBJECT = {
  clauses: [{ field: "subject", op: "=", values: ["kim leine"] }],
};
const DEFAULT = {
  clauses: [{ field: "default", op: "=", values: ["kim leine"] }],
};

describe("v5 candidates + reranking", () => {
  it("asks the small model for 3 candidates as structured JSON", async () => {
    const requests = [];
    await translate("bøger af kim leine", {
      config: CONFIG,
      rerankConfig: RERANK_CONFIG,
      fetchImpl: llm([AUTHOR, SUBJECT, DEFAULT], requests),
      rerankImpl: async ({ documents }) => documents,
    });

    expect(requests[0].model).toBe("google/gemma-4-26b-a4b-it");
    expect(requests[0].tools).toBeUndefined();
    expect(requests[0].response_format.type).toBe("json_schema");
    const schema = requests[0].response_format.json_schema.schema;
    expect(schema.properties.candidates.minItems).toBe(3);
    expect(schema.properties.candidates.maxItems).toBe(3);
  });

  it("returns the reranker's top CQL", async () => {
    const rerankImpl = jest.fn(async ({ documents }) => [
      documents[2],
      documents[0],
      documents[1],
    ]);

    const result = await translate("bøger af kim leine", {
      config: CONFIG,
      rerankConfig: RERANK_CONFIG,
      fetchImpl: llm([AUTHOR, SUBJECT, DEFAULT]),
      rerankImpl,
    });

    expect(rerankImpl).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "bøger af kim leine",
        documents: [
          'term.creatorcontributor="kim leine"',
          'term.subject="kim leine"',
          '"kim leine"',
        ],
      })
    );
    expect(result.cql).toBe('"kim leine"');
    expect(result.ast).toEqual(DEFAULT);
    expect(result.candidates.map((c) => c.rank)).toEqual([1, 2, 3]);
    expect(result.fallback).toBe(false);
  });

  it("drops duplicate CQL before reranking", async () => {
    const rerankImpl = jest.fn(async ({ documents }) => documents);

    const result = await translate("bøger af kim leine", {
      config: CONFIG,
      rerankConfig: RERANK_CONFIG,
      fetchImpl: llm([AUTHOR, AUTHOR, SUBJECT]),
      rerankImpl,
    });

    expect(rerankImpl.mock.calls[0][0].documents).toHaveLength(2);
    expect(result.candidates).toHaveLength(2);
  });

  it("keeps the first candidate when reranking fails", async () => {
    const result = await translate("bøger af kim leine", {
      config: CONFIG,
      rerankConfig: { apiKey: "test", baseUrl: "https://x", timeoutMs: 1000 },
      fetchImpl: async (url, init) =>
        url.endsWith("/rerank")
          ? { ok: false }
          : llm([AUTHOR, SUBJECT, DEFAULT])(url, init),
    });

    expect(result.cql).toBe('term.creatorcontributor="kim leine"');
  });

  it("falls back to a default-index query when no candidate compiles", async () => {
    const result = await translate("bæredygtighed", {
      config: CONFIG,
      rerankConfig: RERANK_CONFIG,
      fetchImpl: llm([]),
    });

    expect(result.fallback).toBe(true);
    expect(result.cql).toBeTruthy();
    expect(result.warnings).toContain("Model returned no usable candidates");
  });
});
