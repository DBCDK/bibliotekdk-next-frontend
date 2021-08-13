import { BibliographicData } from "./BibliographicData";
import dummy_workDataApi from "../dummy.workDataApi";
import dummy_materialTypesApi from "../dummy.materialTypesApi";

export default {
  title: "work/Bibliographic data",
};

/**
 * Returns bibliographic data component
 */
export function BibData() {
  const workId = "some-id";
  const data = dummy_workDataApi({
    workId,
  }).work.materialTypes.map(
    (entry) =>
      dummy_materialTypesApi({ workId, type: entry.materialType })[workId]
  );

  return <BibliographicData data={data} />;
}

/**
 * Returns bibliographic data component
 */
export function Article() {
  const data = [
    {
      inLanguage: "da",
      content: [],
      creators: [
        {
          type: "aut",
          functionSingular: "forfatter",
          name: "Susanne Albæk Andersen",
        },
      ],
      cover: {
        detail: null,
      },
      datePublished: "2014",
      dk5: [
        {
          value: "63.69",
        },
      ],
      edition: "",
      isbn: null,
      materialType: "Tidsskriftsartikel",
      notes: ["Med litteraturhenvisninger"],
      language: ["Dansk"],
      originals: [],
      originalTitle: "",
      pid: "870971-tsart:36160780",
      physicalDescription: "",
      publisher: [],
      shelf: null,
      title: 'Staldkrampe ("shivering") hos hest',
      hostPublication: {
        title: "Dansk veterinærtidsskrift",
        details: "Årg. 97, nr. 10 (2014)",
      },
    },
  ];

  return <BibliographicData data={data} />;
}
