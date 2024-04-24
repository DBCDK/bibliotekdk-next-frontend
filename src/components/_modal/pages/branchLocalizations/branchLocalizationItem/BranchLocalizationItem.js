import cx from "classnames";
import styles from "./BranchLocalizationItem.module.css";
import Text from "@/components/base/text/Text";
import LocalizationItemBase from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";
import { useHoldingsForAgency } from "@/components/hooks/useHoldings";

const textProps = {
  className: cx(styles.text),
  clamp: true,
  lines: 2,
};

/**
 * {@link BranchLocalizationItem} shows each branch found by {@link BranchLocalizations}
 * @param {Object} props
 * @param {Object} props.context
 * @param {Object} props.modal
 * @param {string} props.branchId
 * @param {Array.<string>} props.pids
 * @param {boolean} props.primitiveDisplay
 * @returns {React.ReactElement | null}
 */
export default function BranchLocalizationItem({
  context,
  modal,
  branchId,
  agencyId,
  pids,
  primitiveDisplay = false,
}) {
  const { branches, isLoading } = useHoldingsForAgency({
    agencyId,
    pids,
  });

  const branch = branches?.find((branch) => branch?.branchId === branchId);

  return (
    <LocalizationItemBase
      branch={branch}
      itemLoading={isLoading}
      modalPush={() =>
        modal.push("branchDetails", {
          ...context,
          title: branch?.name,
          pids: pids,
          branchId: branchId,
          agencyId: branch?.agencyId,
        })
      }
    >
      <Text {...textProps} type="text2">
        {branch?.name}
      </Text>
      {!primitiveDisplay && <Text>{branch?.holdingsMessage}</Text>}
    </LocalizationItemBase>
  );
}
