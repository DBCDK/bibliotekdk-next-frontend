import {
  DROP_PRIORITY,
  dropRank,
  fallbackCandidates,
  relaxCandidates,
  significantWords,
} from "@/lib/aiCql/relax";

const AST = {
  clauses: [
    { field: "creator", op: "=", values: ["kim leine"] },
    { field: "specificmaterialtype", op: "=", values: ["bog"] },
    { field: "workyear", op: ">", values: ["2020"] },
    { field: "subject", op: "=", values: ["slanger"], negate: true },
  ],
};

describe("relaxCandidates", () => {
  it("drops negations, then clauses least essential first, then demotes", () => {
    const c = relaxCandidates(AST);
    expect(c.map((x) => x.strategy)).toEqual([
      "drop-negations",
      "drop:workyear",
      "drop:specificmaterialtype",
      "demote:creator",
    ]);
    expect(c.map((x) => x.cql)).toEqual([
      'term.creator="kim leine" AND phrase.specificmaterialtype="bog" AND workyear > 2020',
      'term.creator="kim leine" AND phrase.specificmaterialtype="bog"',
      'term.creator="kim leine"',
      '"kim leine"',
    ]);
    // every candidate carries the AST it was compiled from
    expect(c[1].ast.clauses).toHaveLength(2);
    expect(c[3].ast.clauses[0].field).toBe("default");
  });

  it("respects limit and exclude, and never repeats a CQL", () => {
    const c = relaxCandidates(AST, {
      limit: 2,
      exclude: [
        'term.creator="kim leine" AND phrase.specificmaterialtype="bog" AND workyear > 2020',
      ],
    });
    expect(c.map((x) => x.strategy)).toEqual([
      "drop:workyear",
      "drop:specificmaterialtype",
    ]);
  });

  it("keeps the combine operator", () => {
    const c = relaxCandidates({
      clauses: [
        { field: "subject", op: "=", values: ["katte"] },
        { field: "subject", op: "=", values: ["hunde"] },
        { field: "mood", op: "=", values: ["uhyggelig"] },
      ],
      combine: "OR",
    });
    expect(c[0].strategy).toBe("drop:mood");
    expect(c[0].cql).toBe('term.subject="katte" OR term.subject="hunde"');
  });

  it("does not demote numbers or years and yields nothing for a lone default term", () => {
    expect(
      relaxCandidates({
        clauses: [{ field: "publicationyear", op: "=", values: ["2020"] }],
      })
    ).toEqual([]);
    expect(
      relaxCandidates({
        clauses: [{ field: "default", op: "=", values: ["noget"] }],
      })
    ).toEqual([]);
  });

  it("handles garbage input", () => {
    expect(relaxCandidates(null)).toEqual([]);
    expect(relaxCandidates({ clauses: ["x", null] })).toEqual([]);
  });
});

describe("dropRank", () => {
  it("orders descriptors before subject before creator", () => {
    expect(dropRank("mood")).toBeLessThan(dropRank("publicationyear"));
    expect(dropRank("publicationyear")).toBeLessThan(dropRank("genreandform"));
    expect(dropRank("genreandform")).toBeLessThan(dropRank("subject"));
    expect(dropRank("subject")).toBeLessThan(dropRank("creator"));
    expect(dropRank("creator")).toBeLessThan(dropRank("title"));
    // unknown fields land in the middle, before default
    expect(dropRank("nope")).toBeLessThan(dropRank("default"));
    expect(new Set(DROP_PRIORITY).size).toBe(DROP_PRIORITY.length);
  });
});

describe("fallbackCandidates", () => {
  it("returns the quoted prompt and then its significant words", () => {
    const c = fallbackCandidates("find bøger om anden verdenskrig");
    expect(c.map((x) => x.strategy)).toEqual([
      "fallback:phrase",
      "fallback:words",
    ]);
    expect(c[0].cql).toBe('"find bøger om anden verdenskrig"');
    expect(c[1].cql).toBe('"bøger" AND "anden" AND "verdenskrig"');
    expect(c[0].ast).toBeNull();
  });

  it("skips excluded and duplicate CQL", () => {
    const c = fallbackCandidates("valencia", { exclude: ['"valencia"'] });
    expect(c).toEqual([]);
  });
});

describe("significantWords", () => {
  it("drops stopwords, short tokens and punctuation", () => {
    expect(significantWords("Har I noget af Kim Leine, på engelsk?")).toEqual([
      "kim",
      "leine",
      "engelsk",
    ]);
    expect(significantWords("2. verdenskrig - krimi")).toEqual([
      "verdenskrig",
      "krimi",
    ]);
  });
});
