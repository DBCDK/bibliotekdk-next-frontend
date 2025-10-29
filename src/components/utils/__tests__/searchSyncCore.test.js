/**
 * @file Unit tests for searchSyncCore (pure logic)
 */
import {
  MODE,
  initialSnap,
  reduceCommit,
  computeUrlForMode,
  buildFSFromSimple,
  withWorkTypeInFS,
  hydrateFromUrl,
} from "@/components/search/utils/searchSyncCore";

// Silence debug in tests
jest.mock("@/components/search/utils/debug", () => ({
  dbgCORE: jest.fn(),
  dbgSYNC: jest.fn(),
}));

const mkState = (over = {}) => ({
  snap: { ...initialSnap(), ...(over.snap || {}) },
  lastOrigin: over.lastOrigin ?? null,
});

describe("searchSyncCore – buildFSFromSimple", () => {
  test("strips outer quotes and builds fieldSearch", () => {
    expect(buildFSFromSimple('"hest"')).toBe(
      '{"inputFields":[{"value":"hest","prefixLogicalOperator":null,"searchIndex":"term.default"}]}'
    );
    expect(buildFSFromSimple("'fisk'")).toBe(
      '{"inputFields":[{"value":"fisk","prefixLogicalOperator":null,"searchIndex":"term.default"}]}'
    );
    expect(buildFSFromSimple("aqua")).toBe(
      '{"inputFields":[{"value":"aqua","prefixLogicalOperator":null,"searchIndex":"term.default"}]}'
    );
    expect(buildFSFromSimple("")).toBeUndefined();
  });
});

describe("searchSyncCore – withWorkTypeInFS", () => {
  const fsBase =
    '{"inputFields":[{"value":"hest","prefixLogicalOperator":null,"searchIndex":"term.default"}]}';
  const fsWithLit =
    '{"inputFields":[{"value":"hest","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"literature"}';

  test("preserves existing workType when incoming WT is 'all'", () => {
    expect(withWorkTypeInFS(fsWithLit, "all")).toBe(fsWithLit);
    expect(withWorkTypeInFS(fsBase, "all")).toBe(fsBase);
  });

  test("overwrites/injects workType when incoming WT is specific", () => {
    expect(withWorkTypeInFS(fsBase, "movie")).toBe(
      '{"inputFields":[{"value":"hest","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"movie"}'
    );
    expect(withWorkTypeInFS(fsWithLit, "music")).toBe(
      '{"inputFields":[{"value":"hest","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"music"}'
    );
  });
});

describe("searchSyncCore – reduceCommit", () => {
  test("COMMIT_SIMPLE sets qAll and adopts WT from action", () => {
    const st = mkState();
    const next = reduceCommit(st, {
      type: "COMMIT_SIMPLE",
      qAll: "ost",
      workTypes: "movie",
    });
    expect(next.snap.simple.qAll).toBe("ost");
    expect(next.snap.workTypes).toBe("movie");
    expect(next.lastOrigin).toBe(MODE.SIMPLE);
  });

  test("COMMIT_ADVANCED sets fieldSearch and derives WT from FS", () => {
    const st = mkState();
    const fs =
      '{"inputFields":[{"value":"heste","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"literature"}';
    const next = reduceCommit(st, {
      type: "COMMIT_ADVANCED",
      fieldSearch: fs,
    });
    expect(next.snap.advanced.fieldSearch).toBe(fs);
    expect(next.snap.workTypes).toBe("literature");
    expect(next.lastOrigin).toBe(MODE.ADVANCED);
  });

  test("COMMIT_CQL sets cql and origin", () => {
    const st = mkState();
    const next = reduceCommit(st, { type: "COMMIT_CQL", cql: "(term=hej)" });
    expect(next.snap.cql.cql).toBe("(term=hej)");
    expect(next.lastOrigin).toBe(MODE.CQL);
  });

  test("SET_WORKTYPE updates snapshot WT only", () => {
    const st = mkState();
    const next = reduceCommit(st, { type: "SET_WORKTYPE", workTypes: "game" });
    expect(next.snap.workTypes).toBe("game");
    expect(next.lastOrigin).toBe(null);
  });
});

describe("searchSyncCore – computeUrlForMode (propagation rules)", () => {
  test("SIMPLE → ADV injects WT and qAll via FS", () => {
    const st = mkState({
      snap: {
        ...initialSnap(),
        simple: { qAll: "fisk" },
        workTypes: "music",
      },
      lastOrigin: MODE.SIMPLE,
    });

    const { query } = computeUrlForMode({
      targetMode: MODE.ADVANCED,
      snap: st.snap,
      lastOrigin: st.lastOrigin,
      tid: "TID123",
    });

    expect(query.fieldSearch).toContain('"value":"fisk"');
    expect(query.fieldSearch).toContain('"workType":"music"');
    expect(query.tid).toBe("TID123");
    expect(query.workTypes).toBe("music");
  });

  test("ADV → ADV preserves FS.workType when WT === 'all'", () => {
    const fsLit =
      '{"inputFields":[{"value":"heste","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"literature"}';
    const st = mkState({
      snap: {
        ...initialSnap(),
        advanced: { fieldSearch: fsLit },
        workTypes: "all", // important
      },
      lastOrigin: MODE.ADVANCED,
    });

    const { query } = computeUrlForMode({
      targetMode: MODE.ADVANCED,
      snap: st.snap,
      lastOrigin: st.lastOrigin,
    });

    expect(query.fieldSearch).toContain('"workType":"literature"'); // preserved
  });

  test("ADV → CQL carries FS with workType", () => {
    const fsMovie =
      '{"inputFields":[{"value":"aqua","prefixLogicalOperator":null,"searchIndex":"term.default"}],"workType":"movie"}';
    const st = mkState({
      snap: {
        ...initialSnap(),
        advanced: { fieldSearch: fsMovie },
        workTypes: "all",
      },
      lastOrigin: MODE.ADVANCED,
    });

    const { query } = computeUrlForMode({
      targetMode: MODE.CQL,
      snap: st.snap,
      lastOrigin: st.lastOrigin,
    });

    expect(query.fieldSearch).toContain('"workType":"movie"');
  });

  test("CQL → ADV is blocked (empty) when origin is CQL", () => {
    const st = mkState({
      snap: {
        ...initialSnap(),
        cql: { cql: '(term.default="hej")' },
      },
      lastOrigin: MODE.CQL,
    });

    const { query } = computeUrlForMode({
      targetMode: MODE.ADVANCED,
      snap: st.snap,
      lastOrigin: st.lastOrigin,
    });

    expect(query).toEqual({});
  });
});

describe("searchSyncCore – hydrateFromUrl", () => {
  test("hydrates CQL when mode is CQL and ?cql= present", () => {
    const st = mkState();
    const next = hydrateFromUrl(
      { mode: MODE.CQL, query: { cql: '(term.default="hej")' } },
      st
    );
    expect(next.snap.cql.cql).toBe('(term.default="hej")');
    expect(next.lastOrigin).toBe(MODE.CQL);
  });

  test("no-op when mode is not CQL", () => {
    const st = mkState();
    const next = hydrateFromUrl({ mode: MODE.SIMPLE, query: {} }, st);
    expect(next).toBe(st);
  });
});
