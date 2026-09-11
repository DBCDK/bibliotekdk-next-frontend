import { translate } from "@/pages/api/ai/v3/cql";

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

const AST = {
  clauses: [
    { field: "specificmaterialtype", op: "=", values: ["bog"] },
    { field: "setting", op: "=", values: ["valencia"] },
  ],
};

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

describe("translate", () => {
  it("uses the forced tool call and compiles the AST", async () => {
    const calls = [];
    const fetchImpl = async (url, init) => {
      calls.push(JSON.parse(init.body));
      return response(200, {
        model: "test/model",
        choices: [
          {
            message: {
              tool_calls: [
                {
                  function: {
                    name: "build_query",
                    arguments: JSON.stringify(AST),
                  },
                },
              ],
            },
          },
        ],
      });
    };

    const res = await translate("find bog der foregår i valencia", {
      config: CONFIG,
      fetchImpl,
    });

    expect(res.cql).toBe(
      'phrase.specificmaterialtype="bog" AND term.subject="valencia"'
    );
    expect(res.mode).toBe("tool");
    expect(res.fallback).toBe(false);
    expect(calls).toHaveLength(1);
    expect(calls[0].tools).toHaveLength(1);
    expect(calls[0].tool_choice).toEqual({
      type: "function",
      function: { name: "build_query" },
    });
    expect(calls[0].provider).toBeUndefined();
    expect(calls[0].parallel_tool_calls).toBeUndefined();
    expect(calls[0].messages[0].content[0].cache_control).toEqual({
      type: "ephemeral",
    });
  });

  it("retries as plain JSON when OpenRouter has no tool-capable endpoint", async () => {
    const calls = [];
    const fetchImpl = async (url, init) => {
      const body = JSON.parse(init.body);
      calls.push(body);
      if (body.tools) {
        return response(404, {
          error: {
            message:
              "No endpoints found that can handle the requested parameters.",
            code: 404,
          },
        });
      }
      return response(200, {
        model: "test/model",
        choices: [{ message: { content: JSON.stringify(AST) } }],
      });
    };

    const res = await translate("find bog der foregår i valencia", {
      config: CONFIG,
      fetchImpl,
    });

    expect(res.mode).toBe("json");
    expect(res.cql).toBe(
      'phrase.specificmaterialtype="bog" AND term.subject="valencia"'
    );
    expect(calls).toHaveLength(2);
    expect(calls[1].tools).toBeUndefined();
    expect(calls[1].response_format).toEqual({ type: "json_object" });
    expect(calls[1].messages.at(-1).role).toBe("system");
  });

  it("propagates other OpenRouter errors", async () => {
    const fetchImpl = async () =>
      response(401, { error: { message: "bad key", code: 401 } });
    await expect(
      translate("noget", { config: CONFIG, fetchImpl })
    ).rejects.toMatchObject({ name: "OpenRouterError", status: 401 });
  });

  it("falls back to a default-index term when the model output is unusable", async () => {
    const fetchImpl = async () =>
      response(200, {
        choices: [{ message: { content: "I cannot help with that." } }],
      });
    const res = await translate("krimi i kbh", { config: CONFIG, fetchImpl });
    expect(res.cql).toBe('"krimi i kbh"');
    expect(res.fallback).toBe(true);
  });
});
