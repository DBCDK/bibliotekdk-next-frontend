/**
 * @file details.utils.js - various helper methods for details section on workpage
 */

import styles from "@/components/work/details/Details.module.css";
import { ParsedCreatorsOrContributors } from "@/lib/manifestationParser";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import { capitalize } from "lodash";
import Link from "@/components/base/link";
import { getCanonicalWorkUrl } from "@/lib/utils";
import { cyKey } from "@/utils/trim";

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
 * @returns [any]
 *  comma seperated string of ALL the languages
 */
function parseLanguages(manifestation) {
  const lanagueges = getLanguageValues(manifestation);

  let flatLanguages = [];
  for (const [, value] of Object.entries(lanagueges)) {
    flatLanguages = [...flatLanguages, ...value];
  }
  // filter out duplicates*/
  return [...new Set(flatLanguages)].join(", ");
}

function getLanguageValues(manifestation) {
  const main =
    manifestation?.languages?.main?.map((mlang) => mlang.display) || [];
  // speken languages - put "dansk" first
  const spoken =
    manifestation?.languages?.spoken
      ?.map((spok) => spok.display)
      .sort((a) => (a === "dansk" || a === "Dansk" ? -1 : 0)) || [];
  // subtitles - put "dansk" first
  const subtitles =
    manifestation?.languages?.subtitles
      .map((sub) => sub.display)
      .sort((a) => (a === "dansk" ? -1 : 0)) || [];

  return { main: main, spoken: spoken, subtitles: subtitles };
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

function parseIsAdaptionOf(manifestation) {
  const work = manifestation?.relations?.isAdaptationOf?.find((rel) =>
    rel?.pid?.startsWith("870970")
  );

  return work;
}

/**
 * jsxParser for movie creators - render function
 * @param values
 * @param skeleton
 * @returns {unknown[]}
 *  jsx element to be parsed by react
 * @constructor
 */

function RenderMovieCreatorValues({ values, skeleton }) {
  return (
    values &&
    values.map((person, index) => {
      return (
        <Link
          href={`/find?q.creator=${person.display}`}
          dataCy={cyKey({ name: person.display, prefix: "overview-genre" })}
          disabled={skeleton}
          border={{ bottom: { keepVisible: true } }}
          key={`"${person.display}-${index}"`}
          className={styles.link}
        >
          <Text type="text4" skeleton={skeleton} lines={0} key={index}>
            {parsePersonAndFunction(person)}
          </Text>
        </Link>
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

function RenderMovieActorValues({ values, skeleton }) {
  console.log(values, values.length, "VALUES");
  const actors = values["skuespillere"] || [];
  const tooLong = actors?.length > 3;

  const actorsToRender = tooLong ? actors.splice(0, 4) : actors;

  console.log(actorsToRender, "VALUES TO RENDER");

  return (
    <>
      <Text type="text3" className={styles.title} skeleton={skeleton} lines={2}>
        Skuespillere
      </Text>
      {actorsToRender.map((person, index) => {
        return (
          <Link
            href={`/find?q.creator=${person.display}`}
            dataCy={cyKey({
              name: person?.display,
              prefix: "overview-genre",
            })}
            disabled={skeleton}
            border={{ bottom: { keepVisible: true } }}
            key={`"${person?.display}-${index}"`}
            className={styles.link}
          >
            <Text type="text4" skeleton={skeleton} lines={0} key={index}>
              {person?.display}
            </Text>
          </Link>
        );
      })}
      {tooLong && (
        <Text type="text4" skeleton={skeleton} lines={0}>
          m.fl.
        </Text>
      )}
    </>
  );
}

function RenderMovieAdaption({ values, skeleton }) {
  const title = values?.titles?.main[0];
  const creators = values?.creators;
  const workurl = getCanonicalWorkUrl({ title, creators, id: values?.workId });

  return (
    workurl && (
      <Link
        disabled={skeleton}
        href={workurl}
        border={{ top: false, bottom: { keepVisible: true } }}
      >
        <Text type="text4" skeleton={skeleton} lines={1}>
          {title}
        </Text>
      </Link>
    )
  );
}

function RenderMovieLanguages({ values, skeleton }) {
  // main is the spoken language ??
  const mainlanguage = values["main"]?.map((sub) => capitalize(sub)).join(", ");
  // get the first 2 languages of the subtitle
  const subtitles =
    values["subtitles"]?.length > 0
      ? values["subtitles"]
          ?.splice(0, 2)
          .map((sub) => capitalize(sub))
          .join(", ")
      : null;

  const spoken =
    values["spoken"]?.length > 0
      ? values["spoken"]
          ?.splice(0, 2)
          .map((sub) => capitalize(sub))
          .join(", ")
      : null;

  const fullstring = `${mainlanguage} tale, synkronisering på ${spoken} og andre sprog, Undertekster på ${subtitles} og andre sprog`;

  return (
    <Text type="text4" skeleton={skeleton} lines={2}>
      {fullstring}
    </Text>
  );
}

function RenderMovieGenre({ values, skeleton }) {
  return values.map((val, index) => (
    <Link
      href={`/find?q.subject=${val}`}
      className={styles.link}
      dataCy={cyKey({ name: val, prefix: "overview-genre" })}
      disabled={skeleton}
      border={{ bottom: { keepVisible: true } }}
      key={`"${val}-${index}"`}
    >
      <Text type="text4" skeleton={skeleton} lines={1}>
        {val}
      </Text>
    </Link>
  ));
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
      // overwrite contributors from base array - add a new one (moviecontributors) for correct order
      {
        contributors: {
          label: "",
          value: "",
        },
      },
      // overwrite default languages - add a new one (movielanguages)
      {
        languages: {
          label: "",
          value: "",
        },
      },
      {
        movielanguages: {
          label: Translate({ ...context, label: "language" }),
          value: getLanguageValues(manifestation),
          jsxParser: RenderMovieLanguages,
        },
      },
      {
        genre: {
          label: "",
          value: "",
        },
      },
      {
        moviegenre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: work?.genreAndForm || [],
          jsxParser: RenderMovieGenre,
        },
      },
      {
        moviecontributors: {
          label: "",
          value: parseMovieContributors(manifestation),
          jsxParser: RenderMovieActorValues,
        },
      },
      {
        creators: {
          label: Translate({ ...context, label: "creators" }),
          value: parseMovieCreators(manifestation),
          jsxParser: RenderMovieCreatorValues,
        },
      },
      {
        audience: {
          label: Translate({ ...context, label: "audience" }),
          value: manifestation?.audience?.generalAudience || "",
        },
      },
      {
        adaption: {
          label: Translate({ ...context, label: "adaption" }),
          value: parseIsAdaptionOf(manifestation),
          jsxParser: RenderMovieAdaption,
        },
      },
    ],
  };
  return filterAndMerge({
    baseArray: fieldsMap["DEFAULT"],
    extendingArray: fieldsMap[materialType],
  });
}

export function filterAndMerge({ baseArray, extendingArray }) {
  // find index in basearray of key in extending array
  extendingArray?.forEach((ext) => {
    const key = Object.keys(ext)[0];
    const baseindex = baseArray?.findIndex(
      (base) => Object.keys(base)[0] === key
    );
    if (baseindex !== -1) {
      baseArray[baseindex] = ext;
    } else {
      baseArray.push(ext);
    }
  });
  return baseArray;
}
