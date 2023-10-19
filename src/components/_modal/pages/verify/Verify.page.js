import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import { signIn } from "next-auth/react";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";
import useVerification from "@/components/hooks/useVerification";
import { useAccessToken } from "@/components/hooks/useUser";

import styles from "./Verify.module.css";

/**
 * Modal page for that contains a button to Adgangsplatform login
 * @param {context} context
 * @returns
 */
export default function Verify({ modal, context }) {
  const { title, text, agencyId, agencyName, branchId, callbackUID } = context;
  const callbackUrl = getCallbackUrl(branchId, callbackUID);

  const accessToken = useAccessToken();
  const verification = useVerification();

  const data = verification.read();

  // Origin from where the verification process was started
  const isOriginListener = !!(data?.origin === "listener");

  function onMitIdLogin() {
    const props = {
      accessToken,
      type: "FFU",
    };

    // create or update session verfification process
    verification.update(props);

    signIn(
      "adgangsplatformen",
      { callbackUrl },
      { agency: agencyId, idp: "nemlogin", force_login: 1 }
    );
  }

  return (
    <div className={styles.verify}>
      <Top />
      <div>
        <Title type="title4" tag="h2">
          {title}
        </Title>
        <Text type="text2" className={styles.text}>
          {text}
        </Text>

        {isOriginListener && (
          <Text type="text2" className={styles.benefits}>
            {Translate({
              context: "addLibrary",
              label: "benefitsText",
              vars: [agencyName],
              renderAsHtml: true,
            })}
          </Text>
        )}

        <Button
          ariaLabel={Translate({ context: "login", label: "mit-id" })}
          dataCy="mitid-button"
          type="primary"
          className={styles.mitIDButton}
          onClick={() => onMitIdLogin()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onMitIdLogin();
            }
          }}
        >
          {Translate({ context: "addLibrary", label: "verificationButton" })}
        </Button>

        {isOriginListener && (
          <Button
            type="secondary"
            className={styles.closeButton}
            onClick={() => modal.clear()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                modal.clear();
              }
            }}
          >
            {Translate({ context: "general", label: "notNow" })}
          </Button>
        )}
      </div>
    </div>
  );
}
