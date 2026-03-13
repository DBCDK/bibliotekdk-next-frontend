#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const DEFAULT_TRANSLATION_FILE = path.join(
  ROOT_DIR,
  "src/components/base/translate/Translate.json"
);
const DEFAULT_SCAN_DIRS = ["src", "cypress"];
const VALID_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const TRANSLATE_FN_NAMES = new Set(["Translate", "translate", "hasTranslation"]);

function parseArgs(argv) {
  const options = {
    prune: false,
    backup: true,
    translationFile: DEFAULT_TRANSLATION_FILE,
    dirs: [...DEFAULT_SCAN_DIRS],
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--prune") {
      options.prune = true;
    } else if (arg === "--no-backup") {
      options.backup = false;
    } else if (arg.startsWith("--file=")) {
      options.translationFile = path.resolve(ROOT_DIR, arg.slice("--file=".length));
    } else if (arg === "--file" && argv[i + 1]) {
      options.translationFile = path.resolve(ROOT_DIR, argv[i + 1]);
      i += 1;
    } else if (arg.startsWith("--dirs=")) {
      options.dirs = arg
        .slice("--dirs=".length)
        .split(",")
        .map((dir) => dir.trim())
        .filter(Boolean);
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.warn(`Unknown argument ignored: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Usage:
  node scripts/unused-translations.js [options]

Options:
  --prune             Remove unused translations from Translate.json
  --no-backup         Skip backup file creation when using --prune
  --file <path>       Translation json file (default: src/components/base/translate/Translate.json)
  --dirs=a,b,c        Comma-separated dirs to scan (default: src,cypress)
  --help, -h          Show this help
`);
}

function walkFiles(startPath) {
  const files = [];
  if (!fs.existsSync(startPath)) return files;

  const stack = [startPath];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = fs.statSync(current);

    if (stat.isDirectory()) {
      const base = path.basename(current);
      if (
        base === "node_modules" ||
        base === ".git" ||
        base === ".next" ||
        base === "dist" ||
        base === "build" ||
        base === "coverage"
      ) {
        continue;
      }

      const entries = fs.readdirSync(current);
      for (const entry of entries) {
        stack.push(path.join(current, entry));
      }
      continue;
    }

    if (VALID_EXTENSIONS.has(path.extname(current))) {
      files.push(current);
    }
  }

  return files;
}

function getLineNumber(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i += 1) {
    if (text[i] === "\n") line += 1;
  }
  return line;
}

function findMatching(text, startIndex, openChar, closeChar) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = startIndex; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (!escaped && ch === quote) {
        quote = null;
      }
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      escaped = false;
      continue;
    }
    if (ch === openChar) depth += 1;
    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTopLevel(text, delimiterChar) {
  const parts = [];
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let quote = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  let start = 0;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (!escaped && ch === quote) quote = null;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      escaped = false;
      continue;
    }

    if (ch === "(") depthParen += 1;
    else if (ch === ")") depthParen -= 1;
    else if (ch === "{") depthBrace += 1;
    else if (ch === "}") depthBrace -= 1;
    else if (ch === "[") depthBracket += 1;
    else if (ch === "]") depthBracket -= 1;
    else if (
      ch === delimiterChar &&
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0
    ) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }

  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

function stripOuterBraces(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed.slice(1, -1);
  }
  return null;
}

function parseStringLiteral(value) {
  const trimmed = value.trim();
  if (trimmed.length < 2) return null;
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if ((first === "'" || first === '"' || first === "`") && last === first) {
    if (first === "`" && trimmed.includes("${")) return null;
    return trimmed.slice(1, -1);
  }
  return null;
}

function parseBracedString(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
  return parseStringLiteral(trimmed.slice(1, -1).trim());
}

