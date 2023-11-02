import BibliographicData from "./BibliographicData";
import ManifestationFull from "@/components/work/bibliographicdata/manifestationfull/ManifestationFull";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";
import { AccessEnum } from "@/lib/enums";

const exportedObject = {
  title: "work/Bibliographic data",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS, useMockLoanerInfo } = automock_utils();

/**
 * Returns bibliographic data component
 */
export function BibData() {
  return <BibliographicData workId={"some-work-id-1"} />;
}
BibData.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          manifestation: () => {
            return {
              pid: "some-pid-1",
              access: [
                {
                  __typename: AccessEnum.INTER_LIBRARY_LOAN,
                  loanIsPossible: true,
                },
              ],
            };
          },
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/materiale/some-title/some-work-id-1",
    },
  },
});

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
 * @returns {React.JSX.Element}
 */
export function FullManifestation() {
  useMockLoanerInfo({});
  return (
    <ManifestationFull
      workId={"some-work-id-1"}
      pid={"some-pid-1"}
      hasBeenSeen={true}
    />
  );
}

FullManifestation.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          manifestation: () => {
            return {
              pid: "some-pid-1",
              access: [
                {
                  __typename: AccessEnum.INTER_LIBRARY_LOAN,
                  loanIsPossible: true,
                },
              ],
            };
          },
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/materiale/some-title/some-work-id",
    },
  },
});
