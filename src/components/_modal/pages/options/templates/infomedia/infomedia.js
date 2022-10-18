import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./infomedia.module.css";
import { infomediaUrl } from "@/lib/utils";

export function Infomedia({ props }) {
  const { infomediaId, title_author, className, workId } = {
    ...props,
  };
  const context = { context: "options" };
  const url = infomediaUrl(title_author, workId, infomediaId);
  return (
    <li className={`${className} ${styles.item}`}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        href={url}
        target="_self"
      >
        <Text type="text1">
          {Translate({ ...context, label: "infomedia-link-title" })}
        </Text>
      </Link>
      <Text type="text3">
        {Translate({
          ...context,
          label: "infomedia-link-description",
          vars: ["infomedia"],
        })}
      </Text>
    </li>
  );
}

export default function Wrap({ props }) {
  return <Infomedia props={props} />;
}
