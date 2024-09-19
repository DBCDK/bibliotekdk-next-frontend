"use strict";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import React, { useEffect, useState } from "react";
import { FlatSubjectsForFullManifestation } from "@/components/work/keywords/Keywords";

import { parseFunction } from "@/lib/centralParsers.utils";
import { getAudienceValues } from "@/components/work/details/utils/export.utils";
import { getAdvancedUrl } from "@/components/search/advancedSearch/utils";
import upperFirst from "lodash/upperFirst";
import isEmpty from "lodash/isEmpty";

// fields to handle - add to handle a field eg. subjects or lix or let or ...
const fields = () => [
  {
    // main title
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "title",
    }),
    valueParser: renderFullAndParallelTitles,
  },
  {
    // originalt title
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "originalTitle",
    }),
    valueParser: renderOriginalTitle,
  },
  {
    // alternative titles
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "alternativeTitle",
    }),
    valueParser: renderAlternativeTitles,
  },
  {
    // standard titles
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "standardTitle",
    }),
    valueParser: (value) => value?.standard?.join(", "),
  },
  {
    // translated titles
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "translated",
    }),
    valueParser: renderTranslatedTitle,
  },
  {
    // launch titles
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "danishLaunchTitle",
    }),
    valueParser: (value) => value?.tvSeries?.danishLaunchTitle,
  },
  {
    dataField: "creators",
    label: Translate({
      context: "bibliographic-data",
      label: "creators",
    }),
    valueParser: (creators) =>
      creators?.length === 1 && (
        <ParsedAndRenderedCreators creatorsOrContributors={creators} />
      ),
  },
  {
    dataField: "creators",
    label: Translate({
      context: "bibliographic-data",
      label: "co-creators",
    }),
    valueParser: (creators) =>
      creators?.length > 1 && (
        <ParsedAndRenderedCreators creatorsOrContributors={creators} />
      ),
  },
  {
    dataField: "contributors",
    label: Translate({
      context: "bibliographic-data",
      label: "contributors",
    }),
    // only show for non MUSIC - for MUSIC we show contributorsFromDescription
    valueParser: (contributors, materialTypes) =>
      contributors?.length > 0 &&
      !materialTypes?.includes("MUSIC") && (
        <RenderContributors
          contributors={contributors}
          materialTypes={materialTypes}
        />
      ),
  },
  {
    dataField: "creatorsFromDescription",
    label: Translate({
      context: "bibliographic-data",
      label: "creatorsFromDescription",
    }),
    // only show for MUSIC - for other materialtypes we show creators.corporations or creators.persons
    valueParser: (values, materialTypes) =>
      (materialTypes?.includes("MUSIC") && values?.join(", ")) || "",
  },
  {
    dataField: "contributorsFromDescription",
    label: Translate({
      context: "bibliographic-data",
      label: "contributorsFromDescription",
    }),
    // only show for MUSIC - for other materialtypes we show contributors.corporations or contributors.persons
    valueParser: (values, materialTypes) =>
      (materialTypes?.includes("MUSIC") && values?.join(", ")) || "",
  },
  {
    dataField: "publisher",
    label: Translate({
      context: "bibliographic-data",
      label: "publisher",
    }),
    valueParser: (publishers) => publishers.join(", "),
  },
  {
    dataField: "edition",
    label: Translate({
      context: "bibliographic-data",
      label: "datePublished",
    }),
    valueParser: (value) => value.publicationYear?.display || "",
  },
  {
    dataField: "hostPublication",
    label: Translate({
      context: "bibliographic-data",
      label: "hostpublication",
    }),
    valueParser: (value) => value.summary || "",
  },

  {
    dataField: "physicalDescription",
    label: Translate({
      context: "bibliographic-data",
      label: "physicalDescriptionArticlesAlternative",
    }),
    valueParser: (value) =>
      value?.summaryFull || value?.materialUnits?.[0]?.extent || "",
  },
  {
    dataField: "classifications",
    label: Translate({
      context: "bibliographic-data",
      label: "dk5",
    }),
    valueParser: renderDk5,
  },

  // {
  //   dataField: "originals",
  //   label: Translate({
  //     context: "bibliographic-data",
  //     label: "originals",
  //   }),
  //   valueParser: (value) =>
  //     value.map((line, idx) => (
  //       <span key={`${line}${idx}`}>
  //         {line}
  //         <br />
  //       </span>
  //     )),
  // },
  /* {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "originalTitle",
    }),
    valueParser: (value) => value.original || "",
  },*/
  {
    dataField: "workYear",
    label: Translate({
      context: "bibliographic-data",
      label: "originalYear",
    }),
    valueParser: (workYear) => workYear.display || "",
  },

  {
    dataField: "subjects",
    label: Translate({
      context: "bibliographic-data",
      label: "subject",
    }),
    valueParser: (value) => {
      const subjects = value?.dbcVerified?.map((val) => val.display);
      if (subjects.length < 1) {
        return null;
      }
      return <FlatSubjectsForFullManifestation subjects={subjects} />;
    },
  },
  // {
  //   dataField: "physicalDescriptions",
  //   label: Translate({
  //     context: "bibliographic-data",
  //     label: "physicalDescription",
  //   }),
  //   valueParser: (value) => value[0]?.extent || "",
  // },
  // ISBN
  {
    dataField: "identifiers",
    label: Translate({
      context: "bibliographic-data",
      label: "isbn",
    }),
    valueParser: (values) =>
      values
        .filter((value) => value.type === "ISBN")
        .map((value) => value.value)
        .join(", "),
  },
  // ID for musik
  {
    dataField: "identifiers",
    label: Translate({
      context: "bibliographic-data",
      label: "id",
    }),
    valueParser: (values) =>
      values
        .filter((value) => value.type === "MUSIC")
        .map((value) => value.value)
        .join(", "),
  },
  {
    dataField: "shelfmark",
    label: Translate({
      context: "bibliographic-data",
      label: "shelf",
    }),
    valueParser: (values) => values.shelfmark,
  },
  {
    dataField: "hostPublication",
    label: Translate({
      context: "bibliographic-data",
      label: "issn",
    }),
    valueParser: (value) => {
      return value.issn || "";
    },
  },
  {
    dataField: "identifiers",
    label: Translate({
      context: "bibliographic-data",
      label: "issn",
    }),
    valueParser: (values) => {
      return values
        .filter((value) => value.type === "ISSN")
        .map((value) => value.value)
        .join(", ");
    },
  },
  {
    dataField: "notes",
    label: Translate({
      context: "bibliographic-data",
      label: "notes",
    }),
    // playingtime AND technical requirements has been moved to notes - they
    // are displayed independent -> filter them away from notes field
    valueParser: (values) =>
      values
        ?.filter(
          (note) =>
            note?.type !== "ESTIMATED_PLAYING_TIME_FOR_GAMES" &&
            note?.type !== "TECHNICAL_REQUIREMENTS"
        )
        .map((note, idx) => (
          <div key={`${note?.display?.join(", ")}${idx}`}>
            {note?.display?.map((display, idx2) => (
              <div key={`${display}${idx2}`}>{display}</div>
            ))}
            {values?.length > idx + 1 && <div>&nbsp;</div>}
          </div>
        )),
  },
  {
    dataField: "notes",
    label: Translate({
      context: "bibliographic-data",
      label: "playingtime",
    }),
    valueParser: (values) => {
      return values
        ?.filter((note) => note?.type === "ESTIMATED_PLAYING_TIME_FOR_GAMES")
        .map((note) => note.display[0])
        .join(", ");
    },
  },
  {
    // TODO: Prefer use of the language comment (JED 0.8)
    dataField: "languages",
    label: Translate({
      context: "bibliographic-data",
      label: "usedLanguage",
    }),
    valueParser: (languages) =>
      <ParsedAndRenderedLanguages languages={languages} /> || null,
  },
  {
    dataField: "edition",
    label: Translate({
      context: "bibliographic-data",
      label: "edition",
    }),
    valueParser: (value) => value.edition || "",
  },
  {
    dataField: "audience",
    label: Translate({
      context: "details",
      label: "audience",
    }),
    valueParser: getAudienceValues,
  },
  {
    dataField: "notes",
    label: Translate({
      context: "bibliographic-data",
      label: "requirements",
    }),
    valueParser: (value) =>
      value
        ?.filter((note) => note?.type === "TECHNICAL_REQUIREMENTS")
        .map((note) => note.display[0])
        .join(", "),
  },

  /*{
    dataField: "manifestationParts",
    label: Translate({
      context: "bibliographic-data",
      label: "manifestationParts",
    }),
    valueParser: RenderManifestationParts,
  },*/
];

