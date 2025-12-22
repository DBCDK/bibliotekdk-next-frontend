import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { signIn } from "@dbcdk/login-nextjs/client";
import { useLastLoginBranch } from "@/components/hooks/useLastLoginBranch";
import styles from "./LastLoginLibrary.module.css";
import Select from "@/components/_modal/pages/login/Select";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";
import useDataCollect from "@/lib/useDataCollect";

export default function LastLoginLibrary({ context }) {
  const { lastLoginBranch } = useLastLoginBranch();
  const collect = useDataCollect();

  const onLogin = () => {
    collect.collectChooseLastUsedLibrary();

    // @PJO 28/10/24 we need a callback uuid here
    const callbackUrl = getCallbackUrl(
      lastLoginBranch?.branchId,
      context?.callbackUID,
      { redirectPath: context?.redirectPath }
    );
    signIn(
      "adgangsplatformen",
      { callbackUrl },
      { agency: lastLoginBranch?.branchId, force_login: 1 }
    );
  };
  if (!lastLoginBranch) {
    return null;
  }
  return (
    <>
      <Text type="text1">
        {Translate({ context: "login", label: "latest-login" })}
      </Text>
      <Select
        className={styles.select}
        branch={lastLoginBranch}
        onSelect={onLogin}
        includeArrows={true}
      />

      <Text className={styles.otherOptions} type="text1">
        {Translate({ context: "login", label: "other-options" })}
      </Text>
    </>
  );
}
