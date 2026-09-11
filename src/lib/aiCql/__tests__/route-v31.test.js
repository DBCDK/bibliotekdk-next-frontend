jest.mock("@dbcdk/login-nextjs/server", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/utils/jwt", () => ({
  decodeCookie: jest.fn(),
}));

import { getAccessToken, translate } from "@/pages/api/ai/v3.1/cql";
import { HitcountError } from "@/lib/aiCql/hitcount";
import { getServerSession } from "@dbcdk/login-nextjs/server";
import { decodeCookie } from "@/utils/jwt";

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
  llmRetries: 1,
  maxRelaxations: 6,
  budgetMs: 10000,
};

const AST = {
  clauses: [
    { field: "creator", op: "=", values: ["kim leine"] },
    { field: "specificmaterialtype", op: "=", values: ["bog"] },
    { field: "workyear", op: ">", values: ["2020"] },
  ],
};
const CQL =
  'term.creator="kim leine" AND phrase.specificmaterialtype="bog" AND workyear > 2020';

const REVISED_CQL =
  'term.creator="kim leine" AND phrase.specificmaterialtype="bog"';

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

function toolCall(ast) {
  return response(200, {
    model: "test/model",
    usage: { prompt_tokens: 10, completion_tokens: 5 },
    choices: [
      {
        message: {
          tool_calls: [
            {
              function: { name: "build_query", arguments: JSON.stringify(ast) },
            },
          ],
        },
      },
    ],
  });
}

/** LLM stub: every call returns the supplied AST */
function llm(ast = AST) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push(body);
    return toolCall(ast);
  };
  return { calls, fetchImpl };
}

/** hitcount stub: map cql → hits, everything else 0 */
function hitcounts(map) {
  const checked = [];
  const hitcountImpl = async ({ cql, accessToken, url }) => {
    checked.push({ cql, accessToken, url });
    return { hitcount: map[cql] ?? 0, errorMessage: null, durationMs: 1 };
  };
  return { checked, hitcountImpl };
}

const run = (fetchImpl, hitcountImpl, extra = {}) =>
  translate("bøger af kim leine efter 2020", {
    config: CONFIG,
    validation: VALIDATION,
    accessToken: "tok",
    fetchImpl,
    hitcountImpl,
    ...extra,
  });

