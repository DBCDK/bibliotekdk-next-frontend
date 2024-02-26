import Input from "@/components/base/forms/input";
import Label from "@/components/base/forms/label";
import { useData } from "@/lib/api/api";
import { isFFUAgency } from "@/lib/api/branches.fragments";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Divider from "@/components/base/divider/Divider";

import styles from "./Pincode.module.css";
import {
  useConfirmButtonClicked,
  usePickupBranchId,
  usePincode,
} from "@/components/hooks/order";

function Pincode({ isLoading, onChange, error, value }) {
  return (
    <div className={styles.pincode}>
      <Divider className={styles.divider} />
      <Text type="text1">
        {Translate({
          context: "order",
          label: "pincode-heading",
        })}
      </Text>
      <Label for="pincode" className={styles.label}>
        {Translate({
          context: "order",
          label: "pincode-input-label",
        })}
      </Label>
      <Input
        id="pincode"
        type="password"
        dataCy="pincode-input"
        invalid={error}
        skeleton={isLoading}
        onChange={(e) => onChange?.(e.target.value)}
        autocomplete="off"
        placeholder={Translate({
          context: "order",
          label: "pincode-placeholder",
        })}
        value={value}
      />
    </div>
  );
}

export default function Wrap() {
  const {
    pincode,
    setPincode,
    pincodeIsRequired,
    isLoading: isLoadingPincode,
  } = usePincode();
  const { confirmButtonClicked } = useConfirmButtonClicked();
  const { branchId, isLoading: isLoadingPickupBranchId } = usePickupBranchId();
  const { data, isLoading: isLoadingBranch } = useData(
    branchId && isFFUAgency({ branchId })
  );

  const isFFU = !!data?.branches?.hitcount;

  const hasError = pincodeIsRequired && pincode;

  const isLoading =
    isLoadingPincode || isLoadingPickupBranchId || isLoadingBranch;

  if (!isLoadingBranch && !pincodeIsRequired) {
    return null;
  }

  return (
    <Pincode
      isLoading={isLoading}
      isFFUAgency={isFFU}
      error={confirmButtonClicked && hasError}
      onChange={(val) => setPincode(val)}
      value={pincode}
    />
  );
}
