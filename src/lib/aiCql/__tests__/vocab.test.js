import {
  dice,
  inflections,
  levenshteinRatio,
  normalize,
  resolveValue,
  similarity,
} from "@/lib/aiCql/vocab";

const VOCAB = {
  source: "facets",
  facets: {
    genreandform: [
      ["romaner", 100],
      ["romantik", 10],
      ["krimi", 50],
      ["biografier", 40],
      ["graphic novels", 5],
      ["essays", 5],
    ],
    specificmaterialtype: [
      ["bog", 100],
      ["lydbog (online)", 30],
      ["lydbog (cd)", 20],
      ["film (dvd)", 10],
    ],
    mainlanguage: [["engelsk", 1]],
  },
};

describe("normalize", () => {
  it("lowercases, trims, removes quotes", () => {
    expect(normalize('  "Kim  Leine" ')).toBe("kim leine");
  });
});

describe("similarity", () => {
  it("is 1 for identical strings and 0 for empty", () => {
    expect(dice("abc", "abc")).toBe(1);
    expect(dice("", "abc")).toBe(0);
    expect(levenshteinRatio("abc", "abc")).toBe(1);
  });

  it("ranks close spellings high", () => {
    expect(similarity("biografi", "biografier")).toBeGreaterThanOrEqual(0.8);
    expect(similarity("krimi", "romaner")).toBeLessThan(0.4);
  });
});

describe("inflections", () => {
  it("produces Danish plural/singular variants", () => {
    expect(inflections("roman")).toContain("romaner");
    expect(inflections("romaner")).toContain("roman");
    expect(inflections("bøger")).toContain("bog");
    expect(inflections("lydbog")).toContain("lydbøger");
  });
});

describe("resolveValue", () => {
  const o = { vocab: VOCAB };

  it("exact match is case-insensitive", () => {
    const r = resolveValue("genreandform", "Krimi", o);
    expect(r).toMatchObject({ value: "krimi", method: "exact", exact: true });
  });

  it("alias", () => {
    expect(resolveValue("mainlanguage", "English", o)).toMatchObject({
      value: "engelsk",
      method: "alias",
      trusted: true,
    });
  });

  it("alias table maps roman → romaner", () => {
    expect(resolveValue("genreandform", "roman", o)).toMatchObject({
      value: "romaner",
      method: "alias",
    });
  });

  it("inflection bridges singular/plural for non-aliased words", () => {
    expect(resolveValue("genreandform", "essay", o)).toMatchObject({
      value: "essays",
      method: "inflection",
    });
  });

  it("prefix produces a wildcard only at a word boundary", () => {
    expect(resolveValue("specificmaterialtype", "lydbog", o)).toMatchObject({
      value: "lydbog",
      method: "prefix",
      wildcard: true,
    });
    // "roma" is not a word-boundary prefix of "romaner"
    const r = resolveValue("genreandform", "roma", o);
    expect(r.method).not.toBe("prefix");
  });

  it("fuzzy for typos, none for nonsense", () => {
    expect(resolveValue("genreandform", "biografeir", o)).toMatchObject({
      value: "biografier",
      method: "fuzzy",
      trusted: true,
    });
    expect(resolveValue("genreandform", "qwertyuiop", o)).toMatchObject({
      method: "none",
      trusted: false,
    });
  });

  it("fuzzy is not trusted for seeded vocab", () => {
    const seeded = { ...VOCAB, source: "seed" };
    expect(
      resolveValue("genreandform", "biografeir", { vocab: seeded })
    ).toMatchObject({ method: "fuzzy", trusted: false });
  });

  it("fuzzy requires the same first letter", () => {
    const films = {
      source: "facets",
      facets: {
        filmnationality: [
          ["erotiske film", 11],
          ["engelske film", 10650],
        ],
      },
    };
    expect(
      resolveValue("filmnationality", "britiske film", { vocab: films })
    ).toMatchObject({ value: "engelske film", method: "alias" });
    expect(
      resolveValue("filmnationality", "kritiske film", { vocab: films }).method
    ).toBe("none");
  });

  it("alias with a trailing * forces a wildcard", () => {
    const games = {
      source: "facets",
      facets: {
        gameplatform: [
          ["computerspil (cd-rom)", 2733],
          ["computerspil", 64],
        ],
      },
    };
    expect(resolveValue("gameplatform", "pc", { vocab: games })).toMatchObject({
      value: "computerspil",
      method: "alias",
      wildcard: true,
      trusted: true,
    });
  });

  it("keeps a model-supplied wildcard when unresolved", () => {
    expect(resolveValue("genreandform", "zzz*", o)).toMatchObject({
      value: "zzz",
      method: "none",
      wildcard: true,
    });
  });

  it("language falls back to the mainlanguage vocabulary", () => {
    expect(resolveValue("language", "engelsk", o)).toMatchObject({
      method: "exact",
    });
  });

  it("handles empty input", () => {
    expect(resolveValue("genreandform", "", o).method).toBe("none");
    expect(resolveValue("nonexistent", "x", o).method).toBe("none");
  });
});
