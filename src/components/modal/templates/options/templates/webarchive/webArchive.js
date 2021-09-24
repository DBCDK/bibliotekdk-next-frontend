import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./webArchive.module.css";

export default function WebArchive({
  url,
  origin,
  note,
  className,
  materialType,
}) {
  const context = { context: "options" };

  return (
    <li className={`${className} ${styles.item}`}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        href={url}
        target="_blank"
      >
        <Text type="text1">
          {Translate({ ...context, label: "online-link-title", vars: ["pdf"] })}
        </Text>
      </Link>
      {note ? (
        <Text type="text3">{note}</Text>
      ) : (
        <Text type="text3">
          {Translate({
            ...context,
            label: "online-webarchive-description",
          })}
        </Text>
      )}
    </li>
  );
}
