import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import Translate, { getLanguage } from "@/components/base/translate";
import { getFirstMatch } from "@/lib/utils";
import { DropdownIndicesEnum } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";

export function dummy__languages() {
  return {
    prioritisedItems: prioritisedLanguages,
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems: unprioritisedLanguages,
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
    overrideValueAs: "name",
  };
}

// eslint-disable-next-line css-modules/no-unused-class
export function dummy__specificmaterialTypes() {
  return {
    prioritisedItems: prioritisedMaterialTypeSpecific,
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems: unprioritisedMaterialTypeSpecific,
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
    overrideValueAs: "name",
  };
}
export function dummy__generalmaterialTypes() {
  return {
    prioritisedItems: prioritisedMaterialTypeGeneral,
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems: unprioritisedMaterialTypeGeneral,
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
    overrideValueAs: "name",
  };
}

export function dummy__genreAndForm() {
  return {
    prioritisedItems: prioritisedGenre,
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems: unprioritisedGenre,
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
    overrideValueAs: "name",
  };
}

export function dummy__filmNationality() {
  return {
    prioritisedItems: prioritisedFilmNationality,
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems: unprioritisedFilmNationality,
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
    overrideValueAs: "name",
  };
}

export function nameForActionLinkContainer(formType, searchIndex) {
  return `${formType}__${searchIndex}`;
}

export function publicationYearIndices() {
  const thisYear = new Date().getFullYear();

  return [
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "this_year",
        vars: [new Date().getFullYear()],
      }),
      value: { lower: thisYear, upper: thisYear },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "last_x_years",
        vars: [
          getLanguage() === "da" ? "to" : getLanguage() === "en" ? "two" : "2",
        ],
      }),
      value: { lower: thisYear - 2, upper: thisYear },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "last_x_years",
        vars: [
          getLanguage() === "da"
            ? "tre"
            : getLanguage() === "en"
            ? "three"
            : "3",
        ],
      }),
      value: { lower: thisYear - 3, upper: thisYear },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "last_x_years",
        vars: [
          getLanguage() === "da"
            ? "fem"
            : getLanguage() === "en"
            ? "five"
            : "5",
        ],
      }),
      value: { lower: thisYear - 5, upper: thisYear },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "last_x_years",
        vars: [
          getLanguage() === "da" ? "ti" : getLanguage() === "en" ? "ten" : "10",
        ],
      }),
      value: { lower: thisYear - 10, upper: thisYear },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: nameForActionLinkContainer(
        FormTypeEnum.ACTION_LINK_CONTAINER,
        DropdownIndicesEnum.PUBLICATION_YEAR
      ),
      value: {},
      formType: FormTypeEnum.ACTION_LINK_CONTAINER,
    },
  ];
}

export const publicationYearFormatterAndComparitor = {
  /**
   *
   * @param {any|null} [value]
   * @returns {string}
   */
  getComparator(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "=", [
      [lower && upper, " within "],
      [lower, ">"],
      [upper, "<"],
    ]);
  },
  getFormatValue(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "", [
      [lower && upper, `${value?.lower} ${value?.upper}`],
      [lower, `${value?.lower}`],
      [upper, `${value?.upper}`],
    ]);
  },
  getPrintValue(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "", [
      [lower && upper, `${value?.lower}-${value?.upper}`],
      [lower, `>${value?.lower}`],
      [upper, `<${value?.upper}`],
    ]);
  },
  getSelectedPresentation(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "", [
      [
        lower && upper && value?.lower === value?.upper,
        Translate({
          context: "advanced_search_dropdown",
          label: "exact_publication_year",
          vars: [value?.lower],
        }),
      ],
      [
        lower && upper,
        Translate({
          context: "advanced_search_dropdown",
          label: "publication_year_range",
          vars: [value?.lower, value?.upper],
        }),
      ],
      [
        lower,
        Translate({
          context: "advanced_search_dropdown",
          label: "x_publication_year_and_up",
          vars: [value?.lower],
        }),
      ],
      [
        upper,
        Translate({
          context: "advanced_search_dropdown",
          label: "up_to_x_publication_year",
          vars: [value?.upper],
        }),
      ],
    ]);
  },
};

