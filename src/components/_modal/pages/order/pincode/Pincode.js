import Input from "@/components/base/forms/input";
import Label from "@/components/base/forms/label";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

import styles from "./Pincode.module.css";
import { useData } from "@/lib/api/api";
import { isFFUAgency } from "@/lib/api/branches.fragments";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Divider from "@/components/base/divider/Divider";

export function Pincode({ isLoading, isFFUAgency, onChange, error }) {
  if (!isLoading && !isFFUAgency) {
    return null;
  }

  console.log("error", error);

  return (
    <div className={styles.pincode}>
      <Divider className={styles.divider} />
      <Text type="text1" className={styles.heading}>
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
        invalid={error}
        skeleton={isLoading}
        className={styles.input}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={Translate({
          context: "order",
          label: "pincode-placeholder",
        })}
      />
    </div>
  );
}

export default function Wrap({ onChange, validated, hasValidationErrors }) {
  const { loanerInfo } = useLoanerInfo();

  const { data, isLoading } = useData(
    isFFUAgency({ branchId: loanerInfo.pickupBranch })
  );

  const hasError = !validated?.details?.hasPincode?.status;

  return (
    <Pincode
      isLoading={isLoading}
      isFFUAgency={!!data?.branches?.hitcount}
      error={hasError}
      onChange={onChange}
    />
  );
}
