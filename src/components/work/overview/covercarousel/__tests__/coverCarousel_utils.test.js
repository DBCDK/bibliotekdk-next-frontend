import {
  getManifestationsWithCorrectCover,
  getTextDescription,
  moveCarousel,
} from "@/components/work/overview/covercarousel/utils";

describe("moveCarousel", () => {
  it("handles incr (expect: len 10; 0+1 -> 1)", () => {
    const actual = moveCarousel(1, 10, 0);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("handles decrement (expect: len 10; 1-1 -> 0)", () => {
    const actual = moveCarousel(-1, 10, 1);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("handles multiple moves down (expect: len 10; 1+5 -> 6)", () => {
    const actual = moveCarousel(5, 10, 1);
    const expected = 6;
    expect(actual).toEqual(expected);
  });
  it("handles positive overflow (expect: len 10; 9+1 -> 0)", () => {
    const actual = moveCarousel(1, 10, 9);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("handles negative overflow (expect: len 10; 0-1 -> 9)", () => {
    const actual = moveCarousel(-1, 10, 0);
    const expected = 9;
    expect(actual).toEqual(expected);
  });
});
describe("getTextDescription", () => {
  it(`materialtype, edition, pubYear (expect: "Bog, 9. udgave, 2009")`, () => {
    const actual = getTextDescription(["bog"], {
      edition: { edition: "9. udgave", publicationYear: { display: "2009" } },
    });
    const expected = "Bog, 9. udgave, 2009";
    expect(actual).toEqual(expected);
  });
  it(`no materialtype, edition, pubYear (expect: "9. udgave, 2009")`, () => {
    const actual = getTextDescription([], {
      edition: { edition: "9. udgave", publicationYear: { display: "2009" } },
    });
    const expected = "9. udgave, 2009";
    expect(actual).toEqual(expected);
  });
  it(`no materialtype, no edition, pubYear (expect: "2009")`, () => {
    const actual = getTextDescription([], {
      edition: { edition: null, publicationYear: { display: "2009" } },
    });
    const expected = "2009";
    expect(actual).toEqual(expected);
  });
  it(`no materialtype, no edition, no pubYear (expect: "")`, () => {
    const actual = getTextDescription([], {
      edition: null,
    });
    const expected = "";
    expect(actual).toEqual(expected);
  });
  it(`materialtype, no edition, no pubYear (expect: "Bog")`, () => {
    const actual = getTextDescription(["Bog"], {
      edition: null,
    });
    const expected = "Bog";
    expect(actual).toEqual(expected);
  });
});

const manifestations = [
  {
    pid: 1,
    materialTypes: [{ specific: "bog" }],
    cover: { origin: "moreinfo" },
  },
  {
    pid: 2,
    materialTypes: [{ specific: "bog" }],
    cover: { origin: "moreinfo" },
  },
  {
    pid: 3,
    materialTypes: [{ specific: "bog" }],
    cover: { origin: "default" },
  },
  {
    pid: 4,
    materialTypes: [{ specific: "bog" }],
    cover: { origin: "default" },
  },
];

describe("getManifestationsWithCorrectCover", () => {
  it("2 moreinfo; expect: 2 moreinfo", () => {
    const pids = [1, 2];

    const actual = getManifestationsWithCorrectCover(
      manifestations.filter((mani) => pids.includes(mani.pid))
    );
    const expected = {
      manifestationsWithCover: [
        {
          pid: 1,
          materialTypes: [{ specific: "bog" }],
          cover: { origin: "moreinfo" },
        },
        {
          pid: 2,
          materialTypes: [{ specific: "bog" }],
          cover: { origin: "moreinfo" },
        },
      ],
      materialType: ["bog"],
    };
    expect(actual).toMatchObject(expected);
  });
  it("1 moreinfo, 1 default; expect: 1 moreinfo", () => {
    const pids = [1, 3];

    const actual = getManifestationsWithCorrectCover(
      manifestations.filter((mani) => pids.includes(mani.pid))
    );
    const expected = {
      manifestationsWithCover: [
        {
          pid: 1,
          materialTypes: [{ specific: "bog" }],
          cover: { origin: "moreinfo" },
        },
      ],
      materialType: ["bog"],
    };
    expect(actual).toMatchObject(expected);
  });
  it("2 default; expect: 1 default", () => {
    const pids = [3, 4];

    const actual = getManifestationsWithCorrectCover(
      manifestations.filter((mani) => pids.includes(mani.pid))
    );
    const expected = {
      manifestationsWithCover: [
        {
          pid: 3,
          materialTypes: [{ specific: "bog" }],
          cover: { origin: "default" },
        },
      ],
      materialType: ["bog"],
    };
    expect(actual).toMatchObject(expected);
  });
});
