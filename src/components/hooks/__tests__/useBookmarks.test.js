import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import { parse, visit } from "graphql";
import useBookmarks, {
  getBookmarkKey,
  populateBookmark,
  usePopulateBookmarks,
  toBookmarkInput,
} from "../useBookmarks";
import { fetchAll } from "@/lib/api/bookmarks.fragments";
import { addBookmarks, deleteBookmarks } from "@/lib/api/bookmarks.mutations";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import { useFetcher, useMutate, useData } from "@/lib/api/api";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import MaterialRowBookmark from "@/components/profile/materialRow/versions/MaterialRowBookmark";

jest.mock(
  "@/components/work/reservationbutton/ReservationButton",
  () =>
    function ReservationButton() {
      return <button data-testid="order">Order</button>;
    }
);
jest.mock("@/components/profile/materialRow/MaterialRow", () => ({
  TextWithCheckMark: () => null,
}));
jest.mock("@/components/base/translate", () => ({
  __esModule: true,
  default: ({ label }) => label,
}));
jest.mock(
  "@/public/icons/close.svg",
  () =>
    function CloseIcon() {
      return <span />;
    }
);

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

test("local title sorting retains the existing character ordering", async () => {
  useAuthentication.mockReturnValue({ hasCulrUniqueId: false });
  await mount();
  const bookmarks = ["æ", "a", "Z", "ø", "å"].map((title) => ({ title }));
  expect(
    current.titleSort(bookmarks).map((bookmark) => bookmark.title)
  ).toEqual(["Z", "a", "å", "æ", "ø"]);
  expect(
    current.titleSort(bookmarks, "desc").map((bookmark) => bookmark.title)
  ).toEqual(["ø", "æ", "å", "a", "Z"]);
  expect(bookmarks.map((bookmark) => bookmark.title)).toEqual([
    "æ",
    "a",
    "Z",
    "ø",
    "å",
  ]);
});

test.each([true, false])(
  "bookmark toggle retains single-delete analytics (authenticated: %s)",
  async (authenticated) => {
    useAuthentication.mockReturnValue({ hasCulrUniqueId: authenticated });
    localStorage.setItem(
      "bookmarks",
      JSON.stringify([{ materialId: workId, workId, materialType: "BOOK" }])
    );
    post.mockResolvedValue({
      data: {
        patron: {
          deleteBookmarks: {
            status: "OK",
            items: [{ id: uuid, status: "OK" }],
          },
        },
      },
    });
    hitcount = 1;
    await mount({ workId });
    const value = {
      materialId: workId,
      workId,
      materialType: "BOOK",
      title: "En bog",
    };
    await act(async () => current.setBookmark(value));
    expect(mockCollectDelBookmark).toHaveBeenCalledWith(value);
    expect(mockCollectDelMultipleBookmarks).not.toHaveBeenCalled();
  }
);

test("failed deletion does not report a successful analytics event", async () => {
  post.mockResolvedValue({
    data: {
      patron: {
        deleteBookmarks: {
          status: "FAILED",
          items: [{ id: uuid, status: "FAILED" }],
        },
      },
    },
  });
  hitcount = 1;
  await mount({ workId });
  await act(async () =>
    current.setBookmark({ materialId: workId, workId, materialType: "BOOK" })
  );
  expect(mockCollectDelBookmark).not.toHaveBeenCalled();
  expect(mockCollectDelMultipleBookmarks).not.toHaveBeenCalled();
});

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

  test("prefers a real selection cover over the first edition's default", () => {
    expect(
      populate([
        withCover(ebook, "default", "default"),
        withCover(ebook, "real"),
      ]).image
    ).toBe("real-small");
  });

  test("uses mostRelevant before an API default", () => {
    expect(
      populate(
        [withCover(ebook, "default", "default")],
        [withCover(book, "outside")]
      ).image
    ).toBe("outside-small");
  });

  test("keeps the API default when the work has no real cover", () => {
    expect(
      populate([withCover(ebook, "default", "default")], [book]).image
    ).toBe("default-small");
  });

  test("does not invent a cover when none is supplied", () => {
    expect(populate([ebook], [book]).image).toBeFalsy();
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

  test("does not request all manifestations for cover fallback", () => {
    const fields = [];
    visit(parse(fetchAll({ withMaterial: true }).query), {
      Field(node) {
        fields.push(node.name.value);
      },
    });
    expect(fields).not.toContain("all");
    expect(fields.filter((field) => field === "mostRelevant")).toHaveLength(2);
  });
});

let root;
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
  await act(async () => {
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
  });
  await flush();
}

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  jest.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  items = [stored];
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

test("queries patron with explicit sort, pagination and optional work filter", () => {
  const request = fetchAll({ sortBy: "title", offset: 25, limit: 25, workId });
  expect(request.variables).toMatchObject({
    sortBy: "TITLE_ASC",
    offset: 25,
    limit: 25,
    filter: { workId },
  });
  const document = parse(request.query);
  expect(document.definitions[0].selectionSet.selections[0].name.value).toBe(
    "patron"
  );
  expect(fetchAll({ sortBy: "createdAt" }).variables.sortBy).toBe(
    "CREATEDAT_DESC"
  );
});

test("mutations use patron, selection input and UUID deletion", () => {
  const add = addBookmarks({ bookmarks: [{ materialId: workId, selection }] });
  const remove = deleteBookmarks({ bookmarkIds: [uuid] });
  for (const request of [add, remove]) {
    expect(
      parse(request.query).definitions[0].selectionSet.selections[0].name.value
    ).toBe("patron");
  }
  expect(remove.query).toContain("[String!]!");
  expect(remove.query).toContain("deleteBookmarks(ids:");
});

