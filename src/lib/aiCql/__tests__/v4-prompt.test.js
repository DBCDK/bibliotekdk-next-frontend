import { compile } from "@/lib/aiCql/compiler";
import { FIELDS, FIELD_ALIASES, FIELD_NAMES } from "@/lib/aiCql/v4/indexes";
import {
  buildMessages,
  buildSystemPrompt,
  buildTool,
  EXAMPLES,
  TOOL_NAME,
} from "@/lib/aiCql/v4/prompt";
import { SUGGESTED_FIELDS } from "@/lib/aiCql/v4/suggestFields";
import { extractToolArguments } from "@/lib/aiCql/openrouter";

const COMPILE_OPTIONS = { fields: FIELDS, fieldAliases: FIELD_ALIASES };

describe("v4 prompt", () => {
  it("mentions every v4 field", () => {
    const prompt = buildSystemPrompt();
    for (const name of FIELD_NAMES) {
      expect(prompt).toContain(`- ${name}`);
    }
  });

  it("does not offer the fields v4 dropped", () => {
    const prompt = buildSystemPrompt();
    for (const removed of ["creator", "contributor", "issn", "dk5"]) {
      expect(prompt).not.toContain(`- ${removed}:`);
      expect(prompt).not.toContain(`- ${removed} (`);
    }
  });

  it("tells the model that one person field covers every role", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("**Every person is `creatorcontributor`**");
    expect(prompt).toContain("never guess the role");
  });

  it("explains that open values are looked up in the catalogue", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain(SUGGESTED_FIELDS.join(", "));
    expect(prompt).toContain("closest real catalogue value");
  });

  it("tool schema whitelists the v4 fields only", () => {
    const tool = buildTool();
    const fieldEnum =
      tool.function.parameters.properties.clauses.items.properties.field.enum;
    expect(tool.function.name).toBe(TOOL_NAME);
    expect(fieldEnum).toEqual([...FIELD_NAMES]);
    expect(fieldEnum).toContain("creatorcontributor");
    expect(fieldEnum).not.toContain("creator");
    expect(fieldEnum).not.toContain("contributor");
    expect(fieldEnum).not.toContain("issn");
    expect(fieldEnum).not.toContain("dk5");
  });

  it("every gold example compiles without warnings", () => {
    for (const ex of EXAMPLES) {
      const { cql, warnings } = compile(ex.ast, COMPILE_OPTIONS);
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

  it("no gold example uses a dropped field", () => {
    for (const ex of EXAMPLES) {
      for (const clause of ex.ast.clauses) {
        expect(FIELD_NAMES).toContain(clause.field);
      }
    }
  });

  it("caches the system prompt in the message array", () => {
    const messages = buildMessages("krimi i kbh");
    expect(messages[0].role).toBe("system");
    expect(messages[0].content[0].cache_control).toEqual({ type: "ephemeral" });
    expect(messages[1]).toEqual({ role: "user", content: "krimi i kbh" });
  });

  it("round-trips a tool call through the extractor", () => {
    const ast = EXAMPLES[0].ast;
    const completion = {
      choices: [
        {
          message: {
            tool_calls: [
              {
                function: { name: TOOL_NAME, arguments: JSON.stringify(ast) },
              },
            ],
          },
        },
      ],
    };
    expect(extractToolArguments(completion, TOOL_NAME)).toEqual(ast);
  });
});
