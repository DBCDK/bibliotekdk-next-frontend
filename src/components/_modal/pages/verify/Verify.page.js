import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import { signIn } from "next-auth/react";
import Icon from "@/components/base/icon";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";
import useVerification from "@/components/hooks/useVerification";
import { useAccessToken } from "@/components/hooks/useUser";

import styles from "./Verify.module.css";

/**
 * Modal page for that contains a button to Adgangsplatform login
 * @param {context} context
 * @returns
 */
export default function Verify({ context }) {
  const { agencyId, branchId, callbackUID } = context;
  const callBackUrl = getCallbackUrl(branchId, callbackUID);

  const accessToken = useAccessToken();
  const verification = useVerification();

  function onMitIdLogin() {
    // create session verfification process
    verification.create({ accessToken });

    signIn(
      "adgangsplatformen",
      { callbackUrl: callBackUrl },
      { agency: agencyId, idp: "nemlogin", force_login: 1 }
    );
  }

  const title = Translate({
    context: "addLibrary",
    label: "verifyTitle",
  });

  const text = Translate({
    context: "addLibrary",
    label: "verifyText",
  });

  return (
    <div className={styles.login}>
      <Top />
      <div>
        <Title type="title4" tag="h2">
          {title}
        </Title>
        <Text type="text2" tag="span" className={styles.inline}>
          {text}
        </Text>
        <Button
          ariaLabel={Translate({ context: "login", label: "mit-id" })}
          dataCy="mitid-button"
          type="secondary"
          size="large"
          className={styles.mitIDButton}
          onClick={() => onMitIdLogin}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onMitIdLogin();
            }
          }}
        >
          <Icon
            src="MitID.svg"
            alt="mitID"
            size={{ h: "2" }}
            className={styles.mitIDIcon}
          />
        </Button>
      </div>
    </div>
  );
}
