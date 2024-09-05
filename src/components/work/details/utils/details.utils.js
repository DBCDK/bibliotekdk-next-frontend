/**
 * @file details.utils.js - various helper methods for details section on workpage
 */

import styles from "./details.utils.module.css";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import capitalize from "lodash/capitalize";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import Image from "@/components/base/image";
import { toLower } from "lodash/toLower";
import { parseFunction } from "@/lib/centralParsers.utils";
import { getAudienceValues } from "./export.utils";
import { getAdvancedUrl } from "@/components/search/advancedSearch/utils";
import { getSeriesUrl, getUniverseUrl } from "@/lib/utils";
import React from "react";

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
 *
 * We need to export this function ONLY to run some unittest.
 */
export function getLanguageValues(manifestation) {
  // we pick main language from either [main] or [original] .. or .. spoken if danish
  let main = manifestation?.languages?.main
    // we do NOT want multiple languagse (isoCode=="mul")
    ?.filter((mlang) => mlang.isoCode !== "mul")
    ?.map((mlang) => mlang.display);
  //if main language is empty we try to get it from [original]
  if (isEmpty(main)) {
    main =
      manifestation?.languages?.original
        ?.map((orig) => orig?.display)
        ?.sort((a) => {
          try {
            return toLower(a) === "dansk" || toLower(a) === "engelsk" ? -1 : 0;
          } catch (e) {
            return 0;
          }
        }) || [];
  }

  // speken languages - put "dansk" first
  const spoken =
    manifestation?.languages?.spoken
      ?.map((spok) => spok?.display)
      ?.sort((a) => {
        try {
          return a === "dansk" || a === "engelsk" ? -1 : 0;
        } catch (e) {
          return 0;
        }
      }) || [];
  // subtitles - put "dansk" first
  const subtitles =
    manifestation?.languages?.subtitles
      ?.map((sub) => sub?.display)
      ?.sort((a) => {
        try {
          return a === "dansk" || a === "engelsk" ? -1 : 0;
        } catch (e) {
          return 0;
        }
      }) || [];

  if (isEmpty(main) && isEmpty(spoken) && isEmpty(subtitles)) {
    return {};
  }

  return {
    main: main,
    spoken: spoken,
    subtitles: subtitles,
  };
}

/**
 * Physical description of given manifestations (summary).
 * @param manifestation
 * @returns {string | undefined}
 *  description summary (ies) seperated by space
 */
function parsePhysicalDescription(manifestation) {
  return manifestation?.physicalDescription?.summaryFull;
}

/**
 * Requirements has been moved to notes :)
 * eg.
 *  type": "TECHNICAL_REQUIREMENTS"
 * "display": ["Systemkrav: Windows 95 styresystemet, cd-rom drev, lydkort"]
 *
 * @param manifestation
 * @returns {string | undefined}
 */
