import { compile } from "@/lib/aiCql/compiler";
import { FIELD_NAMES } from "@/lib/aiCql/indexes";
import {
  buildMessages,
  buildSystemPrompt,
  buildTool,
  EXAMPLES,
  TOOL_NAME,
} from "@/lib/aiCql/prompt";
import { extractToolArguments } from "@/lib/aiCql/openrouter";

describe("prompt", () => {
  it("mentions every field", () => {
    const prompt = buildSystemPrompt();
    for (const name of FIELD_NAMES) {
      expect(prompt).toContain(`- ${name}`);
    }
  });

  it("requires names to be preserved for catalogue-backed correction", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("Keep people's names exactly as written");
    expect(prompt).toContain("Never correct names");
    expect(prompt).not.toContain("fix obvious typos");
  });

  it("tool schema whitelists the fields", () => {
    const tool = buildTool();
    expect(tool.function.name).toBe(TOOL_NAME);
    expect(
      tool.function.parameters.properties.clauses.items.properties.field.enum
    ).toEqual(FIELD_NAMES);
  });

  it("every gold example compiles without warnings", () => {
    for (const ex of EXAMPLES) {
      const { cql, warnings } = compile(ex.ast);
      expect({ user: ex.user, cql }).toEqual({
        user: ex.user,
        cql: expect.any(String),
      });
      expect({ user: ex.user, warnings }).toEqual({
        user: ex.user,
        warnings: [],
      });
    }
  });

  it("marks the system prompt for prompt caching", () => {
    const [system, user] = buildMessages("hej", { systemPrompt: "S" });
    expect(system.role).toBe("system");
    expect(system.content[0]).toMatchObject({
      type: "text",
      text: "S",
      cache_control: { type: "ephemeral" },
    });
    expect(user).toEqual({ role: "user", content: "hej" });
  });
});

describe("extractToolArguments", () => {
  it("reads a tool call", () => {
    const completion = {
      choices: [
        {
          message: {
            tool_calls: [
              {
                function: {
                  name: TOOL_NAME,
                  arguments:
                    '{"clauses":[{"field":"creator","op":"=","values":["x"]}]}',
                },
              },
            ],
          },
        },
      ],
    };
    expect(extractToolArguments(completion, TOOL_NAME)).toEqual({
      clauses: [{ field: "creator", op: "=", values: ["x"] }],
    });
  });

  it("falls back to JSON in the content", () => {
    const completion = {
      choices: [
        {
          message: {
            content: 'Here: ```json\n{"clauses":[]}\n```',
          },
        },
      ],
    };
    expect(extractToolArguments(completion)).toEqual({ clauses: [] });
  });

  it("returns null when nothing is parseable", () => {
    expect(
      extractToolArguments({ choices: [{ message: { content: "nope" } }] })
    ).toBeNull();
    expect(extractToolArguments({})).toBeNull();
  });
});
