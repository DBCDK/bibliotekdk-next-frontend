import { useData } from "@/lib/api/api";
import * as branchFragments from "@/lib/api/branches.fragments";
import Text from "@/components/base/text/Text";
import styles from "./Localizations.module.css";
import Divider from "@/components/base/divider";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";

/**
 * Loading component
 * @return {JSX.Element}
 * @constructor
 */
function ItemSkeleton({ index }) {
  const skeletonKey = cyKey({
    name: index + "-localizationloader",
    prefix: "blinking",
  });
  return (
    <div
      data-cy={skeletonKey}
      className={styles.waitforme}
      role="progressbar"
      aria-live="polite"
      aria-busy="true"
    ></div>
  );
}

function parseBranchLookupUrl(branch, pids) {
  if (branch.branchCatalogueUrl) {
    if (branch.branchId.startsWith("7")) {
      return `${branch.branchCatalogueUrl}ting/object/${pids[0]}`;
    }
  }
  if (!branch.branchCatalogueUrl && branch.branchWebsiteUrl) {
    return branch.branchWebsiteUrl;
  }
  return null;
}

/**
 * Localization overview for given branch with given holdings
 * @param branch
 * @param holdings
 * @param isLoading
 * @return {JSX.Element}
 * @constructor
 */
export function LocalizationItem({ pids, branch, holdings, isLoading, index }) {
  // here we need a branch + holdingsdata for the branch
  // data has holdings for ONE agency only - filtered holdingsitem
  const branchHoldings = holdings?.branches?.result?.[0];
  console.log(branchHoldings, "BRANCHHOLDING");

  //console.log(holdings, "HOLGINGS");
  //console.log(branch, "BRANCH");

  const color = branchHoldings?.holdingStatus?.lamp?.color;
  const message = branchHoldings?.holdingStatus?.lamp?.message;
  const firstholding = branchHoldings?.holdingStatus?.holdingItems?.find(
    (item) => item.expectedDelivery
  );

  const showLink =
    message === "loc_no_holding" && parseBranchLookupUrl(branch, pids);
  // expected delivery date
  const expectedDelivery =
    color === "yellow" && firstholding.expectedDelivery
      ? firstholding.expectedDelivery
      : "";

  console.log(message, "MESSAGE");
  console.log(
    showLink,
    branch,
    branch.branchCatalogueUrl,
    branch.branchId,
    branch.branchWebsiteUrl,
    "URL"
  );
  const messages = (color, branch) => {
    const translated = {
      red: Translate({
        context: "holdings",
        label: "label_not_for_loan",
      }),
      loc_no_holding: Translate({
        context: "holdings",
        label: "label_localizaion_no_holdings",
      }),
      green: Translate({
        context: "holdings",
        label: "label_at_home",
      }),
      yellow: Translate({
        context: "holdings",
        label: "label_on_loan",
        vars: [expectedDelivery],
      }),
      white: Translate({
        context: "holdings",
        label: "label_no_holdings",
      }),
      none: Translate({
        context: "holdings",
        label: "label_unknown_status",
        vars: [branch.agencyUrl],
      }),
    };

    return translated[color];
  };

  const blinkingcolors = ["red", "green", "yellow"];

  return (
    <div className={styles.itemwrap} data-cy={`holdings-item-${index.idx}`}>
      <div>
        <Text type="text2">{branch.name}</Text>
        <Text type="text3">{branch.agencyName}</Text>
      </div>
      <div className={styles.item}>
        {isLoading && <ItemSkeleton index={index} />}
        {!isLoading && (
          <>
            {blinkingcolors.includes(color) && (
              <div className={styles[`${color}`]}></div>
            )}
            <span aria-live="polite" aria-busy="false">
              <Text
                type="text3"
                tag="span"
                className={blinkingcolors.includes(color) ? styles.inline : ""}
              >
                {messages(message, branch)}
              </Text>
            </span>
            {showLink && (
              <span aria-live="polite" aria-busy="false">
                <Link
                  href={parseBranchLookupUrl(branch, pids)}
                  target="_blank"
                  border={{ top: false, bottom: { keepVisible: true } }}
                >
                  <Text type="text3" tag="span">
                    {Translate({
                      context: "holdings",
                      label: "label_check_local_library",
                    })}
                  </Text>
                </Link>
              </span>
            )}
          </>
        )}
      </div>
      <Divider className={styles.dividerpadding} />
    </div>
  );
}

