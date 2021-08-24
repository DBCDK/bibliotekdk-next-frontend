import { BibliographicData } from "./BibliographicData";
import dummyWorkManifestationsApi from "../dummyWorkManifestationsApi.json";

export default {
  title: "work/Bibliographic data",
};

/**
 * Returns bibliographic data component
 */
export function BibData() {
  const data = dummyWorkManifestationsApi;
  return <BibliographicData work={data.work} />;
}

/**
 * Returns bibliographic data component
 */
export function Article() {
  const data = {
    work: {
      cover: {
        detail: null,
      },
      path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
      seo: {
        title: 'Staldkrampe ("shivering") hos hest af Susanne Albæk Andersen',
        description:
          'Lån Staldkrampe ("shivering") hos hest. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.',
      },
      workTypes: ["article"],
      manifestations: [
        {
          inLanguage: "da",
          usedLanguage: null,
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
          hostPublication: {
            title: "Dansk veterinærtidsskrift",
            details: "Årg. 97, nr. 10 (2014)",
          },
          physicalDescriptionArticles: "S. 22-24, illustreret",
          isbn: null,
          materialType: "Tidsskriftsartikel",
          notes: [],
          language: ["Dansk"],
          originals: [],
          originalTitle: "",
          pid: "870971-tsart:36160780",
          physicalDescription: "",
          publisher: [],
          shelf: null,
          title: 'Staldkrampe ("shivering") hos hest',
          volume: null,
        },
      ],
    },
    monitor: "OK",
  };

  return <BibliographicData work={data.work} />;
}