/**
 *   ABOUT TITLES:
 *
 * From designer (thank you anders friis brødsgaard) - how to show titles :
 *
 * Tvseries
 * Hvis tv series titles findes skal de vises istedet for Titel
 *
 * Titel:
 * Alle titles.full med linjeskift mellem hver titel
 * Herefter på ny linje alle titles.parallel med linjeskift mellem hver titel
 *
 * Originaltitel:
 * Alle titles.original med komma og mellemrum mellem hver titel
 * OBS: Vises kun hvis de adskiller sig fra titlerne i title.main og titles.full ved en toLowerCase sammenligning.
 *
 * Alternativ titel:
 * Alle titles.alternative med komma og mellemrum mellem hver titel
 *
 * Standardtitel:
 * Alle titles.standard med komma og mellemrum mellem hver titel
 *
 * Oversat titel:
 * Alle titles.translated med komma og mellemrum mellem hver titel
 * OBS: Vises kun hvis de adskiller sig fra titlerne i title.main og titles.full ved en toLowerCase sammenligning.
 *
 *
 **/

/**
 * Render full and parallel titles as one block to show.
 * If tvseries titles are found they overrule standard titles from jed
 * @param value
 * @returns {React.JSX.Element}
 */
function renderFullAndParallelTitles(value) {
  const tvSeriesTitle = getTvSeriesTitle(value);

  return (
    <>
      {tvSeriesTitle ? (
        <div key={`tvseriestitel`}>
          <Text type="text3">{tvSeriesTitle}</Text>
        </div>
      ) : (
        value?.full?.map((val, index) => {
          // collect for comparison
          return (
            <div key={`full-${index}`}>
              <Text type="text3">{val}</Text>
            </div>
          );
        })
      )}
      {value?.parallel?.map((val, index) => {
        // collect for comparison
        return (
          <div key={`parallel-${index}`}>
            <Text type="text3">{val}</Text>
          </div>
        );
      })}
    </>
  );
}