describe("v3.1 translate", () => {
  it("returns the translation as is when it has hits", async () => {
    const { calls, fetchImpl } = llm();
    const { checked, hitcountImpl } = hitcounts({ [CQL]: 12 });

    const res = await run(fetchImpl, hitcountImpl);

    expect(res.cql).toBe(CQL);
    expect(res.hitcount).toBe(12);
    expect(res.validated).toBe(true);
    expect(res.strategy).toBe("original");
    expect(res.fallback).toBe(false);
    expect(res.original).toEqual({ cql: CQL, hitcount: 12 });
    expect(res.attempts).toEqual([
      { strategy: "original", cql: CQL, hitcount: 12 },
    ]);
    expect(calls).toHaveLength(1);
    expect(checked).toEqual([
      { cql: CQL, accessToken: "tok", url: VALIDATION.url },
    ]);
    expect(res.timing.hitcount).toBe(1);
  });

  it("relaxes the structure deterministically when the original has no hits", async () => {
    const { calls, fetchImpl } = llm();
    const { checked, hitcountImpl } = hitcounts({
      'term.creator="kim leine"': 7,
    });

    const res = await run(fetchImpl, hitcountImpl);

    expect(res.cql).toBe('term.creator="kim leine"');
    expect(res.hitcount).toBe(7);
    expect(res.strategy).toBe("drop:specificmaterialtype");
    expect(res.ast).toEqual({
      clauses: [{ field: "creator", op: "=", values: ["kim leine"] }],
    });
    expect(res.fallback).toBe(false);
    expect(res.validated).toBe(true);
    expect(calls).toHaveLength(1);
    const cqls = checked.map((c) => c.cql);
    expect(new Set(cqls).size).toBe(cqls.length);
    expect(cqls).toContain(REVISED_CQL);
  });

  it("falls back to the prompt text when nothing structured has hits", async () => {
    const { fetchImpl } = llm();
    const { hitcountImpl } = hitcounts({
      '"bøger" AND "kim" AND "leine" AND "efter" AND "2020"': 1,
    });

    const res = await run(fetchImpl, hitcountImpl);

    expect(res.strategy).toBe("fallback:words");
    expect(res.fallback).toBe(true);
    expect(res.ast).toBeNull();
    expect(res.hitcount).toBe(1);
    const strategies = res.attempts.map((a) => a.strategy);
    expect(strategies).toContain("fallback:phrase");
    expect(strategies.at(-1)).toBe("fallback:words");
  });

  it("returns the original translation when nothing at all has hits", async () => {
    const { fetchImpl } = llm();
    const { hitcountImpl } = hitcounts({});

    const res = await run(fetchImpl, hitcountImpl);

    expect(res.cql).toBe(CQL);
    expect(res.hitcount).toBe(0);
    expect(res.validated).toBe(true);
    expect(res.strategy).toBe("original");
    expect(res.attempts.length).toBeGreaterThan(3);
  });

  it("only calls the model once even when llmRetries is configured", async () => {
    const { calls, fetchImpl } = llm();
    const { hitcountImpl } = hitcounts({ [REVISED_CQL]: 3 });

    const res = await run(fetchImpl, hitcountImpl, {
      validation: { ...VALIDATION, llmRetries: 5 },
    });

    expect(calls).toHaveLength(1);
    expect(res.strategy).toBe("drop:workyear");
    expect(res.cql).toBe(REVISED_CQL);
  });

  it("returns the unvalidated translation when FBI-API cannot be reached", async () => {
    const { calls, fetchImpl } = llm();
    const hitcountImpl = async () => {
      throw new HitcountError("FBI-API responded 503", { status: 503 });
    };

    const res = await run(fetchImpl, hitcountImpl);

    expect(res.cql).toBe(CQL);
    expect(res.validated).toBe(false);
    expect(res.hitcount).toBeNull();
    expect(res.validationError).toBe("FBI-API responded 503");
    expect(res.strategy).toBe("original");
    expect(calls).toHaveLength(1);
  });

  it("skips validation without a token or when disabled", async () => {
    const { fetchImpl } = llm();
    const { checked, hitcountImpl } = hitcounts({});

    const noToken = await run(fetchImpl, hitcountImpl, { accessToken: null });
    expect(noToken.validated).toBe(false);
    expect(noToken.validationError).toBe("No FBI-API access token");

    const disabled = await run(llm().fetchImpl, hitcountImpl, {
      validation: { ...VALIDATION, enabled: false },
    });
    expect(disabled.validated).toBe(false);
    expect(disabled.validationError).toBeUndefined();
    expect(disabled.cql).toBe(CQL);
    expect(checked).toEqual([]);
  });

  it("propagates LLM errors", async () => {
    const fetchImpl = async () =>
      response(401, { error: { message: "bad key", code: 401 } });
    await expect(
      run(fetchImpl, hitcounts({}).hitcountImpl)
    ).rejects.toMatchObject({
      name: "OpenRouterError",
      status: 401,
    });
  });
});

describe("FBI-API access token", () => {
  beforeEach(() => {
    getServerSession.mockReset();
    decodeCookie.mockReset();
  });

  it("reads an existing anonymous-session token", async () => {
    decodeCookie.mockResolvedValue({ accessToken: "anon-token" });
    const req = {
      cookies: { "next-auth.anon-session": "encoded-anon-cookie" },
    };

    await expect(getAccessToken(req, { getHeader: jest.fn() })).resolves.toBe(
      "anon-token"
    );
    expect(decodeCookie).toHaveBeenCalledWith("encoded-anon-cookie");
    expect(getServerSession).not.toHaveBeenCalled();
  });

  it("decodes a newly created anonymous-session cookie", async () => {
    const headers = {};
    const req = { cookies: {} };
    const res = {
      getHeader: (name) => headers[name],
      setHeader: (name, value) => {
        headers[name] = value;
      },
    };
    decodeCookie
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ accessToken: "new-anon-token" });
    getServerSession.mockImplementation(async (_req, response) => {
      response.setHeader("Set-Cookie", [
        "next-auth.anon-session=new-encoded-cookie; Path=/; HttpOnly",
      ]);
      return {};
    });

    await expect(getAccessToken(req, res)).resolves.toBe("new-anon-token");
    expect(decodeCookie).toHaveBeenNthCalledWith(1, undefined);
    expect(decodeCookie).toHaveBeenNthCalledWith(2, "new-encoded-cookie");
  });
});
