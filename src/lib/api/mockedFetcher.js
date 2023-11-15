import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { graphql, getIntrospectionQuery, buildClientSchema } from "graphql";
import { APIMockContext } from "./api";
import { useEffect, useMemo, useState } from "react";

const LOGGER_PREFIX = "GMOCKER:";
const SCALAR_TYPES = ["Int", "Float", "String", "Boolean", "ID"];
const SCALAR_EXAMPLE_VALUES = {
  Int: 10,
  Float: 10.5,
  Boolean: true,
};

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
  debug = true,
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
  resolvers = {},
  beforeFetch = () => {},
  onError = () => {},
  debug,
}) {
  // Holds the introspect response
  let introspectResponse;

  // Holds the executable GraphQL schema
  let schemaWithMocks;

  let fieldSpy = {};

  let counters = {};

  /**
   * Will introspect and create executable GraphQL schema
   */
  async function fetchSchema() {
    // Check if its already done
    if (schemaWithMocks) {
      return schemaWithMocks;
    }
    // Check if introspection has begun
    if (!introspectResponse) {
      async function doFetch() {
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
          return await tempRes.json();
        } catch (error) {
          console.log(LOGGER_PREFIX, "Failed to introspect server", { error });
        }
      }

      introspectResponse = doFetch();
    }

    try {
      // Introspection is already running, we await
      if (introspectResponse.then) {
        introspectResponse = await introspectResponse;
      }
      if (schemaWithMocks) {
        return schemaWithMocks;
      }

      // Build the executable GraphQL schema
      const schema = buildClientSchema(introspectResponse.data);
      const executableSchema = makeExecutableSchema({
        typeDefs: schema,
      });

      const mockedCustomScalars = mockScalarTypes(schema);

      schemaWithMocks = addMocksToSchema({
        schema: executableSchema,
        mocks: mockedCustomScalars,
        resolvers,
      });

      function getNext(arr) {
        const key = JSON.stringify(arr);
        if (typeof counters[key] === "undefined") {
          counters[key] = 0;
        } else {
          counters[key]++;
        }
        return arr[counters[key] % arr.length];
      }

      const interfaceImplementations = getInterfaceImplementations(schema);

      wrapResolvers(
        schemaWithMocks,
        (orgResolver, { parentTypeName, fieldName }) => {
          return async (...args) => {
            const parent = args[0];

            // If value is provided by parent, we use that
            // i.e. we do not call custom mocked resolver
            if (parent?.[fieldName] || parent?.[fieldName] === null) {
              return parent?.[fieldName];
            }

            const variables = args[3]?.variableValues;
            const {
              isCustomScalar,
              isScalar,
              isList,
              isString,
              scalarTypeName,
            } = expandReturnType(args[3]?.returnType);
            const { path } = getFieldPath(args[3]?.path || args[2]?.path);
            const possibleUnionTypes = args[3]?._types?.map(
              (type) => type?.name
            );
            const implementations =
              possibleUnionTypes || interfaceImplementations[parentTypeName];

            // Create mock helper object
            if (!fieldSpy[parentTypeName]) {
              fieldSpy[parentTypeName] = {};
            }
            if (fieldName === "__resolveType") {
              fieldSpy[parentTypeName][
                fieldName
              ] = `(args) => args.getNext([${implementations
                ?.map((el) => `"${el}"`)
                .join(", ")}])`;
            } else if (!isScalar && isList) {
              fieldSpy[parentTypeName][fieldName] =
                "(args) => [...new Array(10).fill({})]";
            } else if (isScalar && isList) {
              fieldSpy[parentTypeName][fieldName] = `(args) => [${[1, 2]
                .map(
                  (id) =>
                    `"${
                      SCALAR_EXAMPLE_VALUES[scalarTypeName] ||
                      "some-" + fieldName + " - " + id
                    }"`
                )
                .join(", ")}]`;
            } else if (isScalar && !isList) {
              fieldSpy[parentTypeName][fieldName] = `(args) => "${
                SCALAR_EXAMPLE_VALUES[scalarTypeName] || "some-" + fieldName
              }"`;
            }

            // Check if resolver is provided for this field
            if (resolvers[parentTypeName]?.[fieldName]) {
              return resolvers[parentTypeName]?.[fieldName]({
                variables,
                path,
                getNext,
                parent,
              });
            }

            // If this field is for resolving union types
            // we return the next possible type
            if (fieldName === "__resolveType") {
              if (parent?.__typename) {
                return parent?.__typename;
              }
              return getNext(implementations || []);
            }

            // When no resolver is given for the field, we return field path as default
            if (isString || isCustomScalar) {
              if (isList) {
                return [path + "[0]", path + "[1]"];
              }
              return path;
            }

            // If we could do nothing, we call the original resolver
            return await orgResolver(...args);
          };
        }
      );

      console.log(LOGGER_PREFIX, " Schema was mocked", {
        url,
        resolvers,
      });

      return schemaWithMocks;
    } catch (error) {
      console.log(LOGGER_PREFIX, "Failed to mock GraphQL schema", { error });
    }
  }

  /**
   * The mocked fetcher
   *
   * @param {*} queryStr
   * @returns {Object}
   */
  async function mockedFetcher(queryStr, callStack) {
    const { query, variables } =
      typeof queryStr === "string" ? JSON.parse(queryStr) : queryStr;

    const schema = await fetchSchema();

    beforeFetch();
    counters = {};
    fieldSpy = {};
    const res = await graphql(schema, query, null, null, variables);
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

const SYMBOL_PROCESSED = Symbol("processed");

/**
 * Wrap every resolver within a schema with some function
 * It is useful for timing resolvers, logging etc.
 *
 * Inspired by https://github.com/kiwicom/graphql-resolve-wrapper
 *
 * @param {*} schema
 * @param {function} wrapper
 */
function wrapResolvers(schema, wrapper) {
  const types = schema.getTypeMap();
  // Traverse types in the schema
  Object.values(types).forEach((type) => {
    if (
      type[SYMBOL_PROCESSED] ||
      (!type.getFields && !type.resolveType) ||
      isSystemType(type.toString())
    ) {
      return;
    }

    if (type.resolveType) {
      type.resolveType = wrapper(type.resolveType, {
        parentTypeName: type?.name,
        fieldName: "__resolveType",
      });
    } else {
      // Traverse every field of the type
      Object.values(type.getFields()).forEach((field) => {
        // The original resolve function
        const resolveFn = field.resolve;

        if (field[SYMBOL_PROCESSED] || !resolveFn) {
          return;
        }

        field[SYMBOL_PROCESSED] = true;

        // Wrap the resolve function
        field.resolve = wrapper(resolveFn, {
          parentTypeName: type?.name,
          fieldName: field?.name,
        });
      });
    }
  });
}

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

function mockScalarTypes(schema) {
  const res = {};
  const types = schema.getTypeMap();
  // Traverse types in the schema

  Object.values(types)
    .filter(
      (type) =>
        type.constructor.name === "GraphQLScalarType" &&
        !SCALAR_TYPES.includes(type.name)
    )
    .forEach((type) => {
      res[type.name] = () => `Hello World`;
    });
  return res;
}

function isSystemType(fieldName) {
  // __TypeKind, __InputValue, ...
  return /^__/.test(fieldName);
}

function expandReturnType(returnType) {
  let isCustomScalar = false;
  let isList = false;
  let isString = false;
  let isScalar = false;
  let scalarTypeName;
  let currentReturnType = returnType;
  while (currentReturnType) {
    if (currentReturnType?.constructor?.name === "GraphQLList") {
      isList = true;
    }
    if (currentReturnType?.name === "String") {
      isString = true;
    }
    if (currentReturnType?.constructor?.name === "GraphQLScalarType") {
      scalarTypeName = currentReturnType.name;
      if (!SCALAR_TYPES.includes(currentReturnType.name)) {
        isCustomScalar = true;
      } else {
        isScalar = true;
      }
    }
    currentReturnType = currentReturnType?.ofType;
  }
  return {
    isScalar,
    isCustomScalar,
    isList,
    isString,
    scalarTypeName,
  };
}

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
