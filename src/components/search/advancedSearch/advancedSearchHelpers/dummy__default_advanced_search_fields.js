import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

export function dummy__languages() {
  return {
    prioritisedItems: prioritisedLanguages,
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems: unprioritisedLanguages,
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
  };
}

export function dummy__materialTypesSpecific() {
  return {
    prioritisedItems: prioritisedMaterialTypeSpecific,
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems: unprioritisedMaterialTypeSpecific,
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
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
