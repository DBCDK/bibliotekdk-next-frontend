import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import styles from "./OpenAdgangsplatform.module.css";
import Button from "@/components/base/button";
import { signIn } from "@dbcdk/login-nextjs/client";
import Icon from "@/components/base/icon";
import { getCallbackUrl } from "@/components/_modal/pages/login/utils";
import { useLastLoginBranch } from "@/components/hooks/useLastLoginBranch";

/**
 * Modal page for that contains a button to Adgangsplatform login
 * @param {context} context
 * @returns
 */
export function OpenAdgangsplatform({ context, isLoading = false }) {
  const { agencyName, name, title, text, branchId, callbackUID } = context;
  const { setLastLoginBranch } = useLastLoginBranch();

  const onLogin = () => {
    const callbackUrl = getCallbackUrl(branchId, callbackUID);
    if (branchId && name) {
      setLastLoginBranch({ branchId, name });
    }
    signIn(
      "adgangsplatformen",
      { callbackUrl },
      { agency: branchId, force_login: 1 }
    );
  };

  const submitting = false;

  const defaultTitle = Translate({
    context: "login",
    label: "plainLogin-title",
  });

  const defaultText = Translate({
    context: "login",
    label: "plainLogin-description",
    vars: [agencyName],
  });

  return (
    <div className={styles.login}>
      <Top />
      <div>
        <Title type="title4" tag="h2">
          {title || defaultTitle}
        </Title>
        <Text type="text2" tag="span" className={styles.inline}>
          {text || defaultText}
        </Text>
        <Button
          dataCy="go-to-library-login"
          onClick={onLogin}
          onBlur={(e) => {
            if (e.key === "Enter") onLogin();
          }}
          skeleton={isLoading}
          disabled={isLoading || !!submitting}
          tabIndex="0"
        >
          {Translate({
            context: "login",
            label: "go-to-library-login",
          })}
          <Icon
            src="adgangsplatform.svg"
            alt="bibliotekslogin"
            size={{ h: "4", w: "auto" }}
          />
        </Button>
      </div>
    </div>
  );
}

export default function Wrap({ context }) {
  return <OpenAdgangsplatform context={context} />;
}
