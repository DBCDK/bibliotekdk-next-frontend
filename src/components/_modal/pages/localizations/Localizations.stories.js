import { Localizations } from "./Localizations";
import { LocalizationItem } from "./localizationitem/LocalizationItem";
import { LocalizationsLink } from "@/components/work/overview/localizationslink/LocalizationsLink";
import Modal, { useModal } from "@/components/_modal";
import { useEffect } from "react";
import automock_utils from "@/lib/automock_utils.fixture";

const { BORROWER_STATUS_TRUE } = automock_utils();

const exportedObject = {
  title: "modal/Localizations",
};

export default exportedObject;

const greatGatsby = {
  data: {
    branches: {
      borrowerStatus: BORROWER_STATUS_TRUE,
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

const dummybranch = {
  name: "Gjern Bibliotek",
  branchId: "774000",
  agencyUrl: "http://dummybibliotek.dk",
  agencyName: "Silkeborg Biblioteker",
  branchWebsiteUrl: "http://www.aub.aau.dk/",
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

const dummySearch = {
  data: {
    branches: {
      hitcount: 7,
      borrowerStatus: BORROWER_STATUS_TRUE,
      result: [
        {
          agencyId: "717500",
          name: "Rødovre Bibliotek",
          agencyName: "Rødovre Bibliotek",
          branchId: "717500",
        },
        {
          agencyId: "717500",
          name: "Islev Bibliotek: Trekanten",
          agencyName: "Rødovre Bibliotek",
          branchId: "717501",
        },
        {
          agencyId: "710100",
          name: "Nørrebro Bibliotek",
          agencyName: "Københavns Biblioteker",
          branchId: "710111",
        },
      ],
    },
  },
};

/**
 * Returns Localizations
 *
 */
export function LocalizationLink() {
  const type = "Bog";

  const selectedLocalizations = dummylocalizations?.work?.materialTypes?.filter(
    (mat) => mat.materialType === type
  )[0];

  const alertopener = () => {};

  return (
    <LocalizationsLink
      localizations={selectedLocalizations.localizations}
      openLocalizationsModal={alertopener}
    />
  );
}

export function LocalizationItemLoading() {
  const holdings = greatGatsby.data;
  holdings.branches.result[0].holdingStatus.lamp = {
    color: "green",
    message: "at_home",
  };
  return (
    <LocalizationItem
      branch={dummybranch}
      holdings={greatGatsby.data}
      isLoading={true}
      index={0}
    />
  );
}

export function LocalizationItemGreen() {
  const holdings = greatGatsby.data;
  holdings.branches.result[0].holdingStatus.lamp = {
    color: "green",
    message: "loc_holding",
  };

  return (
    <LocalizationItem
      pids={[]}
      branch={dummybranch}
      holdings={holdings}
      isLoading={false}
      index={0}
    />
  );
}

export function LocalizationItemRed() {
  const holdings = greatGatsby.data;
  holdings.branches.result[0].holdingStatus.lamp = {
    message: "loc_hold_no_loan",
    color: "red",
  };
  return (
    <LocalizationItem
      pids={[]}
      branch={dummybranch}
      holdings={holdings}
      isLoading={false}
      index={0}
    />
  );
}

export function LocalizationItemYellow() {
  const holdings = greatGatsby.data;
  holdings.branches.result[0].holdingStatus.lamp = {
    color: "yellow",
    message: "loc_no_hold_expect",
  };
  return (
    <LocalizationItem
      pids={[]}
      branch={dummybranch}
      holdings={holdings}
      isLoading={false}
      index={0}
    />
  );
}

export function LocalizationItemUnknown() {
  const holdings = greatGatsby.data;
  holdings.branches.result[0].holdingStatus.lamp = {
    message: "no_loc_no_holding",
    color: "none",
  };
  return (
    <LocalizationItem
      pids={[]}
      branch={dummybranch}
      holdings={holdings}
      isLoading={false}
      index={0}
    />
  );
}

export function LocalizationItemNoHolding() {
  const holdings = greatGatsby.data;
  holdings.branches.result[0].holdingStatus.lamp = {
    message: "loc_no_holding",
    color: "none",
  };
  return (
    <LocalizationItem
      pids={[]}
      branch={dummybranch}
      holdings={holdings}
      isLoading={false}
      index={0}
    />
  );
}

export function LocalizationsList() {
  const type = "Bog";

  const props = {
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
  const modal = useModal();
  // simulate order submit and callback
  useEffect(() => {
    modal.setStack([{ id: "localizations", context, active: true }]);
  }, []);
  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page
        id="localizations"
        component={Localizations}
        branchData={dummySearch.data.branches}
        onChange={alertopener}
        isLoading={false}
        testing={true}
      />
    </Modal.Container>
  );
}
