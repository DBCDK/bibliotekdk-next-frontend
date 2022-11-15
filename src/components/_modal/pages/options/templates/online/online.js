import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./online.module.css";

export default function Online({ props }) {
  const { url, note, origin, className, materialType } = { ...props };

  return (
    <li className={`${className} ${styles.item}`}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        href={url}
        target="_blank"
        className={styles.onlinelink}
      >
        <Text type="text1">
          {Translate({
            context: "options",
            label: "online-link-title",
            vars: [materialType?.toLowerCase()],
          })}
        </Text>
      </Link>
      {note && <Text type="text3">{note}</Text>}
      <Text type="text3">
        {Translate({
          context: "options",
          label: "online-link-description",
          vars: [origin],
        })}
      </Text>
    </li>
  );
}