function findTopLevelTernary(text) {
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let quote = null;
  let escaped = false;
  let qIndex = -1;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (!escaped && ch === quote) quote = null;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      escaped = false;
      continue;
    }

    if (ch === "(") depthParen += 1;
    else if (ch === ")") depthParen -= 1;
    else if (ch === "{") depthBrace += 1;
    else if (ch === "}") depthBrace -= 1;
    else if (ch === "[") depthBracket += 1;
    else if (ch === "]") depthBracket -= 1;
    else if (
      ch === "?" &&
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0 &&
      qIndex === -1
    ) {
      qIndex = i;
    } else if (
      ch === ":" &&
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0 &&
      qIndex !== -1
    ) {
      return { question: qIndex, colon: i };
    }
  }

  return null;
}

function resolveExpressionToStrings(expr) {
  if (!expr) return null;
  const trimmed = expr.trim();
  const literal = parseStringLiteral(trimmed);
  if (literal !== null) return new Set([literal]);

  const bracedLiteral = parseBracedString(trimmed);
  if (bracedLiteral !== null) return new Set([bracedLiteral]);

  const lowerCall = trimmed.match(/^([A-Za-z_$][\w$]*)\.toLowerCase\(\)$/);
  if (lowerCall) {
    return new Set([lowerCall[1].toLowerCase()]);
  }

  const ternary = findTopLevelTernary(trimmed);
  if (ternary) {
    const left = trimmed.slice(ternary.question + 1, ternary.colon).trim();
    const right = trimmed.slice(ternary.colon + 1).trim();
    const leftValues = resolveExpressionToStrings(left);
    const rightValues = resolveExpressionToStrings(right);
    if (!leftValues || !rightValues) return null;
    return new Set([...leftValues, ...rightValues]);
  }

  return null;
}

