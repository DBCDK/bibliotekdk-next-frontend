/**
 * @file Integration-ish tests for useSearchSync with a mocked Next.js router
 */
import React, { forwardRef, useImperativeHandle } from "react";
import { render, act } from "@testing-library/react";
import { useSearchSync } from "@/components/search/hooks/useSearchSync";

// Silence debug in tests
jest.mock("@/components/search/utils/debug", () => ({
  dbgCORE: jest.fn(),
  dbgSYNC: jest.fn(),
}));

function createMockRouter(
  initial = { pathname: "/find/simpel", query: {}, asPath: "/find/simpel" }
) {
  const pushes = [];
  return {
    ...initial,
    push: jest.fn((url, _unused, opts) => {
      // url can be { pathname, query }
      const pathname = typeof url === "string" ? url : url.pathname;
      const query = typeof url === "string" ? {} : url.query || {};
      pushes.push({ pathname, query, opts });
      // update internal state to simulate shallow navigation
      router.pathname = pathname;
      router.asPath =
        pathname +
        (Object.keys(query).length
          ? `?${new URLSearchParams(query).toString()}`
          : "");
      router.query = query;
      return Promise.resolve();
    }),
    get pushes() {
      return pushes;
    },
  };
}

let router;
beforeEach(() => {
  router = createMockRouter();
});

function Harness(props, ref) {
  const api = useSearchSync({ router });

  useImperativeHandle(ref, () => ({
    api,
    router,
  }));

  return null;
}
const TestHarness = forwardRef(Harness);

describe("useSearchSync – basic flows", () => {
  test("SIMPLE commit adopts WT from URL and pushes with q.all + WT", async () => {
    // Simulate user has chosen workTypes=music in Simple (URL/UI)
    router.query = { workTypes: "music" };
    router.asPath = "/find/simpel?workTypes=music";

    const r = React.createRef();
    render(<TestHarness ref={r} />);

    await act(async () => {
      await r.current.api.handleSimpleCommit("aqua");
    });

    const lastPush = router.pushes.at(-1);
    expect(lastPush.pathname).toBe("/find/simpel");
    expect(lastPush.query).toEqual({ "q.all": "aqua", workTypes: "music" });

    // Now go to ADV and assert FS contains WT
    await act(async () => {
      await r.current.api.goToMode("avanceret");
    });

    const advPush = router.pushes.at(-1);
    expect(advPush.pathname).toBe("/find/avanceret");
    expect(decodeURIComponent(advPush.query.fieldSearch)).toContain(
      '"value":"aqua"'
    );
    expect(decodeURIComponent(advPush.query.fieldSearch)).toContain(
      '"workType":"music"'
    );
  });

  test("ADV commit (with FS WT=literature), go SIMPLE, then back ADV preserves literature", async () => {
    const r = React.createRef();
    render(<TestHarness ref={r} />);

    const fsLit =
      '{"inputFields":[{"value":"heste","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"literature"}';

    await act(async () => {
      await r.current.api.handleAdvancedCommit(fsLit);
    });

    // → SIMPLE (should be empty)
    await act(async () => {
      await r.current.api.goToMode("simpel");
    });

    const simplePush = router.pushes.at(-1);
    expect(simplePush.pathname).toBe("/find/simpel");
    expect(simplePush.query).toEqual({});

    // Back → ADV (should keep literature)
    await act(async () => {
      await r.current.api.goToMode("avanceret");
    });

    const advPush = router.pushes.at(-1);
    expect(advPush.pathname).toBe("/find/avanceret");
    expect(decodeURIComponent(advPush.query.fieldSearch)).toContain(
      '"workType":"literature"'
    );
    expect(decodeURIComponent(advPush.query.fieldSearch)).toContain(
      '"value":"heste"'
    );
  });

  test("SIMPLE → CQL carries WT via fieldSearch; CQL hydrate, then CQL→ADV (blocked empty)", async () => {
    // WT comes from Simple URL
    router.query = { workTypes: "movie" };
    router.asPath = "/find/simpel?workTypes=movie";

    const r = React.createRef();
    render(<TestHarness ref={r} />);

    await act(async () => {
      await r.current.api.handleSimpleCommit("power rangers");
    });

    await act(async () => {
      await r.current.api.goToMode("cql");
    });

    const cqlPush = router.pushes.at(-1);
    expect(cqlPush.pathname).toBe("/find/cql");
    expect(decodeURIComponent(cqlPush.query.fieldSearch)).toContain(
      '"workType":"movie"'
    );
    expect(decodeURIComponent(cqlPush.query.fieldSearch)).toContain(
      '"value":"power rangers"'
    );

    // Hydrate CQL by simulating ?cql=
    router.asPath = "/find/cql?cql=(term.default%3D%22hej%22)";
    router.query = { cql: '(term.default="hej")' };

    // Re-render to fire effect
    render(<TestHarness ref={r} />);

    // CQL → ADV should be blocked to empty (since origin is CQL and we have cql)
    await act(async () => {
      await r.current.api.goToMode("avanceret");
    });

    const blocked = router.pushes.at(-1);
    expect(blocked.pathname).toBe("/find/avanceret");
    expect(blocked.query).toEqual({});
  });

  test("New SIMPLE search overrides previous ADV WT (WT follows the search!)", async () => {
    const r = React.createRef();
    render(<TestHarness ref={r} />);

    // Start in ADV with literature
    const fsLit =
      '{"inputFields":[{"value":"heste","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"literature"}';
    await act(async () => {
      await r.current.api.handleAdvancedCommit(fsLit);
    });

    // Now user goes to SIMPLE and chooses movie in URL/UI and searches "ost"
    router.query = { workTypes: "movie" };
    router.asPath = "/find/simpel?workTypes=movie";

    await act(async () => {
      await r.current.api.handleSimpleCommit("ost");
    });

    // SIMPLE → ADV should carry movie (NOT literature)
    await act(async () => {
      await r.current.api.goToMode("avanceret");
    });

    const advPush = router.pushes.at(-1);
    const fs = decodeURIComponent(advPush.query.fieldSearch);
    expect(fs).toContain('"value":"ost"');
    expect(fs).toContain('"workType":"movie"'); // critical assertion
  });
});
