import {
  MODE,
  initialSnap,
  reduceCommit,
  hydrateFromUrl,
  computeUrlForMode,
} from "@/components/utils/searchSyncCore";

const PROMPT = "krimier der foregår i københavn";
const CQL = 'term.genreandform="krimi" AND term.setting="københavn"';

describe("searchSyncCore – AI mode", () => {
  test("COMMIT_AI stores prompt + cql, clears lower rungs and sets origin AI", () => {
    const snap = {
      ...initialSnap,
      simple: { qAll: "hest" },
      advanced: { fieldSearch: '{"inputFields":[]}' },
      cql: { cql: "term.title=hest" },
      workTypes: "movie",
    };

    const out = reduceCommit(
      { type: "COMMIT_AI", prompt: PROMPT, cql: CQL },
      snap,
      MODE.SIMPLE
    );

    expect(out.lastOrigin).toBe(MODE.AI);
    expect(out.snap.ai).toEqual({ prompt: PROMPT, cql: CQL });
    expect(out.snap.simple.qAll).toBeNull();
    expect(out.snap.advanced.fieldSearch).toBeNull();
    expect(out.snap.cql.cql).toBeNull();
    expect(out.snap.workTypes).toBe("all");
  });

  test("COMMIT_CQL after AI clears the AI conversation", () => {
    const snap = { ...initialSnap, ai: { prompt: PROMPT, cql: CQL } };
    const out = reduceCommit({ type: "COMMIT_CQL", cql: CQL }, snap, MODE.AI);
    expect(out.snap.ai).toEqual(initialSnap.ai);
    expect(out.lastOrigin).toBe(MODE.CQL);
  });

  test("hydrateFromUrl in AI mode treats cql+prompt as an AI commit", () => {
    const out = hydrateFromUrl(
      MODE.AI,
      { mode: "ai", cql: CQL, prompt: PROMPT },
      initialSnap,
      null
    );
    expect(out.lastOrigin).toBe(MODE.AI);
    expect(out.snap.ai).toEqual({ prompt: PROMPT, cql: CQL });
    expect(out.snap.cql.cql).toBeNull();
  });

  test("hydrateFromUrl in AI mode without cql leaves snapshot untouched", () => {
    const out = hydrateFromUrl(MODE.AI, { mode: "ai" }, initialSnap, null);
    expect(out.lastOrigin).toBeNull();
    expect(out.snap.ai).toEqual(initialSnap.ai);
  });

  test("computeUrlForMode keeps the conversation when staying on AI", () => {
    const snap = { ...initialSnap, ai: { prompt: PROMPT, cql: CQL } };
    expect(computeUrlForMode(MODE.AI, snap, MODE.AI)).toEqual({
      query: { cql: CQL, prompt: PROMPT },
    });
  });

  test("computeUrlForMode seeds CQL tab with the generated cql from AI", () => {
    const snap = { ...initialSnap, ai: { prompt: PROMPT, cql: CQL } };
    expect(computeUrlForMode(MODE.CQL, snap, MODE.AI)).toEqual({
      query: { cql: CQL },
    });
  });

  test("computeUrlForMode never seeds down from AI", () => {
    const snap = { ...initialSnap, ai: { prompt: PROMPT, cql: CQL } };
    expect(computeUrlForMode(MODE.SIMPLE, snap, MODE.AI)).toEqual({
      query: {},
    });
    expect(computeUrlForMode(MODE.ADVANCED, snap, MODE.AI)).toEqual({
      query: {},
    });
  });

  test("computeUrlForMode gives an empty AI tab when origin is CQL", () => {
    const snap = { ...initialSnap, cql: { cql: CQL } };
    expect(computeUrlForMode(MODE.AI, snap, MODE.CQL)).toEqual({ query: {} });
  });
});
