import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import useBookmarks, {
  getBookmarkKey,
  populateBookmark,
  usePopulateBookmarks,
  toBookmarkInput,
} from "../useBookmarks";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import { useFetcher, useMutate, useData } from "@/lib/api/api";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useBreakpoint from "@/components/hooks/useBreakpoint";
jest.mock("@/lib/api/api", () => ({
  ApiEnums: { FBI_API: "fbi_api" },
  useFetcher: jest.fn(),
  useMutate: jest.fn(),
  useData: jest.fn(),
}));
jest.mock("@/components/hooks/user/useAuthentication");
jest.mock("@/components/hooks/useBreakpoint");
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { userId: "patron-1" } } }),
}));
const mockCollectDelBookmark = jest.fn();
const mockCollectDelMultipleBookmarks = jest.fn();
jest.mock("@/lib/useDataCollect", () => () => ({
  collectAddBookmark: jest.fn(),
  collectDelBookmark: mockCollectDelBookmark,
  collectDelMultipleBookmarks: mockCollectDelMultipleBookmarks,
}));

const workId = "work-of:870970-basis:123";
const uuid = "d42e6d32-73d8-4d90-989d-8dab893eb119";
const selection = { materialTypes: { specific: ["BOOK"] } };
const stored = {
  id: uuid,
  materialId: workId,
  selection,
  snapshot: { workId, title: "En bog" },
};
const manifestation = (code, pid) => ({
  pid,
  ownerWork: { workId, workTypes: ["LITERATURE"] },
  materialTypes: [
    {
      materialTypeGeneral: { code: "BOOKS", display: "bøger" },
      materialTypeSpecific: {
        code,
        display: code === "BOOK" ? "bog" : "e-bog",
      },
    },
  ],
  edition: { publicationYear: { display: "2020" } },
});
const ebook = manifestation("EBOOK", "870970-basis:ebook");
const book = manifestation("BOOK", "870970-basis:book");
const work = {
  workId,
  manifestations: { mostRelevant: [ebook, book] },
};

describe("bookmark covers", () => {
  const withCover = (item, name, origin = "fbiinfo") => ({
    ...item,
    cover: { thumbnail: `${name}-small`, detail: name, origin },
  });
  const populate = (selected, mostRelevant = []) =>
    populateBookmark({
      ...stored,
      selection: { materialTypes: { specific: ["EBOOK"] } },
      material: {
        work: { ...work, manifestations: { mostRelevant } },
        manifestations: selected,
      },
    });

  test("finds a cover among all three selected editions", () => {
    const selected = [
      ebook,
      withCover(ebook, "second"),
      withCover(ebook, "third"),
    ];
    const result = populate(selected, [withCover(book, "outside")]);
    expect(result.image).toBe("second-small");
    expect(result.manifestations).toEqual(selected);
    expect(result.selection.materialTypes.specific).toEqual(["EBOOK"]);
  });

  test.each([
    [
      "selection before default",
      [withCover(ebook, "default", "default"), withCover(ebook, "real")],
      [],
      "real-small",
    ],
    [
      "mostRelevant before default",
      [withCover(ebook, "default", "default")],
      [withCover(book, "outside")],
      "outside-small",
    ],
    [
      "existing default",
      [withCover(ebook, "default", "default")],
      [book],
      "default-small",
    ],
    ["no supplied cover", [ebook], [book], null],
  ])("cover fallback: %s", (_, selected, mostRelevant, expected) => {
    expect(populate(selected, mostRelevant).image).toBe(expected);
  });

  test("a PID can borrow a work cover without changing its edition", () => {
    const direct = {
      ...ebook,
      ownerWork: {
        ...work,
        manifestations: { mostRelevant: [withCover(book, "outside")] },
      },
    };
    const result = populateBookmark({
      ...stored,
      materialId: ebook.pid,
      selection: null,
      material: { manifestation: direct },
    });
    expect(result.image).toBe("outside-small");
    expect(result.pid).toBe(ebook.pid);
    expect(result.manifestations).toEqual([direct]);
  });
});

let root;
let rerender;
let container;
let current;
let fetch;
let post;
let items;
let hitcount;

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
}

