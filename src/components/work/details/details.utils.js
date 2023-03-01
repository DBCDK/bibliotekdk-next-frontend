/**
 * @file details.utils.js - various helper methods for details section on workpage
 */

import styles from "@/components/work/details/Details.module.css";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import capitalize from "lodash/capitalize";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
/**
 * Parse languages in given manifestation.
 * split languages in main, spoken, subtitles.
 * @param manifestation
 * @returns [any]
 *  comma seperated string of ALL the languages
 */
function parseLanguages(manifestation) {
  const languages = getLanguageValues(manifestation);

  let flatLanguages = [];
  for (const [, value] of Object.entries(languages)) {
    flatLanguages = [...flatLanguages, ...value];
  }
  // filter out duplicates*/
  return [...new Set(flatLanguages)].join(", ");
}

/**
 * Get languages from given manifestion. We sort with "Dansk" first.
 * @param manifestation
 * @returns {{subtitles: (*|*[]), spoken: (*|*[]), main: (*|*[])}}
 */
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
      .sort((a) => (a === "dansk" || a === "Dansk" ? -1 : 0)) || [];

  if (isEmpty(main) && isEmpty(spoken) && isEmpty(subtitles)) {
    return {};
  }
  return { main: main, spoken: spoken, subtitles: subtitles };
}

/**
 * Physical description of given manifestations (summary).
 * @param manifestation
 * @returns {string | undefined}
 *  description summary (ies) seperated by space
 */
function parsePhysicalDescriptions(manifestation) {
  return manifestation?.physicalDescriptions?.map(
    (description) => description.summary
  );
}

