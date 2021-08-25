import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./infomedia.module.css";

export default function Infomedia({ id, origin, html, className }) {
  const context = { context: "options" };

  return (
    <li className={`${className} ${styles.item}`}>
      <Link border={{ bottom: { keepVisible: true } }} href="">
        <Text type="text1">
          {Translate({ ...context, label: "infomedia-link-title" })}
        </Text>
      </Link>
      <Text type="text3">
        {Translate({
          ...context,
          label: "infomedia-link-description",
          vars: [origin],
        })}
      </Text>
    </li>
  );
}
