import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import styles from "./OpenAdgangsplatform.module.css";
import Button from "@/components/base/button";
import { signIn } from "next-auth/react";
import Icon from "@/components/base/icon";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";

/**
 * Modal page for that contains a button to Adgangsplatform login
 * @param {context} context
 * @returns
 */
export default function OpenAdgangsplatform({ context }) {
  const { agencyName, agencyId, branchId, callbackUID } = context;
  const callBackUrl = getCallbackUrl(branchId, callbackUID);
  const onLogin = () => {
    signIn(
      "adgangsplatformen",
      { callbackUrl: callBackUrl },
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
          dataCy="go-to-library-login"
          onClick={onLogin}
          onBlur={(e) => {
            if (e.key === "Enter") onLogin();
          }}
          className={styles.loginbutton}
          disabled={!!submitting}
          tabIndex="0"
        >
          {Translate({
            context: "login",
            label: "go-to-library-login",
          })}
          <Icon
            src="adgangsplatform.svg"
            alt="bibliotekslogin"
            size={{ h: "2", w: "auto" }}
            className={styles.icon}
          />
        </Button>
      </div>
    </div>
  );
}