function getRequirementsFromPhysicalDesc(manifestation) {
  return manifestation?.notes
    ?.filter((note) => note.type === "TECHNICAL_REQUIREMENTS")
    ?.map((note) => note?.display[0])
    .join(", ");
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
 * Get óne work with the relation of type adaption - we want the DBC work - so we look
 * for pid that starts with 870970
 * @param manifestation
 * @returns {React.JSX.Element}
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
 */

function RenderCreatorValues({ values, skeleton }) {
  const length = values?.length;
  // we want at most 4 contributors
  const valuesToRender = length > 4 ? values.splice(0, 4) : values;
  return (
    valuesToRender && (
      <div
        data-cy={"creator-contributor-text-helper"}
        className={styles.link_list}
      >
        {valuesToRender.map((person, index) => (
          <div
            key={`RenderCreatorValues__${JSON.stringify(person)}_${index}`}
            className={styles.creatorWrapper}
          >
            <Link
              href={getAdvancedUrl({ type: "creator", value: person.display })}
              dataCy={cyKey({
                name: person.display,
                prefix: "details-creatore",
              })}
              className={styles.linkWrap}
              disabled={skeleton}
              border={{ bottom: { keepVisible: true } }}
              key={`crators-${index}`}
            >
              <Text type="text4" tag={"span"} lines={0} key={index}>
                {person?.display}
              </Text>
            </Link>
            <Text
              type="text4"
              lines={0}
              key={index}
              tag="span"
              className={styles.txtInline}
            >
              {parseFunction(person)}
            </Text>
          </div>
        ))}
        {length > 4 && (
          <Text
            type="text4"
            skeleton={skeleton}
            lines={0}
            className={styles.txtInline}
          >
            m.fl
          </Text>
        )}
      </div>
    )
  );
}

/**
 * jsxParser for movies - actors. Parse given values for html output - @see parseMovieContributors for given values
 * @param values {Object}
 *  eg. {skuespillere:["jens", "hans", ..], ophav:["kurt", ...]}
 * @param skeleton
 * @returns {any[]}
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
          <div key={`actors-${index}`} className={styles.link_list}>
            <Link
              href={getAdvancedUrl({ type: "creator", value: person.display })}
              dataCy={cyKey({
                name: person?.display,
                prefix: "overview-genre",
              })}
              disabled={skeleton}
              border={{ bottom: { keepVisible: true } }}
            >
              <Text type="text4" tag="span" skeleton={skeleton} lines={0}>
                {person?.display}
              </Text>
            </Link>
          </div>
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
 * OUTCOMMENTED -> pjo 090523 - jed data is fucked up, let's wait a little to see if it gets better
 * Render adaption (movie based on .. a book or something)
 * We give a link to the material the movie is  based on.
 * @param values
 * @param skeleton
 * @returns {""|React.ReactElement}
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
          .map((sub) => sub)
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
 * @returns {React.JSX.Element}
 */
function RenderMovieLanguages({ values }) {
  // get the first 2 languages of the subtitle

  const subtitles =
    values["subtitles"]?.length > 0
      ? values["subtitles"]?.slice(0, 2).join(", ")
      : null;

  const subtitlesAsString = subtitles
    ? `undertekster på ${subtitles} ${
        values["subtitles"]?.length > 1 ? "og andre sprog" : ""
      }`
    : "";

  // spoken is synchronized languages - we pick the first two here
  const spoken =
    values["spoken"]?.length > 0
      ? values["spoken"]?.slice(0, 2).join(", ")
      : null;
  let spokenAsString = spoken
    ? `synkronisering på ${spoken} ${
        values["spoken"]?.length > 1 ? "og andre sprog" : ""
      }`
    : "";
  spokenAsString += spokenAsString && subtitlesAsString ? "," : "";

  // select a language to be shown as main
  let mainlanguage = values["main"]?.map((sub) => capitalize(sub)).join(", ");
  mainlanguage = mainlanguage ? mainlanguage + " tale" : "";
  mainlanguage += subtitlesAsString || spokenAsString ? "," : "";

  const fullstring = `${mainlanguage} ${spokenAsString} ${subtitlesAsString}`;

  return (
    <Text type="text4" lines={2}>
      {fullstring}
    </Text>
  );
}

/**
 * Link to the genre of the movie.
 * @param values
 * @param skeleton
 * @returns {React.JSX.Element}
 */

function RenderGenre({ values }) {
  const genreForm = [];
  const regexp = /^spil for /;

  values?.map((value) => {
    if (!value.match(regexp)) {
      genreForm.push(value);
    }
  });

  return (
    <div>
      <Text type="text4" lines={1} tag="span">
        {genreForm?.join(", ")}
      </Text>
    </div>
  );
}

function getParticipantsValues({ values }) {
  const regexp = /^spil for /;
  const participants = [];
  values?.map((value) => {
    if (value.match(regexp)) {
      participants.push(value);
    }
  });
  return participants;
}

function RenderParticipants({ values }) {
  return (
    <div>
      <Text type="text4" lines={1} tag="span">
        {values.join(", ")}
      </Text>
    </div>
  );
}

function RenderMovieAudience({ values }) {
  let image = null;
  const age = values?.minimumAge || null;

  if (!age) {
    if (values.display.indexOf("Tilladt for alle") !== -1) {
      image = "/img/ageany.png";
    }
  }

  const txt = values?.display || "";
  if (age) {
    switch (age) {
      case 3:
        image = "/img/age3.png";
        break;
      case 7:
        image = "/img/age7.png";
        break;
      case 11:
        image = "/img/age11.png";
        break;
      case 15:
        image = "/img/age15.png";
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div className={styles.pegiimage}>
        {image && (
          <div className={styles.spacemaker}>
            <Image src={image} width={40} height={40} alt={txt ?? ""} />
          </div>
        )}
        {txt && (
          <Text type="text3" lines={1} tag="span" className={styles.imgtext}>
            {txt}
          </Text>
        )}
      </div>
    </div>
  );
}

/**
 * lex and lit for literature (difficulty level)
 *
 * @param values
 * @returns {React.JSX.Element}
 */
function RenderLitteratureAudience({ values }) {
  const general = values.generalAudience
    ? values.generalAudience.join(", ")
    : "";
  const lix = values?.lix ? "lix: " + values.lix : "";
  const lettal = values?.let ? "let: " + values.let : "";

  return (
    <div>
      {general && (
        <Text type="text4" lines={1}>
          {general}
        </Text>
      )}
      {lix && (
        <Text type="text4" lines={1}>
          {lix}
        </Text>
      )}
      {lettal && (
        <Text type="text4" lines={1}>
          {lettal}
        </Text>
      )}
    </div>
  );
}

function getSeriesAndUniverseTitles(work) {
  const seriesTitle = work?.series?.map((singleSeries) => {
    console.log("singleSeries", singleSeries);
    return {
      title: `${singleSeries.title} (serie)`,
      url: getSeriesUrl(singleSeries.seriesId),
      skeleton: work?.seriesIsLoading,
    };
  });
  const universesTitle = work?.universes?.map((singleUniverses) => {
    console.log("singleUniverses", singleUniverses);
    return {
      title: singleUniverses.title,
      url: getUniverseUrl(singleUniverses.universeId),
      skeleton: work?.universesIsLoading,
    };
  });

  if (seriesTitle.length === 0 && universesTitle.length === 0) {
    return null;
  }

  return [...seriesTitle, ...universesTitle];
}

function RenderInSeriesOrUniverse({ values }) {
  return values.map(({ title, url, skeleton }, index) => {
    return (
      <div key={`seriesOrUniverse-${index}`} className={styles.link_list}>
        <Link
          href={url}
          disabled={skeleton}
          border={{ bottom: { keepVisible: true } }}
        >
          <Text type="text4" tag="span" skeleton={skeleton} lines={0}>
            {title}
          </Text>
        </Link>
      </div>
    );
  });
}

function RenderDk5({ values }) {
  return values.map((dk, index) => (
    <Text type="text4" tag={"div"} key={`${dk?.display}${index}`}>
      <Link
        href={getAdvancedUrl({ type: "dk5", value: dk.code })}
        border={{ top: false, bottom: { keepVisible: true } }}
      >
        {dk.display}
      </Link>
    </Text>
  ));
}

function RenderPlayers({ values }) {
  return (
    <Text type="text4" tag={"div"}>
      For {values} spillere
    </Text>
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
 * You may pass a tooltip for the label like this:
 * audience: {
 *           label: Translate({ ...context, label: "level" }),
 *           tooltip: "tooltip_lix",
 *           value: "fisk"
 *         },
 * A tooltip icon will be shown next to the label of the field - the value of
 * the toolitp (here "tooltip_lix") is taken from the translations object.
 *
 *
 * For more complicated valued you may pass a jsx parser and thus overwrite the
 * default presentation like this: *
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
  console.log("materialType", materialType);
  const fieldsMap = {
    DEFAULT: [
      {
        languages: {
          label: Translate({ ...context, label: "language" }),
          value: parseLanguages(manifestation),
        },
      },
      {
        physicalDescription: {
          label: Translate({ ...context, label: "physicalDescription" }),
          value: parsePhysicalDescription(manifestation),
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
        in_series_or_universe: {
          label: Translate({ ...context, label: "in_series_and_universes" }),
          value: getSeriesAndUniverseTitles(work),
          jsxParser: RenderInSeriesOrUniverse,
        },
      },
      {
        dk5: {
          label: Translate({ ...context, label: "dk5" }),
          value: manifestation?.classifications
            ?.filter((clas) => clas.system === "DK5")
            .map((dk) => ({ display: dk.display, code: dk.code })),
          jsxParser: RenderDk5,
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
        participants: {
          label: Translate({ ...context, label: "participants" }),
          value: getParticipantsValues({ values: work?.genreAndForm || [] }),
          jsxParser: RenderParticipants,
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
        audienceage: {
          label: Translate({ ...context, label: "audience" }),
          value: getAudienceValues,
        },
      },
      {
        requirements: {
          label: Translate({ ...context, label: "game-requirements" }),
          value: getRequirementsFromPhysicalDesc(manifestation) || "",
        },
      },
      {
        playingtime: {
          label: Translate({ ...context, label: "playingtime" }),
          value:
            manifestation?.notes?.length > 0 &&
            manifestation.notes
              ?.filter(
                (note) => note?.type === "ESTIMATED_PLAYING_TIME_FOR_GAMES"
              )
              .map((note) => note.display[0])
              .join(", "),
        },
      },
      {
        audience: {
          label: Translate({ ...context, label: "game-audience" }),
          value: manifestation?.audience?.PEGI?.display || "",
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
      // remove physicaldescription - we want it in seperate fields (@xee playingtime & extent)
      {
        physicalDescription: {
          label: "",
          value: null,
        },
      },
      {
        extent: {
          label: Translate({ ...context, label: "extent" }),
          value:
            manifestation?.physicalDescription?.materialUnits?.[0]
              ?.numberAndType ||
            manifestation?.physicalDescription?.materialUnits?.[0]?.size
              ? `${
                  manifestation?.physicalDescription?.materialUnits?.[0]
                    ?.numberAndType || ""
                }  ${
                  manifestation?.physicalDescription?.materialUnits?.[0]
                    ?.size || ""
                }`
              : null,
        },
      },
      {
        players: {
          label: Translate({ ...context, label: "participants" }),
          value: manifestation?.audience?.players?.display,
          jsxParser: RenderPlayers,
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
      {
        label: Translate({ ...context, label: "audience" }),
        value: getAudienceValues,
      },
      {
        requirements: {
          label: Translate({ ...context, label: "game-requirements" }),
          value: getRequirementsFromPhysicalDesc(manifestation) || "",
        },
      },
    ],
    LITERATURE: [
      {
        hasadaption: {
          label: Translate({ ...context, label: "hasadaption" }),
          value: "",
          // pjo 090523 commented out for now - jed data is fucked up
          // value: manifestation?.relations?.hasAdaptation?.find((rel) =>
          //   rel?.pid?.startsWith("870970")
          // ),
          // jsxParser: RenderMovieAdaption,
        },
      },
      {
        audience: {
          label: Translate({ ...context, label: "level" }),
          tooltip: "tooltip_lix",
          value:
            manifestation?.audience?.let || manifestation?.audience?.lix
              ? manifestation.audience
              : null,
          jsxParser: RenderLitteratureAudience,
        },
      },
      {
        audienceage: {
          label: Translate({ ...context, label: "audience" }),
          value: getAudienceValues(manifestation?.audience),
        },
      },

      {
        audienceschool: {
          label: Translate({ ...context, label: "schooluse" }),
          value: manifestation?.audience?.schoolUse
            ? manifestation.audience.schoolUse
                .map((aud) => aud.display)
                .join(", ")
            : null,
        },
      },
      {
        workYear: {
          label: Translate({ ...context, label: "firstEdition" }),
          value: manifestation?.workYear?.display || "",
        },
      },
    ],
    SHEETMUSIC: [
      {
        ensemble: {
          label: Translate({ ...context, label: "ensemble" }),
          value: manifestation?.notes
            ?.filter((note) => note.type === "MUSICAL_ENSEMBLE_OR_CAST")
            .map((note) => note.display)
            .join(", "),
        },
      },
    ],
    MUSIC: [
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
        contributors: {
          label: "",
          value: "",
        },
      },
      {
        creatorsfromdescription: {
          label: Translate({ ...context, label: "creators" }),
          value: manifestation?.creatorsFromDescription?.join("; ") || [],
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
          label: "",
          value: manifestation?.audience?.mediaCouncilAgeRestriction || "",
          jsxParser: RenderMovieAudience,
        },
      },
      {
        label: Translate({ ...context, label: "audience" }),
        value: getAudienceValues,
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
 * Merge given arrays - keys in extending array overwrites keys in base (DEFAULT) array.
 * If an index is given in object it is inserted as desired.
 * New keys are appended to base array.
 * @param baseArray
 * @param extendingArray
 * @returns {React.JSX.Element}
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

/**
 *
 * @param {object} manifestation
 */
export const createEditionText = (manifestation) => {
  if (!manifestation) return "";
  return (
    manifestation?.hostPublication?.title ||
    [
      ...manifestation?.publisher,
      ...(!isEmpty(manifestation?.edition?.edition)
        ? [manifestation?.edition?.edition]
        : []),
    ].join(", ") ||
    ""
  );
};