async function mount(options = { list: true }) {
  function Harness() {
    current = useBookmarks(options);
    return null;
  }
  rerender = () => {
    root.render(
      <SWRConfig
        value={{
          provider: () => new Map(),
          dedupingInterval: 0,
          shouldRetryOnError: false,
        }}
      >
        <Harness />
      </SWRConfig>
    );
  };
  await act(async () => rerender());
  await flush();
}

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  jest.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  items = [{ ...stored, material: { work, manifestations: [book] } }];
  hitcount = 51;
  fetch = jest.fn(async () => ({
    data: { patron: { bookmarks: { status: "OK", hitcount, items } } },
  }));
  post = jest.fn(async () => ({ data: {} }));
  useFetcher.mockReturnValue(fetch);
  useMutate.mockReturnValue({ post });
  useData.mockReturnValue({ data: undefined, mutate: jest.fn() });
  useAuthentication.mockReturnValue({ hasCulrUniqueId: true });
  useBreakpoint.mockReturnValue("lg");
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("only requests the current desktop page and uses hitcount", async () => {
  await mount();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0].variables).toMatchObject({
    offset: 0,
    limit: 25,
    sortBy: "CREATEDAT_DESC",
    withMaterial: true,
  });
  expect(current.totalPages).toBe(3);
  await act(async () => current.setCurrentPage(2));
  await flush();
  expect(fetch.mock.lastCall[0].variables.offset).toBe(25);
  expect(current.paginatedBookmarks).toHaveLength(1);
  expect(current.paginatedBookmarks[0].bookmarkId).toBe(uuid);
});

test("mobile keeps previous items and only requests fallback for the new page", async () => {
  useBreakpoint.mockReturnValue("xs");
  await mount();
  items = [{ ...stored, id: "second", materialId: "work-of:second" }];
  await act(async () => current.setCurrentPage(2));
  await flush();
  expect(fetch.mock.calls.map(([request]) => request.variables.offset)).toEqual(
    [0, 25, 25]
  );
  expect(fetch.mock.lastCall[0].profile).toBe("present");
  expect(current.paginatedBookmarks.map((bm) => bm.bookmarkId)).toEqual([
    uuid,
    "second",
  ]);
});

test("fallback merges only matching unresolved bookmarks and preserves the original page", async () => {
  const resolved = { ...stored, material: { work, manifestations: [book] } };
  items = [
    resolved,
    { ...stored, id: "whole", selection: null },
    {
      ...stored,
      id: "pid",
      materialId: ebook.pid,
      material: { manifestation: book },
    },
    { ...stored, id: "selection", material: { work, manifestations: [] } },
    { ...stored, id: "changed" },
    { ...stored, id: "missing" },
  ];
  const fallbackItems = [
    {
      ...resolved,
      id: "selection",
      selection: { materialTypes: { specific: ["BOOK", "BOOK"] } },
    },
    { ...resolved, id: "whole", selection: null },
    { ...items[2], material: { manifestation: ebook } },
    {
      ...resolved,
      id: "changed",
      selection: { materialTypes: { specific: ["EBOOK"] } },
    },
    { ...resolved, material: null },
    { ...resolved, id: "missing", materialId: "work-of:another" },
  ];
  fetch.mockImplementation(async ({ profile }) => ({
    data: {
      patron: {
        bookmarks: {
          status: "OK",
          hitcount: profile ? 99 : 51,
          items: profile ? fallbackItems : items,
        },
      },
    },
  }));
  await mount();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[1][0].variables).toEqual(
    fetch.mock.calls[0][0].variables
  );
  expect(current.count).toBe(51);
  expect(current.paginatedBookmarks.map((item) => item.id)).toEqual(
    items.map((item) => item.id)
  );
  expect(
    current.paginatedBookmarks.map((item) => item.isAvailableInSearchProfile)
  ).toEqual([true, false, false, false, false, false]);
  expect(current.paginatedBookmarks[0].material).toEqual(resolved.material);
  expect(current.paginatedBookmarks[1].material.work.workId).toBe(workId);
  expect(current.paginatedBookmarks[2].material.manifestation.pid).toBe(
    ebook.pid
  );
  expect(current.paginatedBookmarks[3].material.manifestations).toEqual([book]);
  current.paginatedBookmarks.slice(4).forEach((item) => {
    expect(populateBookmark(item)).toMatchObject({
      title: "En bog",
      hasMaterial: false,
    });
  });
  post.mockResolvedValue({
    data: {
      patron: {
        deleteBookmarks: {
          status: "OK",
          items: [{ id: "pid", status: "OK" }],
        },
      },
    },
  });
  await act(async () =>
    current.deleteBookmarks([current.paginatedBookmarks[2]])
  );
  expect(post.mock.lastCall[0].variables).toEqual({ bookmarkIds: ["pid"] });
});