export default function wrap({ props }) {
  const { branch, pids, index, testing, branchId } = { ...props };

  const dummyData = {
    branches: {
      agencyUrl: "http://bibliotek.kk.dk/",
      result: [
        {
          agencyUrl: "no Url",
          name: "Silkeborg Bibliotek",
          branchId: "774000",
          agencyId: "774000",
          holdingStatus: {
            branchId: "774000",
            willLend: "true",
            expectedDelivery: "2021-11-18",
            localHoldingsId: "29317038",
            circulationRule: "Udlån 28 dage",
            issueId: "",
            department: "Børn",
            issueText: "",
            location: "Skønlitteratur",
            note: "",
            readyForLoan: "0",
            status: "OnLoan",
            subLocation: "Fantasy",
          },
        },
      ],
    },
  };

  const dummyHoldings = {
    717500: {
      branches: {
        agencyUrl: "http://www.rdb.dk",
        result: [
          {
            name: "Rødovre Bibliotek",
            agencyId: "717500",
            branchWebsiteUrl: "http://www.rdb.dk",
            holdingStatus: {
              count: 1,
              lamp: {
                color: "green",
                message: "at_home",
              },
              holdingItems: [
                {
                  branch: "Rødovre hovedbibliotek",
                  branchId: "717500",
                  willLend: "true",
                  expectedDelivery: "2021-12-03",
                  localHoldingsId: "22137298",
                  circulationRule: "Månedslån vok A",
                  issueId: "",
                  department: "VOKSNE",
                  issueText: "",
                  location: "KÆLDER",
                  note: "",
                  readyForLoan: "1",
                  status: "OnShelf",
                  subLocation: "",
                },
              ],
            },
          },
        ],
      },
      monitor: "OK",
    },
    717501: {
      branches: {
        agencyUrl:
          "https://www.genvej.gentofte.bibnet.dk/sites/RKB/pub/patronstatus.html",
        result: [
          {
            name: "Islev Bibliotek: Trekanten",
            agencyId: "717500",
            branchWebsiteUrl: "http://www.rdb.dk",
            holdingStatus: {
              count: 0,
              lamp: {
                color: "white",
                message: "no_holdings",
              },
              holdingItems: [],
            },
          },
        ],
      },
      monitor: "OK",
    },
    710111: {
      branches: {
        agencyUrl: "http://bibliotek.kk.dk/",
        result: [
          {
            name: "Nørrebro Bibliotek",
            agencyId: "710100",
            branchId: "710111",
            branchWebsiteUrl: "http://bibliotek.kk.dk/biblioteker/norrebro",
            holdingStatus: {
              count: 1,
              lamp: {
                color: "yellow",
                message: "2021-12-03",
              },
              holdingItems: [
                {
                  branch: "Nørrebro",
                  branchId: "710111",
                  willLend: "true",
                  expectedDelivery: "2021-12-03",
                  localHoldingsId: "22137298",
                  circulationRule: "Standard",
                  issueId: "",
                  department: "Voksen",
                  issueText: "",
                  location: "",
                  note: "",
                  readyForLoan: "0",
                  status: "OnLoan",
                  subLocation: "Skønlitteratur",
                },
              ],
            },
          },
        ],
      },
      monitor: "OK",
    },
  };

  console.log(props, "PROPS");

  // @TODO .. what do we need here
  // .. we need detailed holdings to show expected delivery

  const { data, isLoading } = !testing
    ? useData(
        branchFragments.branchHoldings({
          branchId: branchId,
          pids: pids,
        })
      )
    : {
        data: dummyHoldings[branchId],
        isLoading: false,
      };

  const holdingsData = isLoading ? dummyData : data;
  return (
    <LocalizationItem
      pids={pids}
      branch={branch}
      holdings={holdingsData}
      isLoading={isLoading}
      index={index}
    />
  );
}
