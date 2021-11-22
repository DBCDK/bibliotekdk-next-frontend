import { Localizations } from "./Localizations";
import { LocalizationItem } from "./LocalizationItem";

export default {
  title: "modal/Localizations",
};

const dummybranch = {
  name: "Gjern Bibliotek",
  branchId: "774000",
  agencyUrl: "http://dummybibliotek.dk",
  agencyName: "Silkeborg Biblioteker",
};

const dummylocalizations = {
  work: {
    materialTypes: [
      {
        materialType: "Bog",
        localizations: {
          count: 2,
          agencies: [
            {
              agencyId: "800028",
              holdingItems: [
                {
                  localizationPid: "800010-katalog:99121916951405763",
                  localIdentifier: "99121916951405763",
                  codes: "",
                },
                {
                  localizationPid: "800010-katalog:99122658105305763",
                  localIdentifier: "99122658105305763",
                  codes: "",
                },
                {
                  localizationPid: "800010-katalog:99122679672605763",
                  localIdentifier: "99122679672605763",
                  codes: "",
                },
              ],
            },
            {
              agencyId: "710100",
              holdingItems: [
                {
                  localizationPid: "870970-basis:22137298",
                  localIdentifier: "22137298",
                  codes: "",
                },
              ],
            },
          ],
        },
      },
      {
        materialType: "Diskette",
        localizations: {
          count: 0,
          agencies: null,
        },
      },
      {
        materialType: "Lydbog (net)",
        localizations: {
          count: 0,
          agencies: null,
        },
      },
      {
        materialType: "Punktskrift",
        localizations: {
          count: 1,
          agencies: [
            {
              agencyId: "874310",
              holdingItems: [
                {
                  localizationPid: "874310-katalog:DBB0104096",
                  localIdentifier: "DBB0104096",
                  codes: "",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  monitor: "OK",
};

/**
 * Returns Localizations
 *
 */
export function ShowLocalzationsNotLoggedIn() {
  const type = "Bog";

  const props = {
    //title: Translate({ context: "modal", label: "title-order" }),
    title: "fisk",
    workId: "work-of:870970-basis:01362984",
    //materialType: selectedMaterial.materialType,
    materialType: type,
  };

  const selectedLocalizations = dummylocalizations?.work?.materialTypes?.filter(
    (mat) => mat.materialType === type
  )[0];

  const context = { ...props, ...selectedLocalizations };
  const alertopener = () => {};

  return (
    <Localizations context={context} isLoading={false} onChange={alertopener} />
  );
}

export function LocalizationItemLoading() {
  const greatGatsby = {
    data: {
      branches: {
        result: [
          {
            name: "Hovedbiblioteket, Krystalgade",
            agencyId: "710100",
            holdingStatus: {
              count: 1,
              message: "this is a message",
              lamp: "green",
              holdingItems: [
                {
                  branch: "Hovedbiblioteket",
                  branchId: "710100",
                  willLend: "true",
                  expectedDelivery: "2021-11-19",
                  localHoldingsId: "22137298",
                  circulationRule: "Standard",
                  issueId: "",
                  department: "Voksen",
                  issueText: "",
                  location: "Fjernmagasin, skal reserveres",
                  note: "",
                  readyForLoan: "0",
                  status: "OnShelf",
                  subLocation: "Skønlitteratur",
                },
              ],
            },
          },
        ],
      },
    },
  };
  return (
    <LocalizationItem
      branch={dummybranch}
      holdings={greatGatsby.data}
      isLoading={true}
    />
  );
}

export function LocalizationItemGreen() {
  const greatGatsby = {
    data: {
      branches: {
        result: [
          {
            name: "Hovedbiblioteket, Krystalgade",
            agencyId: "710100",
            holdingStatus: {
              count: 1,
              lamp: {
                color: "green",
                message: "at_home",
              },
              holdingItems: [
                {
                  branch: "Hovedbiblioteket",
                  branchId: "710100",
                  willLend: "true",
                  expectedDelivery: "2021-11-19",
                  localHoldingsId: "22137298",
                  circulationRule: "Standard",
                  issueId: "",
                  department: "Voksen",
                  issueText: "",
                  location: "Fjernmagasin, skal reserveres",
                  note: "",
                  readyForLoan: "0",
                  status: "OnShelf",
                  subLocation: "Skønlitteratur",
                },
              ],
            },
          },
        ],
      },
    },
  };

  return (
    <LocalizationItem
      branch={dummybranch}
      holdings={greatGatsby.data}
      isLoading={false}
    />
  );
}
