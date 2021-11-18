import { Localizations } from "./Localizations";
import { LocalizationItem } from "./LocalizationItem";

export default {
  title: "modal/Localizations",
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

export function LocalizationItemGreen() {
  const dummyBrances = {
    data: {
      branches: {
        result: [
          {
            name: "Hovedbiblioteket, Krystalgade",
            branchId: "710100",
          },
          {
            name: "Blågårdens Bibliotek",
            branchId: "710104",
          },
          {
            name: "Brønshøj Bibliotek",
            branchId: "710105",
          },
          {
            name: "Christianshavns Bibliotek",
            branchId: "710106",
          },
          {
            name: "Husum Bibliotek",
            branchId: "710107",
          },
          {
            name: "Islands Brygge Bibliotek",
            branchId: "710108",
          },
          {
            name: "Øbro Jagtvej Bibliotek",
            branchId: "710109",
          },
          {
            name: "Biblioteket Rentemestervej",
            branchId: "710110",
          },
          {
            name: "Nørrebro Bibliotek",
            branchId: "710111",
          },
          {
            name: "Solvang Bibliotek",
            branchId: "710112",
          },
        ],
      },
    },
  };
  const dummyDetailed = {
    data: {
      holdingStatus: {
        branchId: "710100",
        count: 3,
        holdingStatus: [
          {
            willLend: "true",
            expectedDelivery: "2021-11-16",
            localHoldingsId: "29317038",
          },
          {
            willLend: "true",
            expectedDelivery: "2021-11-16",
            localHoldingsId: "51980247",
          },
          {
            willLend: "true",
            expectedDelivery: "2021-11-16",
            localHoldingsId: "54871910",
          },
        ],
      },
    },
  };
  return (
    <LocalizationItem
      branch={dummyBrances.result[0]}
      detailedHoldings={dummyDetailed.data}
    />
  );
}