test.each([
  [false, "transport"],
  [false, "graphql"],
  [false, "status"],
  [true, "transport"],
  [true, "graphql"],
  [true, "status"],
])(
  "profile errors remain errors (fallback: %s, failure: %s)",
  async (fallback, failure) => {
    items = [stored];
    fetch.mockImplementation(async ({ profile }) => {
      const page = {
        data: { patron: { bookmarks: { status: "OK", hitcount: 1, items } } },
      };
      if (fallback && !profile) return page;
      if (failure === "transport") throw new Error("network error");
      if (failure === "graphql")
        return { ...page, errors: [{ message: "failed" }] };
      page.data.patron.bookmarks.status = "FAILED";
      return page;
    });
    await mount();
    expect(current.error).toBeTruthy();
    expect(current.isLoading).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(fallback ? 2 : 1);
  }
);

test("sorting resets pagination and delegates ordering to the API", async () => {
  await mount();
  await act(async () => current.setCurrentPage(2));
  await flush();
  await act(async () => current.setSortBy("title"));
  await flush();
  expect(current.currentPage).toBe(1);
  expect(fetch.mock.lastCall[0].variables).toMatchObject({
    offset: 0,
    sortBy: "TITLE_ASC",
  });
});

test.each(["local", "server"])(
  "%s whole works get the work page default without persisting selection",
  (source) => {
    const bookmark = { materialId: workId, workId, selection: null };
    const expected = manifestationMaterialTypeFactory([
      ...work.manifestations.mostRelevant,
    ])
      .uniqueMaterialTypes[0].map((type) => type.specificCode)
      .join(" / ");
    const result =
      source === "server"
        ? populateBookmark({ ...bookmark, id: uuid, material: { work } })
        : populateBookmark(bookmark, work);
    expect(result.materialType).toBe(expected);
    expect(result.manifestations.length).toBeGreaterThan(0);
    expect(result.selection).toBeNull();
    expect(toBookmarkInput(result)).toEqual({ materialId: workId });
  }
);

test("explicit specific and general selections are preserved", () => {
  const specific = { materialTypes: { specific: ["EBOOK"] } };
  expect(
    populateBookmark({ materialId: workId, workId, selection: specific }, work)
      .manifestations
  ).toEqual([ebook]);
  const general = { materialTypes: { general: ["BOOKS"] } };
  const result = populateBookmark(
    { materialId: workId, workId, selection: general },
    work
  );
  expect(result.manifestations).toEqual([ebook, book]);
  expect(toBookmarkInput(result)).toEqual({
    materialId: workId,
    selection: general,
  });
});

test("identity distinguishes whole works and selections but ignores selection ordering", () => {
  const first = {
    materialId: workId,
    selection: { materialTypes: { specific: ["BOOK", "EBOOK"] } },
  };
  const second = {
    ...first,
    selection: { materialTypes: { specific: ["EBOOK", "BOOK", "BOOK"] } },
  };
  expect(getBookmarkKey(first)).toBe(getBookmarkKey(second));
  expect(getBookmarkKey(first)).not.toBe(
    getBookmarkKey({ materialId: workId, selection: null })
  );
});

test("legacy local work selections migrate, but PID material types are not sent", () => {
  expect(
    toBookmarkInput({ materialId: workId, workId, materialType: "BOOK" })
  ).toEqual({ materialId: workId, selection });
  expect(
    toBookmarkInput({ materialId: book.pid, workId, materialType: "BOOK" })
  ).toEqual({ materialId: book.pid });
});

