import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./online.module.css";

export default function Online({ url, origin, note, className, materialType }) {
  const context = { context: "options" };

  return (
    <li className={`${className} ${styles.item}`}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        href={url}
        target="_blank"
      >
        <Text type="text1">
          {Translate({
            ...context,
            label: "online-link-title",
            vars: [materialType],
          })}
        </Text>
      </Link>
      <Text type="text3">
        {Translate({
          ...context,
          label: "online-link-description",
          vars: [origin],
        })}
      </Text>
    </li>
  );
}
