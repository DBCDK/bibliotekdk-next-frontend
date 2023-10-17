import { StoryDescription, StoryTitle } from "@/storybook";
import ResultRow from "@/components/search/result/row/Row";
import omit from "lodash/omit";

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
  type = ["bog"],
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
    work: omit(work, ["manifestations.mostRelevant[0].cover"]),
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

export function WithOneOtherLanguageKlingon() {
  const rowProps = {
    work: work_klingon_language,
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithOtherLanguages"}
      rowProps={rowProps}
    />
  );
}

export function WithTwoOtherLanguagesElvishKlingon() {
  const rowProps = {
    work: work_2_other_languages,
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithOtherLanguages"}
      rowProps={rowProps}
    />
  );
}

export function WithTwoPersonCreators() {
  const rowProps = {
    work: work_2_person_creators,
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithOtherLanguages"}
      rowProps={rowProps}
    />
  );
}

export function WithOneCorpCreators() {
  const rowProps = {
    work: work_1_corp_creators,
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithOtherLanguages"}
      rowProps={rowProps}
    />
  );
}

export function WithTwoCorpCreators() {
  const rowProps = {
    work: work_2_corp_creators,
    className: "",
    onClick: () => {},
  };

  return (
    <RowComponentBuilder
      storyNameOverride={"WithOtherLanguages"}
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
    mostRelevant: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
        },
        materialTypes: [
          {
            materialTypeSpecific: { display: "bog" },
          },
        ],
      },
    ],
    all: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
        },
        materialTypes: [
          {
            materialTypeSpecific: { display: "bog" },
          },
          {
            materialTypeSpecific: { display: "diskette" },
          },
          {
            materialTypeSpecific: { display: "ebog" },
          },
          {
            materialTypeSpecific: { display: "lydbog (bånd)" },
          },
          {
            materialTypeSpecific: { display: "lydbog (cd)" },
          },
          {
            materialTypeSpecific: { display: "lydbog (cd-mp3)" },
          },
          {
            materialTypeSpecific: { display: "lydbog (net)" },
          },
          {
            materialTypeSpecific: { display: "punktskrift" },
          },
        ],
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
      materialTypeSpecific: { display: "bog" },
    },
    {
      materialTypeSpecific: { display: "diskette" },
    },
    {
      materialTypeSpecific: { display: "ebog" },
    },
    {
      materialTypeSpecific: { display: "lydbog (bånd)" },
    },
    {
      materialTypeSpecific: { display: "lydbog (cd)" },
    },
    {
      materialTypeSpecific: { display: "lydbog (cd-mp3)" },
    },
    {
      materialTypeSpecific: { display: "lydbog (net)" },
    },
    {
      materialTypeSpecific: { display: "punktskrift" },
    },
  ],
  titles: {
    main: ["Harry Potter og De Vises Sten"],
    full: ["Harry Potter og De Vises Sten"],
  },
};

const work_klingon_language = {
  workId: "some-id-2",
  manifestations: {
    mostRelevant: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
        },
        materialTypes: [
          {
            materialTypeSpecific: { display: "bog" },
          },
        ],
      },
    ],
  },
  mainLanguages: [
    {
      isoCode: "kli",
      display: "Klingon",
    },
  ],
  workTypes: ["LITERATURE"],
  creators: [
    {
      display: "Joanne K Rowling",
    },
  ],
  titles: {
    main: ["Harry Potter og De Vises Sten"],
    full: ["Harry Potter og De Vises Sten"],
  },
};

const work_2_other_languages = {
  workId: "some-id-3",
  manifestations: {
    mostRelevant: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
        },
        materialTypes: [
          {
            materialTypeSpecific: { display: "bog" },
          },
        ],
      },
    ],
  },
  mainLanguages: [
    {
      isoCode: "elf",
      display: "elvish",
    },
    {
      isoCode: "kli",
      display: "klingon",
    },
  ],
  workTypes: ["LITERATURE"],
  creators: [
    {
      display: "Joanne K Rowling",
    },
  ],
  titles: {
    main: ["Harry Potter og De Vises Sten"],
    full: ["Harry Potter og De Vises Sten"],
  },
};

const noMaterialTypesWork = {
  workId: "some-id-2",
  manifestations: {
    all: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
        },
        materialTypes: [],
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
    main: ["Harry Potter og De Vises Sten"],
    full: ["Harry Potter og De Vises Sten"],
  },
};

const work_2_person_creators = {
  workId: "some-id-2",
  manifestations: {
    all: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54945086&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f801abee638337e163ca",
        },
        materialTypes: [],
      },
    ],
  },
  creators: [
    {
      display: "Lotte Hammer",
      __typename: "Person",
    },
    {
      display: "Søren Hammer",
      __typename: "Person",
    },
  ],
  materialTypes: [],
  titles: {
    full: ["Mirakelbarnet"],
  },
};
const work_1_corp_creators = {
  workId: "some-id-2",
  manifestations: {
    all: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54945086&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f801abee638337e163ca",
        },
        materialTypes: [],
      },
    ],
  },
  creators: [
    {
      display: "Lotte Hammer",
      __typename: "Person",
    },
    {
      display: "Søren Hammer",
      __typename: "Person",
    },
    {
      display: "Hammer Industries",
      __typename: "Corporation",
    },
  ],
  materialTypes: [],
  titles: {
    full: ["Mirakelbarnet"],
  },
};

const work_2_corp_creators = {
  workId: "some-id-2",
  manifestations: {
    all: [
      {
        cover: {
          detail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54945086&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f801abee638337e163ca",
        },
        materialTypes: [],
      },
    ],
  },
  creators: [
    {
      display: "Lotte Hammer",
      __typename: "Person",
    },
    {
      display: "Søren Hammer",
      __typename: "Person",
    },
    {
      display: "Hammer Limited",
      __typename: "Corporation",
    },
    {
      display: "Hammer Incorporated",
      __typename: "Corporation",
    },
  ],
  materialTypes: [],
  titles: {
    full: ["Mirakelbarnet"],
  },
};
