import { StoryDescription, StoryTitle } from "@/storybook";
import ResultRow from "@/components/search/result/row/Row";
import { omit } from "lodash";

const exportedObject = {
  title: "search/Result/ResultRow",
};

export default exportedObject;

/** RowComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} editionProps
 * @param {string} storyNameOverride
 */
function RowComponentBuilder({
  rowProps,
  type = "Bog",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>Row - {descriptionName}</StoryTitle>
      <StoryDescription>
        The Edition on the type: {descriptionName}
      </StoryDescription>
      <ResultRow
        work={rowProps?.work}
        className={rowProps?.className}
        onClick={
          rowProps?.onClick ||
          function () {
            alert("HEJ fra onClick");
          }
        }
      />
    </div>
  );
}

export function WithAllData() {
  const rowProps = {
    work: work,
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithAllData"}
      rowProps={rowProps}
    />
  );
}

export function WithoutCover() {
  const rowProps = {
    work: omit(work, ["manifestations.all[0].cover"]),
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithoutCover"}
      rowProps={rowProps}
    />
  );
}

export function WithoutCreator() {
  const rowProps = {
    work: omit(work, ["creators"]),
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithoutCreator"}
      rowProps={rowProps}
    />
  );
}

export function WithoutTitles() {
  const rowProps = {
    work: omit(work, ["titles.main", "titles.full"]),
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithoutTitles"}
      rowProps={rowProps}
    />
  );
}

export function WithoutManifestations() {
  const rowProps = {
    work: omit(work, ["manifestations.all"]),
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithoutManifestations"}
      rowProps={rowProps}
    />
  );
}

export function WithoutMaterialTypes() {
  const rowProps = {
    work: noMaterialTypesWork,
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithoutMaterialTypes"}
      rowProps={rowProps}
    />
  );
}

export function SlowLoading() {
  const rowProps = {
    work: {},
    className: "",
    onClick: () => {},
    isLoading: true,
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"SlowLoading"}
      rowProps={rowProps}
    />
  );
}

const work = {
  workId: "some-id-1",
  manifestations: {
    all: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
        },
      },
    ],
  },
  creators: [
    {
      display: "Joanne K Rowling",
    },
  ],
  materialTypes: [
    {
      specific: "Bog",
    },
    {
      specific: "Diskette",
    },
    {
      specific: "E-bog",
    },
    {
      specific: "Lydbog (bånd)",
    },
    {
      specific: "Lydbog (cd)",
    },
    {
      specific: "Lydbog (cd-mp3)",
    },
    {
      specific: "Lydbog (net)",
    },
    {
      specific: "Punktskrift",
    },
  ],
  titles: {
    main: "Harry Potter og De Vises Sten",
    full: "Harry Potter og De Vises Sten",
  },
};

const noMaterialTypesWork = {
  workId: "some-id-1",
  manifestations: {
    all: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
        },
      },
    ],
  },
  creators: [
    {
      display: "Joanne K Rowling",
    },
  ],
  materialTypes: [],
  titles: {
    main: "Harry Potter og De Vises Sten",
    full: "Harry Potter og De Vises Sten",
  },
};
