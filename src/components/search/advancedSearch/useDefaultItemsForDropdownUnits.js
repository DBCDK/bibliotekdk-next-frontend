import {
  agesFormatterAndComparitor,
  agesIndices,
  dummy__nota,
  dummy__pegi,
  publicationYearFormatterAndComparitor,
  publicationYearIndices,
  dummy__players,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";
import { convertToDropdownInput } from "@/components/search/advancedSearch/advancedSearchHelpers/convertToDropdownInput";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import isEmpty from "lodash/isEmpty";
import { useComplexSearchFacets } from "@/components/search/advancedSearch/useComplexSearchFacets";

export const DropdownIndicesEnum = {
  MAINLANGUAGES: "phrase.mainlanguage",
  MATERIAL_TYPES_SPECIFIC: "phrase.specificmaterialtype",
  MATERIAL_TYPES_GENERAL: "phrase.generalmaterialtype",
  PUBLICATION_YEAR: "publicationyear",
  AGES: "ages",
  GENRE: "phrase.genreandform",
  FILMNATIONALITY: "phrase.filmnationality",
  GAMEPLATFORM: "phrase.gameplatform",
  PLAYERS: "phrase.players",
  PEGI: "phrase.pegi",
  GENERALAUDIENCE: "phrase.generalaudience",
  NOTA: "nota", //this is not an index in complex search. It will be converted to an index when state is converted to cql. The index used is term.source.
};

const specialIndices = new Set([
  DropdownIndicesEnum.PUBLICATION_YEAR,
  DropdownIndicesEnum.AGES,
]);
const specialFormTypes = new Set([FormTypeEnum.ACTION_LINK_CONTAINER]);

const prioritized = {
  all: {
    MAINLANGUAGES: [
      "dansk",
      "engelsk",
      "tysk",
      "fransk",
      "svensk",
      "norsk",
      "færøsk",
      "grønlandsk",
      "arabisk",
      "ukrainsk",
    ],
    GENRE: [
      "roman",
      "noveller",
      "digte",
      "biografier",
      "tv-serier",
      "dokumentarfilm",
      "børnefilm",
      "drama",
      "actionfilm",
      "rock",
      "jazz",
      "pop",
      "shooters",
      "actionspil",
      "adventurespil",
    ],
  },
  literature: {
    MAINLANGUAGES: [
      "dansk",
      "engelsk",
      "tysk",
      "fransk",
      "svensk",
      "norsk",
      "færøsk",
      "grønlandsk",
      "arabisk",
      "ukrainsk",
    ],
    MATERIAL_TYPES_SPECIFIC: [
      "bog",
      "e-bog",
      "lydbog (online)",
      "lydbog (cd)",
      "lydbog (cd-mp3)",
      "billedbog",
      "tegneserie",
      "graphic novel",
      "bog stor skrift",
    ],
    GENRE: [
      "roman",
      "noveller",
      "digte",
      "biografier",
      "krimi",
      "fantasy",
      "spænding",
      "romantik",
      "humor",
      "strikkeopskrifter",
      "opskrifter",
      "rejseguides",
    ],
  },
  article: {
    MATERIAL_TYPES_SPECIFIC: ["artikel", "artikel (online)"],
    MAINLANGUAGES: [
      "dansk",
      "engelsk",
      "tysk",
      "fransk",
      "svensk",
      "norsk",
      "færøsk",
      "grønlandsk",
      "arabisk",
      "ukrainsk",
    ],
    GENRE: [
      "kronikker",
      "interviews",
      "essays",
      "rejsebeskrivelser",
      "erindringer",
      "nekrologer",
      "noveller",
      "digte",
      "tests",
      "opskrifter",
    ],
  },
  movie: {
    MATERIAL_TYPES_SPECIFIC: [
      "film (online)",
      "film (dvd)",
      "film (blu-ray)",
      "film (blu-ray 3d)",
      "film (blu-ray 4k)",
      "tv-serie (online)",
      "tv-serie (dvd)",
      "tv-serie (blu-ray)",
      "tv-serie (blu-ray 4k)",
      "musik (dvd)",
      "musik (blu-ray)",
    ],
    FILMNATIONALITY: [
      "danske film",
      "amerikanske film",
      "engelske film",
      "franske film",
      "tyske film",
      "italienske film",
      "svenske film",
      "norske film",
      "japanske film",
    ],
    GENRE: [
      "TV-serier",
      "dokumentarfilm",
      "børnefilm",
      "tegnefilm",
      "drama",
      "komedier",
      "krimi",
      "science fiction",
      "actionfilm",
      "thriller",
    ],
  },
  music: {
    MATERIAL_TYPES_SPECIFIC: [
      "musik (cd)",
      "musik (grammofonplade)",
      "musik (dvd)",
      "film (dvd)",
    ],
    GENRE: [
      "rock",
      "jazz",
      "pop",
      "klassisk musik 1950 ->",
      "folk",
      "hip hop",
      "electronica",
      "metal",
      "folkemusik",
      "country",
      "singer/songwriter",
    ],
  },
  game: {
    GAMEPLATFORM: [
      "playstation 5",
      "playstation 4",
      "xbox series X",
      "xbox one",
      "nintendo switch",
    ],
    GENRE: [
      "shooters",
      "actionspil",
      "adventurespil",
      "rollespil",
      "simulationsspil",
      "strategispil",
      "racerspil",
      "platformsspil",
    ],
  },
  sheetmusic: {
    MAINLANGUAGES: [
      "dansk",
      "engelsk",
      "tysk",
      "fransk",
      "svensk",
      "norsk",
      "færøsk",
      "grønlandsk",
      "arabisk",
      "ukrainsk",
    ],
    GENERALAUDIENCE: [
      "for begyndere",
      "for let øvede",
      "for øvede",
      "for musikskoler",
      "for folkeskolen",
    ],
  },
};
/**
 * If there is a fieldSearch.dropdownSearchIndices, this function
 *   enriches the dropdownUnit with its isSelected
 * @param {Array.<DropdownSearchIndex>} initDropdowns
 * @param {DropdownUnit} dropdownUnit
 * @returns {DropdownUnit}
 */
function getDropdownFromUrl({ initDropdowns, dropdownUnit }) {
  // Get the single dropdownUnit from initial value (be it from url or as a new initial dropdown value)
  const actualSearchIndex = initDropdowns.find(
    (initDropdown) => initDropdown?.searchIndex === dropdownUnit.indexName
  );

  // If the actualSearchIndex is not the same as dropdownUnit's indexName
  //   we expect the dropdownUnit to be as default value (where no items has isSelected===true)
  //   Also if value is empty, we expect the same behavior
  if (!actualSearchIndex || isEmpty(actualSearchIndex.value)) {
    return dropdownUnit;
  }

  // We enrich the dropdownUnit with the value from initialDropdowns (be it url or a new intial dropdown)
  const enrichedDropdownUnit = dropdownUnit.items.map((singleItem) => {
    const actualSearchIndexName = actualSearchIndex?.value?.find(
      (val) => val.name === singleItem.name
    );

    // We check if we are looking at special (non-standard) indices and formTypes
    //  If so, we need to add values to specific dropdownItems
    if (
      actualSearchIndexName &&
      specialIndices.has(actualSearchIndex.searchIndex) &&
      specialFormTypes.has(singleItem.formType)
    ) {
      return {
        ...singleItem,
        value: actualSearchIndex?.value?.[0]?.value,
        isSelected: true,
      };
    }

    return {
      ...singleItem,
      isSelected:
        ([
          FormTypeEnum.CHECKBOX,
          FormTypeEnum.RADIO_BUTTON,
          FormTypeEnum.RADIO_SELECT,
        ].includes(singleItem.formType) ||
          ([FormTypeEnum.RADIO_LINK].includes(singleItem.formType) &&
            !isEmpty(singleItem.value))) &&
        actualSearchIndex.value
          .map((val) => val.name)
          .includes(singleItem?.name),
    };
  });

  return {
    indexName: dropdownUnit.indexName,
    items: /** @type DropdownInputArray */ enrichedDropdownUnit,
  };
}

export function formattersAndComparitors(indexName) {
  const withFormatters = {
    [DropdownIndicesEnum.PUBLICATION_YEAR]:
      publicationYearFormatterAndComparitor,
    [DropdownIndicesEnum.AGES]: agesFormatterAndComparitor,
  };

  const specificFormatter = withFormatters?.[indexName];

  return {
    getComparator: !!specificFormatter?.getComparator
      ? specificFormatter?.getComparator
      : // eslint-disable-next-line no-unused-vars
        (value) => "=",
    getFormatValue: !!specificFormatter?.getFormatValue
      ? specificFormatter?.getFormatValue
      : (value) => value,
    getPrintValue: !!specificFormatter?.getPrintValue
      ? specificFormatter?.getPrintValue
      : (value) => value,
    getSelectedPresentation: !!specificFormatter?.getSelectedPresentation
      ? specificFormatter?.getSelectedPresentation
      : (value) => value,
  };
}

function getFacetsForIndex(data, index, ontop) {
  // we look for an index - facets comes with the name facet.<index> .. dropdown enums comes like phrase.<index>
  // split and look .. hopefully no fuckups
  const facets = data?.complexFacets?.facets?.find((dat) => {
    return dat.name.split(".")[1] === index.split(".")[1];
  });

  const facetValues = facets?.values ? [...facets?.values] : [];
  // we filter out facet values with a score lower than 3
  const enrichedFacetValues = facetValues.filter((fac) => fac.score > 3);

  ontop.forEach((prio) => {
    if (!!!facets?.values?.find((fac) => fac.key === prio)) {
      // insert missing item .. whereever in array .. it is sorted later
      enrichedFacetValues?.splice(0, 0, { key: prio });
    }
  });
  return enrichedFacetValues || [];
}

/**
 * Parse given data for facets.
 * @param data
 * @param isLoading
 * @param error
 * @param index
 * @param workType
 * @returns Object
 *  To be passed to convertToDropdownInput function @see /search/advancedSearch/acvancedSearchHelpers/convertToDropdownInput.js
 *  eg.
 * {
 *     prioritisedItems: [],
 *     prioritisedFormType: FormTypeEnum.CHECKBOX,
 *     unprioritisedItems: [],
 *     unprioritisedFormType: FormTypeEnum.CHECKBOX,
 *     overrideValueAs: "name",
 *   }
 */
function parseForFacets({ data, isLoading, error, index, workType }) {
  const key = Object.keys(DropdownIndicesEnum).find(
    (dropdown) => DropdownIndicesEnum[dropdown] === index
  );

  // proritized items to put in top of list
  const prio = prioritized[workType]?.[key] || [];
  // reverse array .. without modifying original - for sorting :)
  const ontop = [...prio].reverse();

  let facets = [];
  if (ontop) {
    facets = getFacetsForIndex(data, index, ontop)?.sort(
      (a, b) => ontop.indexOf(b.key) - ontop.indexOf(a.key)
    );
  }
  const itemForDropDowns = {
    prioritisedItems:
      isLoading || error ? [] : facets?.slice(0, ontop?.length || 3),
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems:
      isLoading || error
        ? []
        : facets
            ?.slice(ontop?.length || 3, facets?.length)
            .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)),
    unprioritisedFormType: FormTypeEnum.CHECKBOX,
    overrideValueAs: "name",
  };

  return itemForDropDowns;
}
/**
 *
 * @param initDropdowns
 * @returns {Array.<DropdownUnit>}
 */
