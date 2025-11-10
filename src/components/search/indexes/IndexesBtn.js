import { useRouter } from "next/router";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import styles from "./IndexesBtn.module.css";

export default function HelpBtn({ className = "" }) {
  const router = useRouter();

  if (router.query?.mode !== "cql") {
    return null;
  }

  return (
    <div className={`${styles.wrap} ${className}`}>
      <Link
        href="https://fbi-api.dbc.dk/indexmapper/"
        className={styles.link}
        border={{
          top: false,
          bottom: {
            keepVisible: true,
          },
        }}
        target="_blank"
      >
        <Text type="text3" tag="span" className={styles.text}>
          {Translate({
            context: "search",
            label: "get-search-codes",
          })}
        </Text>
      </Link>
    </div>
  );
}
