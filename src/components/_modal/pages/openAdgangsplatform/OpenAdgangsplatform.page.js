import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import styles from "./OpenAdgangsplatform.module.css";
import Button from "@/components/base/button";
import { signIn } from "next-auth/react";

export const getCallbackUrl = (pickupBranchId) => {
  let callback = window.location.href;
  return pickupBranchId
    ? callback +
        (callback.includes("?") ? "&" : "?") +
        "setPickupAgency=" +
        pickupBranchId
    : callback;
};

/**
 * Modal page for that contains a button to Adgangsplatform login
 * @param {context} context
 * @returns
 */
export default function OpenAdgangsplatform({ context }) {
  const { agencyName, agencyId, callbackUrl } = context;
  const onLogin = () => {
    signIn(
      "adgangsplatformen",
      { callbackUrl: callbackUrl },
      { agency: agencyId, force_login: 1 }
    );
  };

  const submitting = false;
  const title = Translate({
    context: "login",
    label: "plainLogin-title",
  });

  return (
    <div className={styles.login}>
      <Top />
      <div>
        <Title type="title4" tag="h2">
          {title}
        </Title>
        <Text type="text2" tag="span" className={styles.inline}>
          {Translate({
            context: "login",
            label: "plainLogin-description",
            vars: [agencyName],
          })}
        </Text>
        <Button
          onClick={onLogin}
          className={styles.loginbutton}
          disabled={!!submitting}
          tabIndex="0"
        >
          {Translate({
            context: "header",
            label: "login",
          })}
        </Button>
      </div>
    </div>
  );
}
