import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate";
import Tooltip from "@/components/base/tooltip/Tooltip";
import styles from "./OpenAdgangsplatform.module.css";
import Button from "@/components/base/button";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";

export default function OpenAdgangsplatform({ context }) {
  const { agencyName, mode } = context;
  const onLogin = () => {
    console.log("onLogin");
  };

  const submitting = false;
  const title = Translate({
    context: "login",
    label: `${mode}-title`,
  });

  console.log("OpenAdgangsplatform", mode);

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
            label: `${mode}-description`,
            vars: [agencyName],
          })}
        </Text>
        {mode === LOGIN_MODE.DIGITAL_COPY && (
          <span>
            <Tooltip labelToTranslate="tooltip_digtital_copy" />
            {/* we also need description for physical ordering here
              @TODO - is this text ALWAYS shown now ?? - remove if? seems as if always shown */}
            <Text type="text2">
              {Translate({
                context: "login",
                label: "orderPhysical-description",
                vars: [agencyName],
              })}
            </Text>
          </span>
        )}

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
