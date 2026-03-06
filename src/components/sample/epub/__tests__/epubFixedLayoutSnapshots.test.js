import fs from "fs";
import path from "path";

const SNAP_DIR = path.join(__dirname, "fixtures", "snapshots");

function loadSnap(id) {
  const file = path.join(SNAP_DIR, `${id}.json`);
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw);
}

function spreadPropsFromSpineItem(item) {
  const raw = item?.properties;
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return String(raw || "")
    .split(/\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

describe("fixed-layout snapshot regressions", () => {
  test("9788776278939 stays pre-paginated with declared spread properties", () => {
    const snap = loadSnap("9788776278939");

    expect(snap?.fixedLayout?.isPrePaginated).toBe(true);
    expect(snap?.fixedLayout?.declaredPageSpreadCount).toBeGreaterThan(0);

    const firstSix = (snap?.spine || []).slice(0, 6).map((it) => {
      const props = spreadPropsFromSpineItem(it);
      if (props.some((p) => /page-spread-left/i.test(p))) return "L";
      if (props.some((p) => /page-spread-right/i.test(p))) return "R";
      return "-";
    });

    expect(firstSix).toEqual(["R", "L", "R", "L", "R", "L"]);
  });

  test("9788776275884 stays pre-paginated but without declared page-spread hints", () => {
    const snap = loadSnap("9788776275884");

    expect(snap?.fixedLayout?.isPrePaginated).toBe(true);
    expect(snap?.fixedLayout?.declaredPageSpreadCount).toBe(0);

    // Regression guard: this case should still collapse to cover + Indhold.
    const labels = (snap?.pipeline?.tocFinal || []).map((x) =>
      String(x?.label || "")
    );
    expect(labels).toContain("Indhold");
    expect(snap?.heuristics?.collapse).toBe(true);
  });
});