test("only requests the current desktop page and uses hitcount", async () => {
  await mount();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0].variables).toMatchObject({
    offset: 0,
    limit: 25,
  });
  expect(current.totalPages).toBe(3);
  await act(async () => current.setCurrentPage(2));
  await flush();
  expect(fetch.mock.lastCall[0].variables.offset).toBe(25);
  expect(current.paginatedBookmarks).toHaveLength(1);
  expect(current.paginatedBookmarks[0].bookmarkId).toBe(uuid);
});

test("mobile loads the next API page and keeps previous items", async () => {
  useBreakpoint.mockReturnValue("xs");
  await mount();
  items = [{ ...stored, id: "second", materialId: "work-of:second" }];
  await act(async () => current.setCurrentPage(2));
  await flush();
  expect(fetch.mock.calls.map(([request]) => request.variables.offset)).toEqual(
    [0, 25]
  );
  expect(current.paginatedBookmarks.map((bm) => bm.bookmarkId)).toEqual([
    uuid,
    "second",
  ]);
});

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

test("work marking uses a work filter independently of list pagination", async () => {
  hitcount = 1;
  await mount({ workId });
  expect(fetch.mock.calls[0][0].variables.filter).toEqual({ workId });
  expect(current.bookmarks[0].key).toBe(uuid);
});

test("a whole work gets the same default as the work page without changing selection", () => {
  const bookmark = { materialId: workId, workId, selection: null };
  const expected = manifestationMaterialTypeFactory([
    ...work.manifestations.mostRelevant,
  ])
    .uniqueMaterialTypes[0].map((type) => type.specificCode)
    .join(" / ");
  const result = populateBookmark(bookmark, work);
  expect(result.materialType).toBe(expected);
  expect(result.manifestations.length).toBeGreaterThan(0);
  expect(result.selection).toBeNull();
  expect(toBookmarkInput(result)).toEqual({ materialId: workId });
});

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

test("a PID without selection stays a specific edition", () => {
  const result = populateBookmark(
    { materialId: ebook.pid, workId, selection: null },
    work
  );
  expect(result.pid).toBe(ebook.pid);
  expect(result.manifestations).toEqual([ebook]);
  expect(toBookmarkInput(result)).toEqual({ materialId: ebook.pid });
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

test("removing an existing bookmark sends its UUID", async () => {
  hitcount = 1;
  post.mockResolvedValue({
    data: {
      patron: {
        deleteBookmarks: { status: "OK", items: [{ id: uuid, status: "OK" }] },
      },
    },
  });
  await mount({ workId });
  await act(async () =>
    current.setBookmark({ materialId: workId, workId, materialType: "BOOK" })
  );
  expect(post.mock.lastCall[0].variables).toEqual({ bookmarkIds: [uuid] });
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
    limit: 1,
  });
  expect(current.count).toBe(51);
});

test("work lookups also paginate when a single work has over 100 bookmarks", async () => {
  fetch.mockImplementation(async ({ variables }) => ({
    data: {
      patron: {
        bookmarks: {
          status: "OK",
          hitcount: 101,
          items:
            variables.offset === 0
              ? Array.from({ length: 100 }, (_, i) => ({
                  ...stored,
                  id: `id-${i}`,
                }))
              : [{ ...stored, id: "last" }],
        },
      },
    },
  }));
  await mount({ workId });
  expect(fetch.mock.calls.map(([request]) => request.variables.offset)).toEqual(
    [0, 100]
  );
  expect(
    fetch.mock.calls.every(
      ([request]) => request.variables.filter.workId === workId
    )
  ).toBe(true);
  expect(current.bookmarks).toHaveLength(101);
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
  await act(async () => current.retry());
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

test("direct whole works still use the work page default without persisting it", () => {
  const result = populateBookmark({
    ...stored,
    selection: null,
    material: { work },
  });
  expect(result.materialType).toBe(
    populateBookmark({ materialId: workId, workId, selection: null }, work)
      .materialType
  );
  expect(toBookmarkInput(result)).toEqual({ materialId: workId });
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

test("null snapshot fields and missing material do not discard a bookmark", () => {
  expect(
    populateBookmark({ ...stored, snapshot: null, material: null })
  ).toMatchObject({
    bookmarkId: uuid,
    hasMaterial: false,
    manifestations: [],
  });
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

test("only list requests include full material data", async () => {
  await mount();
  expect(fetch.mock.calls[0][0].variables.withMaterial).toBe(true);
  expect(fetchAll({ workId }).variables.withMaterial).toBe(false);
  expect(parse(fetchAll({ withMaterial: true }).query)).toBeTruthy();
});

test("snapshot rows show title and creator without an order button or dead link", async () => {
  const bookmark = populateBookmark({
    ...stored,
    material: null,
    snapshot: {
      title: "Snapshot title",
      creator: "Snapshot creator",
      workId,
    },
  });
  const remove = jest.fn();
  await act(async () =>
    root.render(
      <MaterialRowBookmark
        {...bookmark}
        bookmarkKey={bookmark.key}
        allManifestations={bookmark.manifestations}
        materialType={bookmark.materialTypeLabel}
        onBookmarkDelete={remove}
      />
    )
  );
  expect(container.textContent).toContain("Snapshot title");
  expect(container.textContent).toContain("Snapshot creator");
  expect(container.querySelector('[data-testid="order"]')).toBeNull();
  expect(container.querySelector("a")).toBeNull();
  await act(async () => container.querySelector("button").click());
  expect(remove).toHaveBeenCalledTimes(1);
});
