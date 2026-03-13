#!/usr/bin/env node
/**
 * Find unused translation keys using AST (Babel).
 * Replaces regex-based detection with proper scope and pattern resolution.
 */

const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

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
    if (arg === "--prune") options.prune = true;
    else if (arg === "--no-backup") options.backup = false;
    else if (arg.startsWith("--file="))
      options.translationFile = path.resolve(ROOT_DIR, arg.slice("--file=".length));
    else if (arg === "--file" && argv[i + 1]) {
      options.translationFile = path.resolve(ROOT_DIR, argv[i + 1]);
      i += 1;
    } else if (arg.startsWith("--dirs="))
      options.dirs = arg.slice("--dirs=".length).split(",").map((d) => d.trim()).filter(Boolean);
    else if (arg === "--help" || arg === "-h") {
      console.log(`
Usage: node scripts/unused-translations-ast.js [options]
Options:
  --prune       Remove unused keys from Translate.json
  --no-backup   Skip backup when using --prune
  --file <path> Translation JSON file
  --dirs=a,b    Dirs to scan (default: src,cypress)
  --help, -h    Show this help
`);
      process.exit(0);
    }
  }
  return options;
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
      if (["node_modules", ".git", ".next", "dist", "build", "coverage"].includes(base)) continue;
      fs.readdirSync(current).forEach((entry) => stack.push(path.join(current, entry)));
      continue;
    }
    if (VALID_EXTENSIONS.has(path.extname(current))) files.push(current);
  }
  return files;
}

function getLineNumber(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i += 1) if (text[i] === "\n") line += 1;
  return line;
}

function parseFile(filePath, content) {
  const ext = path.extname(filePath);
  const plugins = ["jsx"];
  if (ext === ".ts" || ext === ".tsx") plugins.push("typescript");
  try {
    return parser.parse(content, {
      sourceType: "module",
      plugins,
      allowReturnOutsideFunction: true,
    });
  } catch (e) {
    return null;
  }
}

/**
 * Get string value from a simple expression node.
 * Returns string or null.
 */
function getStringLiteral(node) {
  if (!node) return null;
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "TemplateLiteral" && node.quasis.length === 1 && !node.quasis[0].value.raw)
    return "";
  return null;
}

/**
 * Get the set of keys from an ObjectExpression (top-level property keys only).
 */
function getObjectKeys(node) {
  if (!node || node.type !== "ObjectExpression") return null;
  const keys = new Set();
  for (const prop of node.properties) {
    if (prop.type === "SpreadElement") continue;
    let keyName = null;
    if (prop.key) {
      if (prop.key.type === "Identifier") keyName = prop.key.name;
      else if (prop.key.type === "StringLiteral") keyName = prop.key.value;
    }
    if (keyName && !keyName.startsWith("//")) keys.add(keyName);
  }
  return keys;
}

/**
 * Resolve an expression to a Set of strings using scope.
 * pathForBinding: used to resolve Identifier to Object.keys(x).map((id)=> binding.
 */
