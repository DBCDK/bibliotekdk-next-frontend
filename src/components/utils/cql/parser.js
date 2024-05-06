import Translate from "@/components/base/translate/Translate";
import {
  TOKEN_TYPES,
  EXPRESSION_TYPES,
  ALLOWED_NEXT,
  ERRORS,
  CHAR_TO_TYPE,
  TOKEN_SEPARATORS,
  ALLOWED_FIELDS_SET,
} from "./definitions";
import { didYouMean } from "./didYouMean";

/**
 * Assigns types to string tokens based on context, such as preceding and following tokens.
 * This function helps distinguish between fields, literals, and operators within the
 * context of their usage in the query.
 */
function resolveStringTypes(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prevToken = tokens[i - 1];
    const nextToken = tokens[i + 1];
    const lowerCased = token.normalized?.toLowerCase();

    if (token.type) {
      continue;
    }

    if (
      prevToken.type === TOKEN_TYPES.ASSIGNMENT ||
      prevToken.type === TOKEN_TYPES.WITHIN
    ) {
      token.type = TOKEN_TYPES.LITERAL;
    } else if (nextToken?.type === TOKEN_TYPES.ASSIGNMENT) {
      token.type = TOKEN_TYPES.FIELD;
    } else if (
      prevToken.type === TOKEN_TYPES.PARENTHESIS_BEGIN ||
      prevToken.type === TOKEN_TYPES.QUERY_BEGIN ||
      prevToken.type === TOKEN_TYPES.OPERATOR
    ) {
      if (
        nextToken.type === TOKEN_TYPES.ASSIGNMENT ||
        nextToken.type === TOKEN_TYPES.RANGE_OPERATOR ||
        nextToken.normalized?.toLowerCase() === "within"
      ) {
        token.type = TOKEN_TYPES.FIELD;
      } else {
        token.type = TOKEN_TYPES.LITERAL;
      }
    } else if (prevToken.type === TOKEN_TYPES.OPERATOR) {
      token.type = TOKEN_TYPES.LITERAL;
    } else if (["within"].includes(lowerCased)) {
      token.type = TOKEN_TYPES.WITHIN;
    } else if (["and", "or", "not"].includes(lowerCased)) {
      token.type = TOKEN_TYPES.OPERATOR;
    } else {
      token.type = TOKEN_TYPES.LITERAL;
    }
  }
}

/**
 * Assigns types to tokens that are not part of string literals based on predefined
 * character to token type mappings (CHAR_TO_TYPE).
 */
function resolveNonStringTypes(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token.type) {
      token.type = CHAR_TO_TYPE[token.normalized];
    }
  }
}

/**
 * Converts the input string into an array of token objects based on defined
 * separators and quote handling. The function identifies the beginning and end
 * of string literals, respects escaped characters within literals, and handles
 * multi-character separators.
 */
export function tokenize(input) {
  if (!input) {
    return [];
  }
  let tokens = [];
  let currentToken = "";
  let inQuotes = false;
  let isEscaped = false; // Flag to track if the current character is escaped

  function pushToken(raw) {
    const normalized = raw.trim();
    if (normalized) {
      tokens.push({
        raw,
        normalized,
      });
      currentToken = "";
    }
  }

  tokens.push({ type: TOKEN_TYPES.QUERY_BEGIN });

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const nextChar = input[i + 1];

    // Check if current character is a quote and the previous character was an escape character
    if (char === '"' && !isEscaped) {
      inQuotes = !inQuotes; // Toggle quote status for string literals
      currentToken += char;
      continue; // Skip further processing to include the quote in the token
    } else if (char === "\\" && inQuotes) {
      if (isEscaped) {
        // Handle cases of escaped escape character (e.g., "\\")
        currentToken += char;
        isEscaped = false; // Reset the escape state since it's consumed
      } else {
        isEscaped = true; // Next character is escaped
        continue; // Skip further processing to check the next character
      }
    } else {
      isEscaped = false; // Reset escape status if current character is not a backslash
    }

    if (!inQuotes) {
      if (TOKEN_SEPARATORS.includes(char + nextChar)) {
        pushToken(currentToken);
        currentToken += char;
        currentToken += nextChar;
        pushToken(currentToken);
        i++;
      } else if (TOKEN_SEPARATORS.includes(char)) {
        pushToken(currentToken);
        currentToken += char;
        pushToken(currentToken);
      } else {
        currentToken += char;
      }
    } else {
      currentToken += char;
    }
  }
  if (currentToken.trim()) {
    pushToken(currentToken);
  } else {
    tokens[tokens.length - 1].raw =
      tokens[tokens.length - 1].raw + currentToken;
  }

  tokens.push({
    type: TOKEN_TYPES.QUERY_END,
  });

  resolveNonStringTypes(tokens);
  resolveStringTypes(tokens);

  return tokens;
}

/**
 * Checks for and marks tokens involved in unclosed structures such as unpaired
 * parentheses and unclosed string literals. This function ensures the structural
 * integrity of the parsed query.
 */
