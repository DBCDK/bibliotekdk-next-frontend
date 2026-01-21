// src/components/sample/epub/__tests__/epubNavUtils.test.js

import {
  deriveBookEdgesFromLoc,
  shouldForceSpineJumpOnPrev,
  shouldForceSpineJumpOnNext,
} from "../epubNavUtils";

describe("epubNavUtils", () => {
  describe("deriveBookEdgesFromLoc", () => {
    test("treats first spine item as atStart when intra near 0", () => {
      const loc = {
        atStart: true,
        atEnd: false,
        start: { index: 0 },
        fileIntra: 0,
      };

      const edges = deriveBookEdgesFromLoc(loc, 16);
      expect(edges.derivedAtStart).toBe(true);
      expect(edges.derivedAtEnd).toBe(false);
      expect(edges.firstSpineIdx).toBe(0);
      expect(edges.lastSpineIdx).toBe(15);
    });

    test("treats last spine item as atEnd when intra near 1", () => {
      const loc = {
        atStart: false,
        atEnd: true,
        start: { index: 15 },
        fileIntra: 1,
      };

      const edges = deriveBookEdgesFromLoc(loc, 16);
      expect(edges.derivedAtStart).toBe(false);
      expect(edges.derivedAtEnd).toBe(true);
    });
  });

  describe("stuck navigation heuristics", () => {
    test("prev: same spine + at file start => force jump to previous spine", () => {
      const ok = shouldForceSpineJumpOnPrev({
        beforeSpineIdx: 1,
        afterSpineIdx: 1,
        beforeFileIntra: 0.0,
        beforeAtStart: true,
      });
      expect(ok).toBe(true);
    });

    test("prev: same spine but NOT at file start => do not force", () => {
      const ok = shouldForceSpineJumpOnPrev({
        beforeSpineIdx: 5,
        afterSpineIdx: 5,
        beforeFileIntra: 0.6,
        beforeAtStart: false,
      });
      expect(ok).toBe(false);
    });

    test("prev: at spine 0 never force", () => {
      const ok = shouldForceSpineJumpOnPrev({
        beforeSpineIdx: 0,
        afterSpineIdx: 0,
        beforeFileIntra: 0,
        beforeAtStart: true,
      });
      expect(ok).toBe(false);
    });

    test("next: same spine + at file end => force jump to next spine", () => {
      const ok = shouldForceSpineJumpOnNext({
        beforeSpineIdx: 3,
        afterSpineIdx: 3,
        beforeFileIntra: 1,
        beforeAtEnd: true,
        lastSpineIdx: 15,
      });
      expect(ok).toBe(true);
    });

    test("next: on last spine never force", () => {
      const ok = shouldForceSpineJumpOnNext({
        beforeSpineIdx: 15,
        afterSpineIdx: 15,
        beforeFileIntra: 1,
        beforeAtEnd: true,
        lastSpineIdx: 15,
      });
      expect(ok).toBe(false);
    });
  });
});