test("login sync keeps failed bookmarks and removes only individually confirmed entries", async () => {
  const local = ["ok", "exists", "failed"].map((id) => ({
    materialId: `work-of:${id}`,
    workId: `work-of:${id}`,
    materialType: "BOOK",
    createdAt: "2024-01-01",
  }));
  localStorage.setItem("bookmarks", JSON.stringify(local));
  post.mockResolvedValue({
    data: {
      patron: {
        addBookmarks: {
          status: "PARTIALLY_FAILED",
          items: local.map((bm, i) => ({
            materialId: bm.materialId,
            selection,
            status: ["OK", "ALREADY_EXISTS", "FAILED"][i],
          })),
        },
      },
    },
  });
  await mount();
  await act(async () => current.syncCookieBookmarks());
  expect(JSON.parse(localStorage.getItem("bookmarks"))).toEqual([local[2]]);
  expect(post.mock.calls[0][0].variables.bookmarks[0]).toEqual({
    materialId: local[0].materialId,
    selection,
  });
});

test("login sync retains local bookmarks on transport failure", async () => {
  const local = [{ materialId: workId, workId, materialType: "BOOK" }];
  localStorage.setItem("bookmarks", JSON.stringify(local));
  post.mockResolvedValue({ error: "network error" });
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  await mount();
  await act(async () => current.syncCookieBookmarks());
  expect(JSON.parse(localStorage.getItem("bookmarks"))).toEqual(local);
  spy.mockRestore();
});

test("a default material choice removes the original whole-work bookmark", async () => {
  items = [{ ...stored, selection: null }];
  hitcount = 1;
  await mount({ workId });
  await act(async () =>
    current.setBookmark({
      key: current.bookmarks[0].key,
      materialId: workId,
      workId,
      materialType: "BOOK",
    })
  );
  expect(post.mock.lastCall[0].variables).toEqual({ bookmarkIds: [uuid] });
});

test("partial deletion keeps failed items selected by returning only confirmed keys", async () => {
  post.mockResolvedValue({
    data: {
      patron: {
        deleteBookmarks: {
          status: "PARTIALLY_FAILED",
          items: [
            { id: uuid, status: "OK" },
            { id: "failed", status: "FAILED" },
          ],
        },
      },
    },
  });
  await mount();
  let removed;
  await act(async () => {
    removed = await current.deleteBookmarks([
      { bookmarkId: uuid, key: "first" },
      { bookmarkId: "failed", key: "second" },
    ]);
  });
  expect(removed).toEqual(["first"]);
  expect(current.error).toBeTruthy();
  expect(mockCollectDelMultipleBookmarks).toHaveBeenCalledWith({ count: 1 });
});

test("reading a failed API status exposes an error instead of an empty successful list", async () => {
  fetch.mockResolvedValue({
    data: {
      patron: {
        bookmarks: {
          status: "ERROR_UNAUTHENTICATED_TOKEN",
          hitcount: 0,
          items: [],
        },
      },
    },
  });
  await mount();
  expect(current.error).toBeTruthy();
  expect(current.isLoading).toBe(false);
});

test("header requests the count without loading bookmark items", async () => {
  await mount({});
  expect(fetch.mock.calls[0][0].variables).toMatchObject({
    countOnly: true,
    withMaterial: false,
    limit: 1,
  });
  expect(current.count).toBe(51);
});

test("work marking uses a work filter independently of list pagination", async () => {
  hitcount = 1;
  await mount({ workId });
  expect(fetch.mock.calls[0][0].variables).toMatchObject({
    filter: { workId },
    withMaterial: false,
  });
  expect(current.bookmarks[0].key).toBe(uuid);
});

test("unauthenticated bookmarks remain local and receive normalized keys", async () => {
  useAuthentication.mockReturnValue({ hasCulrUniqueId: false });
  localStorage.setItem(
    "bookmarks",
    JSON.stringify([
      { materialId: workId, workId, materialType: "BOOK", key: "old-key" },
    ])
  );
  await mount();
  expect(fetch).not.toHaveBeenCalled();
  expect(current.paginatedBookmarks[0].key).toBe(
    getBookmarkKey({ materialId: workId, selection })
  );
});