function resolveToSet(node, scope, iterationBindings, pathForBinding) {
  if (!node) return null;
  const str = getStringLiteral(node);
  if (str !== null) return new Set([str]);
  if (node.type === "Identifier") {
    const name = node.name;
    if (iterationBindings.has(name)) return new Set(iterationBindings.get(name));
    const scopeVal = scope.get(name);
    if (scopeVal && scopeVal.keys && scopeVal.keys.length > 0) return new Set(scopeVal.keys);
    if (pathForBinding && pathForBinding.scope) {
      const binding = pathForBinding.scope.getBinding(name);
      if (binding && binding.path) {
        const paramPath = binding.path;
        const fn = paramPath.findParent((p) => p.isFunction());
        if (fn && fn.parentPath && fn.parentPath.isCallExpression()) {
          const call = fn.parentPath.node;
          const callee = call.callee;
          if (
            callee.type === "MemberExpression" &&
            callee.property &&
            (callee.property.name === "map" || callee.property.name === "forEach") &&
            callee.object.type === "CallExpression" &&
            callee.object.callee.type === "MemberExpression" &&
            callee.object.callee.object.type === "Identifier" &&
            callee.object.callee.object.name === "Object" &&
            callee.object.callee.property.name === "keys" &&
            callee.object.arguments.length > 0 &&
            callee.object.arguments[0].type === "Identifier"
          ) {
            const objName = callee.object.arguments[0].name;
            const entry = scope.get(objName);
            if (entry && entry.keys && entry.keys.length > 0) return new Set(entry.keys);
          }
        }
      }
    }
    return null;
  }
  if (node.type === "TemplateLiteral") {
    if (node.expressions.length === 1 && node.quasis.length === 2) {
      const pre = node.quasis[0].value.raw;
      const post = node.quasis[1].value.raw;
      const inner = node.expressions[0];
      const set = resolveToSet(inner, scope, iterationBindings, pathForBinding);
      if (set && set.size > 0) {
        const out = new Set();
        for (const v of set) out.add(`${pre}${v}${post}`);
        return out;
      }
    }
    if (node.expressions.length === 1 && node.quasis.length === 1 && !node.quasis[0].value.raw) {
      const set = resolveToSet(node.expressions[0], scope, iterationBindings, pathForBinding);
      if (set) return set;
    }
    return null;
  }
  if (node.type === "ConditionalExpression") {
    const left = resolveToSet(node.consequent, scope, iterationBindings, pathForBinding);
    const right = resolveToSet(node.alternate, scope, iterationBindings, pathForBinding);
    if (left && right) {
      const out = new Set(left);
      right.forEach((v) => out.add(v));
      return out;
    }
    return null;
  }
  return null;
}

/**
 * Extract context and label from an object expression or identifier.
 * pathForBinding: Babel path (e.g. CallExpression) used to resolve identifiers via scope/binding.
 */
function getContextAndLabel(argNode, scope, pathForBinding) {
  let contextNode = null;
  let labelNode = null;
  const spreads = [];

  if (argNode.type === "Identifier") {
    const entry = scope.get(argNode.name);
    if (entry && entry.context !== undefined && entry.label !== undefined)
      return { context: new Set([entry.context]), label: new Set([entry.label]) };
  }

  if (argNode.type !== "ObjectExpression") return { context: null, label: null };

  for (const prop of argNode.properties) {
    if (prop.type === "SpreadElement") {
      if (prop.argument.type === "Identifier") spreads.push(prop.argument.name);
      continue;
    }
    const keyName = prop.key && prop.key.type === "Identifier" ? prop.key.name : prop.key && prop.key.type === "StringLiteral" ? prop.key.value : null;
    if (keyName === "context") contextNode = prop.value;
    if (keyName === "label") labelNode = prop.value;
  }

  let contexts = resolveToSet(contextNode, scope, new Map(), pathForBinding);
  let labels = resolveToSet(labelNode, scope, new Map(), pathForBinding);

  for (const spreadName of spreads) {
    const entry = scope.get(spreadName);
    if (entry) {
      if (entry.context !== undefined && !contexts) contexts = new Set([entry.context]);
      else if (entry.keys && entry.keys.length > 0 && !contexts) contexts = new Set(entry.keys);
    }
  }

  return { context: contexts, label: labels };
}

/**
 * Build scope: variable name -> { keys: string[], context?: string, label?: string } for object literals,
 * or string[] for string literal (single value) or keys-only object.
 */
