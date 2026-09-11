jest.mock("@dbcdk/login-nextjs/server", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/utils/jwt", () => ({
  decodeCookie: jest.fn(),
}));

import { translate } from "@/pages/api/ai/v4/cql";
import {
  FIELDS,
  FIELD_ALIASES,
  normalizeFieldName,
} from "@/lib/aiCql/v4/indexes";
import { selectSuggestion } from "@/lib/aiCql/v4/suggest";
import { compile } from "@/lib/aiCql/compiler";

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

const COMPILE_OPTIONS = { fields: FIELDS, fieldAliases: FIELD_ALIASES };

function toolCall(ast) {
  return {
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        model: "test/model",
        usage: { prompt_tokens: 10, completion_tokens: 5 },
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

/** LLM stub returning the supplied AST for every call */
function llm(ast) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push(JSON.parse(init.body));
    return toolCall(ast);
  };
  return { fetchImpl, calls };
}

/** Suggester stub: a map of input → suggestion list */
function suggester(map) {
  const calls = [];
  const suggestImpl = async ({ q, type }) => {
    calls.push({ q, type });
    return map[q.toLowerCase()] || [];
  };
  return { suggestImpl, calls };
}

describe("v4 pipeline", () => {
  it("replaces open-vocabulary values with the first suggestion", async () => {
    const { fetchImpl, calls } = llm({
      clauses: [
        { field: "creatorcontributor", op: "=", values: ["dostojveski"] },
        { field: "subject", op: "=", values: ["2. verdenskrig"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
      ],
    });
    const { suggestImpl, calls: suggestCalls } = suggester({
      dostojveski: ["F.M. Dostojevskij", "Fjodor Dostojevskij"],
      "2. verdenskrig": ["verdenskrigen 1939-1945"],
    });

    const result = await translate("bøger af dostojveski om 2. verdenskrig", {
      config: CONFIG,
      suggest: SUGGEST,
      accessToken: "tok",
      fetchImpl,
      suggestImpl,
    });

    expect(result.cql).toBe(
      'term.creatorcontributor="F.M. Dostojevskij" AND ' +
        'term.subject="verdenskrigen 1939-1945" AND ' +
        'phrase.specificmaterialtype="bog"'
    );
    expect(result.original.cql).toBe(
      'term.creatorcontributor="dostojveski" AND ' +
        'term.subject="2. verdenskrig" AND ' +
        'phrase.specificmaterialtype="bog"'
    );
    expect(result.resolutions).toContainEqual({
      field: "creatorcontributor",
      input: "dostojveski",
      value: "F.M. Dostojevskij",
      method: "suggester",
    });
    expect(result.fallback).toBe(false);
    expect(calls).toHaveLength(1);
    // the controlled field is resolved locally, not through the suggester
    expect(suggestCalls).toEqual([
      { q: "dostojveski", type: "CREATORCONTRIBUTOR" },
      { q: "2. verdenskrig", type: "SUBJECT" },
    ]);
  });

  it("keeps the value when the suggester has nothing", async () => {
    const { fetchImpl } = llm({
      clauses: [
        { field: "creatorcontributor", op: "=", values: ["ukendt navn"] },
      ],
    });
    const { suggestImpl } = suggester({});

    const result = await translate("noget af ukendt navn", {
      config: CONFIG,
      suggest: SUGGEST,
      accessToken: "tok",
      fetchImpl,
      suggestImpl,
    });

    expect(result.cql).toBe('term.creatorcontributor="ukendt navn"');
    expect(result.resolutions).toHaveLength(0);
    expect(result.suggestions).toEqual([
      {
        field: "creatorcontributor",
        type: "CREATORCONTRIBUTOR",
        input: "ukendt navn",
        suggestions: [],
        accepted: null,
      },
    ]);
  });

  it("looks a title and a series up as well", async () => {
    const { fetchImpl } = llm({
      clauses: [
        { field: "title", op: "=", values: ["profeterne evighedsfjorden"] },
        { field: "series", op: "=", values: ["harry poter"] },
      ],
    });
    const { suggestImpl, calls } = suggester({
      "profeterne evighedsfjorden": ["Profeterne i Evighedsfjorden"],
      "harry poter": ["Harry Potter"],
    });

    const result = await translate("harry poter profeterne", {
      config: CONFIG,
      suggest: SUGGEST,
      accessToken: "tok",
      fetchImpl,
      suggestImpl,
    });

    expect(result.cql).toBe(
      'term.title="Profeterne i Evighedsfjorden" AND term.series="Harry Potter"'
    );
    expect(calls.map((c) => c.type)).toEqual(["TITLE", "SERIES"]);
  });

  it("asks the suggester once per distinct value", async () => {
    const { fetchImpl } = llm({
      clauses: [
        { field: "subject", op: "=", values: ["paris", "Paris"] },
        { field: "subject", op: "=", values: ["paris"], negate: true },
      ],
    });
    const { suggestImpl, calls } = suggester({ paris: ["Paris"] });

    await translate("om paris men ikke paris", {
      config: CONFIG,
      suggest: SUGGEST,
      accessToken: "tok",
      fetchImpl,
      suggestImpl,
    });

    expect(calls).toHaveLength(1);
  });

  it("skips the lookup without an access token and says so", async () => {
    const { fetchImpl } = llm({
      clauses: [{ field: "creatorcontributor", op: "=", values: ["leine"] }],
    });
    const { suggestImpl, calls } = suggester({ leine: ["Kim Leine"] });

    const result = await translate("noget af leine", {
      config: CONFIG,
      suggest: SUGGEST,
      accessToken: null,
      fetchImpl,
      suggestImpl,
    });

    expect(calls).toHaveLength(0);
    expect(result.cql).toBe('term.creatorcontributor="leine"');
    expect(result.warnings).toContain("No FBI-API access token");
  });

  it("skips the lookup when it is disabled", async () => {
    const { fetchImpl } = llm({
      clauses: [{ field: "creatorcontributor", op: "=", values: ["leine"] }],
    });
    const { suggestImpl, calls } = suggester({ leine: ["Kim Leine"] });

    const result = await translate("noget af leine", {
      config: CONFIG,
      suggest: { ...SUGGEST, enabled: false },
      accessToken: "tok",
      fetchImpl,
      suggestImpl,
    });

    expect(calls).toHaveLength(0);
    expect(result.cql).toBe('term.creatorcontributor="leine"');
    expect(result.warnings).toHaveLength(0);
  });

  it("falls back to the prompt when the model returns no tool call", async () => {
    const fetchImpl = async () => ({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          model: "test/model",
          choices: [{ message: { content: "beklager" } }],
        }),
    });
    const { suggestImpl } = suggester({});

    const result = await translate("krimier i kbh", {
      config: CONFIG,
      suggest: SUGGEST,
      accessToken: "tok",
      fetchImpl,
      suggestImpl,
    });

    expect(result.cql).toBe('"krimier i kbh"');
    expect(result.fallback).toBe(true);
    expect(result.ast).toBeNull();
  });
});

