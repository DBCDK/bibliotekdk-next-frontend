import { StoryDescription, StoryTitle } from "@/storybook";
import BookmarkDropdown, {
  BookMarkMaterialSelector,
} from "@/components/work/overview/bookmarkDropdown/BookmarkDropdown";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/overview/Bookmark",
};
const {  DEFAULT_STORY_PARAMETERS } = automock_utils();
export default exportedObject;

export function BookmarkWithDropdown() {
  const materialtypes = [["bog"], ["e-bog"], ["fisk"]];

  return (
    <div>
      <StoryTitle>BookMarkDropdown</StoryTitle>
      <StoryDescription>
        show materialtypes for work in dropdown
      </StoryDescription>
      <div style={{ width: "10%" }}>
        <BookMarkMaterialSelector
          workId="some-work-id"
          title="Some title"
          materialTypes={materialtypes}
        />
      </div>
    </div>
  );
}

export function BookmarkWithDropdownOneMaterial() {
  const materialtypes = [["bog"]];

  return (
    <div>
      <StoryTitle>BookMarkDropdown</StoryTitle>
      <StoryDescription>
        show materialtypes for work in dropdown
      </StoryDescription>
      <div style={{ width: "10%" }}>
        <BookMarkMaterialSelector
          workId="some-work-id"
          title="Some title"
          materialTypes={materialtypes}
        />
      </div>
    </div>
  );
}


export function BookmarkDropdownWithMock() {


const uniqueMaterialTypes = [
  [
    {
      specificDisplay: "bog",
      specificCode: "BOOK",
      generalDisplay: "bøger",
      generalCode: "BOOKS",
    },
  ],
  [
    {
      specificDisplay: "e-bog",
      specificCode: "EBOOK",
      generalDisplay: "e-bøger",
      generalCode: "EBOOKS",
    },
  ],
  [
    {
      specificDisplay: "lydbog (online)",
      specificCode: "AUDIO_BOOK_ONLINE",
      generalDisplay: "lydbøger",
      generalCode: "AUDIO_BOOKS",
    },
  ],
  [
    {
      specificDisplay: "lydbog (cd-mp3)",
      specificCode: "AUDIO_BOOK_CD_MP3",
      generalDisplay: "lydbøger",
      generalCode: "AUDIO_BOOKS",
    },
  ],
];

const work = {
  titles: {
    sort: "Postkort fra Hillerød. Bind 2 : Med fokus på de fotografiske postkort",
  },
  manifestations: {
    mostRelevant: [
      {
        publisher: ["Weber"],
        pid: "870970-basis:135080616",
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=135080616&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=2d940c6c1fd27f20397e",
          origin: "moreinfo",
          thumbnail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=135080616&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=1da393a6072d330b3979",
        },
        materialTypes: [
          {
            materialTypeGeneral: { code: "BOOKS", display: "bøger" },
            materialTypeSpecific: { code: "BOOK", display: "bog" },
          },
        ],
        edition: { publicationYear: { display: "2022" }, edition: "" },
      },
    ],
  },
};
  //useMockLoanerInfo({});

  return (
    <div>
      <StoryTitle>BookmarkDropdown7</StoryTitle>
      <StoryDescription>
        BookmarkDropdown component for managing bookmarks in work overview.
      </StoryDescription>
      <BookmarkDropdown
        materialId="work-of:870970-basis:135080616"
        workId="work-of:870970-basis:135080616"
        materialTypes={uniqueMaterialTypes}
        title={work?.titles?.sort}
        editions={work?.manifestations?.mostRelevant}
      />
    </div>
  );
}

BookmarkDropdownWithMock.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          manifestations: ({ variables }) => {
            const pids = variables?.pid || variables?.pids;
            return pids?.map((pid) =>
              MOCK_EDITIONS.find((m) => m.pid === pid)
            );
          },
          work: ({ variables }) => ({
            workId: variables.workId,
            title: "Mock Work Title",
            materialTypes: MOCK_MATERIAL_TYPES,
          }),
        },
        Mutation: {
          setBookmark: ({ variables }) => {
            console.debug("Set Bookmark", variables);
            return { status: "OK" };
          },
        },
      },
    },
  },
});