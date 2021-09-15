import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./infomedia.module.css";

export function Infomedia({ props }) {
  console.log(props, "INFOMEDIAPROPS");

  const { infomediaId, pid, title_author, className } = { ...props };

  const context = { context: "options" };

  console.log(infomediaId, "INFOMEDIAID");
  const url = infomediaUrl(pid, title_author);
  return (
    <li className={`${className} ${styles.item}`}>
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

function infomediaUrl(pid, title) {
  return `/infomedia/${title}/${pid}`;
  return pid;
}

export default function wrap({ props }) {
  return <Infomedia props={props} />;
}
