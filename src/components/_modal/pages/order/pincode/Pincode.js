import Input from "@/components/base/forms/input";
import Label from "@/components/base/forms/label";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

import styles from "./Pincode.module.css";
import { useData } from "@/lib/api/api";
import { isFFUAgency } from "@/lib/api/branches.fragments";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Divider from "@/components/base/divider/Divider";

function Pincode({ isLoading, onChange, error }) {
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
      />
    </div>
  );
}

export default function Wrap({ onChange, validated }) {
  const { loanerInfo } = useLoanerInfo();

  const branchId = loanerInfo.pickupBranch;

  const { data, isLoading } = useData(branchId && isFFUAgency({ branchId }));

  const isFFU = !!data?.branches?.hitcount;
  const hasBorchk = !!data?.branches?.result?.[0]?.borrowerCheck;

  const hasError = !validated?.details?.hasPincode?.status;
  const hasTry = validated.hasTry;

  if (!isFFU || (isFFU && !hasBorchk)) {
    return null;
  }

  return (
    <Pincode
      isLoading={isLoading}
      isFFUAgency={isFFU}
      error={hasTry && hasError}
      onChange={onChange}
    />
  );
}
