/**
 * @file details.utils.js - various helper methods for details section on workpage
 */

import styles from "@/components/work/details/Details.module.css";
import { ParsedCreatorsOrContributors } from "@/lib/manifestationParser";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";

function CreatorContributorTextHelper({ children }) {
  return (
    <span
      data-cy={"creator-contributor-text-helper"}
      className={styles.creatorContributorTextHelper}
    >
      {children}
    </span>
  );
}

/**
 * Parse languages in given manifestation.
 * split languages in main, spoken, subtitles.
 * @param manifestation
 * @returns {string}
 *  comma seperated string of ALL the languages
 */
function parseLanguages(manifestation) {
  // languages - main + subtitles + spoken - useMemo for performance;
  const main =
    manifestation?.languages?.main?.map((mlang) => mlang.display) || [];
  const spoken =
    manifestation?.languages?.spoken?.map((spok) => spok.display) || [];
  const subtitles =
    manifestation?.languages?.subtitles.map((sub) => sub.display) || [];
  const mixed = [...main, ...spoken, ...subtitles];
  // filter out duplicates
  return [...new Set(mixed)].join(", ");
}

/**
 * Genre and form from given work.
 * @param work
 * @returns {string}
 *  comma seperated string.
 */
function parseGenreAndForm(work) {
  const genreForm = work?.genreAndForm || [];
  return genreForm.join(", ");
}

/**
 * Physical description of given manifestations.
 * @param manifestation
 * @returns {string | undefined}
 *  description summary (ies) seperated by space
 */
function parsePhysicalDescriptions(manifestation) {
  return manifestation?.physicalDescriptions
    ?.map((description) => description.summary)
    .join(" ");
}

/**
 * Creators AND contributors for given manifestation
 * @param manifestation
 * @returns {false|JSX.Element}
 */
function parseContributors(manifestation) {
  const contributors = [
    ...(manifestation?.creators || []),
    ...(manifestation?.contributors || []),
  ];

  return (
    contributors?.length > 0 && (
      <ParsedCreatorsOrContributors
        creatorsOrContributors={contributors}
        Tag={CreatorContributorTextHelper}
      />
    )
  );
}

/**
 * Contributors for given manifestation.
 * For some cases we need to split creators and contributors (eg movies)
 * @param manifestation
 * @returns {{}|null}
 */
function parseMovieContributors(manifestation) {
  const actors = manifestation?.contributors?.filter((cont) =>
    cont?.roles?.find((rol) => rol.functionCode === "act")
  );

  const others =
    manifestation?.contributors?.manifestation?.contributors?.filter((cont) =>
      cont?.roles?.find((rol) => rol.functionCode !== "act")
    );
  const actorslabel =
    actors?.length > 1
      ? actors?.[0]?.roles?.[0]?.function?.plural
      : actors?.[0]?.roles?.[0]?.function?.singular;

  const returnObject = {};

  // check if any values
  if (isEmpty(actors) && isEmpty(others)) {
    return null;
  }

  returnObject[actorslabel] = actors?.length > 0 ? actors : null;
  returnObject["ophav"] = others?.length > 0 ? others : null;

  return returnObject;
}

/**
 * Creators for given manifestation
 * @param manifestation
 * @returns {*|null}
 */
function parseMovieCreators(manifestation) {
  return manifestation?.creators || null;
}

/**
 * Map a single person ({disploy{roles[{function, functioncode}]}}
 * @param person
 * @returns {*}
 *  a string "disploy (function)" .. eg "ebbe fisk (instruktør)"
 */
function parsePersonAndFunction(person) {
  const display = person?.display;
  const roles = person?.roles?.map((role) => role?.function?.singular || "");
  return display + (roles.length > 0 ? " (" + roles.join(", ") + ")" : "");
}

/**
 * jsxParser for movie creators
 * @param values
 * @param skeleton
 * @returns {unknown[]}
 *  jsx element to be parsed by react
 * @constructor
 */
