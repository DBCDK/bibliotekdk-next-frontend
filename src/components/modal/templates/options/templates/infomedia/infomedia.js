import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./infomedia.module.css";

export function Infomedia({ props }) {
  const { infomediaId, pid, title_author, className, workId } = { ...props };
  const context = { context: "options" };
  const url = infomediaUrl(workId, title_author);
  return (
    <li className={`${className} ${styles.item}`} key="options-infomedia">
      <Link
        border={{ bottom: { keepVisible: true } }}
        href={url}
        target="_blank"
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

function infomediaUrl(workId, title) {
  return `/infomedia/${title}/${workId}`;
}

export default function wrap({ props }) {
  return <Infomedia props={props} />;
}