test("switching from mobile load-more to desktop does not duplicate pages", async () => {
  useBreakpoint.mockReturnValue("xs");
  await mount();
  await act(async () => current.setCurrentPage(2));
  await flush();
  useBreakpoint.mockReturnValue("lg");
  await act(async () => rerender());
  await flush();
  expect(current.paginatedBookmarks).toHaveLength(1);
});

test("a mutation refreshes the list, work marking and header count", async () => {
  hitcount = 1;
  let list;
  let marking;
  let header;
  function Harness() {
    list = useBookmarks({ list: true });
    marking = useBookmarks({ workId });
    header = useBookmarks();
    return null;
  }
  await act(async () => {
    root.render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Harness />
      </SWRConfig>
    );
  });
  await flush();
  expect(header.count).toBe(1);
  post.mockImplementation(async () => {
    items = [];
    hitcount = 0;
    return {
      data: {
        patron: {
          deleteBookmarks: {
            status: "OK",
            items: [{ id: uuid, status: "OK" }],
          },
        },
      },
    };
  });
  await act(async () =>
    marking.setBookmark({ materialId: workId, workId, materialType: "BOOK" })
  );
  await flush();
  expect(post.mock.lastCall[0].variables).toEqual({ bookmarkIds: [uuid] });
  expect(mockCollectDelBookmark).toHaveBeenCalledTimes(1);
  expect(mockCollectDelMultipleBookmarks).not.toHaveBeenCalled();
  expect(list.paginatedBookmarks).toEqual([]);
  expect(marking.bookmarks).toEqual([]);
  expect(header.count).toBe(0);
});

test("a direct PID is displayed even when it is absent from mostRelevant", () => {
  const direct = { ...ebook, titles: { full: ["Direkte udgave"] } };
  const result = populateBookmark({
    ...stored,
    materialId: ebook.pid,
    selection: null,
    material: { manifestation: direct },
  });
  expect(result.title).toBe("Direkte udgave");
  expect(result.manifestations).toEqual([direct]);
  expect(result.hasMaterial).toBe(true);
  expect(result.key).toBe(uuid);
});

test("a selection uses the API's matching manifestations without filtering mostRelevant", () => {
  const result = populateBookmark({
    ...stored,
    material: { work, manifestations: [book] },
  });
  expect(result.manifestations).toEqual([book]);
  expect(result.selection).toEqual(selection);
});

test("missing material remains visible and deletable using snapshot metadata", () => {
  const result = populateBookmark({
    ...stored,
    material: { work: null, manifestations: [] },
    snapshot: { workId, title: "Gemt titel", creator: "Gemt ophav" },
  });
  expect(result).toMatchObject({
    title: "Gemt titel",
    creator: "Gemt ophav",
    key: uuid,
    bookmarkId: uuid,
    hasMaterial: false,
    manifestations: [],
  });
});

test("an empty selection does not fall back to unrelated work manifestations", () => {
  const result = populateBookmark({
    ...stored,
    material: { work, manifestations: [] },
  });
  expect(result.manifestations).toEqual([]);
  expect(result.hasMaterial).toBe(false);
});

test("server bookmarks with the same meaning retain separate UUID identities", async () => {
  items = [stored, { ...stored, id: "another-uuid" }];
  await mount();
  expect(current.paginatedBookmarks.map((bookmark) => bookmark.key)).toEqual([
    uuid,
    "another-uuid",
  ]);
  expect(getBookmarkKey(current.paginatedBookmarks[0])).toBe(
    getBookmarkKey(current.paginatedBookmarks[1])
  );
});

test("only local bookmarks require a separate work lookup", async () => {
  let bookmarks = [{ ...stored, material: { work, manifestations: [book] } }];
  function Harness() {
    current = usePopulateBookmarks(bookmarks);
    return null;
  }
  await act(async () => root.render(<Harness />));
  expect(useData.mock.lastCall[0]).toBeFalsy();
  expect(current.data[0].manifestations).toEqual([book]);
  bookmarks = [
    ...bookmarks,
    { materialId: "work-of:local", workId: "work-of:local" },
  ];
  await act(async () => root.render(<Harness />));
  expect(useData.mock.lastCall[0].variables.ids).toEqual(["work-of:local"]);
});
