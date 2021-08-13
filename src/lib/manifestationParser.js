"use strict";

import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

const searchOnUrl = "/find?q=";

function manifestationLink({ name }) {
  return (
    <Link
      children={name}
      href={`${searchOnUrl}${name}`}
      border={{ top: false, bottom: { keepVisible: true } }}
    />
  );
}

// fields to handle - add to handle a field eg. subjects or lix or let or ...
const fields = () => [
  {
    dataField: "title",
    label: Translate({
      context: "bibliographic-data",
      label: "title",
    }),
  },
  {
    dataField: "creators",
    label: Translate({
      context: "bibliographic-data",
      label: "creators",
    }),
    valueParser: (value) =>
      (value[0] && manifestationLink({ name: value[0].name })) || "",
  },
  {
    dataField: "creators",
    label: Translate({
      context: "bibliographic-data",
      label: "contributors",
    }),
    valueParser: (value) =>
      value.length > 1 &&
      value.map((creator, idx) => (
        <span key={`${creator.name}${idx}`}>
          {manifestationLink({ name: creator.name })}
          {creator.functionSingular && ` (${creator.functionSingular})`}
          <br />
        </span>
      )),
  },
  {
    dataField: "publisher",
    label: Translate({
      context: "bibliographic-data",
      label: "publisher",
    }),
  },
  {
    dataField: "datePublished",
    label: Translate({
      context: "bibliographic-data",
      label: "datePublished",
    }),
  },
  {
    dataField: "hostPublication",
    label: Translate({
      context: "bibliographic-data",
      label: "hostPublication",
    }),
    valueParser: (value) => [value.title, value.details].join(", "),
  },
  {
    dataField: "physicalDescriptionArticles",
    label: Translate({
      context: "bibliographic-data",
      label: "physicalDescriptionArticles",
    }),
  },
  {
    dataField: "dk5",
    label: Translate({
      context: "bibliographic-data",
      label: "dk5",
    }),
    valueParser: (value) => value.map((entry) => entry.value).join(", "),
  },
  {
    dataField: "originals",
    label: Translate({
      context: "bibliographic-data",
      label: "originals",
    }),
    valueParser: (value) =>
      value.map((line, idx) => (
        <span key={`${line}${idx}`}>
          {line}
          <br />
        </span>
      )),
  },
  {
    dataField: "originalTitle",
    label: Translate({
      context: "bibliographic-data",
      label: "originalTitle",
    }),
  },
  {
    dataField: "physicalDescription",
    label: Translate({
      context: "bibliographic-data",
      label: "physicalDescription",
    }),
  },
  {
    dataField: "isbn",
    label: Translate({
      context: "bibliographic-data",
      label: "isbn",
    }),
  },
  {
    dataField: "shelf",
    label: Translate({
      context: "bibliographic-data",
      label: "shelf",
    }),
  },
  {
    dataField: "notes",
    label: Translate({
      context: "bibliographic-data",
      label: "notes",
    }),

    valueParser: (value) =>
      value.map((note, idx) => (
        <div key={`${note}${idx}`}>
          {note}
          {value.length > idx + 1 && <div>&nbsp;</div>}
        </div>
      )),
  },
  {
    dataField: "usedLanguage",
    label: Translate({
      context: "bibliographic-data",
      label: "usedLanguage",
    }),
    valueParser: (value) => value.join(", "),
  },
  {
    dataField: "edition",
    label: Translate({
      context: "bibliographic-data",
      label: "edition",
    }),
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
      .filter((field) => manifestation[field.dataField])
      // Parse fields
      .map((field) => {
        // if special parser exist, use that to parse value
        // otherwise use value as is
        const value = field.valueParser
          ? field.valueParser(manifestation[field.dataField])
          : manifestation[field.dataField];
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
