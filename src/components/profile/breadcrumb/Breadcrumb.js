import Divider from "@/components/base/divider/Divider";
import Text from "@/components/base/text/Text";
import styles from "./Breadcrumb.module.css";
import Translate from "@/components/base/translate/Translate";

export default function Breadcrumb() {
  return (
    <div className={styles.breadcrumb}>
      <Text type="text2" tag="p" className={styles.text}>
        {Translate({ context: "helpmenu", label: "Profil" })}
      </Text>
      <Divider />
    </div>
  );
}
