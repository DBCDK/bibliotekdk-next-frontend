import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

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

const prioritisedLanguages = [
  {
    term: "Dansk",
    key: "dan",
  },
  {
    term: "Engelsk",
    key: "eng",
  },
  {
    term: "Tysk",
    key: "ger",
  },
  {
    term: "Fransk",
    key: "fre",
  },
];

const unprioritisedLanguages = [
  {
    term: "Svensk",
    key: "swe",
  },
  {
    term: "Italiensk",
    key: "ita",
  },
  {
    term: "Spansk",
    key: "spa",
  },
  {
    term: "Hebraisk",
    key: "heb",
  },
  {
    term: "Hindi",
    key: "hin",
  },
  {
    term: "Tjekkisk",
    key: "cze",
  },
  {
    term: "Finsk",
    key: "fin",
  },
  {
    term: "Græsk",
    key: "gre",
  },
  {
    term: "Kroatisk",
    key: "hrv",
  },
  {
    term: "Ungarsk",
    key: "hun",
  },
  {
    term: "Norsk",
    key: "nor",
  },
  {
    term: "Polsk",
    key: "pol",
  },
  {
    term: "Portugisisk",
    key: "por",
  },
  {
    term: "Russisk",
    key: "rus",
  },
  {
    term: "Tyrkisk",
    key: "tur",
  },
  {
    term: "Ukrainsk",
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
