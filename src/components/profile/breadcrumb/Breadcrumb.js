import Text from "@/components/base/text/Text";
import styles from "./Breadcrumb.module.css";
import Translate from "@/components/base/translate/Translate";

export default function Breadcrumb({ textType }) {
  return (
    <div className={styles.breadcrumb}>
      <Text type={textType} tag="p" className={styles.text}>
        {Translate({ context: "helpmenu", label: "Profil" })}
      </Text>
    </div>
  );
}
