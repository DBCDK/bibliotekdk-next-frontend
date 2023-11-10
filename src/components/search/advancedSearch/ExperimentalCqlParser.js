import {
  DebugStateDetails,
  prettyParseCql,
} from "@/components/search/advancedSearch/DebugStateDetails";
import parseObjectToCql from "@/lib/cql_parser/parseObjectToCql";
import parseCqlToObject from "@/lib/cql_parser/parseCqlToObject";
import lexer from "@/lib/cql_parser/lexer";

export function ExperimentalCqlParser({ parsedCQL }) {
  let cqlObject = "";
  let cqlParsedFromObject = "";

  try {
    cqlObject = parseCqlToObject(lexer(parsedCQL));
    cqlParsedFromObject = parseObjectToCql(cqlObject);
  } catch (e) {
    cqlObject = "parsing failed";
    cqlParsedFromObject = "parsing failed";
  }

  return (
    <details
      open={false}
      style={{
        marginTop: "var(--pt4)",
        backgroundColor: "var(--feedback-yellow-warning-background)",
      }}
    >
      <summary style={{ fontSize: "14px" }}>EXPERIMENTAL: cql parser</summary>
      {parsedCQL ? (
        <>
          <DebugStateDetails
            title="Cql from lexed and parsed cql"
            state={cqlParsedFromObject}
            jsonParser={prettyParseCql}
          />
          <DebugStateDetails
            title="Lexed and parsed cql"
            openDefault={false}
            state={cqlObject}
          />
        </>
      ) : (
        <div>Missing parsedCQL</div>
      )}
    </details>
  );
}
