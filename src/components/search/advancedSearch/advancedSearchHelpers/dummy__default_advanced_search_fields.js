import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import Translate, { getLanguage } from "@/components/base/translate";
import { getFirstMatch } from "@/lib/utils";
import { DropdownIndicesEnum } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";

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
