import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import Text from "@/components/base/text/Text";
import styles from "./LocalizationItem.module.css";
import Divider from "@/components/base/divider";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import cx from "classnames";
import automock_utils from "@/lib/automock_utils.fixture";

const { BORROWER_STATUS_TRUE } = automock_utils();

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

function parseBranchLookupUrl(branch, holdings, localIds) {
  if (!holdings) {
    return branch.branchWebsiteUrl || branch.agencyUrl || null;
  }
  const lookupUrl = holdings.lookupUrl || null;

  const localIdentifier = (localIds && localIds[0]?.localIdentifier) || null;
  if (!lookupUrl || !localIds) {
    return branch.branchWebsiteUrl || branch.agencyUrl || null;
  }

  const itemLink =
    lookupUrl &&
    lookupUrl.indexOf("_IDNR_") !== -1 &&
    lookupUrl.replace("_IDNR_", localIdentifier);

  if (!itemLink) {
    return lookupUrl + localIdentifier;
  }

  return itemLink;
}

/**
 * Localization overview for given branch with given holdings
 * @param branch
 * @param holdings
 * @param {boolean} isLoading
 * @param {number} index
 * @return {JSX.Element}
 * @constructor
 */
export function LocalizationItem({ branch, holdings, isLoading, index }) {
  // here we need a branch + holdingsdata for the branch
  // data has holdings for ONE agency only - filtered holdingsitem
  const branchHoldings = holdings?.branches?.result?.[0];
  const color = branchHoldings?.holdingStatus?.lamp?.color;
  const label = branchHoldings?.holdingStatus?.lamp?.message;
  const firstholding = branchHoldings?.holdingStatus?.holdingItems?.find(
    (item) => item.expectedDelivery
  );

  const lookupurl = parseBranchLookupUrl(
    branch,
    branchHoldings,
    branchHoldings?.holdingStatus?.agencyHoldings
  );
  const showLink = label === "loc_no_holding" && lookupurl;
  // expected delivery date
  const expectedDelivery =
    color === "yellow" && firstholding?.expectedDelivery
      ? firstholding.expectedDelivery
      : "";

  const messages = (label) => {
    const translated = {
      no_loc_no_holding: Translate({
        context: "holdings",
        label: "label_no_holdings",
      }),
      loc_no_holding: Translate({
        context: "holdings",
        label: "label_localizaion_no_holdings",
        vars: [branchHoldings.agencyName],
      }),
      loc_holding: Translate({
        context: "holdings",
        label: "label_at_home",
      }),
      loc_no_hold_expect: Translate({
        context: "holdings",
        label: "label_on_loan",
        vars: [expectedDelivery],
      }),
      loc_hold_no_loan: Translate({
        context: "holdings",
        label: "label_not_for_loan",
      }),
    };

    return translated[label];
  };

  const blinkingcolors = ["red", "green", "yellow", "none"];

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
              <div
                className={cx({
                  [styles.green]: color === "green",
                  [styles.red]: color === "red",
                  [styles.yellow]: color === "yellow",
                  [styles.none]: color === "none",
                })}
              ></div>
            )}
            <span aria-live="polite" aria-busy="false">
              <Text
                type="text3"
                tag="span"
                className={blinkingcolors.includes(color) ? styles.inline : ""}
              >
                {messages(label)}
              </Text>
            </span>
            {showLink && (
              <div aria-live="polite" aria-busy="false">
                <Link
                  href={lookupurl}
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
              </div>
            )}
          </>
        )}
      </div>
      <Divider className={styles.dividerpadding} />
    </div>
  );
}

export default function Wrap({ props }) {
  const { branch, pids, index, testing, branchId } = { ...props };

  const dummyData = {
    branches: {
      agencyUrl: "http://bibliotek.kk.dk/",
      borrowerStatus: BORROWER_STATUS_TRUE,
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
        borrowerStatus: BORROWER_STATUS_TRUE,
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
        borrowerStatus: BORROWER_STATUS_TRUE,
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
        borrowerStatus: BORROWER_STATUS_TRUE,
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

  // @TODO .. what do we need here
  // .. we need detailed holdings to show expected delivery

  let { data, isLoading } = useData(
    !testing &&
      branchesFragments.branchHoldings({
        branchId: branchId,
        pids: pids,
      })
  );

  const holdingsData = isLoading ? dummyData : data;
  return (
    <LocalizationItem
      pids={pids}
      branch={branch}
      holdings={!testing ? holdingsData : dummyHoldings[branchId]}
      isLoading={!testing ? isLoading : false}
      index={index}
    />
  );
}