function getRequirementsFromPhysicalDesc(manifestation) {
  return manifestation?.physicalDescriptions?.map(
    (description) => description.requirements
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
function getCreators(manifestation) {
  return manifestation?.creators || null;
}

function getCreatorsAndContributors(manifestation) {
  const creators = manifestation?.creators || [];
  const contributors = manifestation?.contributors || [];

  return [...creators, ...contributors];
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
  return display + (roles?.length > 0 ? " (" + roles?.join(", ") + ") " : "");
}

/**
 * Get óne work with the relation of type adaption - we want the DBC work - so we look
 * for pid that starts with 870970
 * @param manifestation
 * @returns {*}
 *
 * @TODO - this one is  outcommented while we wait for data to be fixed
 */
// function parseIsAdaptionOf(manifestation) {
//   console.log(manifestation, "MANIFESTATIONS");
//
//   const work = manifestation?.relations?.isAdaptationOf?.find((rel) =>
//     rel?.pid?.startsWith("870970")
//   );
//
//   const unique = [
//     ...new Set(
//       manifestation?.relations?.isAdaptationOf?.map((item) => item.workId)
//     ),
//   ];
//
//   //return [];
//
//   const adaptations = manifestation?.relations?.isAdaptationOf?.filter(
//     (rel) =>
//       rel.pid.indexOf("870970") !== -1 && rel.workId.indexOf("870970") !== -1
//   );
//
//   console.log(adaptations, "ADAPTIONS");
//
//   const result = [];
//   const map = new Map();
//   if (adaptations) {
//     for (const item of adaptations) {
//       if (!map.has(item.workId)) {
//         map.set(item.workId, true); // set any value to Map
//         result.push({
//           id: item.workId,
//           item,
//         });
//       }
//     }
//   }
//   console.log(result, "RESULT");
//   return result;
//
//   //return work;
// }

/**
 * jsxParser for creators - render function
 * @param values
 * @param skeleton
 * @returns {unknown[]}
 *  jsx element to be parsed by react
 * @constructor
 */

function RenderCreatorValues({ values, skeleton }) {
  const length = values?.length;
  // we want at most 4 contributors
  const valuesToRender = length > 4 ? values.splice(0, 4) : values;
  return (
    valuesToRender && (
      <div data-cy={"creator-contributor-text-helper"}>
        {valuesToRender.map((person, index) => (
          <>
            <Link
              href={`/find?q.creator=${person.display}`}
              dataCy={cyKey({
                name: person.display,
                prefix: "details-creatore",
              })}
              disabled={skeleton}
              border={{ bottom: { keepVisible: true } }}
              key={`crators-${index}`}
              className={styles.link}
            >
              <Text type="text4" skeleton={skeleton} lines={0} key={index}>
                {parsePersonAndFunction(person)}
              </Text>
            </Link>
          </>
        ))}
        {length > 4 && (
          <Text type="text4" skeleton={skeleton} lines={0}>
            m.fl
          </Text>
        )}
      </div>
    )
  );
}

/**
 * jsxParser for movies - actors. Parse given values for html output - @see parseMovieContributors for given values
 * @param values {object}
 *  eg. {skuespillere:["jens", "hans", ..], ophav:["kurt", ...]}
 * @param skeleton
 * @returns {any[]}
 * @constructor
 */

function RenderMovieActorValues({ values, skeleton }) {
  const actors = values["skuespillere"] || values["skuespiller"] || [];
  // check if there are too many to display - we want to display at most 4.
  const tooLong = actors?.length > 3;
  const actorsToRender = tooLong ? actors.splice(0, 4) : actors;
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
            key={`actors-${index}`}
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

/**
 * Render adaption (movie based on .. a book or something)
 * We give a link to the material the movie is  base on.
 * @param values
 * @param skeleton
 * @returns {""|JSX.Element}
 * @constructor
 */
// function RenderMovieAdaption({ values, skeleton }) {
//   return values?.map((work) => {
//
//     const title = work?.item?.titles?.main[0];
//     const creators = work?.item?.creators;
//     const workurl = getCanonicalWorkUrl({
//       title,
//       creators,
//       id: work?.item?.workId,
//     });
//     return (
//       workurl && (
//         <Link
//           disabled={skeleton}
//           href={workurl}
//           border={{ top: false, bottom: { keepVisible: true } }}
//           className={styles.link}
//         >
//           <Text type="text4" skeleton={skeleton} lines={1}>
//             {title}
//           </Text>
//         </Link>
//       )
//     );
//   });
// }

function RenderGameLanguages({ values }) {
  // main is the spoken language ??
  const mainlanguage =
    values["main"].length > 0
      ? values["main"]
          ?.splice(0, 2)
          .map((sub) => capitalize(sub))
          .join(", ")
      : null;

  const fullstring = mainlanguage
    ? `Vejledning på ${mainlanguage} ${
        values["main"].length > 0 ? "og andre sprog" : ""
      }`
    : "";

  return (
    fullstring && (
      <Text type="text4" lines={2}>
        {fullstring}
      </Text>
    )
  );
}

/**
 * We want a special display for movies - like subtitles and synchronization.
 * @param values
 * @param skeleton
 * @returns {JSX.Element}
 * @constructor
 */
function RenderMovieLanguages({ values, skeleton }) {
  // get the first 2 languages of the subtitle
  const subtitles =
    values["subtitles"]?.length > 0
      ? values["subtitles"]
          ?.splice(0, 2)
          .map((sub) => capitalize(sub))
          .join(", ")
      : null;

  const subtitlesAsString = subtitles
    ? `Undertekster på ${subtitles} ${
        values["subtitles"]?.length > 1 ? "og andre sprog" : ""
      }`
    : "";

  // spoken is synchronized languages
  const spoken =
    values["spoken"]?.length > 0
      ? values["spoken"]
          ?.splice(0, 2)
          .map((sub) => capitalize(sub))
          .join(", ")
      : null;
  let spokenAsString = spoken
    ? `synkronisering på ${spoken} ${
        values["spoken"]?.length > 1 ? "og andre sprog" : ""
      }`
    : "";
  spokenAsString += spokenAsString && subtitlesAsString ? "," : "";

  // main is the spoken language ??
  let mainlanguage = values["main"]?.map((sub) => capitalize(sub)).join(", ");
  mainlanguage = mainlanguage ? mainlanguage + " tale " : "";
  mainlanguage += subtitlesAsString || spokenAsString ? "," : "";

  const fullstring = `${mainlanguage} ${spokenAsString} ${subtitlesAsString}`;

  return (
    <Text type="text4" skeleton={skeleton} lines={2}>
      {fullstring}
    </Text>
  );
}

/**
 * Link to the genre of the movie.
 * @param values
 * @param skeleton
 * @returns {*}
 * @constructor
 */
function RenderGenre({ values, skeleton }) {
  return values.map((val, index) => (
    <>
      <Link
        href={`/find?q.subject=${val}`}
        dataCy={cyKey({ name: val, prefix: "overview-genre" })}
        disabled={skeleton}
        border={{ bottom: { keepVisible: true } }}
        key={`${val}-${index}`}
      >
        <Text type="text4" skeleton={skeleton} lines={1}>
          {val}
        </Text>
      </Link>
      <span>{index < values.length - 1 ? ", " : ""}</span>
    </>
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
          value: getCreatorsAndContributors(manifestation),
          jsxParser: RenderCreatorValues,
        },
      },
      {
        genre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: work?.genreAndForm || [],
          jsxParser: RenderGenre,
        },
      },
      {
        hundeprut: {
          label: "hundeprut",
          value: "",
        },
      },
    ],
    GAME: [
      // remove genre - we want it first
      {
        genre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: "",
        },
      },
      {
        languages: {
          label: Translate({ ...context, label: "language" }),
          value: getLanguageValues(manifestation),
          jsxParser: RenderGameLanguages,
        },
      },
      {
        gamegenre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: work?.genreAndForm || [],
          jsxParser: RenderGenre,
          index: 0,
        },
      },
      {
        audience: {
          label: Translate({ ...context, label: "game-audience" }),
          value: manifestation?.audience?.generalAudience || "",
        },
      },
      {
        requirements: {
          label: Translate({ ...context, label: "game-requirements" }),
          value: getRequirementsFromPhysicalDesc(manifestation) || "",
        },
      },
    ],
    OTHER: [
      // remove genre - we want it first
      {
        genre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: "",
        },
      },
      {
        languages: {
          label: Translate({ ...context, label: "language" }),
          value: getLanguageValues(manifestation),
          jsxParser: RenderGameLanguages,
        },
      },
      {
        gamegenre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: work?.genreAndForm || [],
          jsxParser: RenderGenre,
          index: 0,
        },
      },
      {
        audience: {
          label: Translate({ ...context, label: "other-audience" }),
          value:
            manifestation?.audience?.generalAudience?.join(", ") ||
            manifestation?.audience?.childrenOrAdults
              ?.map((dis) => {
                return dis.display;
              })
              .join(", ") ||
            "",
        },
      },
    ],
    LITERATURE: [
      {
        hasadaption: {
          label: Translate({ ...context, label: "hasadaption" }),
          value: "",
          // value: manifestation?.relations?.hasAdaptation?.find((rel) =>
          //   rel?.pid?.startsWith("870970")
          // ),
          // jsxParser: RenderMovieAdaption,
        },
      },
      {
        firstEdition: {
          label: Translate({ ...context, label: "firstEdition" }),
          value:
            work?.manifestations?.first?.edition?.publicationYear?.display ||
            "",
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
          jsxParser: RenderGenre,
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
          value: getCreators(manifestation),
          jsxParser: RenderCreatorValues,
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
          value: "", // @TODO removed this one for now - data is fucked up parseIsAdaptionOf(manifestation),
          // jsxParser: RenderMovieAdaption,
        },
      },
    ],
  };
  return filterAndMerge({
    baseArray: fieldsMap["DEFAULT"],
    extendingArray: fieldsMap[materialType],
  });
}

/**
 * Merge given arrays - keys in extending array overwrites keys in base array.
 * If an index is given in object it is inserted as desired.
 * New keys are appended to base arrray.
 * @param baseArray
 * @param extendingArray
 * @returns {*}
 */
export function filterAndMerge({ baseArray, extendingArray }) {
  // find index in basearray of key in extending array
  extendingArray?.forEach((ext) => {
    const key = Object.keys(ext)[0];
    const desiredIndex =
      ext[key]?.index || ext[key]?.index === 0 ? ext[key]?.index : false;

    const baseindex = baseArray?.findIndex(
      (base) => Object.keys(base)[0] === key
    );
    if (baseindex !== -1) {
      baseArray[baseindex] = ext;
    } else if (desiredIndex !== false) {
      baseArray.splice(desiredIndex, 0, ext);
    } else {
      baseArray.push(ext);
    }
  });
  return baseArray;
}