function buildScope(ast) {
  const scope = new Map();
  traverse(ast, {
    VariableDeclarator(path) {
      const id = path.node.id;
      const init = path.node.init;
      if (!id || id.type !== "Identifier" || !init) return;
      const name = id.name;
      const keys = getObjectKeys(init);
      if (keys && keys.size > 0) {
        const entry = { keys: Array.from(keys) };
        if (init.type === "ObjectExpression") {
          for (const prop of init.properties) {
            if (prop.type === "SpreadElement") continue;
            const k = prop.key?.type === "Identifier" ? prop.key.name : prop.key?.type === "StringLiteral" ? prop.key.value : null;
            const v = getStringLiteral(prop.value);
            if (k === "context" && v !== null) entry.context = v;
            if (k === "label" && v !== null) entry.label = v;
          }
        }
        scope.set(name, entry);
      } else {
        const str = getStringLiteral(init);
        if (str !== null) scope.set(name, { keys: [str] });
      }
    },
  });
  return scope;
}

/**
 * AST-based extraction: find all Translate/translate/hasTranslation calls and JSX <Translate />,
 * resolve context and label via scope and Object.keys().map((key)=> pattern.
 */
function extractUsageFromFileAST(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const ast = parseFile(filePath, text);
  if (!ast) {
    return { used: new Set(), unresolved: [], translateCallCount: 0, jsxCallCount: 0, dynamicLabelContexts: new Set() };
  }

  const scope = buildScope(ast);
  const used = new Set();
  const unresolved = [];
  const dynamicLabelContexts = new Set();

  let translateCallCount = 0;
  let jsxCallCount = 0;

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      let fnName = null;
      if (callee.type === "Identifier") fnName = callee.name;
      if (!fnName || !TRANSLATE_FN_NAMES.has(fnName)) return;
      const args = path.node.arguments;
      if (args.length === 0) return;
      translateCallCount += 1;
      const arg = args[0];
      const { context: contexts, label: labels } = getContextAndLabel(arg, scope, path);
      if (contexts && contexts.size > 0 && labels && labels.size > 0) {
        for (const ctx of contexts) for (const lbl of labels) used.add(`${ctx}.${lbl}`);
      } else {
        const contextList = contexts ? Array.from(contexts) : [];
        const labelLooksDynamic =
          arg.type === "ObjectExpression" &&
          arg.properties.some(
            (p) =>
              p.type !== "SpreadElement" &&
              (p.key?.name === "label" || p.key?.value === "label") &&
              (p.value?.type === "TemplateLiteral" || p.value?.type === "Identifier")
          );
        if (contextList.length > 0 && labelLooksDynamic)
          contextList.forEach((c) => dynamicLabelContexts.add(c));
        unresolved.push({
          file: filePath,
          line: path.node.loc ? path.node.loc.start.line : 0,
          reason: `Could not statically resolve ${fnName} context or label`,
          contexts: contextList,
        });
      }
    },
    JSXOpeningElement(path) {
      const name = path.node.name;
      const elName = name.type === "JSXIdentifier" ? name.name : null;
      if (elName !== "Translate") return;
      jsxCallCount += 1;
      let contextAttr = null;
      let labelAttr = null;
      for (const attr of path.node.attributes) {
        if (attr.type !== "JSXAttribute" || !attr.name) continue;
        const attrName = attr.name.type === "JSXIdentifier" ? attr.name.name : null;
        if (attrName === "context") contextAttr = attr.value;
        if (attrName === "label") labelAttr = attr.value;
      }
      let contexts = null;
      let labels = null;
      if (contextAttr) {
        if (contextAttr.type === "JSXExpressionContainer")
          contexts = resolveToSet(contextAttr.expression, scope, new Map(), path);
        else if (contextAttr.type === "StringLiteral") contexts = new Set([contextAttr.value]);
      }
      if (labelAttr) {
        if (labelAttr.type === "JSXExpressionContainer")
          labels = resolveToSet(labelAttr.expression, scope, new Map(), path);
        else if (labelAttr.type === "StringLiteral") labels = new Set([labelAttr.value]);
      }
      if (contexts && contexts.size > 0 && labels && labels.size > 0) {
        for (const ctx of contexts) for (const lbl of labels) used.add(`${ctx}.${lbl}`);
      } else {
        const contextList = contexts ? Array.from(contexts) : [];
        if (contextList.length > 0 && labelAttr && labelAttr.type === "JSXExpressionContainer")
          contextList.forEach((c) => dynamicLabelContexts.add(c));
        unresolved.push({
          file: filePath,
          line: path.node.loc ? path.node.loc.start.line : 0,
          reason: "Could not statically resolve JSX <Translate> context or label",
          contexts: contextList,
        });
      }
    },
  });

  return {
    used,
    unresolved,
    translateCallCount,
    jsxCallCount,
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
      if (value && typeof value === "object" && (value.da !== undefined || value.en !== undefined))
        keys.add(`${context}.${label}`);
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
      if (Object.keys(contexts[context]).length === 0) delete contexts[context];
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
    const usage = extractUsageFromFileAST(filePath);
    if (usage.translateCallCount === 0 && usage.jsxCallCount === 0) continue;
    translateCallCount += usage.translateCallCount;
    jsxCallCount += usage.jsxCallCount;
    usage.used.forEach((k) => allUsed.add(k));
    unresolved.push(...usage.unresolved);
    if (usage.dynamicLabelContexts) usage.dynamicLabelContexts.forEach((c) => allDynamicLabelContexts.add(c));
  }

  const { data: translations, keys: allTranslationKeys } = loadTranslationMap(translationFile);
  const usedKeys = new Set();
  for (const key of allUsed) {
    if (allTranslationKeys.has(key)) usedKeys.add(key);
  }
  const unusedKeys = new Set();
  for (const key of allTranslationKeys) {
    if (!usedKeys.has(key)) unusedKeys.add(key);
  }

  const uncertainContexts = new Set();
  let hasUnknownContextUnresolved = false;
  for (const item of unresolved) {
    if (item.contexts && item.contexts.length > 0) item.contexts.forEach((ctx) => uncertainContexts.add(ctx));
    else hasUnknownContextUnresolved = true;
  }
  allDynamicLabelContexts.forEach((ctx) => uncertainContexts.add(ctx));

  console.log("Translation usage report (AST)");
  console.log("==============================");
  console.log(`Translation file: ${path.relative(ROOT_DIR, translationFile)}`);
  console.log(`Scanned files: ${sourceFiles.length}`);
  console.log(`Translate function calls: ${translateCallCount}`);
  console.log(`JSX <Translate> usages: ${jsxCallCount}`);
  console.log(`Total translation keys: ${allTranslationKeys.size}`);
  console.log(`Used keys (resolved): ${usedKeys.size}`);
  console.log(`Unused key candidates: ${unusedKeys.size}`);
  console.log(`Unresolved calls: ${unresolved.length}`);
  console.log(`Uncertain contexts: ${uncertainContexts.size}`);

  if (unresolved.length > 0) {
    console.log("\nUnresolved (first 20):");
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
    if (!uncertainContexts.has(context)) prunableUnusedKeys.add(key);
  }

  if (prunableUnusedKeys.size === 0) {
    console.log("\nPrune skipped: all unused candidates are in uncertain contexts.");
    return;
  }

  let backupPath = null;
  if (options.backup) backupPath = createBackup(translationFile);

  const sorted = Array.from(prunableUnusedKeys).sort((a, b) => a.localeCompare(b));
  const deleted = deleteUnusedKeys(translations, sorted);
  fs.writeFileSync(translationFile, `${JSON.stringify(translations, null, 2)}\n`, "utf8");

  console.log("\nPrune completed");
  console.log(`Deleted keys: ${deleted}`);
  console.log(`Skipped (uncertain): ${unusedKeys.size - prunableUnusedKeys.size}`);
  if (hasUnknownContextUnresolved) console.log("Warning: some unresolved calls had unknown context.");
  if (backupPath) console.log(`Backup: ${path.relative(ROOT_DIR, backupPath)}`);
}

run();
