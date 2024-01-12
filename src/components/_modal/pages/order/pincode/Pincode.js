import Input from "@/components/base/forms/input";
import Label from "@/components/base/forms/label";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

import styles from "./Pincode.module.css";
import { useData } from "@/lib/api/api";
import { isFFUAgency } from "@/lib/api/branches.fragments";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Divider from "@/components/base/divider/Divider";

function Pincode({ isLoading, isFFUAgency, onChange, error }) {
  if (!isLoading && !isFFUAgency) {
    return null;
  }

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

  console.log("ccc", loanerInfo.pickupBranch, data);

  const hasError = !validated?.details?.hasPincode?.status;
  const hasTry = validated.hasTry;

  return (
    <Pincode
      isLoading={isLoading}
      isFFUAgency={!!data?.branches?.hitcount}
      error={hasTry && hasError}
      onChange={onChange}
    />
  );
}
