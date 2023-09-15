import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import Text from "@/components/base/text/Text";
import styles from "./LocalizationItem.module.css";
import Divider from "@/components/base/divider";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import cx from "classnames";
import {
  dummyData_localizationsItems_branches,
  dummyData_localizationsItems_holdings,
} from "@/components/_modal/pages/localizations/dummyData.localizations.fixture";
import { highlightMarkedWords } from "@/components/_modal/utils";

/**
 * Loading component
 * @return {JSX.Element}
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
        <Text type="text2">
          {highlightMarkedWords(
            branch?.highlights?.find((hl) => hl.key === "name")?.value ||
              branch.name
          )}
        </Text>
        <Text type="text3">
          {highlightMarkedWords(
            branch?.highlights?.find((hl) => hl.key === "agencyName")?.value ||
              branch?.agencyName
          )}
        </Text>
        <>
          {branch?.highlights
            ?.filter((hl) => hl.key !== "agencyName" && hl.key !== "name")
            ?.map((res) => (
              <Text type="text3" key={res.key + "+" + res.value}>
                {res.key}: {highlightMarkedWords(res.value)}
              </Text>
            ))}
        </>
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
              />
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

  // @TODO .. what do we need here
  // .. we need detailed holdings to show expected delivery

  let { data, isLoading } = useData(
    !testing &&
      branchesFragments.branchHoldings({
        branchId: branchId,
        pids: pids,
      })
  );

  const holdingsData = isLoading ? dummyData_localizationsItems_branches : data;
  return (
    <LocalizationItem
      pids={pids}
      branch={branch}
      holdings={
        !testing
          ? holdingsData
          : dummyData_localizationsItems_holdings[branchId]
      }
      isLoading={!testing ? isLoading : false}
      index={index}
    />
  );
}
