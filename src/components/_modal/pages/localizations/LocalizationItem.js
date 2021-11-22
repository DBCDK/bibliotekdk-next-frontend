import { useData } from "@/lib/api/api";
import * as branchFragments from "@/lib/api/branches.fragments";
import Text from "@/components/base/text/Text";
import styles from "./Localizations.module.css";
import Divider from "@/components/base/divider";

function ItemSkeleton() {
  return <div className={styles.waitforme}></div>;
}

export function LocalizationItem({ branch, holdings, isLoading }) {
  // here we need a branch + holdingsdata for the branch
  // data has holdings for ONE agency only - filtered holdingsitem
  const branchHoldings =
    holdings?.branches?.result &&
    holdings?.branches?.result[0] &&
    holdings?.branches?.result[0];

  const color = branchHoldings?.holdingStatus?.lamp?.color;
  return (
    <div className={styles.itemwrap}>
      <div>
        <Text type="text2">{branch.agencyName}</Text>
        <Text type="text3">{branch.name}</Text>
      </div>
      <div className={styles.item}>
        {isLoading && <ItemSkeleton />}
        {!isLoading && (
          <>
            <div className={styles[`${color}`]}></div>
            <Text type="text3" tag="span" className={styles.inline}>
              {branchHoldings?.holdingStatus?.lamp?.message}
            </Text>
          </>
        )}
      </div>
      <Divider className={styles.dividerpadding} />
    </div>
  );
}

export default function wrap({ props }) {
  const { branch, pids } = { ...props };
  // @TODO .. what do we need here
  // .. we need detailed holdings to show expected delivery
  const { data, isLoading: holdingsLoading } = useData(
    branchFragments.branchHoldings({
      branchId: branch.branchId,
      pids: pids,
    })
  );
  const dummyData = {
    result: [
      {
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
  };
  //const data = null;
  //const isLoading = true;

  const holdingsData = holdingsLoading ? dummyData : data;

  return (
    <LocalizationItem
      branch={branch}
      holdings={holdingsData}
      isLoading={holdingsLoading}
    />
  );
}
