import ALLOWED_FIELDS from "./fields.json";

/**
 * TOKEN_TYPES defines different categories of tokens that can be recognized by the parser.
 * Each token type represents a significant element in the syntax of CQL, as follows:
 * - QUERY_BEGIN: Marks the start of a query.
 * - QUERY_END: Marks the end of a query.
 * - OPERATOR: Represents logical operators (AND, OR).
 * - RANGE_OPERATOR: Used for range operations (<, >, <=, >=).
 * - ASSIGNMENT: Indicates an assignment operation (=).
 * - WITHIN: Represents the within operator.
 * - FIELD: Identifies field names within queries.
 * - LITERAL: Represents literal values (e.g., numbers, strings).
 * - PARENTHESIS_BEGIN: Marks the beginning of a parenthesis block.
 * - PARENTHESIS_END: Marks the end of a parenthesis block.
 */
export const TOKEN_TYPES = {
  QUERY_BEGIN: "QUERY_BEGIN",
  QUERY_END: "QUERY_END",
  OPERATOR: "OPERATOR",
  RANGE_OPERATOR: "RANGE_OPERATOR",
  ASSIGNMENT: "ASSIGNMENT",
  WITHIN: "WITHIN",
  FIELD: "FIELD",
  LITERAL: "LITERAL",
  PARENTHESIS_BEGIN: "PARENTHESIS_BEGIN",
  PARENTHESIS_END: "PARENTHESIS_END",
};

/**
 * EXPRESSION_TYPES categorizes different types of expressions within CQL. Definitions include:
 * - ASSIGNMENT_VALUE_GROUP: Represents a group of values or logical expressions enclosed in
 *   parentheses directly following an assignment. This expression type is used to define the
 *   values being assigned, allowing for logical operations within them, but excluding any
 *   field identifiers to maintain a focused context for the assignment.
 *   For instance: term.title=(fisk or hest).
 */
export const EXPRESSION_TYPES = {
  ASSIGNMENT_VALUE_GROUP: "ASSIGNMENT_VALUE_GROUP",
};

/**
 * ALLOWED_NEXT defines valid sequences of token types following a given token.
 * This ensures that the parser can enforce syntactical rules based on the current
 * context of parsing. For example, after a FIELD token, an ASSIGNMENT token can
 * follow, indicating that a field is about to be assigned a value.
 */
export const ALLOWED_NEXT = {
  [TOKEN_TYPES.ASSIGNMENT]: [
    TOKEN_TYPES.LITERAL,
    TOKEN_TYPES.PARENTHESIS_BEGIN,
  ],
  [TOKEN_TYPES.QUERY_BEGIN]: [
    TOKEN_TYPES.FIELD,
    TOKEN_TYPES.PARENTHESIS_BEGIN,
    TOKEN_TYPES.LITERAL,
  ],
  [TOKEN_TYPES.FIELD]: [
    TOKEN_TYPES.ASSIGNMENT,
    TOKEN_TYPES.WITHIN,
    TOKEN_TYPES.RANGE_OPERATOR,
  ],
  [TOKEN_TYPES.PARENTHESIS_BEGIN]: [
    TOKEN_TYPES.FIELD,
    TOKEN_TYPES.LITERAL,
    TOKEN_TYPES.PARENTHESIS_BEGIN,
  ],
  [TOKEN_TYPES.PARENTHESIS_END]: [
    TOKEN_TYPES.OPERATOR,
    TOKEN_TYPES.PARENTHESIS_END,
    TOKEN_TYPES.QUERY_END,
  ],
  [TOKEN_TYPES.LITERAL]: [
    TOKEN_TYPES.OPERATOR,
    TOKEN_TYPES.PARENTHESIS_END,
    TOKEN_TYPES.QUERY_END,
  ],
  [TOKEN_TYPES.OPERATOR]: [
    TOKEN_TYPES.LITERAL,
    TOKEN_TYPES.FIELD,
    TOKEN_TYPES.PARENTHESIS_BEGIN,
  ],
  [TOKEN_TYPES.WITHIN]: [TOKEN_TYPES.LITERAL],
  [TOKEN_TYPES.RANGE_OPERATOR]: [TOKEN_TYPES.LITERAL],

  [EXPRESSION_TYPES.ASSIGNMENT_VALUE_GROUP]: [
    TOKEN_TYPES.LITERAL,
    TOKEN_TYPES.OPERATOR,
    TOKEN_TYPES.PARENTHESIS_BEGIN,
    TOKEN_TYPES.PARENTHESIS_END,
  ],
};

/**
 * ERRORS lists possible error codes that the parser can generate during the parsing process.
 * Each error code corresponds to a specific type of syntax or semantic error
 */
export const ERRORS = {
  MISSING_OPENING_PARANTHESIS: "MISSING_OPENING_PARANTHESIS",
  MISSING_CLOSING_PARANTHESIS: "MISSING_CLOSING_PARANTHESIS",
  UNCLOSED_STRING_LITERAL: "UNCLOSED_STRING_LITERAL",
  UNEXPECTED_TOKEN: "UNEXPECTED_TOKEN",
  UNKNOWN_FIELD: "UNKNOWN_FIELD",
  UNEXPECTED_ENDING: "UNEXPECTED_ENDING",
};

/**
 * CHAR_TO_TYPE maps single characters and character sequences to their respective token types.
 * This mapping is utilized during the lexical analysis phase to convert raw text into categorized
 * tokens, facilitating further syntactic analysis.
 */
export const CHAR_TO_TYPE = {
  "<": "RANGE_OPERATOR",
  ">": "RANGE_OPERATOR",
  "<=": "RANGE_OPERATOR",
  ">=": "RANGE_OPERATOR",
  "=": "ASSIGNMENT",
  "(": "PARENTHESIS_BEGIN",
  ")": "PARENTHESIS_END",
};

/**
 * TOKEN_SEPARATORS lists characters and strings that should be treated as boundaries between tokens.
 * This helps in tokenizing the input string efficiently by identifying where one token ends and another begins.
 */
export const TOKEN_SEPARATORS = [
  "(",
  ")",
  "=",
  " ",
  "\n",
  ">",
  "<",
  ">=",
  "<=",
];

/**
 * ALLOWED_FIELDS_SET is a set derived from an external JSON file containing names of fields
 * that are permitted in CQL queries. This set is used to validate field names during parsing
 * to ensure only recognized fields are used in.
 */
export const ALLOWED_FIELDS_SET = new Set(ALLOWED_FIELDS);
