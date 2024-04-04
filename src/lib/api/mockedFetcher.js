import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql, getIntrospectionQuery, buildClientSchema } from "graphql";
import { APIMockContext } from "./api";
import { useEffect, useMemo, useState } from "react";

const LOGGER_PREFIX = "GMOCKER:";
const SCALAR_TYPES = ["Int", "Float", "String", "Boolean", "ID"];

function DisplayCode({ header, code }) {
  return (
    <div
      style={{
        background: "#222222",
        padding: 16,
        width: 800,
        margin: "16px 0",
      }}
    >
      <p
        style={{
          fontSize: 28,
          marginBottom: 24,
          paddingBottom: 8,
          borderBottom: "1px solid white",
        }}
      >
        {header}
      </p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{code}</pre>
    </div>
  );
}
export function GraphQLMocker({
  children,
  url,
  resolvers,
  beforeFetch,
  debug,
}) {
  const [error, setError] = useState();
  const fetcher = useMemo(() => {
    return createMockedFetcher({
      url,
      resolvers,
      beforeFetch,
      debug,
      onError: (e) => setError(e),
    });
  }, [url, resolvers, beforeFetch]);
  useEffect(() => {
    if (error) {
      console.log(error.stack);
    }
  }, error);

  if (error) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          minHeight: "100vh",
          background: "#cc0000",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: 48, color: "white" }}>GraphQL ERROR!</div>

        <DisplayCode
          header="Errors"
          code={JSON.stringify(error.response.errors, null, 2)}
        />
        <DisplayCode
          header="Variables"
          code={JSON.stringify(error.request.variables, null, 2)}
        />

        <DisplayCode
          header="Query"
          code={error.request.query.replace(/\\n/g, "\n")}
        />
        <DisplayCode header="Stacktrace" code={error.stack} />
      </div>
    );
  }
  return (
    <APIMockContext.Provider
      value={{
        fetcher,
      }}
    >
      {children}
    </APIMockContext.Provider>
  );
}
const schemas = {};
async function createExecutableSchema(url) {
  if (schemas[url]?.then) {
    schemas[url] = await schemas[url];
  }
  if (schemas[url]) {
    return schemas[url];
  }

  async function process() {
    let introspectRes;
    try {
      const tempRes = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: getIntrospectionQuery({ inputValueDeprecation: true }),
        }),
      });
      introspectRes = await tempRes.json();
    } catch (error) {
      console.log(LOGGER_PREFIX, "Failed to introspect server", { error });
      throw "Failed to introspect server";
    }
    const schema = buildClientSchema(introspectRes.data);
    const executableSchema = makeExecutableSchema({
      typeDefs: schema,
    });
    addGlobalResolver(executableSchema, defaultMockResolver);
    console.log(LOGGER_PREFIX, " Schema was mocked", {
      url,
    });

    return executableSchema;
  }

  schemas[url] = process();

  return await schemas[url];
}

/**
 * getNext picks the next element from an array
 * useful for having variations when mocking interfaces
 * or unions
 */
function createGetNext() {
  const counters = {};
  return function getNext(arr) {
    const key = JSON.stringify(arr);
    if (typeof counters[key] === "undefined") {
      counters[key] = 0;
    } else {
      counters[key]++;
    }
    return arr[counters[key] % arr.length];
  };
}

/**
 * This is the global mock resolver.
 * It is run for ALL fields.
 *
 * It will generate default mock values when no mock is
 * provided.
 *
 * It also collect examples for mocking fields in the fieldSpy object
 */
