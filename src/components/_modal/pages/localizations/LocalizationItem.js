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

/**
 * Localization overview for given branch with given holdings
 * @param branch
 * @param holdings
 * @param isLoading
 * @return {JSX.Element}
 * @constructor
 */
export function LocalizationItem({ branch, holdings, isLoading, index }) {
  // here we need a branch + holdingsdata for the branch
  // data has holdings for ONE agency only - filtered holdingsitem
  const branchHoldings = holdings?.branches?.result?.[0];

  const color = branchHoldings?.holdingStatus?.lamp?.color;
  const message = branchHoldings?.holdingStatus?.lamp?.message;
  const firstholding = branchHoldings?.holdingStatus?.holdingItems?.find(
    (item) => item.expectedDelivery
  );

  // expected delivery date
  const expectedDelivery =
    color === "yellow" && firstholding.expectedDelivery
      ? firstholding.expectedDelivery
      : "";

  const messages = (color, branch) => {
    const translated = {
      red: Translate({
        context: "holdings",
        label: "label_not_for_loan",
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
    <div className={styles.itemwrap}>
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
                {messages(color, branch)}
              </Text>
            </span>
            {color === "none" && branch.branchWebsiteUrl && (
              <span aria-live="polite" aria-busy="false">
                <Link
                  href={branch?.branchWebsiteUrl}
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
  const { branch, pids, index } = { ...props };
  // @TODO .. what do we need here
  // .. we need detailed holdings to show expected delivery
  const { data, isLoading: holdingsLoading } = useData(
    branchFragments.branchHoldings({
      branchId: branch.branchId,
      pids: pids,
    })
  );

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

  const holdingsData = holdingsLoading ? dummyData : data;
  return (
    <LocalizationItem
      branch={branch}
      holdings={holdingsData}
      isLoading={holdingsLoading}
      index={index}
    />
  );
}