function validateUnclosed(tokens) {
  // Check parenthesis errors
  let parenthesisDepth = 0;
  let parenthesisFirstToken;
  tokens.forEach((token) => {
    if (token.normalized === "(") {
      if (parenthesisDepth === 0) {
        parenthesisFirstToken = token;
      }
      parenthesisDepth++;
    }
    if (token.normalized === ")") {
      parenthesisDepth--;
      if (parenthesisDepth < 0) {
        token.error = ERRORS.MISSING_OPENING_PARANTHESIS;
        parenthesisDepth = 0;
      }
    }

    if (
      token?.normalized?.startsWith('"') &&
      !token?.normalized?.endsWith('"')
    ) {
      token.error = ERRORS.UNCLOSED_STRING_LITERAL;
    }
  });
  if (parenthesisDepth > 0) {
    parenthesisFirstToken.error = ERRORS.MISSING_CLOSING_PARANTHESIS;
  }
}

/**
 * Validates the sequence of tokens against the defined grammatical rules of CQL.
 * It uses ALLOWED_NEXT to determine valid following tokens and identifies
 * grammatical mismatches.
 */
function validateGrammar(tokens) {
  let isAssignmentGroup = [];
  for (let i = 0; i < tokens.length; i++) {
    const currentToken = tokens[i];
    const prevToken = tokens[i - 1];
    if (currentToken.type === TOKEN_TYPES.PARENTHESIS_BEGIN) {
      isAssignmentGroup.push(prevToken?.type === TOKEN_TYPES.ASSIGNMENT);
    } else if (currentToken.type === TOKEN_TYPES.PARENTHESIS_END) {
      isAssignmentGroup.pop();
    }

    let allowed =
      i === 0 ? [TOKEN_TYPES.QUERY_BEGIN] : ALLOWED_NEXT[prevToken?.type];
    if (isAssignmentGroup.includes(true)) {
      allowed = allowed.filter((type) =>
        ALLOWED_NEXT[EXPRESSION_TYPES.ASSIGNMENT_VALUE_GROUP].includes(type)
      );
    }

    if (!allowed?.includes(currentToken.type)) {
      currentToken.error = ERRORS.UNEXPECTED_TOKEN;
      currentToken.expected = allowed;

      // Attach error to prev token, for better error visualization
      if (currentToken.type === TOKEN_TYPES.QUERY_END && !prevToken?.error) {
        prevToken.error = currentToken.error = ERRORS.UNEXPECTED_ENDING;
        prevToken.expected = allowed;
      }
    }
  }

  return tokens;
}

/**
 * Ensures that all field tokens correspond to known and allowed fields as
 * defined in ALLOWED_FIELDS_SET.
 */
function validateFields(tokens) {
  tokens.forEach((token) => {
    if (
      token.type === TOKEN_TYPES.FIELD &&
      !ALLOWED_FIELDS_SET.has(token.normalized?.toLowerCase())
    ) {
      token.error = ERRORS.UNKNOWN_FIELD;
    }
  });
}

/**
 * Validate all tokens
 */
export function validateTokens(tokens) {
  validateUnclosed(tokens);
  validateGrammar(tokens);
  validateFields(tokens);

  return tokens;
}

/**
 * Converts an array of token objects into a string with HTML markup for
 * syntax highlighting.
 */
export function highlight(tokens) {
  let res = "";
  let errorCount = 0;
  tokens.forEach((token) => {
    if ([TOKEN_TYPES.QUERY_BEGIN, TOKEN_TYPES.QUERY_END].includes(token.type)) {
      return;
    }
    const classes = [];
    classes.push(`token-type_${token.type}`);
    if (token.error) {
      if (errorCount === 0) {
        classes.push("cql-error");
        classes.push(`cql-error_cql-error_${token.error}`);
      }

      errorCount++;
    }

    const raw = token.raw.replace(token.normalized, "%s");
    const final = raw.replace(
      "%s",
      `<span class="${classes.join(" ")}">${token.normalized}</span>`
    );
    res += final;
  });

  return res;
}

/**
 * Converts an array of token objects into a string with HTML markup for
 * displaying error message.
 */
export function createErrorMessage(validatedTokens) {
  const errors = validatedTokens.filter((token) => token.error);
  let message;
  // Only begin and end token found
  if (validatedTokens.length < 3) {
    message = Translate({
      context: "advanced_search_parse_errors",
      label: "EMPTY_QUERY",
    });
  } else if (errors.length) {
    message = Translate({
      context: "advanced_search_parse_errors",
      label: errors[0]?.error,
    });

    if (errors[0]?.error === ERRORS.UNKNOWN_FIELD) {
      const fields = didYouMean(errors[0].normalized, ALLOWED_FIELDS_SET);
      if (fields.length > 0) {
        message +=
          "<br/>" +
          Translate({
            context: "advanced_search_parse_errors",
            label: "didUMean",
            vars: [
              fields.map((field) => `<b><i>${field.value}</i></b>`).join(", "),
            ],
          });
      }
    }
  }

  return { message, errors };
}