function getTvSeriesTitle(Titles) {
  const tvtitles = Titles?.tvSeries;
  const title = tvtitles?.title;
  // ..hmm sometimes we have numbers in seasen, disc, episode, volume
  // if so - use the number BEFORE the display - there are too many errors in the display field
  const season =
    tvtitles?.season?.numbers || tvtitles?.season?.display
      ? `sæson ${tvtitles?.season?.numbers[0]}`
      : tvtitles?.season?.display || null;
  const disc = tvtitles?.disc?.numbers
    ? `disc ${tvtitles?.disc?.numbers[0]}`
    : tvtitles?.disc?.display || null;
  const volume = tvtitles?.volume?.numbers
    ? `volume ${tvtitles?.volume?.numbers[0]}`
    : tvtitles?.volume?.display || null;

  // subtitle eg. (Sæson 3, volume 1, disc 2)
  const subtitleArray = [
    ...((season && [season]) || []),
    ...((volume && [volume]) || []),
    ...((disc && [disc]) || []),
  ];
  const subtitle =
    subtitleArray.length > 0
      ? "(" + upperFirst(subtitleArray.join(", ")) + ")"
      : "";

  return title ? `${title} ${subtitle && subtitle}` : null;
}

function renderAlternativeTitles(value) {
  const alreadyHandled = titlesToFilterOn(value);
  const toRender = value?.alternative?.filter(
    (val) => !alreadyHandled.includes(val)
  );

  if (!toRender || toRender?.length < 1) {
    return null;
  }
  return (
    <>
      {toRender?.map((val, index) => {
        // collect for comparison
        return (
          <div key={`alternative-${index}`}>
            <Text type="text3">{val}</Text>
          </div>
        );
      })}
    </>
  );
}

/**
 * Render translated titles - do not show if shown before in another title
 * @param value
 * @returns {React.ReactElement|null}
 */
function renderTranslatedTitle(value) {
  // only render if values are not rendered before - compare with full, parallel and main
  const alreadyHandled = titlesToFilterOn(value);
  const toRender = value?.translated?.filter(
    (val) => !alreadyHandled.includes(val)
  );

  if (!toRender || toRender?.length < 1) {
    return null;
  }
  return (
    <>
      {toRender?.map((val, index) => {
        // collect for comparison
        return (
          <div key={`translated-${index}`}>
            <Text type="text3">{val}</Text>
          </div>
        );
      })}
    </>
  );
}

/**
 * Some titles should not be shown if shown before - these are the arrays of titles
 * to look in for reappearing titles.
 *
 * @param value
 * @returns {*[]}
 */
function titlesToFilterOn(value) {
  return [
    ...(value?.full ? value?.full : []),
    ...(value.parallel ? value.parallel : []),
    ...(value?.main ? value.main : []),
  ];
}

