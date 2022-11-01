import { BibliographicData } from "./BibliographicData";
import dummyWorkManifestationsApi from "../dummyWorkManifestationsApi.json";
import ManifestationFull from "@/components/work/BibliographicData/ManifestationFull";

const localizations = {
  localizations: {
    count: 6,
    agencies: [
      {
        agencyId: "800022",
        holdingItems: [
          {
            localizationPid: "800010-katalog:99122237439705763",
            codes: "",
            localIdentifier: "99122237439705763",
          },
        ],
      },
      {
        agencyId: "739000",
        holdingItems: [
          {
            localizationPid: "870970-basis:28940483",
            codes: "",
            localIdentifier: "28940483",
          },
        ],
      },
      {
        agencyId: "800015",
        holdingItems: [
          {
            localizationPid: "800010-katalog:99122237439705763",
            codes: "d",
            localIdentifier: "99122237439705763",
          },
        ],
      },
      {
        agencyId: "911010",
        holdingItems: [
          {
            localizationPid: "870970-basis:28940483",
            codes: "g",
            localIdentifier: "28940483",
          },
        ],
      },
      {
        agencyId: "774600",
        holdingItems: [
          {
            localizationPid: "870970-basis:28940483",
            codes: "",
            localIdentifier: "28940483",
          },
        ],
      },
      {
        agencyId: "715500",
        holdingItems: [
          {
            localizationPid: "870970-basis:28940483",
            codes: "",
            localIdentifier: "28940483",
          },
        ],
      },
    ],
  },
  monitor: "OK",
};

const exportedObject = {
  title: "work/Bibliographic data",
};

export default exportedObject;

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
  const data = dummyWorkManifestationsApi;
  const work = data.work;
  const manifestation = work.manifestations[0];
  const alertopener = () => {
    alert("open");
  };
  return (
    <ManifestationFull
      manifestation={manifestation}
      work={work}
      workId={work.workId}
      localizations={localizations}
      localizationsLoading={false}
      openLocalizationsModal={alertopener}
      openOrderModal={alertopener}
      user={{}}
    />
  );
}
