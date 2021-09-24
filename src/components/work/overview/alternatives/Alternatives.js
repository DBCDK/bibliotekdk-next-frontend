import { useRouter } from "next/router";

import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

import styles from "./Alternatives.module.css";

export default function AlternativeOptions({ onlineAccess = [] }) {
  const router = useRouter();
  const context = { context: "overview" };

  const count = onlineAccess?.length;
  {
    return (
      count > 1 && (
        <Link
          border={{ bottom: { keepVisible: true } }}
          onClick={() => {
            if (router) {
              router.push({
                pathname: router.pathname,
                query: { ...router.query, modal: "options" },
              });
            }
          }}
        >
          <Text>
            {Translate({
              ...context,
              label: "all-options-link",
              vars: [count],
            })}
          </Text>
        </Link>
      )
    );
  }
}
