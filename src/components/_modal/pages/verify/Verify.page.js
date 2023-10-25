/**
 * @file This modal page handles the CPR verification process before creating FFU users in CULR
 */

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
  const { title, text, agencyId, agencyName } = context;

  const index = modal.index?.();

  const accessToken = useAccessToken();
  const verification = useVerification();

  const data = verification.read();

  // Origin from where the verification process was started
  const isOriginListener = !!(data?.origin === "listener");

  // Handles the "Skip" button click
  function handleOnClick() {
    // handles if modal should have "back" functionality
    const hasBack = index > 0;
    hasBack ? modal.prev() : modal.clear();
  }

  // Handles the MitID button click
  function onMitIdLogin() {
    // Can be reassigned if none given
    let callbackUID = context.callbackUID;

    /* Check if verify modal "stole" the view from another modal page.
       If no callbackUID was given in context, update UID to the previous modal page
       callback will then return user to the original (previous) modal page  */
    if (!callbackUID) {
      // if a previous modal exist
      if (index > 0) {
        // previous modal
        const target = modal.stack?.[index - 1];
        // Ignore if last modal was the 'openAdgangsplatform' modal
        if (target?.id !== "openAdgangsplatform") {
          callbackUID = target?.uid;
        }
      }
    }

    // Generate callbackurl
    // When login method is 'nemlogin' no pickupBranch is used
    const callbackUrl = getCallbackUrl(null, callbackUID);

    // create or update session verfification process
    verification.update({
      accessToken,
      type: "FFU",
    });

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
            onClick={() => handleOnClick()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOnClick();
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