import cx from "classnames";
import styles from "./BranchDetailsStatus.module.css";
import Text from "@/components/base/text";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import { LinkForBranch } from "@/components/_modal/pages/base/localizationsBase/linkForBranch/LinkForBranch";
import { HoldingStatusEnum } from "@/components/hooks/useHoldings";

/**
 * {@link BranchDetailsStatus} presents that Branch-wide status in {@link BranchDetails}
 *   using {@link AvailabilityLight}, {@link BranchStatusMessage}, {@link LinkForBranch}
 *
 * @param {Object} props
 * @param {Object.<string, any>} props.library
 * @param {Array.<Object.<string, any>>} props.manifestations
 * @param {Array.<string>} props.pids
 * @returns {React.ReactElement | null}
 */
export default function BranchDetailsStatus({ branch, pids }) {
  return (
    <div className={cx(styles.row_wrapper)}>
      <AvailabilityLight branch={branch} />
      <div className={styles.result}>
        <Text type="text2">{branch?.holdingsMessage}</Text>
        {branch?.locations?.map((location) => {
          return (
            <Text type="text2" key={location}>
              {location}
            </Text>
          );
        })}
        {branch?.holdings?.status !== HoldingStatusEnum.NOT_OWNED && (
          <div className={styles.link_for_branch}>
            <LinkForBranch library={branch} pids={pids} />
          </div>
        )}
      </div>
    </div>
  );
}
