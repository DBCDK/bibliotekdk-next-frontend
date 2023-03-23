"use strict";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import React, { useEffect, useState } from "react";
import { cyKey } from "@/utils/trim";
import { FlatSubjectsForFullManifestation } from "@/components/work/keywords/Keywords";

// fields to handle - add to handle a field eg. subjects or lix or let or ...
const fields = () => [
  {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "title",
    }),
    valueParser: renderFullAndParallellTitles,
  },
  {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "originaltitle",
    }),
    valueParser: renderOriginalTitle,
  },
  {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "alternative",
    }),
    valueParser: (value) => value.alternative || "",
  },
  {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "standard",
    }),
    valueParser: (value) => value.standard || "",
  },
  {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "translated",
    }),
    valueParser: renderTranslatedTitle,
  },
  {
    dataField: "creators",
    label: Translate({
      context: "bibliographic-data",
      label: "creators",
    }),
    valueParser: (creators) =>
      creators?.length === 1 && (
        <ParsedCreatorsOrContributors creatorsOrContributors={creators} />
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
        <ParsedCreatorsOrContributors creatorsOrContributors={creators} />
      ),
  },
  {
    dataField: "contributors",
    label: Translate({
      context: "bibliographic-data",
      label: "contributors",
    }),
    valueParser: (contributors) =>
      contributors?.length > 0 && (
        <ParsedCreatorsOrContributors creatorsOrContributors={contributors} />
      ),
  },
  {
    dataField: "publisher",
    label: Translate({
      context: "bibliographic-data",
      label: "publisher",
    }),
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
      label: "hostPublication",
    }),
    valueParser: (value) => value.summary || "",
  },
  {
    dataField: "physicalDescriptions",
    label: Translate({
      context: "bibliographic-data",
      label: "physicalDescriptionArticlesAlternative",
    }),
    valueParser: (value) => value[0]?.summary || value[0]?.extent || "",
  },
  {
    dataField: "classifications",
    label: Translate({
      context: "bibliographic-data",
      label: "dk5",
    }),
    valueParser: (values) =>
      values
        .filter((classification) => classification.system === "DK5")
        .map((classification) => classification.display)
        .join(", ") || "",
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
    valueParser: FlatSubjectsForFullManifestation,
  },
  // {
  //   dataField: "physicalDescriptions",
  //   label: Translate({
  //     context: "bibliographic-data",
  //     label: "physicalDescription",
  //   }),
  //   valueParser: (value) => value[0]?.extent || "",
  // },
  {
    dataField: "identifiers",
    label: Translate({
      context: "bibliographic-data",
      label: "isbn",
    }),
    valueParser: (values) =>
      values
        .filter((value) => value.type === "ISBN")
        .map((value) => value.value),
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
    dataField: "notes",
    label: Translate({
      context: "bibliographic-data",
      label: "notes",
    }),
    valueParser: (values) =>
      values?.map((note, idx) => (
        <div key={`${note?.display?.join(", ")}${idx}`}>
          {note?.display?.map((display, idx2) => (
            <div key={`${display}${idx2}`}>{display}</div>
          ))}
          {values?.length > idx + 1 && <div>&nbsp;</div>}
        </div>
      )),
  },
  {
    // TODO: Prefer use of the language comment (JED 0.8)
    dataField: "languages",
    label: Translate({
      context: "bibliographic-data",
      label: "usedLanguage",
    }),
    valueParser: (languages) =>
      <ParsedLanguages languages={languages} /> || null,
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
    dataField: "manifestationParts",
    label: Translate({
      context: "bibliographic-data",
      label: "manifestationParts",
    }),
    valueParser: RenderManifestationParts,
  },
];

/**
 * From designer (thank you anders friis brødsgaard) - how to show titles :
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
 * @param value
 *  the titles (manifestation.titles)
 * @returns {*}
 * @constructor
 */