function defaultMockResolver(parent, _args, context, info) {
  const { fieldSpy, getNext, resolvers } = context;
  const parentTypeName = info.parentType?.name;
  const { schema, variableValues: variables, fieldName } = info;

  // This field is mocked to actually be null
  if (parent?.[fieldName] === null) {
    return null;
  }

  // Get some info on the returntype
  const {
    enumValues,
    scalarName,
    typeName: returnTypeName,
    isList,
    customTypeName,
    unionValues,
  } = expandReturnType(info.returnType);

  // When the return type is interface or union
  // we need the possible implementation type names
  const implementations =
    ["GraphQLInterfaceType", "GraphQLUnionType"].includes(returnTypeName) &&
    (unionValues || getInterfaceImplementations(schema)[customTypeName]);

  // helper for attaching __typename to interface or union
  // It may be mocked by the parent object or by a resolver, otherwise we just pick one
  function attachTypename(target) {
    if (Array.isArray(target)) {
      target.forEach(
        (el) =>
          (el.__typename =
            el.__typename ||
            resolvers[customTypeName]?.__resolveType?.() ||
            (typeof el?.__resolveType === "function" && el.__resolveType()) ||
            el?.__resolveType ||
            getNext(implementations))
      );
    } else {
      target.__typename =
        target.__typename ||
        resolvers[customTypeName]?.__resolveType?.() ||
        (typeof target?.__resolveType === "function" &&
          target.__resolveType()) ||
        target.__resolveType ||
        getNext(implementations);
    }
  }

  const { path } = getFieldPath(info.path);

  // helper for adding Mock examples
  // to the field spy object
  function addFieldExample(example) {
    if (!fieldSpy[parentTypeName]) {
      fieldSpy[parentTypeName] = {};
    }
    fieldSpy[parentTypeName][fieldName] = example;
  }

  // Check if a resolver function is provided for this field
  if (typeof resolvers?.[parentTypeName]?.[fieldName] === "function") {
    const resolved = resolvers[parentTypeName][fieldName]({
      variables,
      path,
      getNext,
      parent,
    });
    if (implementations) {
      attachTypename(resolved);
    }
    return resolved;
  }

  // The field was mocked with some value
  // so we return that, instead of using a default mock
  if (
    parent?.hasOwnProperty(fieldName) &&
    typeof parent?.[fieldName] !== "undefined"
  ) {
    // If return type is interface or union, there MUST be a __typename
    // If the mock does not provide it, we attach one
    if (implementations) {
      attachTypename(parent?.[fieldName]);
    }

    return parent?.[fieldName];
  }

  // No mock resolver was provided for the field
  // We return a default value based on what the
  // return type is
  if (isList) {
    if (["String", "CustomScalar"].includes(scalarName)) {
      addFieldExample(
        `(args) => [${[1, 2]
          .map((id) => `"${"some-" + fieldName + " - " + id}"`)
          .join(", ")}]`
      );

      return [path + "[0]", path + "[1]"];
    }
    if (["GraphQLObjectType"].includes(returnTypeName)) {
      addFieldExample("(args) => [...new Array(10).fill({})]");

      return [{}, {}];
    }
    if (["GraphQLUnionType", "GraphQLInterfaceType"].includes(returnTypeName)) {
      addFieldExample(
        `(args) => [{__typename: ${implementations
          .map((impl) => `"${impl}"`)
          .join("|")}}]`
      );

      return [
        { __typename: getNext(implementations) },
        { __typename: getNext(implementations) },
      ];
    }

    if (["Int", "Float"].includes(scalarName)) {
      addFieldExample(`(args) => [10, 10]`);

      return [10, 10];
    }
    if (returnTypeName === "GraphQLEnumType") {
      addFieldExample(
        `(args) => [${enumValues
          .map((enumValue) => `"${enumValue}"`)
          .join(", ")}]`
      );

      return [getNext(enumValues), getNext(enumValues)];
    }
    if (scalarName === "Boolean") {
      return [true, false];
    }
    return [];
  }

  if (["GraphQLObjectType"].includes(returnTypeName)) {
    addFieldExample(`(args) => ({})`);
    return {};
  }
  if (["GraphQLUnionType", "GraphQLInterfaceType"].includes(returnTypeName)) {
    addFieldExample(
      `(args) => ({__typename: ${implementations
        .map((impl) => `"${impl}"`)
        .join("|")}})`
    );
    return { __typename: getNext(implementations) };
  }

  if (["String", "CustomScalar"].includes(scalarName)) {
    addFieldExample(`(args) => "hello world"`);
    return path;
  }

  if (["Int", "Float"].includes(scalarName)) {
    addFieldExample(`(args) => 10`);
    return 10;
  }

  if (returnTypeName === "GraphQLEnumType") {
    addFieldExample(
      `(args) => ${enumValues.map((impl) => `"${impl}"`).join("|")}`
    );
    return getNext(enumValues);
  }

  if (scalarName === "Boolean") {
    addFieldExample(`(args) => true`);
    return true;
  }

  // Something is missing in this default resolver
  // It should not happen
  throw "why am I here?";
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

/**
 * This creates a mocked fetcher that can be used for testing.
 *
 * The fetcher will introspect the GraphQL server running on
 * the url, and then mock all responses with fake values.
 *
 * It is possible to provide custom mocks where needed, for instance:
 * {
 *   Creator: { name: () => "Jens Jensen" }
 * }
 *
 * The above will return "Jens Jensen" for creator types.
 * For more examples, see https://www.graphql-tools.com/docs/mocking#customizing-mocks
 *
 * @param {string} url
 * @param {Object} resolvers
 * @param {function} beforeFetch
 * @param debug
 * @returns
 */
export function createMockedFetcher({
  url,
  resolvers,
  beforeFetch = () => {},
  debug = true,
  onError,
}) {
  /**
   * The mocked fetcher
   *
   * @param {*} queryStr
   * @returns {Object}
   */
  async function mockedFetcher(queryStr, callStack) {
    // allow isLoading state to show
    await sleep(5);
    const { query, variables } =
      typeof queryStr === "string" ? JSON.parse(queryStr) : queryStr;

    // Object for storing mock examples
    const fieldSpy = {};

    // get the executableSchema
    const schema = await createExecutableSchema(url);

    // run beforeFetch callback
    beforeFetch();

    // process the actual graphql request
    const res = await graphql(
      schema,
      query,
      null,
      { fieldSpy, getNext: createGetNext(), resolvers },
      variables
    );

    // When debug is enabled, we write out all examples
    // that were collected during this request
    if (debug) {
      console.log(
        LOGGER_PREFIX,
        res.errors ? "response with errors" : "response",
        {
          request: { query, variables },
          response: { ...res },
        },
        "\n\nEXAMPLE MOCK RESOLVERS:\n",
        ...JSON.stringify(fieldSpy, null, 2)
          .replace(/\\"/g, "'")
          .replace(/"/g, "")
          .split("\n")
          .map((line) => line + "\n")
      );
    }

    // If there are errors, we call onError (red screen of death)
    if (res.errors) {
      onError({
        request: { query, variables },
        response: { ...res },
        stack: callStack,
      });
    }
    return res;
  }

  return mockedFetcher;
}

/**
 * Wrap every resolver within a schema with some function
 * It is useful for timing resolvers, logging etc.
 *
 * Inspired by https://github.com/kiwicom/graphql-resolve-wrapper
 *
 * @param {*} schema
 * @param {function} wrapper
 */
function addGlobalResolver(schema, resolve) {
  const types = schema.getTypeMap();
  // Traverse types in the schema
  Object.values(types).forEach((type) => {
    if (isSystemType(type.toString())) {
      return;
    }
    if (
      type?.constructor?.name === "GraphQLUnionType" ||
      type?.constructor?.name === "GraphQLInterfaceType"
    ) {
      type.resolveType = (parent) => parent?.__typename;
    } else {
      // Traverse every field of the type
      Object.values(type.getFields?.() || {}).forEach((field) => {
        // add resolve function
        field.resolve = resolve;
      });
    }
  });
}

/**
 * Return map of interface implementations
 */
function getInterfaceImplementations(schema) {
  const res = {};
  const types = schema.getTypeMap();
  Object.values(types).forEach((type) => {
    type?.getInterfaces?.().forEach?.((iface) => {
      if (!res[iface.name]) {
        res[iface.name] = [];
      }
      res[iface.name].push(type.name);
    });
  });
  return res;
}

function isSystemType(fieldName) {
  // __TypeKind, __InputValue, ...
  return /^__/.test(fieldName);
}

/**
 * Extracts info from the return type
 */
function expandReturnType(returnType) {
  const result = {
    scalarName: null,
    isList: false,
    typeName: null,
    enumValues: null,
    customTypeName: null,
    unionValues: null,
    interfaceValues: null,
  };

  let currentReturnType = returnType;

  while (currentReturnType) {
    const { constructor, name, ofType } = currentReturnType;
    if (constructor?.name === "GraphQLList") {
      result.isList = true;
    } else if (constructor?.name === "GraphQLEnumType") {
      result.enumValues = currentReturnType
        .getValues()
        .map((enumValue) => enumValue.name);
    } else if (constructor?.name === "GraphQLScalarType") {
      result.scalarName = SCALAR_TYPES.includes(name) ? name : "CustomScalar";
    } else if (constructor?.name === "GraphQLUnionType") {
      result.unionValues = currentReturnType
        .getTypes()
        .map((union) => union.name);
    }

    result.typeName = constructor?.name;
    result.customTypeName = name;

    currentReturnType = ofType;
  }

  return result;
}

/**
 * The path to the current resolved field
 */
function getFieldPath(current) {
  let pathStr = "";
  let pathArr = [];

  while (typeof current?.key !== "undefined") {
    pathArr = [current?.key, ...pathArr];
    current = current.prev;
  }
  pathArr.forEach((key, idx) => {
    if (idx > 0 && typeof key === "string") {
      pathStr += ".";
    }
    pathStr += typeof key === "number" ? `[${key}]` : key;
  });
  return {
    path: pathStr,
    pathNoKeys: pathStr.replace(/\[\d+]/g, "[]"),
  };
}
