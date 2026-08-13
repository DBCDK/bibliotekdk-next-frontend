import Top from "@/components/_modal/pages/base/top";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import MitIDButton from "../mitIDButton/MitIDButton";
import styles from "./MitIDOnly.module.css";

export default function MitIDOnly({ context }) {
  const { agencyName, callbackUID, redirectPath } = context || {};

  return (
    <div className={styles.login}>
      <Top />
      <Title type="title4" className={styles.title} tag="h2">
        {Translate({ context: "login", label: "plainLogin-title" })}
      </Title>
      <Text type="text2" className={styles.text}>
        {Translate({
          context: "login",
          label: "uses-mitid",
          vars: [agencyName],
        })}
      </Text>
      <MitIDButton callBackUUID={callbackUID} redirectPath={redirectPath} />
    </div>
  );
}