function MovieCreatorValues({ values, skeleton }) {
  return (
    values &&
    values.map((person, index) => {
      return (
        <Text type="text4" skeleton={skeleton} lines={0} key={index}>
          {parsePersonAndFunction(person)}
        </Text>
      );
    })
  );
}

/**
 * jsxParser for movies - contributors. Parse given values for html output - @see parseMovieContributors for given values
 * @param values {object}
 *  eg. {skuespillere:["jens", "hans", ..], ophav:["kurt", ...]}
 * @param skeleton
 * @returns {any[]}
 * @constructor
 */
function MovieContributorValues({ values, skeleton }) {
  return Object.keys(values).map(
    (val) =>
      values[val] && (
        <>
          <Text
            type="text3"
            className={styles.title}
            skeleton={skeleton}
            lines={2}
          >
            {val}
          </Text>
          {values[val].map((person, index) => {
            return (
              <Text type="text4" skeleton={skeleton} lines={0} key={index}>
                {person?.display}
              </Text>
            );
          })}
        </>
      )
  );
}

/**
 * Main method for retrieving fields to show in details section on workpage.
 * Configurable arrays for different materialtypes - the fieldsMap holds array of
 * configured objects to be shown - the DEFAULT is the base and may be overwritten if desired.
 *
 * example: to overwrite the languages object in the DEFAULT array with another definition for
 * works with materialType MUSIC make another array like this:
 * MUSIC: [
 *       {
 *         languages: {
 *           label: "label for MUSIC materialtypes",
 *           value: "values for MUSIC materialtypes",
 *         },
 *       },
 *     ],
 * fields are shown in the order of the objects
 *
 * For more complicated valued you may pass a jsx parser and thus overwrite the
 * default presentation like this:
 *
 * MUSIC: [
 *       {
 *         languages: {
 *           label: "label for MUSIC materialtypes",
 *           value: "values for MUSIC materialtypes",
 *           jsxParser: MovieLanguageValues,
 *         }
 *       }
 *       ]

 * To disable a field from the DEFAULT array overwrite with an empty value eg:
 *      {
 *         languages: {
 *           label: "hundeprut",
 *           value: "",
 *         },
 *       },
 *
 * @param manifestation
 * @param work
 * @param context
 * @returns {*[]}
 */
export function fieldsForRows(manifestation, work, context) {
  const materialType = work?.workTypes?.[0] || null;

  const fieldsMap = {
    DEFAULT: [
      {
        languages: {
          label: Translate({ ...context, label: "language" }),
          value: parseLanguages(manifestation),
        },
      },
      {
        physicalDescriptions: {
          label: Translate({ ...context, label: "physicalDescription" }),
          value: parsePhysicalDescriptions(manifestation),
        },
      },
      {
        publicationYear: {
          label: Translate({ ...context, label: "released" }),
          value: manifestation?.edition?.publicationYear?.display || "",
        },
      },
      {
        contributors: {
          label: Translate({ ...context, label: "contribution" }),
          value: parseContributors(manifestation),
        },
      },
      {
        genre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: parseGenreAndForm(work),
        },
      },
      {
        hundeprut: {
          label: "hundeprut",
          value: "",
        },
      },
    ],
    MUSIK: [
      {
        genre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: "hest",
        },
      },
    ],
    MOVIE: [
      {
        contributors: {
          label: "",
          value: parseMovieContributors(manifestation),
          jsxParser: MovieContributorValues,
        },
      },
      {
        creators: {
          label: Translate({ ...context, label: "creators" }),
          value: parseMovieCreators(manifestation),
          jsxParser: MovieCreatorValues,
        },
      },
    ],
  };

  const merged = [
    ...fieldsMap["DEFAULT"].filter((def) => {
      const fisk =
        fieldsMap[materialType] &&
        fieldsMap[materialType].find((mat) => mat[Object.keys(def)[0]]);
      return !fisk;
    }),
    ...(fieldsMap[materialType] || []),
  ];

  return merged;
}
