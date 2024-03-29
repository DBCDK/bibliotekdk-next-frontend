/**
 * @file
 * Debugger component for state
 * For having a useful and pretty debug for advanced search
 */

export function prettyParseCql(state) {
  return JSON.stringify(state, null, 2)
    .replaceAll(`\\"`, `\'`)
    .replaceAll(`"`, `\n"\n`)
    .replaceAll(`\'`, `\"`)
    .replaceAll(`\\"`, `\"`)
    .replaceAll(" AND ", "\nAND\n")
    .replaceAll(" NOT ", "\nNOT ")
    .replaceAll("((", "((")
    .replaceAll("))", "))")
    .trim();
}

function prettyObject(state) {
  return JSON.stringify(state, null, 2);
}

export function DebugStateDetails({
  title,
  state,
  openDefault = true,
  jsonParser = (state) => prettyObject(state),
}) {
  return (
    <details
      open={openDefault ? Boolean(state) : false}
      style={{
        marginTop: "var(--pt4)",
        backgroundColor: "var(--feedback-yellow-warning-background)",
      }}
    >
      <summary style={{ fontSize: "14px" }}>Debug: {title}</summary>
      <pre
        style={{
          border: "1px solid var(--gray)",
          fontSize: "14px",
        }}
      >
        {jsonParser(state)}
      </pre>
    </details>
  );
}
