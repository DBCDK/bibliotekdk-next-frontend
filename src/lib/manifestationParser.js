"use strict";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { useEffect, useState } from "react";

// fields to handle - add to handle a field eg. subjects or lix or let or ...
const fields = () => [
  {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "title",
    }),
    valueParser: (value) => value.main || "",
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
  {
    dataField: "titles",
    label: Translate({
      context: "bibliographic-data",
      label: "originalTitle",
    }),
    valueParser: (value) => value.original || "",
  },
  {
    dataField: "workYear",
    label: Translate({
      context: "bibliographic-data",
      label: "originalYear",
    }),
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
    valueParser: (values) =>
      values.map((value) => Object.values(value).join(", ")).join(", "),
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
    valueParser: (languages) => (
      <>
        <div key={`anvendtSprog-main`}>
          Tale:{" "}
          {languages.main?.map((mainLang) => mainLang?.display).join(", ")}
        </div>
        <div key={`anvendtSprog-syncronized`}>
          Synkronisering:{" "}
          {languages?.spoken
            .map((spokenLang) => spokenLang?.display)
            .join(", ")}
        </div>
        <div key={`anvendtSprog-subtitles`}>
          Undertekster:{" "}
          {languages?.subtitles?.map((subLang) => subLang?.display).join(", ")}
        </div>
      </>
    ),
  },
  {
    dataField: "edition",
    label: Translate({
      context: "bibliographic-data",
      label: "edition",
    }),
    valueParser: (value) => value.edition || "",
  },
];

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
          label: field.label,
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
    <Text key={`${C?.display}${idx}`}>
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
