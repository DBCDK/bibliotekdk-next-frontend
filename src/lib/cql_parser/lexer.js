"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
const ast_1 = require("./ast");
const os = __importStar(require("os"));
class LexerException extends Error {
  name;
  constructor(message) {
    super(message);
    this.name = "LexerException";
  }
}
module.exports = function lexer(input) {
  if (!input || input.trim() === "") {
    return [];
    // throw new LexerException('No input provided');
  }
  // List of valid found tokens to return
  const tokens = [];
  // Tracks the current line we are on.
  let line = 0;
  // Tracks the current character we are on for a line.
  let pointer = -1;
  // Used to build up full tokens before adding to list.
  let token = "";
  // isDoubleQuoteStart
  let doubleQuoteState = ast_1.DoubleQuoteState.CLOSED;
  // isOpenedParenthesis
  let numberParenthesisOpened = 0;
  // List of lines in the input
  let lines = input.split(os.EOL).map((l) => l + os.EOL);
  // // Function to add a token to the list of found valid tokens
  function createToken(token, overridePointer) {
    return {
      line: line,
      col: overridePointer || pointer,
      parenthesisCount: numberParenthesisOpened,
      ...token,
    };
  }
  function getChar(line, pointer) {
    if (lines.length <= line) {
      return os.EOL;
    }
    return lines[line][pointer];
  }
  function getCurrentChar() {
    return getChar(line, pointer);
  }
  function getNextChar() {
    return getChar(line, pointer + 1) || getChar(line + 1, 0);
  }
  do {
    // Increment pointer
    pointer = pointer + 1;
    /* --- */
    // Check if we're at the end
    // EOL reached. Advance line and reset pointer.
    if (pointer >= lines[line].length) {
      if (line + 1 >= lines.length && token.trim() !== "") {
        tokens.push(
          createToken(
            { type: ast_1.TypeEnum.Term, value: token.trim() },
            pointer - 1
          )
        );
      }
      line++;
      pointer = -1;
    }
    // EOF reached. Exit the loop.
    if (line >= lines.length) {
      tokens.push(createToken({ type: ast_1.TypeEnum.Eof, value: "" }));
      break;
    }
    // Init currentChar
    let currentChar = getCurrentChar();
    /* --- */
    /* Check if currentChar is permitted */
    switch (currentChar) {
      case '"':
        doubleQuoteState = (0, ast_1.SwitchDoubleQuoteState)(doubleQuoteState);
        continue;
      case "(":
        if (doubleQuoteState === ast_1.DoubleQuoteState.CLOSED) {
          numberParenthesisOpened++;
          tokens.push(
            createToken({ type: ast_1.TypeEnum.ParenthesisLeft, value: "(" })
          );
          break;
        }
        continue;
      case ")":
        if (doubleQuoteState === ast_1.DoubleQuoteState.OPEN) {
          token = token + currentChar;
          break;
        } else if (numberParenthesisOpened <= 0) {
          throw new LexerException(
            `Closing unopened parenthesis: ${currentChar} on line ${
              line + 1
            }, col: ${pointer + 1}`
          );
        } else {
          tokens.push(
            createToken({ type: ast_1.TypeEnum.ParenthesisRight, value: ")" })
          );
          numberParenthesisOpened--;
          break;
        }
      case " ":
      case "\n":
        if (doubleQuoteState === ast_1.DoubleQuoteState.OPEN) {
          token = token + currentChar;
        }
        break;
      case "=":
        if (
          token === "" &&
          doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
        ) {
          token = "=";
          tokens.push(
            createToken({ type: ast_1.TypeEnum.CompOpClause, value: token })
          );
          token = "";
          break;
        }
        continue;
      case ">":
      case "<":
        if (
          token === "" &&
          doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
        ) {
          if (getNextChar() === "=") {
            token = currentChar + getNextChar();
            pointer += 1;
            tokens.push(
              createToken({ type: ast_1.TypeEnum.CompOpClause, value: token })
            );
            token = "";
            break;
          } else {
            token = currentChar;
            tokens.push(
              createToken({ type: ast_1.TypeEnum.CompOpClause, value: token })
            );
            token = "";
          }
        }
        continue;
      case "A":
        if (
          token === "" &&
          doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
        ) {
          if (
            getNextChar() === "N" &&
            getChar(line, pointer + 2) === "D" &&
            [" ", "\n"].includes(getChar(line, pointer + 3))
          ) {
            token = "AND";
            pointer += 2;
            tokens.push(
              createToken({ type: ast_1.TypeEnum.BoolOpClause, value: token })
            );
            token = "";
            break;
          } else {
            token = token + currentChar;
          }
        } else {
          token = token + currentChar;
        }
        continue;
      case "O":
        if (
          token === "" &&
          doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
        ) {
          if (
            getNextChar() === "R" &&
            [" ", "\n"].includes(getChar(line, pointer + 2))
          ) {
            token = "OR";
            pointer += 1;
            tokens.push(
              createToken({ type: ast_1.TypeEnum.BoolOpClause, value: token })
            );
            token = "";
            break;
          } else {
            token = token + currentChar;
          }
        } else {
          token = token + currentChar;
        }
        continue;
      case "N":
        if (
          token === "" &&
          doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
        ) {
          if (
            getNextChar() === "O" &&
            getChar(line, pointer + 2) === "T" &&
            [" ", "\n"].includes(getChar(line, pointer + 3))
          ) {
            token = "NOT";
            pointer += 2;
            tokens.push(
              createToken({ type: ast_1.TypeEnum.BoolOpClause, value: token })
            );
            token = "";
            break;
          } else {
            token = token + currentChar;
          }
        } else {
          token = token + currentChar;
        }
        continue;
      default:
        token = token + currentChar;
        break;
    }
    /* ---- */
    /* Forward 1 char */
    let nextChar = getNextChar();
    let isNextCharEOL = typeof lines[line][pointer + 1] === "undefined";
    // /* Check if tempToken is an actual token */
    if (!isNextCharEOL) {
      switch (nextChar) {
        case '"':
          if (token !== "") {
            if (doubleQuoteState === ast_1.DoubleQuoteState.OPEN) {
              tokens.push(
                createToken(
                  { type: ast_1.TypeEnum.Term, value: `"${token}"` },
                  pointer + 1
                )
              );
            } else {
              tokens.push(
                createToken({ type: ast_1.TypeEnum.Term, value: token })
              );
            }
            token = "";
            break;
          }
          break;
        case "(":
          if (
            token !== "" &&
            doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
          ) {
            tokens.push(
              createToken({ type: ast_1.TypeEnum.Term, value: token })
            );
            token = "";
            break;
          }
          break;
        case " ":
        case "\n":
          if (doubleQuoteState === ast_1.DoubleQuoteState.CLOSED) {
            if (token !== "") {
              tokens.push(
                createToken({ type: ast_1.TypeEnum.Term, value: token })
              );
              token = "";
              break;
            }
          }
          break;
        case ")":
          if (
            token !== "" &&
            doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
          ) {
            tokens.push(
              createToken({ type: ast_1.TypeEnum.Term, value: token })
            );
            token = "";
            break;
          }
          break;
        case "=":
        case ">":
        case "<":
          if (
            token !== "" &&
            !token.endsWith("<") &&
            !token.endsWith(">") &&
            doubleQuoteState === ast_1.DoubleQuoteState.CLOSED
          ) {
            tokens.push(
              createToken({ type: ast_1.TypeEnum.Index, value: token })
            );
            token = "";
            break;
          }
          continue;
        default:
          break;
      }
    }
  } while (true);
  return tokens;
};
//# sourceMappingURL=lexer.js.map