export function useDefaultItemsForDropdownUnits({ initDropdowns }, workType) {
  const { facetResponse, isLoading, error } = useComplexSearchFacets(workType);

  const filmnationality = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.FILMNATIONALITY,
        workType,
      })
    ),
    indexName: DropdownIndicesEnum.FILMNATIONALITY,
  };

  const publicationYear = {
    items: publicationYearIndices(),
    indexName: DropdownIndicesEnum.PUBLICATION_YEAR,
  };

  const genreAndForm = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.GENRE,
        workType,
      })
    ),
    indexName: DropdownIndicesEnum.GENRE,
  };

  const specificMaterialTypes = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC,
        workType,
      })
    ),
    indexName: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC,
  };

  const languages = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.MAINLANGUAGES,
        workType,
      })
    ),
    indexName: DropdownIndicesEnum.MAINLANGUAGES,
  };

  const ages = {
    items: agesIndices(),
    indexName: DropdownIndicesEnum.AGES,
  };

  const gamePlatform = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.GAMEPLATFORM,
        workType,
      })
    ),
    indexName: DropdownIndicesEnum.GAMEPLATFORM,
  };

  const generalAudience = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.GENERALAUDIENCE,
        workType,
      })
    ),
    indexName: DropdownIndicesEnum.GENERALAUDIENCE,
  };

  // will be used at a later time
  // const players = {
  //   items: convertToDropdownInput(dummy__players()),
  //   indexName: DropdownIndicesEnum.PLAYERS,
  // };

  const pegi = {
    items: convertToDropdownInput(dummy__pegi()),
    indexName: DropdownIndicesEnum.PEGI,
    showSearchBar: false,
  };

  const nota = {
    items: convertToDropdownInput(dummy__nota()),
    indexName: DropdownIndicesEnum.NOTA,
    showSearchBar: false,
    infoBarLabel: "tooltip_nota_info",
  };

  const players = {
    items: convertToDropdownInput(dummy__players()),
    indexName: DropdownIndicesEnum.PLAYERS,
    showSearchBar: false,
  };

  const types = {
    //all: DONE
    all: [genreAndForm, languages, publicationYear, ages, nota].map(
      (dropdownUnit) =>
        getDropdownFromUrl({
          initDropdowns: initDropdowns,
          dropdownUnit: dropdownUnit,
        })
    ),
    // literature: DONE
    literature: [
      specificMaterialTypes,
      genreAndForm,
      publicationYear,
      languages,
      ages,
      nota,
    ].map((dropdownUnit) => {
      return getDropdownFromUrl({
        initDropdowns: initDropdowns,
        dropdownUnit: dropdownUnit,
      });
    }),
    // @TODO: issue.date ? - there is no such index :)
    article: [
      specificMaterialTypes,
      genreAndForm,
      publicationYear,
      languages,
      nota,
    ].map((dropdownUnit) =>
      getDropdownFromUrl({
        initDropdowns: initDropdowns,
        dropdownUnit: dropdownUnit,
      })
    ),
    // movie: DONE
    movie: [
      specificMaterialTypes,
      genreAndForm,
      publicationYear,
      filmnationality,
      ages,
    ].map((dropdownUnit) =>
      getDropdownFromUrl({
        initDropdowns: initDropdowns,
        dropdownUnit: dropdownUnit,
      })
    ),
    // music: DONE
    music: [specificMaterialTypes, genreAndForm, publicationYear].map(
      (dropdownUnit) =>
        getDropdownFromUrl({
          initDropdowns: initDropdowns,
          dropdownUnit: dropdownUnit,
        })
    ),
    //@TODO .. something is not right - players always makes a zero search ??
    game: [
      gamePlatform,
      genreAndForm,
      publicationYear,
      ages,
      pegi,
      players,
    ].map((dropdownUnit) =>
      getDropdownFromUrl({
        initDropdowns: initDropdowns,
        dropdownUnit: dropdownUnit,
      })
    ),
    sheetmusic: [languages, generalAudience].map((dropdownUnit) =>
      getDropdownFromUrl({
        initDropdowns: initDropdowns,
        dropdownUnit: dropdownUnit,
      })
    ),
  };
  return {
    dropdownUnits: types[workType] || types["all"],
  };
}
