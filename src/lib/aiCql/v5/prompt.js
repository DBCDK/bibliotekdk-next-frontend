/**
 * @file
 * System prompt and JSON schema for AI search v5.
 *
 * Reuses the v4 prompt and clause schema, but asks for three candidate ASTs
 * as plain JSON (structured output) instead of one tool call.
 */

import {
  buildSystemPrompt as buildV4SystemPrompt,
  buildTool,
  TOOL_NAME,
} from "../v4/prompt";

export const CANDIDATE_COUNT = 3;
export const SCHEMA_NAME = "build_queries";

export function buildResponseFormat() {
  const astSchema = buildTool().function.parameters;
  return {
    type: "json_schema",
    json_schema: {
      name: SCHEMA_NAME,
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          candidates: {
            type: "array",
            minItems: CANDIDATE_COUNT,
            maxItems: CANDIDATE_COUNT,
            items: astSchema,
          },
        },
        required: ["candidates"],
      },
    },
  };
}

export function buildSystemPrompt(options) {
  return `${buildV4SystemPrompt(options)}

## Output format (overrides the tool instructions above)

Tools are unavailable. Do not call \`${TOOL_NAME}\`. Instead reply with ONLY a JSON object {"candidates": [q1, q2, q3]} where each q has the exact shape of a \`${TOOL_NAME}\` argument (keys: clauses, combine, note). No prose, no markdown.

Give exactly ${CANDIDATE_COUNT} DIFFERENT candidates for the same request:
1. Your best interpretation.
2. An alternative interpretation (e.g. a different field for an ambiguous word, or a different Danish wording).
3. A broader, looser interpretation (fewer constraints, or default instead of a specific field).`;
}
