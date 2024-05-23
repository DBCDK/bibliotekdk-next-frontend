import {
  agesFormatterAndComparitor,
  agesIndices,
  publicationYearFormatterAndComparitor,
  publicationYearIndices,
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
};

const specialIndices = new Set([
  DropdownIndicesEnum.PUBLICATION_YEAR,
  DropdownIndicesEnum.AGES,
]);
const specialFormTypes = new Set([FormTypeEnum.ACTION_LINK_CONTAINER]);

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
        ([FormTypeEnum.CHECKBOX, FormTypeEnum.RADIO_BUTTON].includes(
          singleItem.formType
        ) ||
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

function getFacetsForIndex(data, index) {
  const facets = data?.complexSearch?.facets?.find((dat) => dat.name === index);
  return facets?.values || [];
}

function parseForFacets({ data, isLoading, error, index }) {
  const itemForDropDowns = {
    prioritisedItems:
      isLoading || error ? [] : getFacetsForIndex(data, index)?.slice(0, 3),
    prioritisedFormType: FormTypeEnum.CHECKBOX,
    unprioritisedItems:
      isLoading || error ? [] : getFacetsForIndex(data, index),
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
      })
    ),
    indexName: DropdownIndicesEnum.FILMNATIONALITY,
  };

  const publicationYear = {
    items: publicationYearIndices(),
    indexName: DropdownIndicesEnum.PUBLICATION_YEAR,
  };

  // const genreAndForm = {
  //   items: convertToDropdownInput(dummy__genreAndForm()),
  //   indexName: DropdownIndicesEnum.FILM_NATIONALITY,
  // };

  const genreAndForm = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.GENRE,
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
      })
    ),
    indexName: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC,
  };

  // const generalMaterialTypes = {
  //   items: convertToDropdownInput(dummy__generalmaterialTypes()),
  //   indexName: DropdownIndicesEnum.MATERIAL_TYPES_GENERAL,
  // };

  const languages = {
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.MAINLANGUAGES,
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
    items: convertToDropdownInput(
      parseForFacets({
        data: facetResponse,
        isLoading,
        error,
        index: DropdownIndicesEnum.PEGI,
      })
    ),
    indexName: DropdownIndicesEnum.PEGI,
  };

  const types = {
    //all: DONE
    all: [genreAndForm, languages, publicationYear, ages].map((dropdownUnit) =>
      getDropdownFromUrl({
        initDropdowns: initDropdowns,
        dropdownUnit: dropdownUnit,
      })
    ),
    // literature: DONE
    literature: [
      specificMaterialTypes,
      genreAndForm,
      languages,
      publicationYear,
      ages,
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
      languages,
      publicationYear,
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
      filmnationality,
      publicationYear,
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
    game: [gamePlatform, genreAndForm, ages, pegi, publicationYear].map(
      (dropdownUnit) =>
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
  // The init dropdown holds the dropdowns configured (selected) - if a selected dropdown is NOT
  // in types we return it to be deleted from url :)
  const toRemove = initDropdowns.filter(
    (drop) =>
      !!!types[workType].find((type) => type.indexName === drop.searchIndex)
  );

  return {
    dropdownUnits: types[workType] || types["all"],
    dropdownsToRemove: toRemove,
  };
}