export function agesIndices() {
  return [
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "for_x_y_years",
        vars: [1, 2],
      }),
      value: { lower: 1, upper: 2 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "for_x_y_years",
        vars: [3, 6],
      }),
      value: { lower: 3, upper: 6 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "for_x_y_years",
        vars: [7, 10],
      }),
      value: { lower: 7, upper: 10 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "for_x_y_years",
        vars: [11, 13],
      }),
      value: { lower: 11, upper: 13 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: Translate({
        context: "advanced_search_dropdown",
        label: "for_x_y_years",
        vars: [14, 16],
      }),
      value: { lower: 14, upper: 16 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: nameForActionLinkContainer(
        FormTypeEnum.ACTION_LINK_CONTAINER,
        DropdownIndicesEnum.AGES
      ),
      value: {},
      formType: FormTypeEnum.ACTION_LINK_CONTAINER,
    },
  ];
}

export const agesFormatterAndComparitor = {
  /**
   *
   * @param {any|null} [value]
   * @returns {string}
   */
  getComparator(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "=", [
      [lower && upper, " within "],
      [lower, ">"],
      [upper, "<"],
    ]);
  },
  getFormatValue(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "", [
      [lower && upper, `${value?.lower} ${value?.upper}`],
      [lower, `${value?.lower}`],
      [upper, `${value?.upper}`],
    ]);
  },
  getPrintValue(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "", [
      [lower && upper, `${value?.lower}-${value?.upper}`],
      [lower, `>${value?.lower}`],
      [upper, `<${value?.upper}`],
    ]);
  },
  getSelectedPresentation(value) {
    const lower = Boolean(value?.lower);
    const upper = Boolean(value?.upper);

    return getFirstMatch(true, "", [
      [
        lower && upper && value?.lower === value?.upper,
        Translate({
          context: "advanced_search_dropdown",
          label: "exact_years_old",
          vars: [value?.lower],
        }),
      ],
      [
        lower && upper,
        Translate({
          context: "advanced_search_dropdown",
          label: "years_range",
          vars: [value?.lower, value?.upper],
        }),
      ],
      [
        lower,
        Translate({
          context: "advanced_search_dropdown",
          label: "x_years_and_up",
          vars: [value?.lower],
        }),
      ],
      [
        upper,
        Translate({
          context: "advanced_search_dropdown",
          label: "up_to_x_years",
          vars: [value?.upper],
        }),
      ],
    ]);
  },
};

const prioritisedLanguages = [
  {
    term: "dansk",
    key: "dan",
  },
  {
    term: "engelsk",
    key: "eng",
  },
  {
    term: "tysk",
    key: "ger",
  },
  {
    term: "fransk",
    key: "fre",
  },
];

const unprioritisedLanguages = [
  {
    term: "svensk",
    key: "swe",
  },
  {
    term: "italiensk",
    key: "ita",
  },
  {
    term: "spansk",
    key: "spa",
  },
  {
    term: "hebraisk",
    key: "heb",
  },
  {
    term: "kinesisk",
    key: "kin",
  },
  {
    term: "hindi",
    key: "hin",
  },
  {
    term: "arabisk",
    key: "ar",
  },
  {
    term: "persisk",
    key: "per",
  },
  {
    term: "japansk",
    key: "ja",
  },
  {
    term: "tjekkisk",
    key: "cze",
  },
  {
    term: "finsk",
    key: "fin",
  },
  {
    term: "græsk",
    key: "gre",
  },
  {
    term: "kroatisk",
    key: "hrv",
  },
  {
    term: "ungarsk",
    key: "hun",
  },
  {
    term: "norsk",
    key: "nor",
  },
  {
    term: "polsk",
    key: "pol",
  },
  {
    term: "portugisisk",
    key: "por",
  },
  {
    term: "russisk",
    key: "rus",
  },
  {
    term: "rumænsk",
    key: "ru",
  },
  {
    term: "tyrkisk",
    key: "tur",
  },
  {
    term: "ukrainsk",
    key: "ukr",
  },
];

