/**
 * @file - MitIDButton.js
 * MitID login button that opens MitID login
 */

import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Button from "@/components/base/button";
import Text from "@/components/base/text";
import styles from "./MitIDButton.module.css";
import Translate from "@/components/base/translate";
import { signIn } from "@dbcdk/login-nextjs/client";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";

/**
 * Shows MitID login button and opens MitID login
 * @param {string} callbackUrl
 * @returns
 */
export default function MitIDButton({ callBackUUID }) {
  const callBackUrl = getCallbackUrl(null, callBackUUID);
  const onMitIdLogin = () => {
    signIn(
      "adgangsplatformen",
      { callbackUrl: callBackUrl },
      { force_login: 1, idp: "nemlogin" }
    );
  };

  return (
    <section className={styles.mitIDSection}>
      <Text type="text2" className={styles.hideOnSmallScreen}>
        {Translate({ context: "login", label: "or-mit-id" })}
      </Text>
      <Button
        ariaLabel={Translate({ context: "login", label: "mit-id" })}
        dataCy="mitid-button"
        type="secondary"
        size="large"
        className={styles.mitIDButton}
        onClick={onMitIdLogin}
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
      {/**dont show on mobile */}
      <Link
        href="/artikel/bliv-laaner/43"
        className={styles.createLibraryUserLink}
        border={{ bottom: { keepVisible: true } }}
      >
        <Text type="text3" tag="span">
          {Translate({ context: "login", label: "create-library-user" })}
        </Text>
      </Link>
    </section>
  );
}