function parseObjectProperties(objectText) {
  const properties = splitTopLevel(objectText, ",");
  const parsed = {
    spreads: [],
    contextExpr: null,
    labelExpr: null,
  };

  for (const prop of properties) {
    if (prop.startsWith("...")) {
      const name = prop.slice(3).trim();
      if (name) parsed.spreads.push(name);
      continue;
    }

    const colonIndex = prop.indexOf(":");
    if (colonIndex === -1) continue;
    const key = prop.slice(0, colonIndex).trim().replace(/^["']|["']$/g, "");
    const value = prop.slice(colonIndex + 1).trim();

    if (key === "context") parsed.contextExpr = value;
    if (key === "label") parsed.labelExpr = value;
  }

  return parsed;
}

function extractObjectLiteralKeys(objectText) {
  const keys = new Set();
  const properties = splitTopLevel(objectText, ",");
  for (const prop of properties) {
    if (prop.startsWith("...")) continue;
    const colonIndex = prop.indexOf(":");
    if (colonIndex === -1) continue;
    const rawKey = prop.slice(0, colonIndex).trim();
    if (rawKey.startsWith("//") || rawKey.startsWith("*")) continue;
    const unquoted = rawKey.replace(/^["']|["']$/g, "").trim();
    if (!unquoted || !/^[A-Za-z_$][\w$]*$/.test(unquoted)) continue;
    keys.add(unquoted);
  }
  return keys;
}

function extractStringVariables(fileText) {
  const stringVars = new Map();
  const re = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)[;\n]/g;
  let match;

  while ((match = re.exec(fileText))) {
    const name = match[1];
    const expr = match[2].trim();
    const values = resolveExpressionToStrings(expr);
    if (values && values.size > 0) {
      stringVars.set(name, values);
    }
  }

  return stringVars;
}

function findObjectVariableLiterals(fileText) {
  const literals = new Map();
  const re = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*{/g;
  let match;

  while ((match = re.exec(fileText))) {
    const varName = match[1];
    const openBraceIndex = fileText.indexOf("{", match.index);
    if (openBraceIndex === -1) continue;
    const closeBraceIndex = findMatching(fileText, openBraceIndex, "{", "}");
    if (closeBraceIndex === -1) continue;
    literals.set(varName, fileText.slice(openBraceIndex + 1, closeBraceIndex));
  }

  return literals;
}

function resolveIdentifierToStrings(identifier, stringVars) {
  if (stringVars.has(identifier)) return stringVars.get(identifier);
  return null;
}

function resolveExpression(expr, stringVars, derivedVars) {
  if (!expr) return null;
  const values = resolveExpressionToStrings(expr);
  if (values && values.size > 0) return values;

  const ident = expr.trim().match(/^[A-Za-z_$][\w$]*$/);
  if (ident) {
    return (
      resolveIdentifierToStrings(ident[0], stringVars) ||
      derivedVars.get(ident[0]) ||
      null
    );
  }

  const trimmedExpr = expr.trim();
  const templateVarOnly = trimmedExpr.match(/^`\s*\$\{\s*([A-Za-z_$][\w$]*)\s*\}\s*`$/);
  if (templateVarOnly && derivedVars.has(templateVarOnly[1])) {
    return new Set(derivedVars.get(templateVarOnly[1]));
  }

  const templateWithAffixes = trimmedExpr.match(
    /^`\s*([^`]*?)\$\{\s*([A-Za-z_$][\w$]*)\s*\}\s*([^`]*?)\s*`$/
  );
  if (templateWithAffixes && derivedVars.has(templateWithAffixes[2])) {
    const [, prefix, varName, suffix] = templateWithAffixes;
    const out = new Set();
    for (const val of derivedVars.get(varName)) {
      out.add(`${prefix}${val}${suffix}`);
    }
    return out;
  }
  return null;
}

function looksLikeDynamicLabel(labelExpr) {
  if (!labelExpr || typeof labelExpr !== "string") return false;
  const t = labelExpr.trim();
  return (
    t.includes("`") ||
    (t.length > 0 && /^[A-Za-z_$][\w$]*$/.test(t) && !t.startsWith('"') && !t.startsWith("'"))
  );
}

function resolveObjectSpec(parsed, stringVars, objectVars, derivedVars) {
  let contexts = resolveExpression(parsed.contextExpr, stringVars, derivedVars);
  let labels = resolveExpression(parsed.labelExpr, stringVars, derivedVars);

  for (const spread of parsed.spreads) {
    const spreadSpec = objectVars.get(spread);
    if (!spreadSpec) continue;

    if (!contexts && spreadSpec.contexts && spreadSpec.contexts.size > 0) {
      contexts = new Set(spreadSpec.contexts);
    }
    if (!labels && spreadSpec.labels && spreadSpec.labels.size > 0) {
      labels = new Set(spreadSpec.labels);
    }
  }

  return { contexts, labels };
}

function resolveObjectVariables(objectLiterals, stringVars) {
  const objectVars = new Map();
  let changed = true;
  let safety = 0;

  while (changed && safety < 8) {
    changed = false;
    safety += 1;

    for (const [name, objectBody] of objectLiterals.entries()) {
      const parsed = parseObjectProperties(objectBody);
      const resolved = resolveObjectSpec(parsed, stringVars, objectVars, new Map());

      const prev = objectVars.get(name);
      const prevCtxSize = prev?.contexts?.size || 0;
      const prevLblSize = prev?.labels?.size || 0;
      const newCtxSize = resolved.contexts?.size || 0;
      const newLblSize = resolved.labels?.size || 0;

      if (!prev || newCtxSize !== prevCtxSize || newLblSize !== prevLblSize) {
        objectVars.set(name, resolved);
        changed = true;
      }
    }
  }

  return objectVars;
}

function extractIterationDerivedVars(fileText, objectLiterals) {
  const derived = new Map();

  function addDerived(iterName, keys) {
    if (keys.size === 0) return;
    const existing = derived.get(iterName);
    if (existing) {
      keys.forEach((k) => existing.add(k));
    } else {
      derived.set(iterName, new Set(keys));
    }
  }

  const keysMapRe =
    /Object\.keys\(\s*([A-Za-z_$][\w$]*)\s*\)\s*\.\s*(?:map|forEach)\s*\(\s*\(?\s*([A-Za-z_$][\w$]*)/g;
  let match;
  while ((match = keysMapRe.exec(fileText))) {
    const objectName = match[1];
    const iterName = match[2];
    const objectBody = objectLiterals.get(objectName);
    if (!objectBody) continue;
    const keys = extractObjectLiteralKeys(objectBody);
    addDerived(iterName, keys);
  }

  const entriesMapRe =
    /Object\.entries\(\s*([A-Za-z_$][\w$]*)\s*\)\s*\.\s*(?:map|forEach)\s*\(\s*\(\s*\[\s*([A-Za-z_$][\w$]*)/g;
  while ((match = entriesMapRe.exec(fileText))) {
    const objectName = match[1];
    const iterName = match[2];
    const objectBody = objectLiterals.get(objectName);
    if (!objectBody) continue;
    const keys = extractObjectLiteralKeys(objectBody);
    addDerived(iterName, keys);
  }

  return derived;
}

function findTranslateCalls(fileText) {
  const calls = [];
  const nameRe = /\b(Translate|translate|hasTranslation)\s*\(/g;
  let match;

  while ((match = nameRe.exec(fileText))) {
    const fnName = match[1];
    if (!TRANSLATE_FN_NAMES.has(fnName)) continue;
    const openParen = fileText.indexOf("(", match.index);
    const closeParen = findMatching(fileText, openParen, "(", ")");
    if (closeParen === -1) break;

    const argsText = fileText.slice(openParen + 1, closeParen).trim();
    calls.push({
      startIndex: match.index,
      fnName,
      argsText,
    });
    nameRe.lastIndex = closeParen + 1;
  }

  return calls;
}

function parseJsxTranslateUsages(fileText) {
  const usages = [];
  const jsxRe = /<Translate\b([\s\S]*?)(\/>|>)/g;
  let match;

  while ((match = jsxRe.exec(fileText))) {
    const attrs = match[1];
    const ctxMatch =
      attrs.match(/\bcontext\s*=\s*"([^"]+)"/) ||
      attrs.match(/\bcontext\s*=\s*'([^']+)'/) ||
      attrs.match(/\bcontext\s*=\s*\{\s*([A-Za-z_$][\w$]*)\s*}/);
    const lblMatch =
      attrs.match(/\blabel\s*=\s*"([^"]+)"/) ||
      attrs.match(/\blabel\s*=\s*'([^']+)'/) ||
      attrs.match(/\blabel\s*=\s*\{\s*([A-Za-z_$][\w$]*)\s*}/);

    usages.push({
      startIndex: match.index,
      contextRaw: ctxMatch?.[1] || null,
      labelRaw: lblMatch?.[1] || null,
      contextIsIdentifier: !!(ctxMatch && attrs.includes(`{${ctxMatch[1]}}`)),
      labelIsIdentifier: !!(lblMatch && attrs.includes(`{${lblMatch[1]}}`)),
    });
  }

  return usages;
}

function extractUsageFromFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const stringVars = extractStringVariables(text);
  const objectLiterals = findObjectVariableLiterals(text);
  const objectVars = resolveObjectVariables(objectLiterals, stringVars);
  const derivedVars = extractIterationDerivedVars(text, objectLiterals);
  const calls = findTranslateCalls(text);
  const jsxCalls = parseJsxTranslateUsages(text);
  const used = new Set();
  const unresolved = [];
  const dynamicLabelContexts = new Set();

  for (const call of calls) {
    const objectText = stripOuterBraces(call.argsText);
    let parsed = null;

    if (objectText) {
      parsed = parseObjectProperties(objectText);
    } else {
      const ident = call.argsText.match(/^[A-Za-z_$][\w$]*$/);
      if (ident && objectVars.has(ident[0])) {
        const spec = objectVars.get(ident[0]);
        if (spec?.contexts && spec?.labels) {
          for (const context of spec.contexts) {
            for (const label of spec.labels) {
              used.add(`${context}.${label}`);
            }
          }
          continue;
        }
      }
      unresolved.push({
        file: filePath,
        line: getLineNumber(text, call.startIndex),
        reason: `${call.fnName} call is not statically resolvable`,
        contexts: [],
      });
      continue;
    }
    const { contexts, labels } = resolveObjectSpec(
      parsed,
      stringVars,
      objectVars,
      derivedVars
    );

    if (!contexts || contexts.size === 0 || !labels || labels.size === 0) {
      const contextList = contexts ? Array.from(contexts) : [];
      if (contextList.length > 0 && looksLikeDynamicLabel(parsed.labelExpr)) {
        contextList.forEach((c) => dynamicLabelContexts.add(c));
      }
      unresolved.push({
        file: filePath,
        line: getLineNumber(text, call.startIndex),
        reason: `Could not statically resolve ${call.fnName} context or label`,
        contexts: contextList,
      });
      continue;
    }

    for (const context of contexts) {
      for (const label of labels) {
        used.add(`${context}.${label}`);
      }
    }
  }

  for (const jsx of jsxCalls) {
    let ctxValues = null;
    let lblValues = null;

    if (jsx.contextRaw) {
      if (jsx.contextIsIdentifier) ctxValues = resolveIdentifierToStrings(jsx.contextRaw, stringVars);
      else ctxValues = new Set([jsx.contextRaw]);
    }
    if (jsx.labelRaw) {
      if (jsx.labelIsIdentifier) {
        lblValues =
          resolveIdentifierToStrings(jsx.labelRaw, stringVars) ||
          derivedVars.get(jsx.labelRaw) ||
          null;
      }
      else lblValues = new Set([jsx.labelRaw]);
    }

    if (!ctxValues || !lblValues) {
      unresolved.push({
        file: filePath,
        line: getLineNumber(text, jsx.startIndex),
        reason: "Could not statically resolve JSX <Translate> context or label",
        contexts: ctxValues ? Array.from(ctxValues) : [],
      });
      continue;
    }

    for (const context of ctxValues) {
      for (const label of lblValues) {
        used.add(`${context}.${label}`);
      }
    }
  }

  return {
    used,
    unresolved,
    translateCallCount: calls.length,
    jsxCallCount: jsxCalls.length,
    dynamicLabelContexts,
  };
}

function loadTranslationMap(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(content);
  const contexts = data?.contexts || {};
  const keys = new Set();

  for (const [context, contextMap] of Object.entries(contexts)) {
    if (!contextMap || typeof contextMap !== "object" || Array.isArray(contextMap)) continue;
    for (const [label, value] of Object.entries(contextMap)) {
      if (value && typeof value === "object" && (value.da !== undefined || value.en !== undefined)) {
        keys.add(`${context}.${label}`);
      }
    }
  }

  return { data, keys };
}

function deleteUnusedKeys(translations, unusedKeys) {
  let deleted = 0;
  const contexts = translations?.contexts || {};
  for (const key of unusedKeys) {
    const [context, label] = key.split(".");
    if (contexts[context] && Object.prototype.hasOwnProperty.call(contexts[context], label)) {
      delete contexts[context][label];
      deleted += 1;
      if (Object.keys(contexts[context]).length === 0) {
        delete contexts[context];
      }
    }
  }
  return deleted;
}

function createBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${filePath}.bak.${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function uniqueSorted(values) {
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

function run() {
  const options = parseArgs(process.argv);
  const translationFile = options.translationFile;

  if (!fs.existsSync(translationFile)) {
    console.error(`Translation file not found: ${translationFile}`);
    process.exit(1);
  }

  const scanPaths = options.dirs.map((dir) => path.resolve(ROOT_DIR, dir));
  const sourceFiles = scanPaths.flatMap((scanPath) => walkFiles(scanPath));

  const allUsed = new Set();
  const unresolved = [];
  let translateCallCount = 0;
  let jsxCallCount = 0;

  const allDynamicLabelContexts = new Set();
  for (const filePath of sourceFiles) {
    const usage = extractUsageFromFile(filePath);
    if (usage.translateCallCount === 0 && usage.jsxCallCount === 0) continue;
    translateCallCount += usage.translateCallCount;
    jsxCallCount += usage.jsxCallCount;
    for (const key of usage.used) allUsed.add(key);
    unresolved.push(...usage.unresolved);
    if (usage.dynamicLabelContexts) {
      usage.dynamicLabelContexts.forEach((c) => allDynamicLabelContexts.add(c));
    }
  }

  const { data: translations, keys: allTranslationKeys } = loadTranslationMap(translationFile);
  const usedKeys = new Set();

  for (const key of allUsed) {
    if (allTranslationKeys.has(key)) {
      usedKeys.add(key);
    }
  }

  const unusedKeys = new Set();
  for (const key of allTranslationKeys) {
    if (!usedKeys.has(key)) {
      unusedKeys.add(key);
    }
  }

  const uncertainContexts = new Set();
  let hasUnknownContextUnresolved = false;
  for (const item of unresolved) {
    if (item.contexts && item.contexts.length > 0) {
      item.contexts.forEach((ctx) => uncertainContexts.add(ctx));
    } else {
      hasUnknownContextUnresolved = true;
    }
  }
  allDynamicLabelContexts.forEach((ctx) => uncertainContexts.add(ctx));

  console.log("Translation usage report");
  console.log("========================");
  console.log(`Translation file: ${path.relative(ROOT_DIR, translationFile)}`);
  console.log(`Scanned files: ${sourceFiles.length}`);
  console.log(`Translate function calls found: ${translateCallCount}`);
  console.log(`JSX <Translate> usages found: ${jsxCallCount}`);
  console.log(`Total translation keys: ${allTranslationKeys.size}`);
  console.log(`Used keys (resolved): ${usedKeys.size}`);
  console.log(`Unused key candidates: ${unusedKeys.size}`);
  console.log(`Unresolved Translate calls: ${unresolved.length}`);
  console.log(`Uncertain contexts: ${uncertainContexts.size}`);

  if (unresolved.length > 0) {
    console.log("\nUnresolved calls (first 20):");
    unresolved.slice(0, 20).forEach((item) => {
      console.log(`- ${path.relative(ROOT_DIR, item.file)}:${item.line} (${item.reason})`);
    });
  }

  if (!options.prune) {
    console.log("\nRun with --prune to remove unused key candidates.");
    return;
  }

  if (unusedKeys.size === 0) {
    console.log("\nNo unused keys to remove.");
    return;
  }

  const prunableUnusedKeys = new Set();
  for (const key of unusedKeys) {
    const [context] = key.split(".");
    if (!uncertainContexts.has(context)) {
      prunableUnusedKeys.add(key);
    }
  }

  if (prunableUnusedKeys.size === 0) {
    console.log(
      "\nPrune skipped: all unused candidates are in uncertain contexts. " +
        "No keys were removed."
    );
    return;
  }

  let backupPath = null;
  if (options.backup) {
    backupPath = createBackup(translationFile);
  }

  const deleted = deleteUnusedKeys(translations, uniqueSorted(prunableUnusedKeys));
  fs.writeFileSync(translationFile, `${JSON.stringify(translations, null, 2)}\n`, "utf8");

  console.log("\nPrune completed");
  console.log(`Deleted keys: ${deleted}`);
  console.log(`Skipped (uncertain): ${unusedKeys.size - prunableUnusedKeys.size}`);
  if (hasUnknownContextUnresolved) {
    console.log(
      "Warning: unresolved calls with unknown context exist. " +
        "Those calls were skipped, but remaining deletions are based only on statically resolved usage."
    );
  }
  if (backupPath) {
    console.log(`Backup created: ${path.relative(ROOT_DIR, backupPath)}`);
  }
}

run();
