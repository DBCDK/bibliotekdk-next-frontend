import BibliographicData from "./BibliographicData";
import ManifestationFull from "@/components/work/BibliographicData/ManifestationFull";

const exportedObject = {
  title: "work/Bibliographic data",
};

export default exportedObject;

function BibDataStoryBuilder(storyname, resolvers = {}, query = {}) {
  return {
    parameters: {
      graphql: {
        debug: true,
        resolvers: resolvers,
        url:
          "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql" ||
          "https://alfa-api.stg.bibliotek.dk/190101/bibdk21/graphql",
      },
      nextRouter: {
        showInfo: true,
        pathname: `/materiale/${storyname}ReservationButton/work-of:870970-basis:${storyname}`,
        query: query,
      },
    },
  };
}

/**
 * Returns bibliographic data component
 */
export function BibData() {
  // const data = dummyWorkManifestationsApi;
  return <BibliographicData workId={"some-workId"} />;
}
BibData.story = {
  ...BibDataStoryBuilder("book", {}),
};

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

/**
 * NOTE
 * <ManifestationFull
 *       manifestation={manifestation}
 *       work={work}
 *       workId={workId}
 *       localizations={localizations}
 *       localizationsLoading={localizationsLoading}
 *       opener={openLocalizationsModal}
 *       openOrderModal={openOrderModal}
 *       user={user}
 *     />
 *
 */

/**
 * Return a full manifestation
 * @return {JSX.Element}
 * @constructor
 */
export function FullManifestation() {
  return (
    <ManifestationFull
      workId={"some-work-id"}
      pid={"some-pid"}
      hasBeenSeen={true}
    />
  );
}
FullManifestation.story = {
  ...BibDataStoryBuilder("EBook", {
    Manifestation: {
      pid: () => "some-pid",
      creators: () => [...new Array(10).fill({})],
      contributors: () => [...new Array(10).fill({})],
      publisher: () => ["some-publisher - 1", "some-publisher - 2"],
      physicalDescriptions: () => [...new Array(10).fill({})],
      classifications: () => [...new Array(10).fill({})],
      workYear: () => {
        display: "some-workYear";
      },
      identifiers: () => [...new Array(10).fill({})],
      notes: () => [...new Array(10).fill({})],
      materialTypes: () => [...new Array(10).fill({})],
      access: () => [...new Array(10).fill({})],
    },
  }),
};