/**
 * Render original titles
 * @param value
 * @returns {React.ReactElement|null}
 */
function renderOriginalTitle(value) {
  // only render if values are not rendered before - compare with full, parallel and main
  const alreadyHandled = titlesToFilterOn(value);
  const toRender = value?.original.filter(
    (val) => !alreadyHandled.includes(val)
  );
  if (toRender?.length < 1) {
    return null;
  }
  return (
    <>
      {toRender?.map((val, index) => {
        // collect for comparison
        return (
          <div key={`original-${index}`}>
            <Text type="text3">{val}</Text>
          </div>
        );
      })}
    </>
  );
}
/**
 * Parse manifestation into array of objects
 * containing a label and a value
 *
 * It tries to parse all fields that are in the "fields" array
 *
 * @param {Object} manifestation
 * @returns {Array}
 */
export function parseManifestation(manifestation) {
  const materialTypes = manifestation?.materialTypes?.map(
    (mat) => mat?.materialTypeGeneral?.code
  );
  return (
    fields()
      // Remove fields that are not in the manifestation
      .filter((field) => manifestation?.[field.dataField])
      // Parse fields
      .map((field) => {
        // if special parser exist, use that to parse value
        // otherwise use value as is
        const value = field?.valueParser
          ? field?.valueParser(manifestation?.[field?.dataField], materialTypes)
          : manifestation?.[field?.dataField];
        return {
          dataField: field.dataField,
          label: field.label || null,
          value,
        };
      })
      .filter(({ value }) => {
        // remove entry if value is empty array
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        // remove entry if value is falsy
        return !!value;
      })
  );
}

function renderDk5(classifications = []) {
  const dk5Mark = classifications
    .filter((clas) => clas.system === "DK5")
    .map((dk) => ({ display: dk.display, code: dk.code }));

  return dk5Mark.map((dk, index) => (
    <Text tag={"div"} key={`${dk?.display}${index}`}>
      <Link
        href={getAdvancedUrl({ type: "dk5", value: dk.code })}
        border={{ top: false, bottom: { keepVisible: true } }}
      >
        {dk.display}
      </Link>
    </Text>
  ));
}

export function RenderContributors({ contributors = [] }) {
  // we want to show contributors.corporations first - else contributors.persons
  const corporations = contributors?.filter(
    (cont) => cont?.__typename === "Corporation"
  );
  const persons = contributors?.filter((cont) => cont?.__typename === "Person");

  // show corporations or persons
  const contribToRender = corporations.length > 1 ? corporations : persons;

  return contribToRender?.map((cont, idx) => (
    <Text tag={"div"} key={`${cont?.display}${idx}`}>
      <Link
        href={getAdvancedUrl({ type: "creator", value: cont.display })}
        border={{ top: false, bottom: { keepVisible: true } }}
      >
        {cont.display}
      </Link>
      {parseFunction(cont)}
      <br />
    </Text>
  ));
}

export function ParsedAndRenderedCreators({
  creatorsOrContributors: creators,
}) {
  // Used to ensure hydration is consistent
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return creators?.map((C, idx) => (
    <Text tag={"div"} key={`${C?.display}${idx}`}>
      <Link
        href={getAdvancedUrl({ type: "creator", value: C.display })}
        border={{ top: false, bottom: { keepVisible: true } }}
      >
        {C.display}
      </Link>
      {parseFunction(C)}
      <br />
    </Text>
  ));
}

function ParsedAndRenderedLanguages({ languages }) {
  const languagesNotesExist = languages?.notes?.length > 0;

  const languagesExist =
    [...languages?.main, ...languages?.spoken, ...languages?.subtitles].length >
    0;
  return (
    (languagesNotesExist && <div>{languages?.notes?.join(". ")}</div>) ||
    (languagesExist && (
      <>
        {languages?.main?.length > 0 && (
          <div key={`anvendtSprog-main`}>
            Sprog:{" "}
            {languages.main?.map((mainLang) => mainLang?.display).join(", ")}
          </div>
        )}
        {languages?.spoken?.length > 0 && (
          <div key={`anvendtSprog-syncronized`}>
            Synkronisering:{" "}
            {languages?.spoken
              .map((spokenLang) => spokenLang?.display)
              .join(", ")}
          </div>
        )}
        {languages?.subtitles?.length > 0 && (
          <div key={`anvendtSprog-subtitles`}>
            Undertekster:{" "}
            {languages?.subtitles
              ?.map((subLang) => subLang?.display)
              .join(", ")}
          </div>
        )}
      </>
    ))
  );
}