const prioritisedMaterialTypeSpecific = [
  {
    code: "BOOK",
    display: "bog",
  },
  {
    code: "EBOOK",
    display: "e-bog",
  },
  {
    code: "AUDIO_BOOK_ONLINE",
    display: "lydbog (online)",
  },
  {
    code: "FILM_DVD",
    display: "film (dvd)",
  },
  {
    code: "MUSIK_CD",
    display: "musik (cd)",
  },
];

const unprioritisedMaterialTypeSpecific = [
  {
    code: "SHEET_MUSIC",
    display: "node",
  },
  {
    code: "ARTICLE",
    display: "artikel",
  },
  {
    code: "TV_SERIES_BLURAY",
    display: "tv-serie (blu-ray)",
  },
  {
    code: "TV_SERIES_DVD",
    display: "tv-serie (dvd)",
  },
  {
    code: "PICTURE_BOOK",
    display: "billedbog",
  },
  {
    code: "MUSIC_GRAMOPHONE",
    display: "musik (grammofonplade)",
  },
  {
    code: "FILM_ONLINE",
    display: "film (online)",
  },
  {
    code: "FILM_BLURAY",
    display: "film (blu-ray)",
  },
  {
    code: "AUDIO_BOOK_CD",
    display: "lydbog (cd)",
  },
  {
    code: "AUDIO_BOOK_TAPE",
    display: "lydbog (bånd)",
  },
  {
    code: "AUDIO_BOOK_CD_MP3",
    display: "lydbog (cd-mp3)",
  },
  {
    code: "BRAILLE",
    display: "punktskrift",
  },
  {
    code: "COMIC",
    display: "tegneserie",
  },
];

const prioritisedFilmNationality = [
  {
    key: "engelske film",
    score: 442,
  },
  {
    key: "biografiske film",
    score: 49,
  },

  {
    key: "franske film",
    score: 11,
  },
  {
    key: "danske film",
    score: 9,
  },
];

const unprioritisedFilmNationality = [
  {
    key: "amerikanske film",
    score: 31,
  },
];

const unprioritisedGenre = [
  {
    code: "110",
    display: "HEST",
  },
  {
    code: "1100",
    display: "HUND",
  },
];

const prioritisedGenre = [
  /**
   * roman
   * 11
   *
   * romaner
   * 9
   *
   * lydret
   * 2
   *
   * sjove bøger
   */

  {
    code: "11",
    display: "roman",
  },
  {
    code: "9",
    display: "sjove bøger",
  },
  {
    code: "2",
    display: "lydret",
  },
];

const prioritisedMaterialTypeGeneral = [
  {
    code: "BOOKS",
    display: "bøger",
  },
  {
    code: "EBOOKS",
    display: "e-bøger",
  },
  {
    code: "AUDIO_BOOKS",
    display: "lydbøger",
  },
  {
    code: "FILMS",
    display: "film",
  },
  {
    code: "MUSIC",
    display: "musik",
  },
];

const unprioritisedMaterialTypeGeneral = [
  {
    code: "ARTICLES",
    display: "artikler",
  },
  {
    code: "NEWSPAPER_JOURNALS",
    display: "aviser og tidsskrifter",
  },
  {
    code: "IMAGE_MATERIALS",
    display: "billedmaterialer",
  },
  {
    code: "BOARD_GAMES",
    display: "brætspil",
  },
  {
    code: "BOOKS",
    display: "bøger",
  },
  {
    code: "EBOOKS",
    display: "e-bøger",
  },
  {
    code: "COMPUTER_GAMES",
    display: "computerspil",
  },
  {
    code: "FILMS",
    display: "film",
  },
  {
    code: "TV_SERIES",
    display: "tv-serier",
  },
  {
    code: "AUDIO_BOOKS",
    display: "lydbøger",
  },
  {
    code: "MUSIC",
    display: "musik",
  },
  {
    code: "SHEET_MUSIC",
    display: "noder",
  },
  {
    code: "PODCASTS",
    display: "podcasts",
  },
  {
    code: "COMICS",
    display: "tegneserier",
  },
  {
    code: "OTHER",
    display: "øvrige",
  },
];