describe("v4 field registry", () => {
  it("has no creator, contributor, issn or dk5", () => {
    for (const removed of ["creator", "contributor", "issn", "dk5"]) {
      expect(FIELDS[removed]).toBeUndefined();
    }
    expect(FIELDS.creatorcontributor).toBeDefined();
    expect(FIELDS.isbn).toBeDefined();
  });

  it("maps every person alias to creatorcontributor", () => {
    for (const alias of [
      "creator",
      "contributor",
      "author",
      "artist",
      "director",
      "actor",
      "narrator",
      "translator",
      "illustrator",
      "term.creator",
      "phrase.contributor",
    ]) {
      expect(normalizeFieldName(alias)).toBe("creatorcontributor");
    }
  });

  it("compiles a creator clause from the model as creatorcontributor", () => {
    const { cql } = compile(
      { clauses: [{ field: "creator", op: "=", values: ["kim leine"] }] },
      COMPILE_OPTIONS
    );
    expect(cql).toBe('term.creatorcontributor="kim leine"');
  });

  it("sends a dk5 clause to the default index", () => {
    const { cql, warnings } = compile(
      { clauses: [{ field: "dk5", op: "=", values: ["85"] }] },
      COMPILE_OPTIONS
    );
    expect(cql).toBe('"85"');
    expect(warnings.join(" ")).toMatch(/Unknown field "dk5"/);
  });
});

describe("selectSuggestion", () => {
  it("returns the first usable suggestion", () => {
    expect(selectSuggestion(["", "  ", "Kim Leine", "Kim L."])).toBe(
      "Kim Leine"
    );
  });

  it("returns null without suggestions", () => {
    expect(selectSuggestion([])).toBeNull();
    expect(selectSuggestion(undefined)).toBeNull();
  });
});