function renderFullAndParallellTitles(value) {
  return (
    <>
      {value?.full?.map((val, index) => {
        // collect for comparison
        return (
          <div key={`full-${index}`}>
            <Text type="text3">{val}</Text>
          </div>
        );
      })}
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

function renderTranslatedTitle(value) {
  // only render if values are not rendered before - compare with full, parallel and main
  const alreadyHandled = titlesToFilterOn(value);
  const toRender = value?.translated?.filter(
    (val) => !alreadyHandled.includes(val)
  );

  console.log(toRender, "TORENDER");

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

function titlesToFilterOn(value) {
  return [
    ...(value?.full ? value?.full : []),
    ...(value.parallel ? value.parallel : []),
    ...(value?.main ? value.main : []),
  ];
}

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

// return (
//   <>
//     {/*FULL TITLES */}
//     {value.full?.length > 0 && (
//       <>
//         <div>
//           <Text type="text4">
//             {Translate({
//               context: "bibliographic-data",
//               label: "title",
//             })}
//           </Text>
//         </div>
//         {value.full.map((val, index) => {
//           // collect for comparison
//           renderedTitles.push(val);
//           return (
//             <div key={`full-${index}`}>
//               <Text type="text3">{val}</Text>
//             </div>
//           );
//         })}
//       </>
//     )}
//
//     {/* ALTERNATIVE TITLES */}
//
//     {value?.alternative && value?.length > 0 && (
//       <>
//         <div>
//           <Text type="text4">Alternative titles</Text>
//         </div>
//         {value?.alternative.map((val, index) => {
//           if (!renderedTitles.includes(val)) {
//             return (
//               <div key={`alternate-${index}`}>
//                 <Text type="text3">{val}</Text>
//               </div>
//             );
//           }
//         })}
//       </>
//     )}
//
//     {value.original?.length > 0 && (
//       <>
//         <div>
//           <Text type="text4">Original titles</Text>
//         </div>
//         {value.original.map((val, index) => {
//           return (
//             <div key={`original-${index}`}>
//               <Text type="text3">{val}</Text>
//             </div>
//           );
//         })}
//       </>
//     )}
//
//     {value.parallel?.length > 0 && (
//       <>
//         <div>
//           <Text type="text4">Parallel titles</Text>
//         </div>
//         {value.parallel.map((val, index) => {
//           return (
//             <div key={`parllel-${index}`}>
//               <Text type="text3">{val}</Text>
//             </div>
//           );
//         })}
//       </>
//     )}
//
//     {value.translated?.length > 0 && (
//       <>
//         <div>
//           <Text type="text4">Translated titles</Text>
//         </div>
//         {value.translated.map((val, index) => {
//           return (
//             <div key={`translated-${index}`}>
//               <Text type="text3">{val}</Text>
//             </div>
//           );
//         })}
//       </>
//     )}
//   </>
// );
//}

/**
 * Render manifestationParts (content of music, node etc) as a
 * unordered list. Show at most 10.
 * @param value
 * @returns {JSX.Element}
 * @constructor
 */
function RenderManifestationParts(value) {
  const tooLong = value?.parts?.length > 10;
  const valuesToMap = tooLong ? value?.parts?.slice(0, 10) : value?.parts;
  return (
    <>
      <ul>
        {valuesToMap?.map((val, index) => (
          <li
            data-cy={cyKey({
              name: `${val.title}`,
              prefix: "manifestation-parts",
            })}
            key={`manifestation-parts-${index}`}
          >
            <Text type="text3" lines={2} tag="span">
              {val.title}
            </Text>
          </li>
        ))}
      </ul>
      {tooLong && <div>....</div>}
    </>
  );
}

/**
 * Parse manifestation into array of objects
 * containing a label and a value
 *
 * It tries to parse all fields that are in the "fields" array
 *
 * @param {object} manifestation
 * @returns {array}
 */
export function parseManifestation(manifestation) {
  return (
    fields()
      // Remove fields that are not in the manifestation
      .filter((field) => manifestation?.[field.dataField])
      // Parse fields
      .map((field) => {
        // if special parser exist, use that to parse value
        // otherwise use value as is
        const value = field?.valueParser
          ? field?.valueParser(manifestation?.[field?.dataField])
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

export function ParsedCreatorsOrContributors({
  creatorsOrContributors,
  Tag = ManifestationLink,
}) {
  // Used to ensure hydration is consistent
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return creatorsOrContributors?.map((C, idx) => (
    <Text tag={"div"} key={`${C?.display}${idx}`}>
      <Tag>{C?.display}</Tag>
      {C?.roles?.length > 0 &&
        ` (${C?.roles
          ?.map((role) => role?.["function"]?.singular)
          .join(", ")})`}
      <br />
    </Text>
  ));
}

function ManifestationLink({ children }) {
  return (
    <Link
      href={`/find?q.creator=${children}`}
      border={{ top: false, bottom: { keepVisible: true } }}
    >
      {children}
    </Link>
  );
}

function ParsedLanguages({ languages }) {
  return null;
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
