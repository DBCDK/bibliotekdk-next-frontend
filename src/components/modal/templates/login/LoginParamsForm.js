import { UserParamsForm } from "@/components/modal/templates/order/layers/loanerform/LoanerForm";
import { useData } from "@/lib/api/api";
import { branchUserParameters } from "@/lib/api/branches.fragments";
import styles from "@/components/modal/templates/order/layers/loanerform/LoanerForm.module.css";
import useUser from "@/components/hooks/useUser";
import getConfig from "next/config";

export function LoginParamsForm({ branch, initial, onSubmit }) {
  return (
    <div className={styles.loanerform}>
      <UserParamsForm branch={branch} initial={initial} onSubmit={onSubmit} />
    </div>
  );
}

export default function wrap({ branchId }) {
  const APP_URL =
    getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";
  // Branch userparams fetch (Fast)
  const { data, isLoading: branchIsLoading } = useData(
    branchId && branchUserParameters({ branchId })
  );

  const { loanerInfo, updateLoanerInfo } = useUser();
  const initial = loanerInfo.userParameters;

  const onSubmit = async (info) => {
    await updateLoanerInfo({
      userParameters: info,
      pickupBranch: branchId,
    });
    window.location.href = APP_URL;
  };

  if (branchIsLoading) {
    return null;
  }

  const branch = data?.branches?.result?.[0];
  return LoginParamsForm({ branch, initial, onSubmit });
}
